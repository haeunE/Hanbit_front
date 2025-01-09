import { useEffect, useState } from "react";
import "../css/Bicycle.css";

function Bicycle() {
  const location = JSON.parse(localStorage.getItem("location"));
  const APIKEY = import.meta.env.VITE_KOREA_SEOUL_DATA_API_KEY;
  const CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
  const [isLoading, setIsLoading] = useState(true);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    if (!location || !location.latitude || !location.longitude) return;

    // Naver 지도 API 스크립트 로드
    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${CLIENT_ID}`;
    script.async = true;
    script.onload = () => {
      // 스크립트가 로드되면 API 호출
      const city = location.city;
      const URL = `http://openapi.seoul.go.kr:8088/${APIKEY}/json/tbCycleStationInfo/1/1000/`;

      fetch(URL)
        .then((response) => response.json())
        .then((data) => {
          const items = data.stationInfo.row || [];
          console.log(items);
          setStations(items);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("API 호출 오류:", error);
          setIsLoading(false);
        });
    };
    document.head.appendChild(script);

    // Cleanup: 컴포넌트가 언마운트될 때 스크립트 제거
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (stations.length > 0 && window.naver && window.naver.maps) {
      const map = new window.naver.maps.Map("map", {
        center: new window.naver.maps.LatLng(location.latitude, location.longitude),
        zoom: 13,
      });

      // 자전거 대여소 마커 추가
      stations.forEach((station) => {
        const { LAT, LNG, STATION_NAME } = station;
        const position = new window.naver.maps.LatLng(LAT, LNG);

        const marker = new window.naver.maps.Marker({
          position: position,
          map: map,
        });

        const infoWindow = new window.naver.maps.InfoWindow({
          content: `<div>${STATION_NAME}</div>`,
        });

        window.naver.maps.Event.addListener(marker, "click", () => {
          infoWindow.open(map, marker);
        });
      });
    }
  }, []);

  return (
    <div>
      <h2>{location.city} 자전거 대여소</h2>
      {isLoading ? (
        <p>로딩 중...</p>
      ) : (
        <div id="map" style={{ width: "100%", height: "500px" }}></div>
      )}
    </div>
  );
}

export default Bicycle;
