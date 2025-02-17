import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import "../css/Amenities.css";
import GoogleTranslate from '../../components/jsx/GoogleTranslate';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

const Amenities = () => {
  const { t } = useTranslation();
  const [map, setMap] = useState(null);
  const [placeOverlay, setPlaceOverlay] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [currCategory, setCurrCategory] = useState('');
  const kakaoApiKey = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const location = useLocation();
  const nowLocation = JSON.parse(localStorage.getItem("location"));
  const stateId = location.state;

  const categories = [
    { id: 'CS2', name: t('amenities.convenience-store'), icon: '/img/icon/icon-convenience.png' },
    { id: 'SW8', name: t('amenities.subway'), icon: '/img/icon/icon-subway.png' },
    { id: 'CE7', name: t('amenities.coffee'), icon: '/img/icon/icon-coffee.png' },
    { id: 'HP8', name: t('amenities.hospital'), icon: '/img/icon/icon-hospital.png' },
    { id: 'PM9', name: t('amenities.pharmacy'), icon: '/img/icon/icon-pharmacy.png' },
    { id: 'BK9', name: t('amenities.bank'), icon: '/img/icon/icon-bank.png' },
  ];

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&libraries=services&autoload=false`;
      script.onload = () => {
        window.kakao.maps.load(() => {
          console.log("✅ 카카오맵 API 로드 완료");
          initMap();
        });
      };
      script.onerror = () => console.error("❌ 카카오맵 스크립트 로드 실패");
      document.head.appendChild(script);
    } else {
      console.log("✅ 카카오맵 API 이미 로드됨");
      initMap();
    }

    return () => markers.forEach(marker => marker.setMap(null));
  }, []);

  const initMap = () => {
    if (!window.kakao?.maps?.services) {
      console.error("❌ 카카오맵 서비스 로드 실패");
      return;
    }

    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.error("❌ 맵 컨테이너 없음");
      return;
    }

    const mapInstance = new window.kakao.maps.Map(mapContainer, {
      center: new window.kakao.maps.LatLng(nowLocation.latitude, nowLocation.longitude),
      level: 5,
    });

    setMap(mapInstance);
    setPlaceOverlay(new window.kakao.maps.CustomOverlay({ zIndex: 1 }));

    // ✅ stateId가 있을 경우 카테고리 자동 선택
    if (stateId) {
      const category = categories.find(cat => cat.id === stateId);
      if (category) handleCategoryClick(category, mapInstance);
    }
  };

  const handleCategoryClick = (category, mapInstance = map) => {
    setCurrCategory(category.id);
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
    placeOverlay?.setMap(null);

    if (!window.kakao?.maps?.services) {
      console.error("❌ 카카오맵 서비스 로드 실패");
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    
    ps.categorySearch(category.id, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        data.forEach(place => {
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(place.y, place.x),
            map: mapInstance,
          });

          window.kakao.maps.event.addListener(marker, 'click', () => {
            placeOverlay.setMap(null);
            placeOverlay.setContent(`
              <div class="placeinfo">
                <a class="title" href="${place.place_url}" target="_blank">${place.place_name}</a>
                <span>${place.road_address_name || place.address_name}</span>
                <span class="tel">${place.phone}</span>
              </div>
            `);
            placeOverlay.setPosition(new window.kakao.maps.LatLng(place.y, place.x));
            placeOverlay.setMap(mapInstance);
          });

          setMarkers(prev => [...prev, marker]);
        });
      }
    }, {
      useMapBounds: true,
      radius: 4000,
      location: new window.kakao.maps.LatLng(nowLocation.latitude, nowLocation.longitude),
    });
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
              className={currCategory === category.id ? 'active' : ''}
              onClick={() => handleCategoryClick(category)}
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
