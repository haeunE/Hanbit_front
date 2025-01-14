import { useEffect, useState, useRef } from "react";
import { SetIsLocation } from "../../redux/locationState";
import { useDispatch, useSelector } from "react-redux";
import "@/locales/i18n";
import i18n from 'i18next';  
import { useTranslation } from "react-i18next";

function NaverMap({ items, language }) {
  const { t } = useTranslation();
  const location = useSelector((state) => state.isLocation);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
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
          setIsLoading(false);
          return;
        }

        // 지도 초기화
        const mapOptions = {
          center: location
            ? new window.naver.maps.LatLng(location.latitude, location.longitude)
            : new window.naver.maps.LatLng(37.5665, 126.9780),
          zoom: 12,
        };
        const map = new window.naver.maps.Map(mapContainerRef.current, mapOptions);

        // 마커 추가
        items.forEach((spot) => {
          const position = new window.naver.maps.LatLng(spot.mapy / 10000000, spot.mapx / 10000000);
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

        setIsLoading(false);
      };

      script.onerror = () => {
        console.error("Naver 지도 API 스크립트를 로드할 수 없습니다.");
        setIsLoading(false);
      };

      document.head.appendChild(script);
    };

    // 위치 정보 가져오기
    const savedLocation = JSON.parse(localStorage.getItem("location"));
    if (savedLocation !== null) {
      dispatch(SetIsLocation(savedLocation));
    }

    // 지도 로드
    if (mapContainerRef.current) {
      loadMap();
    } else {
      setIsLoading(false); // 지도 컨테이너가 없다면 로딩 상태 해제
    }
  }, [items, language, location, dispatch]);

  // 로딩 중일 때 표시
  if (isLoading) {
    return <div>{t`loading`}</div>;
  }

  return <div ref={mapContainerRef} style={{ width: "100%", height: "400px" }} />;
}

export default NaverMap;
