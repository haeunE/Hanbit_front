import React, { useState, useEffect } from 'react';
import "../css/Population.css";
import Papa from 'papaparse';
import { NavermapsProvider, Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps';

function Population() {
  const location = localStorage.getItem('location');
  const initialRegion = location ? JSON.parse(location).region : '천호역'; // 기본 지역

  const [populationData, setPopulationData] = useState(null); // 실시간 인구밀집도 데이터
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // 사용자가 입력한 검색어
  const [places, setPlaces] = useState([]); // 검색된 장소
  const [region, setRegion] = useState(initialRegion); // 현재 선택된 지역
  const [allPlaces, setAllPlaces] = useState([]); // 서울시 주요 116곳 명소 정보

  const [naverLoaded, setNaverLoaded] = useState(false); // 네이버 지도 API 로드 상태

  console.log(location)

  // 네이버 지도 API 로드
  useEffect(() => {
    const loadNaverMapScript = () => {
      if (window.naver) return; // 네이버 지도 API가 이미 로드되었으면 아무 것도 하지 않음

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}`;
      script.async = true;
      script.onload = () => {
        setNaverLoaded(true); // 네이버 지도 API 로드 후 상태 업데이트
      };
      document.head.appendChild(script);
    };

    loadNaverMapScript();
  }, []);

  // // 좌표로 주소를 변환하는 코드 (Reverse Geocoding)
  // const convertCoordinates = async (mapx, mapy) => {
  //   const address = `${mapx},${mapy}`;  // 좌표를 주소로 변환할 수 있도록 변경
  //   try {
  //     const response = await fetch(`/geocode?address=${address}`);
  //     const data = await response.json();
  //     return {
  //       latitude: data.latitude,   // 위도
  //       longitude: data.longitude, // 경도
  //     };
  //   } catch (error) {
  //     console.error('좌표 변환 오류:', error);
  //   }
  // };

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
        console.log(place);
      }
    });

    return closestPlace;
  };

  // CSV 파일 로드
  useEffect(() => {
    const loadcsv = async () => {
      const response = await fetch('/data/update_geo_population.csv');
      const text = await response.text();

      Papa.parse(text, {
        header: true,
        complete: (result) => {
          const places = result.data.map(place => ({
            AREA_NM: place.AREA_NM,
            ENG_NM: place.ENG_NM,
            Latitude: parseFloat(place.Latitude),  // 위도
            Longitude: parseFloat(place.Longitude), // 경도
          }));
          setAllPlaces(places);  // 명소 정보 상태 업데이트
        },
        error: (error) => {
          console.error(error);
        }
      });
    };

    loadcsv();
  }, []);


  useEffect(() => {
    if (allPlaces.length > 0) {
      fetchPopulationData();
    }
  }, [allPlaces]);  // allPlaces가 업데이트될 때마다 호출

  // 데이터 fetching 함수 (인구 데이터)
  const fetchPopulationData = async () => {
    if (allPlaces.length === 0) {
      return;
    }

    const userLocationData = JSON.parse(location);  // 현재 위치 정보 가져오기
    const closestPlace = findClosestPlace(userLocationData.latitude, userLocationData.longitude);

    if (!closestPlace) {
      console.error("가장 가까운 장소를 찾을 수 없습니다.");
      return;
    }

    const POPULATION_MAP_API_URL = `http://openapi.seoul.go.kr:8088/${import.meta.env.VITE_POPULATION_API_KEY}/json/citydata_ppltn/1/5/${closestPlace.AREA_NM}`;

    try {
      const response = await fetch(POPULATION_MAP_API_URL);
      if (!response.ok) {
        throw new Error('ERROR');
      }
      const data = await response.json();
      const result = await data["SeoulRtd.citydata_ppltn"][0];
      setPopulationData(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 히트맵 생성 함수
  const createHeatmap = (navermaps, populationData) => {
    const heatmapData = populationData.map((place) => ({
      lat: place.Latitude,
      lng: place.Longitude,
      weight: normalizePopulation(place.AREA_PPLTN_MIN, populationData),
    }));

    if (navermaps.visualization) {
      const heatmap = new navermaps.visualization.HeatMap({
        map: navermaps,
        data: heatmapData,
        radius: 30,
        opacity: 0.7,
        colorMap: naver.maps.visualization.SpectrumStyle.YIGnBu,
      });
    } else {
      console.error('Naver Map visualization 모듈이 로드되지 않았습니다.');
    }
  };

  // 인구 밀도를 0~1로 정규화하는 함수
  const normalizePopulation = (population, populationData) => {
    if (populationData.length === 0) {
      return 0; // 데이터가 없을 경우 기본값 0
    }

    const minPopulation = Math.min(...populationData.map(place => place.AREA_PPLTN_MIN));
    const maxPopulation = Math.max(...populationData.map(place => place.AREA_PPLTN_MAX));
    console.log(populationData)

    if (maxPopulation === minPopulation) {
      return 0; // 분모가 0인 경우를 처리
    }

    return (population - minPopulation) / (maxPopulation - minPopulation);
  };


  // 장소 검색 함수
  const searchPlace = async (query) => {
    try {
      const response = await fetch(`http://localhost:8888/searchmap?query=${query}`);

      if (response.ok) {
        const data = await response.json();
        console.log(data.items[0].mapx, data.items[0].mapy)
        setPlaces([{ mapx: data.items[0].mapx, mapy: data.items[0].mapy }]);  // 검색된 장소 항목을 상태로 설정
      } else {
        throw new Error("데이터 가져오기 실패 : " + response.statusText);
      }
    } catch (error) {
      console.error("장소 데이터 로딩 중 오류 : ", error);
      setPlaces([]);  // 오류 발생 시 장소 리스트 초기화
    }
  };

  // 검색 버튼 클릭 시 검색
  const handleSearch = async () => {
    if (!searchQuery) return; // 검색어가 비어있으면 아무 것도 하지 않음
    setRegion(searchQuery);  // 검색어를 지역으로 설정
    await searchPlace(searchQuery);
    fetchPopulationData();  // 가장 가까운 명소의 AREA_NM을 실시간 인구 데이터 API에 전달
  };

  // 엔터키로 검색
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();  // 엔터키로 검색
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="population">
      <div className='search-population'>
        <p> * 서울시 116개 주요 명소의 실시간 인구 데이터를 검색하실 수 있습니다.<br />
          * 찾으시는 지역의 데이터가 없는 경우, 해당 지역과 가장 가까운 명소의 데이터를 검색합니다.<br />
          * 서울시 이외의 데이터는 불러올 수 없습니다.</p>

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

      <MapPage region={region} places={places} />

      <div className="text-population">
        <h1>{populationData.AREA_NM}</h1><br />
        <p>인구 : {populationData.AREA_PPLTN_MIN} ~ {populationData.AREA_PPLTN_MAX}명<br />
          혼잡도 : {populationData.AREA_CONGEST_LVL}<br /><br />
          {populationData.AREA_CONGEST_MSG}</p>
      </div>
    </div>
  );
}

// 지도 페이지
const MapPage = ({ region, places }) => {
  return (
    <NavermapsProvider ncpClientId={import.meta.env.VITE_NAVER_MAP_CLIENT_ID}>
      <MapDiv style={{ width: '100%', height: '400px' }}>
        <MapWithMarker region={region} places={places} />
      </MapDiv>
    </NavermapsProvider>
  );
};

// 지역에 맞는 좌표로 지도에 표시
const MapWithMarker = ({ places }) => {
  const navermaps = useNavermaps();

  // useEffect(() => {
  //   if (navermaps **) {      // 히트맵 생성
  //   }
  // }, [navermaps]);

  return (
    <NaverMap
      defaultCenter={places.length > 0 ? new navermaps.LatLng(places[0].mapy, places[0].mapx) : null}
      defaultZoom={12}
    >
      {places.length > 0 ? (
        places.map((place, index) => {
          const { mapx, mapy } = place;
          const lat = parseFloat(mapx);
          const lng = parseFloat(mapy);
          const searchedLatLon = new naver.maps.LatLng(lat, lng);
          console.log(lat, lng);
          console.log(mapx, mapy);
          // console.log(place)

          return (
            <Marker key={index} position={searchedLatLon} title={'검색된 장소'} />
          );
        })
      ) : (
        <div>장소 없음</div>
      )}
    </NaverMap>
  );
};

export default Population;
