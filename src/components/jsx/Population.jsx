import React, { useState, useEffect } from 'react';
import "../css/Population.css";
import { NavermapsProvider, Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps';

function Population() {
  const location = localStorage.getItem('location');
  const [populationData, setPopulationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState([]);

  const region = location ? JSON.parse(location).region : '천호역'; // 지역 기본 설정

  // 서울시 실시간 인구 데이터 API URL
  const MAP_APIKEY = import.meta.env.VITE_POPULATION_API_KEY;
  const POPULATION_MAP_API_URL = `http://openapi.seoul.go.kr:8088/${MAP_APIKEY}/json/citydata_ppltn/1/5/천호역`;

  // 데이터 fetching 함수
  const fetchPopulationData = async () => {
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

  // 장소 검색 함수
  const searchPlace = async (query) => {
    const searchmap_url = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}`;
    const options = {
      headers: {
        'X-Naver-Client-Id': import.meta.env.VITE_NAVER_MAP_CLIENT_ID,
        'X-Naver-Client-Secret': import.meta.env.VITE_NAVER_MAP_CLIENT_SECRET,
      },
    };

    try {
      const response = await fetch(searchmap_url, options);
      const data = await response.json();
      return data.items; // 검색된 장소 항목 반환
    } catch (error) {
      console.error('Error fetching place data:', error);
      return [];
    }
  };

  // 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    fetchPopulationData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return;

    const results = await searchPlace(searchQuery); // 장소 검색
    setPlaces(results); // 검색된 장소 저장
  };

  // 엔터키로 검색
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 기본 동작 막기
      handleSearch(); // 엔터키 눌렀을 때 검색
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
        <p>장소 검색 : </p>
        <input
          type='search'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}  // 엔터키 처리
          placeholder='ex) 김포공항, 성수카페거리, 인사동'
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      <MapPage region={region} places={places} />

      <div className='text-population'>
        <h2>{populationData.AREA_NM}</h2><br />
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
const MapWithMarker = ({ region, places }) => {
  const navermaps = useNavermaps();

  // region 값에 맞는 좌표 설정
  const defaultLocation = new navermaps.LatLng(37.5365, 127.1242);

  return (
    <NaverMap
      defaultCenter={defaultLocation}
      defaultZoom={12}
    >
      {places.length > 0 ? (
        places.map((place, index) => {
          const { title, mapx, mapy } = place;
          const location = new navermaps.LatLng(mapy, mapx);
          return (
            <Marker
              key={index}
              position={location}
              title={title}
            />
          );
        })
      ) : (
        <Marker
          defaultPosition={defaultLocation}
          title="검색된 장소 없음"
        />
      )}
    </NaverMap>
  );
};


export default Population;
