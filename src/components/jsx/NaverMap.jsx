import { useEffect, useState, useRef } from "react";

function NaverMap({ items, location, language }) {
  const [isLoading, setIsLoading] = useState(true);
  const mapContainerRef = useRef(null); // useRef로 map 요소를 참조

  useEffect(() => {
    const MAP_CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;

    // mapContainerRef가 렌더링 후 초기화되었는지 확인
    if (!mapContainerRef.current) {
      console.error("Map container not found");
      setIsLoading(false);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${MAP_CLIENT_ID}&language=${language}`;
    script.async = true;

    script.onload = () => {
      console.log("네이버 지도 API 로드 완료");

      // Naver 지도 API가 로드되지 않았으면 종료
      if (!window.naver || !window.naver.maps) {
        console.error("Naver 지도 API가 로드되지 않았습니다.");
        setIsLoading(false);
        return;
      }

      const mapOptions = {
        center: location
          ? new window.naver.maps.LatLng(location.latitude, location.longitude)
          : new window.naver.maps.LatLng(37.5665, 126.9780), // 기본 서울 좌표
        zoom: 12,
      };

      // mapContainerRef.current가 null이 아닐 때만 지도를 생성
      const map = new window.naver.maps.Map(mapContainerRef.current, mapOptions);

      // 마커 추가
      if (items.length > 0) {
        items.forEach(({ latitude, longitude, RENT_NM, HOLD_NUM }) => {
          const position = new window.naver.maps.LatLng(latitude, longitude);
          const marker = new window.naver.maps.Marker({
            position: position,
            map: map,
          });

          const infoWindow = new window.naver.maps.InfoWindow({
            content: `<div>${RENT_NM}, 대여 가능 수: ${HOLD_NUM}</div>`,
          });

          window.naver.maps.Event.addListener(marker, "click", () => {
            infoWindow.open(map, marker);
          });
        });
      }

      setIsLoading(false);
    };

    script.onerror = () => {
      console.error("Naver 지도 API 스크립트를 로드할 수 없습니다.");
      setIsLoading(false);
    };

    document.head.appendChild(script);

    // Cleanup
    return () => {
      document.head.removeChild(script);
    };
  }, [items, location, language]);

  // mapContainerRef가 준비되었을 때만 렌더링
  if (isLoading || !mapContainerRef.current) {
    return <div>지도 로드 중...</div>;
  }

  return <div ref={mapContainerRef} style={{ width: "100%", height: "400px" }} />;
}

export default NaverMap;
