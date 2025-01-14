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
  const [recommendations, setRecommendations] = useState([]); // 검색 추천 목록

  const [test, setTest] = useState({lat: JSON.parse(location).latitude, lon: JSON.parse(location).longitude}) // 사용자 위치 위경도

  // 서울시 실시간 인구 데이터 API URL
  const MAP_APIKEY = import.meta.env.VITE_POPULATION_API_KEY;

  // 데이터 fetching 함수 (인구 데이터)
  const fetchPopulationData = async (placeName) => {
    console.log(placeName)
    const place = findClosestPlace(placeName.lat, placeName.lon)
    console.log(place)
    const POPULATION_MAP_API_URL = `http://openapi.seoul.go.kr:8088/${MAP_APIKEY}/json/citydata_ppltn/1/5/천호역`;

    // console.log('fetchPopulationData URL : ', POPULATION_MAP_API_URL);
    // console.log('placeName : ', placeName)
    // console.log('location : ', location)
    // console.log('region : ', region)

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
    const searchmap_url = `https://api.naver.com/v1/searchmap?query=${encodeURIComponent(query)}`;
    // const searchmap_url = `http://localhost:8888/searchmap?query=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(searchmap_url);
      if (response.ok) {
        const data = await response.json();
        setPlaces(data.items);  // 검색된 장소 항목을 상태로 설정
      } else {
        throw new Error(" 데이터 가져오기 실패 : " + response.statusText);
      }
    } catch (error) {
      console.error("장소 데이터 로딩 중 오류 : ", error);
      setPlaces([]);  // 오류 발생 시 장소 리스트 초기화
    }
  };

  // CSV 파일 로딩
  useEffect(() => {
    const loadcsv = async () => {
      const response = await fetch('/data/서울시 주요 116장소명 목록.csv');
      const text = await response.text();

      Papa.parse(text, {
        header: true,
        complete: (result) => {
          const places = result.data.map(place => ({
            AREA_NM: place.AREA_NM,
            ENG_NM: place.ENG_NM,
            mapx: null,  // 경도 (나중에 API로 받아올 예정)
            mapy: null,  // 위도 (나중에 API로 받아올 예정)
          }));
          setAllPlaces(places);
        },
        error: (error) => {
          console.error("Error loading places data:", error);
        }
      });
    };

    loadcsv();
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
        return null;
      }
    } catch (error) {
      console.error("좌표를 가져오는 중 오류가 발생했습니다:", error);
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
  const findClosestPlace = (latitude, longitude) => {
    let closestPlace = null;
    let closestDistance = Infinity;

    allPlaces.forEach(place => {
      console.log(place)
      const placeLatLng = new naver.maps.LatLng(parseFloat(place.mapy), parseFloat(place.mapx));
      const inputLatLng = new naver.maps.LatLng(latitude, longitude);
      const distance = naver.maps.LatLng.computeDistance(inputLatLng, placeLatLng);  // 네이버 지도 API의 거리 계산 함수 사용

      if (distance < closestDistance) {
        closestDistance = distance;
        closestPlace = place;
      }
    });

    console.log('--------------')
    console.log(allPlaces)
    console.log(latitude, longitude);
    console.log(closestPlace)

    return closestPlace;
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
        setSelectedLocation(closestPlace); // 가장 가까운 명소 위치 설정
        fetchPopulationData(closestPlace.AREA_NM); // 가장 가까운 명소의 AREA_NM을 실시간 인구 데이터 API에 전달
      }
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
    fetchPopulationData(test);  // 새로 설정된 지역에 대해 데이터 요청
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
            onChange={handleInputChange}
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

  // 명소 이름을 한글/영어에 상관없이 표시할 수 있도록 처리
  const getPlaceTitle = (place) => {
    // 영어 이름이 있으면 영어 이름을, 없으면 한글 이름을 사용
    return place.ENG_NM || place.AREA_NM;
  };

  return (
    <NaverMap defaultCenter={defaultLocation} defaultZoom={12}>
      {places.length > 0 ? (
        places.map((place, index) => {
          const { mapx, mapy } = place;
          const lat = parseFloat(mapy);  // 위도 (latitude)
          const lng = parseFloat(mapx);  // 경도 (longitude)
          const location = new navermaps.LatLng(lat, lng);

          return (
            <Marker key={index} position={location} title={getPlaceTitle(place)} />
          );
        })
      ) : (
        // 검색된 장소가 없으면 가장 가까운 명소를 표시
        nearPlace && (
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
