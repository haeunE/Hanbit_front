import React, { useState, useEffect } from 'react';
import "../css/Population.css";
import { NavermapsProvider, Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps';


// function csvToJson(csv) {
//   const [header, ...rows] = csv.split("\n").filter(line => line);  // 첫 번째 줄을 헤더로 사용
//   const headers = header.split(",");  // 첫 번째 줄을 헤더로 사용
//   return rows.map(row => {
//     const values = row.split(",");
//     return headers.reduce((obj, header, index) => {
//       obj[header] = values[index];
//       return obj;
//     }, {});
//   });
// }

function Population() {
  const location = localStorage.getItem('location');
  const region = location ? JSON.parse(location).region : '천호역'; // 지역 기본 설정

  const [populationData, setPopulationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState([]);

  // 서울시 실시간 인구 데이터 API URL
  const MAP_APIKEY = import.meta.env.VITE_POPULATION_API_KEY;
  const POPULATION_MAP_API_URL = `http://openapi.seoul.go.kr:8088/${MAP_APIKEY}/json/citydata_ppltn/1/5/천호역`;

  // // CSV 파일을 JSON 형식으로 변환한 데이터를 설정하는 함수
  // const fetchPlacesData = async () => {
  //   try {
  //     const response = await fetch('public/data/서울시 주요 116장소명 목록.csv');
  //     const csv = await response.text();  // CSV 파일 읽기
  //     const json = csvToJson(csv);  // CSV를 JSON으로 변환
  //     setPlacesData(json);  // 변환된 JSON을 상태에 저장
  //   } catch (error) {
  //     console.error("Error fetching places data:", error);
  //   }
  // };

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
    const searchmap_url = `http://localhost:8888/searchmap?query=${encodeURIComponent(query)}`;
    
    try {
      const response = await fetch(searchmap_url);
  
      if (response.ok) {
        const data = await response.json(); // 응답이 JSON 형식일 경우 처리
        console.log(data.items);
        return data.items;  // 검색된 장소 항목 반환
      } else {
        throw new Error("Failed to fetch data: " + response.statusText);
      }
    } catch (error) {
      console.error("Error fetching place data:", error);
      setPlaces([]);
    }
  };

  // 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    fetchPopulationData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return;

   await searchPlace(searchQuery) 
  };

  // 엔터키로 검색
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();  // 엔터키 검색
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
          onKeyDown={handleKeyDown}  // 엔터키 검색
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
const MapWithMarker = ({ places }) => {
  const navermaps = useNavermaps();
  const defaultLocation = new navermaps.LatLng(37.5365, 127.1242);

  console.log("Received places:", places); 

  return (
    <NaverMap
      defaultCenter={defaultLocation}
      defaultZoom={12}
    >
      {places.length > 0 ? (
        places.map((place, index) => {
          const { title, mapx, mapy } = place;

                    // mapx, mapy 값을 숫자로 변환
          const lat = parseFloat(mapy);  // 위도 (latitude)
          const lng = parseFloat(mapx);  // 경도 (longitude)
          
          const location = new navermaps.LatLng(lat, lng);
          
          console.log(lat, lng);

          
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