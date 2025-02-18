import React from "react";

const HourWeather = ({ hourweather }) => {
  if (!hourweather || hourweather.length === 0) {
    return <p>데이터를 불러오는 중...</p>;
  }

  return (
    <section className="hour-weathers">
      <b className="hour-title">시간대별 일기 예보</b>
      <br />
      <p className="hour-subtitle">서울시 공기질 지수(AQI*) 예보</p>
      <br />
      <div className="hour-datas">
        {hourweather.slice(0, 12).map((data, index) => (
          <div key={index} className="hour-data">
            <p>{data.time.slice(11, 16)}</p>
            <p>200</p> {/* AQI 데이터 추가 필요 */}
            <img className="hour-i" src={data.condition.icon} alt="날씨 아이콘" />
            <p className="hour-d">{data.temp_c}˚</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HourWeather;