import React, { useState, useEffect } from 'react';
import "../css/Population.css";
import Papa from 'papaparse';
import { NavermapsProvider, Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps';

function Population() {
  const location = localStorage.getItem('location');
  const initialRegion = location ? JSON.parse(location).region : '천호역'; // 기본 지역

  const [populationData, setPopulationData] = useState([]); // 실시간 인구밀집도 단일 데이터
  const [allPopulation, setAllPopulation] = useState({});  // 전체 인구밀집도 데이터
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialRegion); // 사용자가 입력한 검색어
  const [region, setRegion] = useState(initialRegion); // 현재 선택된 지역
  const [allPlaces, setAllPlaces] = useState([]); // 서울시 주요 116곳 명소 정보
  const [closestPlace, setClosestPlace] = useState(null); // 가장 가까운 장소를 저장할 상태
  const [naverLoaded, setNaverLoaded] = useState(false); // 네이버 지도 API 로드 상태

  useEffect(() => {
    const loadcsv = async () => {
      const response = await fetch('/data/update_geo_population.csv');
      const text = await response.text();

      Papa.parse(text, {
        header: true,
        complete: (result) => {
          const places = result.data.map(place => ({
            CATEGORY: place.CATEGORY,
            AREA_NM: place.AREA_NM,
            ENG_NM: place.ENG_NM,
            Latitude: parseFloat(place.Latitude),  // 위도
            Longitude: parseFloat(place.Longitude), // 경도
          }));
          // '인구밀집지역' 카테고리만 필터링하여 allPlaces에 저장
          const filteredPlaces = places.filter(place => place.CATEGORY === '인구밀집지역');
          setAllPlaces(filteredPlaces);  // 필터된 명소 정보 상태 업데이트
        },
        error: (error) => {
          console.error(error);
        }
      });
    };
    loadcsv();
  }, []);


  // 네이버 지도 API 로드
  useEffect(() => {
    const loadNaverMapScript = () => {
      if (window.naver) return; // 네이버 지도 API가 이미 로드되었으면 아무 것도 하지 않음

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}&submodules=geocoder,visualization`;
      script.async = true;
      script.onload = () => {
        setNaverLoaded(true); // 네이버 지도 API 로드 후 상태 업데이트
      };
      document.head.appendChild(script);
    };
    loadNaverMapScript();
  }, []);


  // 현재 위치 - 서울 116곳 명소 직선 거리(km) 계산
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // 거리 (km)
  };

  // 가장 가까운 장소 찾기
  const findClosestPlace = (lat, lon) => {
    let closestPlace = null;
    let minDistance = Infinity;

    allPlaces.forEach(place => {
      const distance = calculateDistance(lat, lon, place.Latitude, place.Longitude); // mapy와 mapx 사용
      if (distance < minDistance) {
        minDistance = distance;
        closestPlace = place;
      }
    });
    // console.log('closestPlace : ', closestPlace);

    return closestPlace;
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      fetchPopulationData();
    }
  }, [searchQuery, allPlaces]);

  // 데이터 fetching 함수 (인구 데이터)
  const fetchPopulationData = async () => {
    setLoading(true); // 데이터 요청 시작 시 로딩 상태 true로 설정

    if (allPlaces.length === 0) {
      // setLoading(false); // 데이터가 없으면 로딩 종료
      return;
    }

    let userLocationData = null;  // 현재 위치 정보 가져오기
    if (!searchQuery && !location) {
      userLocationData = JSON.parse(location);
    } else if (searchQuery) {
      // searchQuery에 있는 장소이름의 위경도를 구해와서 userLocationData변수에 저장을 해야함
      const place = await searchPlace(searchQuery);  // 검색된 장소의 위도, 경도 받아오기
      if (place) {
        userLocationData = {
          latitude: parseFloat(place.Latitude) / 10000000,  // 소수점 변환
          longitude: parseFloat(place.Longitude) / 10000000,
        };
        console.log(userLocationData.latitude, userLocationData.longitude)
      }
    } else if (location) {
      userLocationData = JSON.parse(location); // 이미 저장된 위치 사용
    }

    if (!userLocationData) return;

    const closestPlace = findClosestPlace(userLocationData.latitude, userLocationData.longitude);
    if (!closestPlace) return;
    
    setClosestPlace(closestPlace);

    const POPULATION_MAP_API_URL = `http://openapi.seoul.go.kr:8088/${import.meta.env.VITE_POPULATION_API_KEY}/json/citydata_ppltn/1/5/${closestPlace.AREA_NM}`;

    try {
      const response = await fetch(POPULATION_MAP_API_URL);
      if (!response.ok) {
        throw new Error('인구 데이터 요청 실패');
      }

      const data = await response.json();
      const result = data["SeoulRtd.citydata_ppltn"][0];  // 응답에서 인구 데이터 추출
      setPopulationData(result);  // 상태 업데이트
    } catch (error) {
      setError(error.message);  // 에러 처리
    } finally {
      setLoading(false);  // 로딩 끝
    }
  };

  // 장소 검색 함수
  const searchPlace = async (query) => {
    try {
      const response = await fetch(`http://localhost:8888/searchmap?query=${query}`);
      if (response.ok) {
        const data = await response.json();
        if (data.items.length > 0) {
          const { mapx, mapy } = data.items[0];
          return { Latitude: parseFloat(mapy), Longitude: parseFloat(mapx) };
        }
      } else {
        throw new Error("데이터 가져오기 실패");
      }
    } catch (error) {
      console.error("장소 데이터 로딩 중 오류 : ", error);
      return null;
    }
  };
  const handleSearch = async () => {
    if (!searchQuery) return;  // searchQuery가 비어있으면 아무 것도 하지 않음
    setLoading(true);           // 로딩 상태 시작
    await fetchPopulationData();  // 인구 데이터 가져오기
    setLoading(false);          // 로딩 상태 끝
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();  
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="population">
      <div className='search-population'>
        <p> * 서울시 116개 주요 명소의 실시간 인구 데이터를 검색하실 수 있습니다.<br />
          * 찾으시는 지역의 데이터가 없는 경우, 해당 지역과 가장 가까운 명소의 데이터를 검색합니다.<br /></p>

        <div className="search-box">
          <strong>장소 검색 : </strong>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}  // 엔터키 검색
            placeholder="ex) 김포공항, 성수카페거리, 인사동"
          />
          <button onClick={handleSearch}>검색</button>
        </div>
      </div>

      <MapPage closestPlace={closestPlace} populationData={populationData} allPlaces={allPlaces} />

      <div className="text-population">
        <h1>{populationData.AREA_NM}</h1><br />
        <p>인구 : {populationData.AREA_PPLTN_MIN} ~ {populationData.AREA_PPLTN_MAX}명<br />
          혼잡도 : {populationData.AREA_CONGEST_LVL}<br /><br />
          {populationData.AREA_CONGEST_MSG}</p>
      </div>
    </div>
  );
}

const MapPage = ({ closestPlace, populationData }) => {
  console.log(populationData)
  return (
    <NavermapsProvider ncpClientId={import.meta.env.VITE_NAVER_MAP_CLIENT_ID}>
      <MapDiv style={{ width: '100%', height: '450px' }}>
        <MapWithMarker closestPlace={closestPlace} /> {/* closestPlace를 MapWithMarker로 전달 */}
      </MapDiv>
    </NavermapsProvider>
  );
};

const MapWithMarker = ({ closestPlace, populationData }) => {
  const navermaps = useNavermaps();
  const { Latitude, Longitude } = closestPlace;  // 가장 가까운 장소의 좌표
  const userLocation = new navermaps.LatLng(Latitude, Longitude);

  if (closestPlace && populationData) {
    createHeatmap(navermaps, populationData);  // 히트맵 생성 함수 호출
  }

  return (
    <NaverMap defaultCenter={userLocation} defaultZoom={11} >
      <Marker position={userLocation} />
    </NaverMap>
  );
};

const createHeatmap = (navermaps, allPopulationData) => {
  const heatmapData = allPopulationData.map((data) => {
    const { Latitude, Longitude, allPopulationData } = data;  // 인구 밀집도와 위치 정보

    // 인구 밀집도를 정규화하여 가중치로 사용
    const weight = normalPop(AREA_PPLTN_MIN, allPopulationData);

    // WeightedLocation 객체를 생성하여 히트맵에 추가
    return new navermaps.visualization.WeightedLocation(
      new navermaps.LatLng(Latitude, Longitude),
      weight
    );
  });

  // 히트맵 객체 생성
  const heatmap = new navermaps.visualization.HeatMap({
    map: navermaps,
    data: heatmapData,
    radius: 30,  // 히트맵 반경 설정
    opacity: 0.7,  // 히트맵 투명도 설정
    colorMap: naver.maps.visualization.SpectrumStyle.YIGnBu,
  });

  // 지도에 히트맵 추가
  heatmap.setMap(navermaps);
};


// 인구 밀도를 0 ~ 1로 정규화하는 함수
const normalPop = (population, allPopulationData) => {
  const minPop = allPopulationData.AREA_PPLTN_MIN;
  const maxPop = allPopulationData.AREA_PPLTN_MAX;

  if (maxPop === minPop) {
    return 0;
  }

  return (population - minPop) / (maxPop - minPop); // 0 ~ 1 사이의 값으로 정규화
};


export default Population;