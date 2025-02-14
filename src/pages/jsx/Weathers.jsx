import { Container } from "react-bootstrap";
import { useState } from "react";
import "../css/Weathers.css"; // CSS 파일 불러오기

function Weathers() {
  // AQI 상태 변수
  const [aqi, setAqi] = useState(75); // 초기 AQI 값 (예제)

  // AQI에 따른 상태 결정 함수
  const getAqiClass = (aqi) => {
    if (aqi <= 50) return "aqi-good"; // 좋음 (초록)
    if (aqi <= 100) return "aqi-moderate"; // 보통 (노랑)
    if (aqi <= 150) return "aqi-sensitive"; // 민감군 영향 (주황)
    if (aqi <= 200) return "aqi-unhealthy"; // 나쁨 (빨강)
    if (aqi <= 300) return "aqi-very-unhealthy"; // 매우 나쁨 (보라)
    return "aqi-hazardous"; // 위험 (갈색)
  };

  // 배경 클래스 결정
  const bgClass = getAqiClass(aqi);

  return (
    <div className={`weather-container ${bgClass}`}>
      <Container>
        <h1>공기질 지수 (AQI)</h1>
        <p>현재 AQI: {aqi}</p>

        {/* AQI 값 변경 버튼 (테스트용) */}
        <button onClick={() => setAqi(aqi + 20)}>AQI 증가</button>
        <button onClick={() => setAqi(aqi - 20)}>AQI 감소</button>
      </Container>
    </div>
  );
}

export default Weathers;
