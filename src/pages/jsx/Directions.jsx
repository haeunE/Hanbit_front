import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "@/locales/i18n";
import i18n from "i18next";
import { Container } from "react-bootstrap";
import "../css/Directions.css";

const Directions = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [destination, setDestination] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [path, setPath] = useState([]);

  // 초기 위치 설정
  useEffect(() => {
    const locationFromStorage = JSON.parse(localStorage.getItem("location"));
    if (locationFromStorage) {
      const { latitude, longitude, region, city } = locationFromStorage;
      setCurrentLocation({ lat: latitude, lon: longitude, region, city });
    }

    const { data } = location.state || {};
    if (data?.lat && data?.lon) {
      setDestination({
        lat: parseFloat(data.lat),
        lon: parseFloat(data.lon),
        add: data.addr || t("directions.noDestination"),
        title: data.title || t("directions.destination"),
      });
    }

    loadNaverMapAPI()
      .then(() => setMapLoaded(true))
      .catch(console.error);
  }, [location.state, t]);

  // 지도 로딩 후 경로 가져오기
  useEffect(() => {
    if (mapLoaded && currentLocation && destination) {
      fetchDirections();
    }
  }, [mapLoaded, currentLocation, destination]);

  // 경로가 설정되면 지도 업데이트
  useEffect(() => {
    if (mapLoaded && path.length > 0) {
      displayMap();
    }
  }, [mapLoaded, path]);

  // 네이버 지도 API 로드
  const loadNaverMapAPI = () => {
    return new Promise((resolve, reject) => {
      if (window.naver && window.naver.maps) return resolve();

      const MAP_CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
      const script = document.createElement("script");
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${MAP_CLIENT_ID}&language=${i18n.language}`;
      script.async = true;
      script.onload = () => (window.naver?.maps ? resolve() : reject("Naver 지도 API 로드 실패"));
      script.onerror = () => reject("Naver 지도 API 스크립트 로드 실패");
      document.head.appendChild(script);
    });
  };

  // 지도 표시
  const displayMap = () => {
    if (!currentLocation || !destination) return;

    const { lat, lon } = currentLocation;
    const map = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(lat, lon),
      zoom: 13,
    });

    // 현재 위치 마커
    new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(lat, lon),
      map,
      icon: {
        content: `<div style="background-color:red;width:20px;height:20px;border-radius:50%;"></div>`,
        size: new window.naver.maps.Size(20, 20),
        anchor: new window.naver.maps.Point(10, 10),
      },
    });

    // 목적지 마커
    const destinationPosition = new window.naver.maps.LatLng(destination.lat, destination.lon);
    const destinationMarker = new window.naver.maps.Marker({
      position: destinationPosition,
      map,
    });

    const infoWindow = new window.naver.maps.InfoWindow({
      content: `<div>${destination.title} (${destination.add})</div>`,
    });

    window.naver.maps.Event.addListener(destinationMarker, "click", () => {
      infoWindow.open(map, destinationMarker);
    });

    // 폴리라인 생성
    if (path.length > 0) {
      const polylinePath = path.map(coord => new window.naver.maps.LatLng(coord[1], coord[0]));
      new window.naver.maps.Polyline({
        map,
        path: polylinePath,
        strokeColor: '#FF0000',
        strokeWeight: 4,
        strokeOpacity: 0.7,
        strokeStyle: 'solid',
      });
    }
  };

  // 네이버 지도 길찾기 API 호출
  const fetchDirections = async () => {
    const MAP_CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
    const MAP_SECRET = import.meta.env.VITE_NAVER_MAP_SECRET;
    const url = `/load/map-direction-15/v1/driving?start=${currentLocation.lon},${currentLocation.lat}&goal=${destination.lon},${destination.lat}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-ncp-apigw-api-key-id': MAP_CLIENT_ID,
          'x-ncp-apigw-api-key': MAP_SECRET,
        },
      });

      if (!response.ok) {
        throw new Error('네이버 API 요청에 실패했습니다.');
      }

      const data = await response.json();
      setPath(data.route.traoptimal[0].path); // 상태 업데이트 (useEffect 트리거)
    } catch (error) {
      console.error(error);
    }
  };

  const openNaverMapApp = () => {
    if (!currentLocation || !destination) return;

    const naverMapURL = `nmap://route/walk?slat=${currentLocation.lat}&slng=${currentLocation.lon}&sname=내 위치&dlat=${destination.lat}&dlng=${destination.lon}&dname=${destination.title}`;
    const appStoreURL = "https://apps.apple.com/kr/app/naver-map/id311867728";
    const playStoreURL = "https://play.google.com/store/apps/details?id=com.nhn.android.nmap";

    window.location.href = naverMapURL;
    setTimeout(() => {
      window.location.href = /iPhone|iPad|iPod/.test(navigator.userAgent) ? appStoreURL : playStoreURL;
    }, 1000);
  };

  return (
    <Container>
    <div className="directions-container">
      <h2 className="directions-title">{t("directions.title")}</h2>
      {currentLocation ? (
        <div className="current-location">
          <p>
            {t("directions.currentLocation")}: {currentLocation.city} {currentLocation.region}
          </p>
        </div>
      ) : (
        <p className="error-message">{t("directions.noCurrentLocation")}</p>
      )}

      {destination ? (
        <>
          <div className="directions-address">
            <p>
              {t("directions.destination")}: {destination.title} ({destination.add})
            </p>
          </div>
          <div id="map" className="map"></div>
          <div className="button-container">
            <button className="open-naver-map-btn" onClick={openNaverMapApp}>
              {t("directions.openNaverMap")}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="error-message">{t("directions.noDestination")}</p>
          <div className="button-container">
            <button className="open-naver-map-btn" onClick={openNaverMapApp}>
              {t("directions.openNaverMap")}
            </button>
          </div>
        </>
      )}
    </div>
  </Container>
  );
};

export default Directions;
