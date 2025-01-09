import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../css/Weather.css"
import { OverlayTrigger, Tooltip } from "react-bootstrap"; // Tooltip 추가 import

function Weather() {
  const isMode = useSelector(state => state.isMode)
  const location = JSON.parse(localStorage.getItem("location"));
  const APIKEY = import.meta.env.VITE_WEATHER_API_KEY;
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {   
    const lat = location.latitude;
    const lon = location.longitude;
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`;
    
    fetch(URL)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("API 키가 유효하지 않습니다.");
          }
        }
        return response.json();
      })
      .then((data) => {
        setWeatherData({
          temp: data.main.temp,
          maxTemp: data.main.temp_max,
          minTemp: data.main.temp_min,
          icon: data.weather[0].icon
        });
      })
      .catch((error) => {
        console.log(error)
      });
  }, [location]);

  const renderTooltip = () => (
    <Tooltip id="button-tooltip">
      {weatherData && (
        <div className={`weather-info ${isMode?'day':'night'}`}>
          <p className={`weather-icon ${isMode?'day':'night'}`}>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
              alt="날씨 아이콘"
            />
          </p>
          <p className="weather-temp">현재 온도: {weatherData.temp}°C</p>
          <p className="weather-max-temp">최고 온도: {weatherData.maxTemp}°C</p>
          <p className="weather-min-temp">최저 온도: {weatherData.minTemp}°C</p>
        </div>
      )}
    </Tooltip>
  );

  return (
    <div className="weather">
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip()}
      >
        {weatherData ? (
          <div className={`weather  ${isMode?'day':'night'}`}>
            <div className="weather-icon">
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                alt="날씨 아이콘"
              />
            </div>
            <p className="weather-temp">{weatherData.temp}°C</p>
          </div>
        ) : (
          <p>날씨 정보를 불러오는 중...</p>
        )}
      </OverlayTrigger>
    </div>
  );
}

export default Weather;
