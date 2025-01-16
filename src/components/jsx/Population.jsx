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
  const [places, setPlaces] = useState([]); // 검색된 장소 목록
  const [nearPlace, setNearPlace] = useState(null); // 가장 가까운 명소
  const [allPlaces, setAllPlaces] = useState([]); // 서울시 주요 116곳 명소 정보
  const [region, setRegion] = useState(initialRegion); // 현재 선택된 지역
  const [naverLoaded, setNaverLoaded] = useState(false); // 네이버 지도 API 로드 상태

  const [userLocation, setUserLocation] = useState(location ? { 
    lat: JSON.parse(location).latitude, 
    lon: JSON.parse(location).longitude 
  } : { lat: 37.5365, lon: 127.1242 }); // 기본값: 천호역

  // 네이버 지도 API 스크립트를 동적으로 로드하는 함수
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

  // 네이버 지도 API 로드
  useEffect(() => {
    loadNaverMapScript();
  }, []);


  // Haversine 공식을 이용한 두 지점 간의 거리 계산 함수
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
      const distance = calculateDistance(lat, lon, place.Latitude, place.Longitude);

      if (distance < minDistance) {
        minDistance = distance;
        closestPlace = place;
      }
    });

    if (!closestPlace) {
      console.error("가장 가까운 장소를 찾을 수 없습니다.");
    }
    return closestPlace;
  };

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

// 데이터 fetching 함수 (인구 데이터)
const fetchPopulationData = async () => {
  const closestPlace = findClosestPlace(userLocation.lat, userLocation.lon);

  // closestPlace가 null일 경우, 함수 실행을 종료
  if (!closestPlace) {
    console.error("가장 가까운 장소를 찾을 수 없습니다.");
    return;
  }

  console.log(closestPlace.AREA_NM);

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
    // 인구 밀도를 기반으로 가중치 생성
    const heatmapData = populationData.map((place) => ({
      lat: place.Latitude,
      lng: place.Longitude,
      weight: normalizePopulation(place.AREA_PPLTN_MIN), // 인구 밀도 정규화
    }));

    const heatmap = new navermaps.visualization.HeatMap({
      map: navermaps, // 히트맵을 표시할 지도 객체
      data: heatmapData,
      radius: 30, // 반경 크기 (픽셀)
      opacity: 0.7, // 불투명도
      colorMap: naver.maps.visualization.SpectrumStyle.RAINBOW, // 색상 스펙트럼
    });
  };

  // 인구 밀도를 0~1로 정규화하는 함수
  const normalizePopulation = (population) => {
    const minPopulation = Math.min(...populationData.map(place => place.AREA_PPLTN_MIN));
    const maxPopulation = Math.max(...populationData.map(place => place.AREA_PPLTN_MAX));

    return (population - minPopulation) / (maxPopulation - minPopulation); // 0~1로 정규화
  };


  // 장소 검색 함수
  const searchPlace = async (query) => {
    try {
      const response = await fetch(`/searchmap?query=${encodeURIComponent(query)}`);

      if (response.ok) {
        const data = await response.json();
        setPlaces(data.places);  // 검색된 장소 항목을 상태로 설정
      } else {
        throw new Error("데이터 가져오기 실패 : " + response.statusText);
      }
    } catch (error) {
      console.error("장소 데이터 로딩 중 오류 : ", error);
      setPlaces([]);  // 오류 발생 시 장소 리스트 초기화
    }
  };

  // 명소에 대한 경도, 위도 정보를 백엔드 API를 통해 받아오기
  const fetchCoordinates = async (placeName) => {
    try {
      const response = await fetch(`/geocode?address=${encodeURIComponent(placeName)}`);

      if (response.ok) {
        const data = await response.json();
        const { x: longitude, y: latitude } = data.addresses[0];
        return new naver.maps.LatLng(parseFloat(latitude), parseFloat(longitude));
      } else {
        console.error('Geocode API 요청 실패:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('좌표를 가져오는 중 오류가 발생했습니다:', error);
      return null;
    }
  };

  // 검색 버튼 클릭 시 검색
  const handleSearch = async () => {
    if (!searchQuery) return; // 검색어가 비어있으면 아무 것도 하지 않음
    setRegion(searchQuery);  // 검색어를 지역으로 설정
    await searchPlace(searchQuery);

    // 입력된 지역이 명소 목록에 없으면, 가장 가까운 명소 찾기
    const coordinates = await fetchCoordinates(searchQuery);
    if (coordinates) {
      const closestPlace = findClosestPlace(coordinates.lat(), coordinates.lng());
      if (closestPlace) {
        setNearPlace(closestPlace); // 가장 가까운 명소 위치 설정
        fetchPopulationData(); // 가장 가까운 명소의 AREA_NM을 실시간 인구 데이터 API에 전달
      } else {
        setNoDataMessage('검색하신 장소와 가장 가까운 장소의 데이터를 불러옵니다.');
      }
    }
  };

  // 엔터키로 검색
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();  // 엔터키로 검색
    }
  };

  useEffect(() => {
    fetchPopulationData();  // 새로 설정된 지역에 대해 데이터 요청
  }, [allPlaces]);

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

      <MapPage region={region} places={places} nearPlace={nearPlace} />

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
const MapPage = ({ region, places, nearPlace, populationData }) => {
  return (
    <NavermapsProvider ncpClientId={import.meta.env.VITE_NAVER_MAP_CLIENT_ID}>
      <MapDiv style={{ width: '100%', height: '400px' }}>
      <MapWithMarker region={region} places={places} nearPlace={nearPlace} populationData={populationData} />
      </MapDiv>
    </NavermapsProvider>
  );
};

// 지역에 맞는 좌표로 지도에 표시
const MapWithMarker = ({ places, nearPlace, populationData }) => {
  const navermaps = useNavermaps();
  const defaultLocation = new navermaps.LatLng(37.5365, 127.1242);

  useEffect(() => {
    if (navermaps && populationData) {
      createHeatmap(navermaps, populationData);
    }
  }, [navermaps, populationData]); // populationData 변경 시마다 히트맵 갱신

  return (
    <NaverMap defaultCenter={defaultLocation} defaultZoom={12}>
      {places.length > 0 ? (
        places.map((place, index) => {
          const { mapx, mapy } = place;
          const lat = parseFloat(mapy);
          const lng = parseFloat(mapx);
          const location = new navermaps.LatLng(lat, lng);

          return (
            <Marker key={index} position={location} title={getPlaceTitle(place)} />
          );
        })
      ) : (
        nearPlace && (        // 검색된 장소가 없으면 가장 가까운 명소를 표시
          <Marker
            position={new navermaps.LatLng(parseFloat(nearPlace.mapy), parseFloat(nearPlace.mapx))}
            title={getPlaceTitle(nearPlace)}
          />
        )
      )}
    </NaverMap>
  );
};

export default Population;
