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
  const [searchQuery, setSearchQuery] = useState(''); // 검색어
  const [places, setPlaces] = useState([]); // 검색된 장소
  const [nearPlace, setSelectedLocation] = useState(null); // 지도에 표시할 선택된 지역
  const [allPlaces, setAllPlaces] = useState([]); // 서울시 주요 116곳 명소 정보
  const [region, setRegion] = useState(initialRegion); // 현재 지역 상태

  // 서울시 실시간 인구 데이터 API URL
  const MAP_APIKEY = import.meta.env.VITE_POPULATION_API_KEY;

  // 데이터 fetching 함수 (인구 데이터)
  const fetchPopulationData = async (region) => {
    const POPULATION_MAP_API_URL = `http://openapi.seoul.go.kr:8088/${MAP_APIKEY}/json/citydata_ppltn/1/5/${region}`;

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
        const data = await response.json();
        setPlaces(data.items);  // 검색된 장소 항목을 상태로 설정
      } else {
        throw new Error("Failed to fetch data: " + response.statusText);
      }
    } catch (error) {
      console.error("Error fetching place data:", error);
      setPlaces([]);  // 오류 발생 시 장소 리스트 초기화
    }
  };

  useEffect(() => {   // CSV 파일 로딩
    const PlacesData = async () => {
      const response = await fetch('/data/서울시 주요 116장소명 목록.csv');
      const text = await response.text();

      Papa.parse(text, {
        header: true,  // CSV의 첫 번째 행을 헤더로 사용
        complete: (result) => {
          const places = result.data.map(place => ({
            AREA_NM: place.AREA_NM,  // 한글 명소 이름
            ENG_NM: place.ENG_NM,  // 영어 명소 이름
            mapx: null, // 경도 초기화 (나중에 API로 받아올 예정)
            mapy: null // 위도 초기화 (나중에 API로 받아올 예정)
          }));

          setAllPlaces(places);
        },
        error: (error) => {
          console.error("Error loading places data:", error);
        }
      });
    };

    PlacesData();
  }, []);

  // 명소에 대한 경도, 위도 정보를 API로부터 받아오기
  const fetchCoordinates = async (placeName) => {
    const geocodingUrl = `https://api.naver.com/v1/geocode?address=${encodeURIComponent(placeName)}&key=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}`;

    try {
      const response = await fetch(geocodingUrl);
      const data = await response.json();
      
      // 데이터가 존재하는 경우에만 경도 및 위도 업데이트
      if (data && data.results && data.results[0]) {
        const { x: mapx, y: mapy } = data.results[0].geometry;
        return new naver.maps.LatLng(parseFloat(mapy), parseFloat(mapx));
      } else {
        console.error(`Unable to find coordinates for ${placeName}`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  // 입력값에 맞는 장소 추천 (검색어와 일치하는 명소 추천)
  const getSearchRecommendations = (query) => {
    const lowerQuery = query.toLowerCase();  // 입력된 검색어를 소문자로 변환하여 비교
    const recommendations = allPlaces.filter(place => 
      place.AREA_NM.toLowerCase().includes(lowerQuery) || 
      place.ENG_NM.toLowerCase().includes(lowerQuery)
    );
    setRecommendations(recommendations);
  };

  // 입력된 지역에 가장 가까운 명소 찾기
  const findClosestPlace = (query) => {
    const inputLocation = allPlaces.find(place => place.AREA_NM === query);
  
    // inputLocation이 없으면 가장 가까운 명소 찾기
    if (!inputLocation) {
      let closestPlace = null;
      let closestDistance = Infinity;
  
      allPlaces.forEach(place => {
        // 입력 지역이 명소 목록에 없을 경우 거리 계산
        const placeLatLng = new naver.maps.LatLng(parseFloat(place.mapy), parseFloat(place.mapx));
        const inputLatLng = new naver.maps.LatLng(parseFloat(region.mapy), parseFloat(region.mapx));
        const distance = naver.maps.LatLng.computeDistance(inputLatLng, placeLatLng);  // 네이버 지도 API의 거리 계산 함수 사용
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestPlace = place;
        }
      });
  
      return closestPlace;
    } else {
      return inputLocation;
    }
  };

  // 검색 버튼 클릭 시 검색
  const handleSearch = async () => {
    if (!searchQuery) return; // 검색어가 비어있으면 아무 것도 하지 않음
    setRegion(searchQuery);  // 검색어를 지역으로 설정
    await searchPlace(searchQuery);

    // 입력된 지역이 명소 목록에 없으면, 가장 가까운 명소 찾기
    const closestPlace = findClosestPlace(searchQuery);
    if (closestPlace) {
      setSelectedLocation(closestPlace); // 가장 가까운 명소 위치 설정
    }
  };

  // 검색어 변경 시 추천 목록 업데이트
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    getSearchRecommendations(e.target.value);
  };

  // 엔터키로 검색
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();  // 엔터키로 검색
    }
  };

  // 검색어 변경 시 실시간 인구 데이터 업데이트
  useEffect(() => { 
    fetchPopulationData(region);  // 새로 설정된 지역에 대해 데이터 요청
  }, [region]);

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
        {recommendations.length > 0 && (
          <div className="recommendations">
            <ul>
              {recommendations.map((place, index) => (
                <li key={index}>{place.AREA_NM} ({place.ENG_NM})</li>
              ))}
            </ul>
          </div>
        )}
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
const MapPage = ({ region, places, nearPlace }) => {
  return (
    <NavermapsProvider ncpClientId={import.meta.env.VITE_NAVER_MAP_CLIENT_ID}>
      <MapDiv style={{ width: '100%', height: '400px' }}>
        <MapWithMarker region={region} places={places} nearPlace={nearPlace} />
      </MapDiv>
    </NavermapsProvider>
  );
};

// 지역에 맞는 좌표로 지도에 표시
const MapWithMarker = ({ places, nearPlace }) => {
  const navermaps = useNavermaps();
  const defaultLocation = new navermaps.LatLng(37.5365, 127.1242);

  return (
    <NaverMap defaultCenter={defaultLocation} defaultZoom={12}>
      {places.length > 0 ? (
        places.map((place, index) => {
          const { title, mapx, mapy } = place;
          const lat = parseFloat(mapy);  // 위도 (latitude)
          const lng = parseFloat(mapx);  // 경도 (longitude)
          const location = new navermaps.LatLng(lat, lng);

          return (
            <Marker key={index} position={location} title={title} />
          )})
      ) : (
        <Marker defaultPosition={defaultLocation} title="검색된 장소 없음" />
      )}
      
      {nearPlace && (
        <Marker
          position={new navermaps.LatLng(parseFloat(nearPlace.mapy), parseFloat(nearPlace.mapx))}
          title={nearPlace.AREA_NM}
        />
      )}
    </NaverMap>
  );
};

export default Population;
