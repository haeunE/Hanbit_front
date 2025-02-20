import "../css/WeatherIntro.css"
function WeathersItro({ cityAir, dayweather }) {
  if (!cityAir) {
    return <div>로딩 중...</div>;
  }
  console.log("인트로",dayweather)
  return (
    <div className="weather-header">
  {/* 왼쪽 공기질 정보 */}
  <div className="weather-header-h1">
    <h1>{cityAir.guname || ""}의 공기질</h1>
    <p>
      {cityAir.guname || ""}의 공기질 지수(AQI&#176;)와 {cityAir.pollutant || "PM 10"}의 공해도 |{" "}
      {cityAir.date?.slice(8, 10)}:00, {cityAir.date?.slice(4, 6)}월 {cityAir.date?.slice(6, 8)}일
    </p>
  </div>

  {/* 오른쪽 공기질 수치 및 날씨 정보 */}
  <div className="weather-intro">
    <div className="weather-info main">
      <span>{cityAir.aqi}</span>
      <span>{cityAir.grade}</span>
    </div>

    <div className="weather-info">
      <span>주요 오염물질: {cityAir.pollutant || "PM 10, PM 2.5"}</span>
      <span>
        {cityAir.aqi ? `${cityAir.aqi}μg` : `(${cityAir.pm10} | ${cityAir.pm25})μg`}
      </span>
    </div>

    <div className="weather-details">
      <span className="weather-icon">
        <img
          className="image2"
          src={dayweather?.day?.condition?.icon}
          alt="날씨 아이콘"
        />
        {dayweather?.day?.maxtemp_c}˚ / {dayweather?.day?.mintemp_c}˚
      </span>
      <span>🌀 {dayweather?.day?.maxwind_kph} km/h</span>
      <span>💧 {dayweather?.day?.avghumidity}%</span>
    </div>
  </div>
</div>

  );
}

export default WeathersItro