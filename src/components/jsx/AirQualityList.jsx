import { useEffect, useState } from "react";
import "../css/AirQualityList.css"; // 스타일 파일 추가
import { useDispatch, useSelector } from "react-redux";
import { SetIsMode } from "../../redux/modeState";

function AirQualityList({ airData }) {
  const [showAll, setShowAll] = useState(false); // 전체 보기 상태 관리
  const filteredData = airData.filter((item) => item.pm10 !== null && item.pm10 !== undefined && item.pm10 != "점검중");
  const sortedData = [...filteredData].sort((a, b) => b.pm10 - a.pm10);
  const top10Data = sortedData.slice(0, 10); // 상위 10개 데이터
  const displayData = showAll ? sortedData : top10Data; // 상태에 따라 표시할 데이터 결정
  const isMode = useSelector((state) => state.isMode);
  const dispatch = useDispatch();
  
  useEffect(()=>{
    const savedMode = JSON.parse(localStorage.getItem("isMode"));
    if (savedMode !== null) {
      dispatch(SetIsMode(savedMode));
    }
  })
  return (
    <div className="air-quality-container">
      {/* 테이블 헤더 */}
      <div className="air-quality-header" style={{ backgroundColor: isMode ? "#00b493" : "#f3eada", color: isMode ? "white" : "black" }}>
        <div></div>
        <div>지역</div>
        <div>AQI</div>
        <div>미세먼지 (PM10)</div>
        <div>초미세먼지 (PM2.5)</div>
        <div>주요 오염물질</div>
      </div>

      {/* 데이터 표시 */}
      {displayData.map((item, index) => (
        <div className="air-quality-row" key={item.guno}>
          <div>{index + 1}</div>
          <div>{item.guname}</div>
          <div>{item.aqi}</div>
          <div>{item.pm10} ㎍/㎥</div>
          <div>{item.pm25 !== null ? `${item.pm25} ㎍/㎥` : "-"}</div>
          <div>{item.pollutant || "-"}</div>
        </div>
      ))}

      {/* 더보기 / 접기 버튼 */}
      {sortedData.length > 10 && (
        <button className="toggle-button" onClick={() => setShowAll(!showAll)}>
          {showAll ? "접기 ▲" : "더보기 ▼"}
        </button>
      )}
    </div>
  );
}

export default AirQualityList;
