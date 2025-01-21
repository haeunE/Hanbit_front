import React, { useState, useEffect } from 'react';
import "../css/Population.css";
import Papa from 'papaparse';
import { NavermapsProvider, Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps';

function Population() {
  const location = localStorage.getItem('location');
  const initialRegion = location ? JSON.parse(location).region : '천호역'; // 기본 지역

  const [populationData, setPopulationData] = useState([]); // 실시간 인구밀집도 데이터
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialRegion); // 사용자가 입력한 검색어
  const [region, setRegion] = useState(initialRegion); // 검색 받은 지역
  const [allPlaces, setAllPlaces] = useState([]); // 서울시 주요 116곳 명소 정보
  const [closestPlace, setClosestPlace] = useState(null); // 가장 가까운 장소를 저장할 상태
  const [naverLoaded, setNaverLoaded] = useState(false);


  useEffect(() => {
    const loadcsv = async () => {
      const response = await fetch('/data/update_geo_population.csv');
      const text = await response.text();

      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const places = result.data.filter(place => place.Latitude && place.Longitude)
          .map(place => ({
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
    const loadNaverMapAPI = () => {
      // Naver API를 로드하는 로직을 작성합니다.
      // 예시로 NaverMap API의 script를 로딩합니다.
      const script = document.createElement('script');
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}&submodules=geocoder`
      script.onload = () => setNaverLoaded(true);
      document.body.appendChild(script);
    };
  
    if (!naverLoaded) {
      loadNaverMapAPI(); // API 로딩
    }
  }, [naverLoaded]);


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

  // 검색한 지역과 가장 가까운 서울 명소 찾기기
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
    return closestPlace;
  };

  useEffect(() => {
    if (allPlaces.length > 0) {
      fetchPopulationData();
    }
  }, [allPlaces]);


    // 인구 데이터 요청
    const fetchPopulationData = async () => {
      if (allPlaces.length === 0) return;
  
      let userLocationData = null;  // 현재 위치 정보 가져오기
      if (!searchQuery) {
        userLocationData = JSON.parse(location);  // 기본 위치
      } else {
        // searchQuery에 있는 장소이름의 위경도를 구해와서 userLocationData에 저장
        const place = await searchPlace(searchQuery);
        if (place) {
          userLocationData = {
            latitude: parseFloat(place.Latitude) / 10000000,
            longitude: parseFloat(place.Longitude) / 10000000,
          };
          console.log(userLocationData);
        }
      }
  
      if (!userLocationData) {
        console.error('위치 정보를 찾을 수 없습니다. - userLocationData');
        return;
      }
  
      // 가장 가까운 장소 찾기
      const closestPlace = findClosestPlace(userLocationData.latitude, userLocationData.longitude);
      if (!closestPlace) {
        console.error("가장 가까운 장소를 찾을 수 없습니다.");
        return;
      }
  
      setClosestPlace(closestPlace);  // 가장 가까운 장소 상태 업데이트
  
      // 실시간 인구데이터 api
      const POPULATION_MAP_API_URL = `http://openapi.seoul.go.kr:8088/${import.meta.env.VITE_POPULATION_API_KEY}/json/citydata_ppltn/1/5/${closestPlace.AREA_NM}`;
      
      try {
        const response = await fetch(POPULATION_MAP_API_URL);
        if (!response.ok) {
          throw new Error('인구 데이터 요청 실패');
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
  
  const isEnglish = () => {
    // 영어 여부 체크: 정규식으로 한글이 포함되어 있지 않으면 영어로 간주
    return !/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(searchQuery);
  };

  
    // 장소 검색
    const searchPlace = async (query) => {
      try {
        const response = await fetch(`http://localhost:8888/searchmap?query=${query}`);
        if (response.ok) {
          const data = await response.json();
          if (data.items.length > 0) {
            const { mapx, mapy } = data.items[0];
            return {
              Latitude: parseFloat(mapy), // 위도
              Longitude: parseFloat(mapx), // 경도
            };
            
          } else {
            console.error("검색된 장소가 없습니다.");
            return null;
          }
        } else {
          throw new Error("데이터 가져오기 실패 : " + response.statusText);
        }
      } catch (error) {
        console.error("장소 데이터 로딩 중 오류 : ", error);
        return null;
      }
    };

    // 검색 버튼 클릭 시 검색
  const handleSearch = async () => {
    if (!searchQuery) return; // 검색어가 비어있으면 아무 것도 하지 않음
    setRegion(searchQuery);
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

      <MapPage closestPlace={closestPlace} />

      <div className="text-population">
        <h1>{populationData.AREA_NM}</h1><br />
        <p>인구 : {populationData.AREA_PPLTN_MIN} ~ {populationData.AREA_PPLTN_MAX}명<br />
          혼잡도 : {populationData.AREA_CONGEST_LVL}<br /><br />
          {populationData.AREA_CONGEST_MSG}</p>
      </div>
    </div>
  );
}

const MapPage = ({ closestPlace }) => {
  return (
    <NavermapsProvider ncpClientId={import.meta.env.VITE_NAVER_MAP_CLIENT_ID}>
      <MapDiv style={{ width: '100%', height: '40vh' }}>
        <MapWithMarker closestPlace={closestPlace} /> 
      </MapDiv>
    </NavermapsProvider>
  );
};

const MapWithMarker = ({ closestPlace }) => {
  const navermaps = useNavermaps();
  const { Latitude, Longitude } = closestPlace;
  const userLocation = new navermaps.LatLng(Latitude, Longitude);

  return (
    <NaverMap defaultCenter={userLocation} defaultZoom={11} >
      <Marker position={userLocation} />
    </NaverMap>

  );
};



export default Population;
