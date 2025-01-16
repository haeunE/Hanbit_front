import { useEffect, useState, useRef } from "react";
import { SetIsLocation } from "../../redux/locationState";
import { useDispatch, useSelector } from "react-redux";
import "@/locales/i18n";
import i18n from 'i18next';
import { useTranslation } from "react-i18next";

function NaverMap({ items, language }) {
  const { t } = useTranslation();
  const location = useSelector((state) => state.isLocation); // 현재 위치
  const dispatch = useDispatch();
  const mapContainerRef = useRef(null);

  // 지도 로드 함수
  useEffect(() => {
    const loadMap = () => {
      const MAP_CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;

      const script = document.createElement("script");
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${MAP_CLIENT_ID}&language=${language}`;
      script.async = true;

      script.onload = () => {
        if (!window.naver || !window.naver.maps) {
          console.error("Naver 지도 API가 로드되지 않았습니다.");
          return;
        }

        // 지도 초기화
        const mapOptions = {
          center: location
            ? new window.naver.maps.LatLng(location.latitude, location.longitude) // 저장된 위치 사용
            : new window.naver.maps.LatLng(37.5665, 126.9780), // 기본 서울 위치
          zoom: 12,
        };
        const map = new window.naver.maps.Map(mapContainerRef.current, mapOptions);

        // 마커 추가
        items.forEach((spot) => {
          const position = new window.naver.maps.LatLng(spot.lat, spot.lon);
          const marker = new window.naver.maps.Marker({
            position: position,
            map: map,
          });

          const infoWindowContent = `
            <div>
              <h3>${spot.title}</h3>
              <p>${spot.address}</p>
            </div>
          `;

          const infoWindow = new window.naver.maps.InfoWindow({
            content: infoWindowContent,
          });

          window.naver.maps.Event.addListener(marker, "click", () => {
            infoWindow.open(map, marker);
          });
        });

        // 현재 위치 마커 추가 (location에서 가져온 위치)
        if (location) {
          const currentPositionLatLng = new window.naver.maps.LatLng(location.latitude, location.longitude);
          const currentPositionMarker = new window.naver.maps.Marker({
            position: currentPositionLatLng,
            map: map,
            icon: {
              content: '<div style="background-color: red; width: 10px; height: 10px; border-radius: 50%;"></div>', // 빨간 점 마커
            },
          });
        }
      };

      script.onerror = () => {
        console.error("Naver 지도 API 스크립트를 로드할 수 없습니다.");
      };

      document.head.appendChild(script);
    };

    // 위치 정보 가져오기 (redux 또는 localStorage에서 가져온 위치)
    const savedLocation = JSON.parse(localStorage.getItem("location"));
    if (savedLocation !== null) {
      dispatch(SetIsLocation(savedLocation));
    }

    // 지도 로드
    if (mapContainerRef.current) {
      loadMap();
    }
  }, [items, language, dispatch]); // location 변경 시에도 지도 리로딩

  return <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />;
}

export default NaverMap;
