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
      if (!window.naver || !window.naver.maps) {
        console.error("Naver 지도 API가 로드되지 않았습니다.");
        setIsLoading(false);
        return;
      }

      const URL = `http://openapi.seoul.go.kr:8088/${APIKEY}/json/tbCycleStationInfo/1/500/`;

      fetch(URL)
        .then((response) => response.json())
        .then((data) => {
          const items = data.stationInfo.row || [];
          setStations(items);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("API 호출 오류:", error);
          setIsLoading(false);
        });
    };
    script.onerror = () => {
      console.error("Naver 지도 API 스크립트를 로드할 수 없습니다.");
      setIsLoading(false);
    };
    document.head.appendChild(script);

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

      stations.forEach((station) => {
        const { STA_LAT, STA_LONG, RENT_NM, HOLD_NUM } = station;
        const position = new window.naver.maps.LatLng(STA_LAT, STA_LONG);

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
  }, [stations]);

  return (
    <div className="bicycle">
      <h2>{location.city} 자전거 대여소</h2>
      {isLoading ? (
        <p>로딩 중...</p>
      ) : (
        <div id="map" style={{ width: "100%", height: "500px" }}></div>
      )}

      {/* 따릉이 사용법 섹션 추가 */}
      <div className="instructions">
        <h3>따릉이 사용법</h3>
        <ul>
          <li>1. 대여소에 도착하여 자전거를 선택하세요.</li>
          <li>2. 자전거를 대여하려면 스마트폰의 '따릉이' 앱을 실행합니다.</li>
          <li>3. 앱에서 QR코드를 스캔하여 자전거를 대여하세요.</li>
          <li>4. 자전거를 이용한 후 가까운 대여소에 반납하세요.</li>
          <li>5. 대여소에 자전거가 없는 경우, 다른 대여소를 확인하거나 대여 가능한 자전거가 있는 곳으로 이동하세요.</li>
        </ul>

        {/* 앱과 웹사이트 링크 추가 */}
        <div className="button-container">
          <a
            href="https://www.bikeseoul.com" // 서울 따릉이 웹사이트
            target="_blank"
            rel="noopener noreferrer"
          >
            따릉이 웹사이트로 이동
          </a>
        </div>
      </div>
    </div>
  );
}

export default Bicycle;
