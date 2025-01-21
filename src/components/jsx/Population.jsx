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
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}`;
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
    console.log(closestPlace);

    return closestPlace;
  };

  useEffect(() => {
    if (allPlaces.length > 0) {
      fetchPopulationData();
    }
  }, [allPlaces]);

  // 인구 데이터 fetching 함수
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
  
      // 인구 데이터 API 호출 (가장 가까운 장소의 인구 데이터 가져오기)
      const POPULATION_MAP_API_URL = `http://openapi.seoul.go.kr:8088/${import.meta.env.VITE_POPULATION_API_KEY}/json/citydata_ppltn/1/5/${closestPlace.AREA_NM}`;
      
      try {
        const response = await fetch(POPULATION_MAP_API_URL);
        if (!response.ok) {
          throw new Error('인구 데이터 요청 실패');
        }
        const data = await response.json();
        const result = await data["SeoulRtd.citydata_ppltn"][0];
        setPopulationData(result);  // 인구 데이터 상태 업데이트
        
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
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

      <MapPage closestPlace={closestPlace} populationData={populationData} />

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
  return (
    <NavermapsProvider ncpClientId={import.meta.env.VITE_NAVER_MAP_CLIENT_ID}>
      <MapDiv style={{ width: '100%', height: '40vh' }}>
        <MapWithMarker closestPlace={closestPlace} populationData={populationData} />
      </MapDiv>
    </NavermapsProvider>
  );
};

const MapWithMarker = ({ closestPlace, populationData }) => {
  const navermaps = useNavermaps();
  const { Latitude, Longitude } = closestPlace;
  const userLocation = new navermaps.LatLng(Latitude, Longitude);

  useEffect(() => {
    if (!populationData) return;

    // populationData가 배열인지 확인 후, 처리
    if (Array.isArray(populationData)) {
      // 히트맵을 추가
      const heatmapData = populationData.map(place => ({
        lat: place.Latitude,
        lng: place.Longitude,
        weight: place.AREA_PPLTN_MIN,  // 가중치로 인구 최소값을 사용
      }));

      const heatmapLayer = new navermaps.visualization.Heatmap({
        map: navermaps,
        data: heatmapData,
        radius: 30,  // 히트맵 반경 설정
        opacity: 0.7,
        maxIntensity: 100,  // 최대 밀도 설정
      });
    } else {
      console.error('populationData는 배열이어야 합니다:', populationData);
    }

    return () => {
      if (heatmapLayer) {
        heatmapLayer.setMap(null);  // 히트맵 제거
      }
    };
  }, [populationData, navermaps]);

  return (
    <NaverMap defaultCenter={userLocation} defaultZoom={11}>
      <Marker position={userLocation} />
    </NaverMap>
  );
};



export default Population;






  // // 히트맵 생성 함수
  // const createHeatmap = (navermaps, populationData) => {
  //   const heatmapData = populationData.map((place) => ({
  //     lat: place.Latitude,
  //     lng: place.Longitude,
  //     weight: normalizePopulation(place.AREA_PPLTN_MIN, populationData),
  //   }));

  //   if (navermaps.visualization) {
  //     const heatmap = new navermaps.visualization.HeatMap({
  //       map: navermaps,
  //       data: heatmapData,
  //       radius: 30,
  //       opacity: 0.7,
  //       colorMap: naver.maps.visualization.SpectrumStyle.YIGnBu,
  //     });
  //   } else {
  //     console.error('Naver Map visualization 모듈이 로드되지 않았습니다.');
  //   }
  // };

  // // 인구 밀도를 0~1로 정규화하는 함수
  // const normalizePopulation = (population, populationData) => {
  //   if (populationData.length === 0) {
  //     return 0; // 데이터가 없을 경우 기본값 0
  //   }

  //   const normalPop = (population, allPopulationData) => {
  //     const minPop = allPopulationData.AREA_PPLTN_MIN;
  //     const maxPop = allPopulationData.AREA_PPLTN_MAX;
    
  //     if (maxPop === minPop) {
  //       return 0;
  //     }

  //   return (population - minPop) / (maxPop - minPop);
  // };