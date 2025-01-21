import { useEffect, useRef } from "react";
import { SetIsLocation } from "../../redux/locationState";
import { useDispatch, useSelector } from "react-redux";
import "@/locales/i18n";
import i18n from 'i18next';

function NaverMap({ items, zoom }) {
  const location = useSelector((state) => state.isLocation); // 현재 위치
  const dispatch = useDispatch();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null); // 지도 인스턴스를 저장할 ref

  // 지도 로드 함수
  const loadMap = () => {
    // 기존 스크립트가 있으면 삭제
    const existingScript = document.getElementById("naver-map-script");
    if (existingScript) {
      existingScript.remove();
    }

    // 스크립트 로딩
    const MAP_CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
    const script = document.createElement("script");
    script.id = "naver-map-script"; // 스크립트 id 지정
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${MAP_CLIENT_ID}&language=${i18n.language}`;
    script.async = true;

    script.onload = () => {
      if (!window.naver || !window.naver.maps) {
        console.error("Naver 지도 API가 로드되지 않았습니다.");
        return;
      }

      // 기존 지도 객체가 있으면 삭제
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
      }

      // 지도 초기화
      const mapOptions = {
        center: location
          ? new window.naver.maps.LatLng(location.latitude, location.longitude) // 저장된 위치 사용
          : new window.naver.maps.LatLng(37.5665, 126.9780), // 기본 서울 위치
        zoom: zoom,
      };

      const map = new window.naver.maps.Map(mapContainerRef.current, mapOptions);
      mapInstanceRef.current = map; // 지도 인스턴스를 ref에 저장

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
            <p>${spot.add}</p>
          </div>
        `;

        const infoWindow = new window.naver.maps.InfoWindow({
          content: infoWindowContent,
        });

        window.naver.maps.Event.addListener(marker, "click", () => {
          infoWindow.open(map, marker);
        });
      });

      // 현재 위치 마커 추가
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

  // 언어 변경 시 페이지 새로 고침
  useEffect(() => {
    const langChangeHandler = () => {
      window.location.reload();
      loadMap();
    };

    i18n.on("languageChanged", langChangeHandler);

    return () => {
      i18n.off("languageChanged", langChangeHandler);
    };
  }, []); // 페이지 새로고침 (지도 API 언어 적용을 위해 필요)

  useEffect(() => {
    loadMap();
  }, [items, i18n.language]); // 마커 목록 및 언어 변경 시 지도 다시 로드

  return <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />;
}

export default NaverMap;
