import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import "../css/Amenities.css";
import GoogleTranslate from '../../components/jsx/GoogleTranslate';
import { useTranslation } from "react-i18next";
import "@/locales/i18n";
import { useLocation } from 'react-router-dom';

const Amenities = () => {
  const { t } = useTranslation();
  const [map, setMap] = useState(null);
  const [placeOverlay, setPlaceOverlay] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [currCategory, setCurrCategory] = useState('');
  const kakaoApiKey = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const location = useLocation();
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
    if (stateId) {
      const category = categories.find(cat => cat.id === stateId);
      if (category) onCategoryClick(category);
    }
  }, [stateId]);

  useEffect(() => {
    loadKakaoMapScript();
    return cleanUp;
  }, []);

  const loadKakaoMapScript = () => {
    const existingScript = document.getElementById('kakao-map-script');
    if (existingScript) existingScript.remove();

    
    const script = document.createElement('script');
    script.id = 'kakao-map-script';
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&libraries=services&autoload=false`;
    script.onload = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(initMap);  // 카카오맵 로드 후 맵 초기화
      } else {
        console.error('카카오맵 API 로드 실패');
      }
    };
    document.head.appendChild(script);
  };

  const initMap = () => {
    const mapContainer = document.getElementById('map');
    const storedLocation = JSON.parse(localStorage.getItem('location')) || { latitude: 37.566826, longitude: 126.9786567 };
    const mapOption = {
      center: new window.kakao.maps.LatLng(storedLocation.latitude, storedLocation.longitude),
      level: 5,
    };
    const mapInstance = new window.kakao.maps.Map(mapContainer, mapOption);
    setMap(mapInstance);

    const overlay = new window.kakao.maps.CustomOverlay({ zIndex: 1 });
    setPlaceOverlay(overlay);
  };

  const searchPlaces = (categoryId) => {
    if (!categoryId || !window.kakao?.maps) {
      console.error('카카오맵 서비스 로드 실패');
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    const storedLocation = JSON.parse(localStorage.getItem('location')) || { latitude: 37.566826, longitude: 126.9786567 };

    ps.categorySearch(categoryId, placesSearchCB, {
      useMapBounds: true,
      radius: 4000,
      location: new window.kakao.maps.LatLng(storedLocation.latitude, storedLocation.longitude),
    });
  };

  const placesSearchCB = (data, status) => {
    if (status === window.kakao.maps.services.Status.OK) displayPlaces(data);
  };

  const displayPlaces = (places) => {
    removeMarkers();
    places.forEach(place => {
      const marker = addMarker(new window.kakao.maps.LatLng(place.y, place.x));
      window.kakao.maps.event.addListener(marker, 'click', () => displayPlaceInfo(place));
    });
  };

  const addMarker = (position) => {
    const marker = new window.kakao.maps.Marker({
      position,
      content: getCategoryIcon(currCategory),
    });
    marker.setMap(map);
    setMarkers(prev => [...prev, marker]);
    return marker;
  };

  const getCategoryIcon = (categoryId) => {
    const categoryIcon = categories.find(category => category.id === categoryId)?.icon;
    return `<div class="custom-marker"><img src="${categoryIcon}" alt="${categoryId}" style="width: 50px; height: 50px;" /></div>`;
  };

  const removeMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  };

  const displayPlaceInfo = (place) => {
    placeOverlay.setMap(null);
    const content = `
      <div class="placeinfo">
        <a class="title" href="${place.place_url}" target="_blank" title="${place.place_name}">
          ${place.place_name}
        </a>
        ${place.road_address_name ? `
          <span title="${place.road_address_name}">${place.road_address_name}</span>
          <span class="jibun" title="${place.address_name}">(지번 : ${place.address_name})</span>` :
          `<span title="${place.address_name}">${place.address_name}</span>`
        }
        <span class="tel">${place.phone}</span>
      </div>
      <div class="after"></div>
    `;
    const contentNode = document.createElement('div');
    contentNode.className = 'placeinfo_wrap';
    contentNode.innerHTML = content;
    placeOverlay.setContent(contentNode);
    placeOverlay.setPosition(new window.kakao.maps.LatLng(place.y, place.x));
    placeOverlay.setMap(map);
  };

  const onCategoryClick = (category) => {
    setCurrCategory(category.id);
    removeMarkers();
    if (placeOverlay) placeOverlay.setMap(null);
    searchPlaces(category.id);
  };

  const cleanUp = () => {
    removeMarkers();
    if (placeOverlay) placeOverlay.setMap(null);
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
              className={currCategory === category.id ? 'active' : ''}
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
