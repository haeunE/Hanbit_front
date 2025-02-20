import React from "react";

const HourWeather = ({ hourweather, predictHour, city}) => {
  if (!hourweather || hourweather.length === 0) {
    return <p>데이터를 불러오는 중...</p>;
  }
  console.log(predictHour)
  function pm10ToAqi(pm10) {
    const breakpoints = [
        { C_low: 0, C_high: 54, I_low: 0, I_high: 50 },
        { C_low: 55, C_high: 154, I_low: 51, I_high: 100 },
        { C_low: 155, C_high: 254, I_low: 101, I_high: 150 },
        { C_low: 255, C_high: 354, I_low: 151, I_high: 200 },
        { C_low: 355, C_high: 424, I_low: 201, I_high: 300 },
        { C_low: 425, C_high: 604, I_low: 301, I_high: 500 }
    ];

    for (let bp of breakpoints) {
        if (pm10 >= bp.C_low && pm10 <= bp.C_high) {
            return Math.round(
                ((bp.I_high - bp.I_low) / (bp.C_high - bp.C_low)) * (pm10 - bp.C_low) + bp.I_low
            );
        }
    }

    return 500; // 604 이상이면 최대 AQI 500으로 고정
  }
  function getAqiColor(aqi) {
    if (aqi <= 50) {
      return "good";
    } else if (aqi <= 100) {
      return "moderate";
    } else if (aqi <= 150) {
      return "unhealthy-sens";
    } else if (aqi <= 200) {
      return "unhealthy";
    } else if (aqi <= 300) {
      return "very-unhealthy";
    } else {
      return "hazardous";
    }
  }


  return (
    <section className="hour-weathers">
      <b className="hour-title">시간대별 일기 예보</b>
      <br />
      <p className="hour-subtitle">{city} 공기질 지수(AQI*) 예보</p>
      <br />
      <div className="hour-datas">
        {hourweather.slice(0, 12).map((data, index) => (
          <div key={index} className="hour-data">
            <p>{data.time.slice(11, 16)}</p>
            <div
              className={`pre-hour-aqi ${
                predictHour[index] !== undefined
                  ? getAqiColor(pm10ToAqi(predictHour[index]))
                  : ""
              }`}
            >
              {predictHour[index] !== undefined
                ? pm10ToAqi(predictHour[index])
                : "데이터 없음"}
            </div> 
            <img className="hour-i" src={data.condition.icon} alt="날씨 아이콘" />
            <p className="hour-d">{data.temp_c}˚</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HourWeather;