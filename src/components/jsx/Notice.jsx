import React from "react";
import "../css/Notice.css";

function Notice({ aqi }) {
  // AQI 색상 클래스 결정 함수
  const getAqiClass = (aqi) => {
    if (aqi <= 50) return "aqi-good"; // 좋음 (초록)
    if (aqi <= 100) return "aqi-moderate"; // 보통 (노랑)
    if (aqi <= 150) return "aqi-sensitive"; // 민감군 영향 (주황)
    if (aqi <= 200) return "aqi-unhealthy"; // 나쁨 (빨강)
    if (aqi <= 300) return "aqi-very-unhealthy"; // 매우 나쁨 (보라)
    return "aqi-hazardous"; // 위험 (갈색)
  };

  // AQI 상태와 메시지 반환 함수
  const getAqiMessage = (aqi) => {
    if (aqi <= 50) {
      return [
        "공기질이 매우 좋습니다! 외출 활동을 적극 권장합니다.",
        "실내 공기도 매우 좋습니다. 창문을 열고 환기하세요.",
        "자유롭게 외출하셔도 좋습니다."
      ];
    }
    if (aqi <= 100) {
      return [
        "공기질이 괜찮습니다. 외출 가능합니다.",
        "실내 공기도 괜찮습니다. 잠깐 창문을 열어 환기하세요.",
        "외출이 가능하나, 장시간은 피하는 것이 좋습니다."
      ];
    }
    if (aqi <= 150) {
      return [
        "호흡기 질환이 있는 분들은 주의해주세요.",
        "실내에서 활동 시 환기를 자주 해 주세요.",
        "실외 활동은 제한적으로 하고, 마스크 착용이 권장됩니다."
      ];
    }
    if (aqi <= 200) {
      return [
        "외출을 자제하세요. 마스크 착용이 권장됩니다.",
        "실내에서도 환기를 자주 해 주세요. 공기청정기 사용을 권장합니다.",
        "외출을 자제하고, 실내에서 활동하는 것이 좋습니다."
      ];
    }
    if (aqi <= 300) {
      return [
        "공기질이 매우 나쁩니다. 외출을 피하세요.",
        "실내 공기 질이 나쁠 수 있으므로 환기를 피하세요.",
        "외출을 삼가고, 실내에서 휴식을 취하세요."
      ];
    }
    return [
      "공기질이 위험합니다. 외출을 삼가세요.",
      "실내에서 공기 질이 매우 나쁠 수 있으니 환기를 삼가세요.",
      "절대 외출을 삼가고, 실내에서만 활동하세요."
    ];
  };
 
  const getAqiIcon = (aqi) => {
    if (aqi <= 50) return "fas fa-smile"; // 좋음
    if (aqi <= 100) return "fas fa-sun"; // 보통
    if (aqi <= 150) return "fas fa-cloud-sun"; // 민감군 영향
    if (aqi <= 200) return "fas fa-cloud"; // 나쁨
    if (aqi <= 300) return "fas fa-smog"; // 매우 나쁨
    return "fas fa-skull-crossbones"; // 위험
  };
  
  const bgClass = getAqiClass(aqi);
  const [mainMessage, message1, message2] = getAqiMessage(aqi);
  const iconClass = getAqiIcon(aqi);

  return (
    <div className={`weather-notice ${bgClass}`}>
      <div className="aqi-container">
        <div className={`aqi-icon ${bgClass}`}>
          <i className={iconClass}></i>
          <div className="aqi-message">{mainMessage}</div>
        </div>
        <div className="aqi-message-container">
          <div className="aqi-message">{message1}</div>
          <div className="aqi-message">{message2}</div>
        </div>
      </div>
    </div>
  );
}

export default Notice;
