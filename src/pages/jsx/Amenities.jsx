import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import "../css/Amenities.css"
import GoogleTranslate from '../../components/jsx/GoogleTranslate';
import { useTranslation } from "react-i18next";
import "@/locales/i18n";
import i18n from 'i18next';  // i18n을 import


// 카테고리 정보 (아이콘 URL을 직접 포함)

const Amenities = () => {
  const { t } = useTranslation();
  const [map, setMap] = useState(null);
  const [placeOverlay, setPlaceOverlay] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [currCategory, setCurrCategory] = useState('');
  const kakaoApiKey = import.meta.env.VITE_KAKAO_REST_API_KEY; // 환경 변수로 API 키 가져오기
  
  const categories = [
    { id: 'CS2', name: t('amenities.convenience-store'), icon: '/img/icon/icon-convenience.png' }, // 편의점 아이콘 URL
    { id: 'SW8', name: t('amenities.subway'), icon: '/img/icon/icon-subway.png' }, // 지하철역 아이콘 URL
    { id: 'CE7', name: t('amenities.coffee'), icon: '/img/icon/icon-coffee.png' }, // 카페 아이콘 URL
    { id: 'HP8', name: t('amenities.hospital'), icon: '/img/icon/icon-hospital.png' }, // 병원 아이콘 URL
    { id: 'PM9', name: t('amenities.pharmacy'), icon: '/img/icon/icon-pharmacy.png' } // 약국 아이콘 URL
  ];

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&libraries=services&autoload=false`;
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(initMap);
      } else {
        console.error('카카오맵 로드 실패');
      }
    };
    document.head.appendChild(script);

    return () => {
      removeMarker();
      if (placeOverlay) {
        placeOverlay.setMap(null); // 오버레이 제거
      }
    };
  }, []);

  const initMap = () => {
    const mapContainer = document.getElementById('map');
    const location = JSON.parse(localStorage.getItem('location'));
    const mapOption = {
      center: new window.kakao.maps.LatLng(location?.latitude || 37.566826, location?.longitude || 126.9786567), // 서울의 위도, 경도
      level: 5, // 지도 확대 레벨
    };

    const mapInstance = new window.kakao.maps.Map(mapContainer, mapOption);
    setMap(mapInstance);

    const overlay = new window.kakao.maps.CustomOverlay({ zIndex: 1 });
    setPlaceOverlay(overlay);
  };

  const searchPlaces = (categoryId) => {
    if (!categoryId || !window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.error('카카오맵 서비스 로드 실패');
      return;
    }

    const ps = new window.kakao.maps.services.Places(); // 카카오맵의 장소 검색 서비스 객체 생성
    const location = JSON.parse(localStorage.getItem('location')) || { latitude: 37.566826, longitude: 126.9786567 };

    ps.categorySearch(categoryId, placesSearchCB, {
      useMapBounds: true, // 지도 범위 내에서 검색
      radius: 2000, // 검색 범위를 2km로 설정
      location: new window.kakao.maps.LatLng(location.latitude, location.longitude), // 검색 중심점 설정
    });
  };

  const placesSearchCB = (data, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      displayPlaces(data);
    }
  };

  const displayPlaces = (places) => {
    removeMarker(); // 기존 마커 제거

    places.forEach((place) => {
      const marker = addMarker(new window.kakao.maps.LatLng(place.y, place.x), currCategory);
  
      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        displayPlaceInfo(place); // 장소 정보 표시
      });
    });
  };

  const addMarker = (position, categoryId) => {
    const categoryIcon = categories.find(category => category.id === categoryId)?.icon;

    const marker = new window.kakao.maps.Marker({
      position,
      content: `<div class="custom-marker"><img src="${categoryIcon}" alt="${categoryId}" style="width: 50px; height: 50px;" /></div>`, // 아이콘 URL 사용
    });

    marker.setMap(map);
    setMarkers((prevMarkers) => [...prevMarkers, marker]); // 새로운 마커를 상태에 추가
    return marker;
  };

  const removeMarker = () => {
    markers.forEach((marker) => {
      marker.setMap(null); // 마커 제거
    });
    setMarkers([]); // 마커 배열 초기화
  };

  const displayPlaceInfo = (place) => {
    // 기존에 표시된 오버레이를 지운다.
    placeOverlay.setMap(null);

    const content = `  
      <div class="placeinfo">
        <a class="title" href="${place.place_url}" target="_blank" title="${place.place_name}">
          ${place.place_name}
        </a>
        ${place.road_address_name ? ` 
          <span title="${place.road_address_name}">${place.road_address_name}</span>
          <span class="jibun" title="${place.address_name}">(지번 : ${place.address_name})</span>` : 
          `<span title="${place.address_name}">${place.address_name}</span>`}
        <span class="tel">${place.phone}</span>
      </div>
      <div class="after"></div>
    `;

    const contentNode = document.createElement('div');
    contentNode.className = 'placeinfo_wrap';
    contentNode.innerHTML = content;
    
    placeOverlay.setContent(contentNode);
    placeOverlay.setPosition(new window.kakao.maps.LatLng(place.y, place.x));
    placeOverlay.setMap(map); // 새로운 장소 정보 창 표시
  };

  const onCategoryClick = (category) => {
    setCurrCategory(category.id);
    removeMarker(); // 카테고리 클릭 시 기존 마커 제거
    if (placeOverlay) {
      placeOverlay.setMap(null); // 오버레이 초기화 (기존 오버레이 숨기기)
    }
    searchPlaces(category.id); // 새로운 카테고리 검색
  };

  return (
    <Container>
      <div className="google">
        <GoogleTranslate />
      </div>
      <div className='kakao-amenities'>
        <div id="category">
          {categories.map((category) => (
            <button
              key={category.id}
              id={category.id}
              className={currCategory === category.id ? 'active' : ''} // 현재 선택된 카테고리에 active 클래스 추가
              onClick={() => onCategoryClick(category)}
            >
              <img src={category.icon} alt={category.name} /> {category.name}
            </button>
          ))}
        </div>
        <div id="map" style={{ width: '100%', height: '500px' }}></div>
      </div>
    </Container>
  );
};

export default Amenities;
