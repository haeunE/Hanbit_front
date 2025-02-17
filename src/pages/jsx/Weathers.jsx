import { Container } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import "../css/Weathers.css"; // CSS 파일 불러오기
import Pollutant from "./Pollutant";
import HourWeather from "../../components/jsx/HourWeather";
import DayWeather from "../../components/jsx/DayWeather";

function Weathers() {
  // AQI 상태 변수
  const [aqi, setAqi] = useState(75); // 초기 AQI 값 (예제)
  const [hourweather, setHourWeather] = useState([]);
  const [dayweather, setDayWeather] = useState([]);
  const [airData, setAirData] = useState([]);
  const [cityAir, setCityAir] = useState(null);
  const city = JSON.parse(localStorage.getItem("location"))?.region?.split(" ")[0] || "서울";

  // API 키 및 URL
  const seoul_apiKey = import.meta.env.VITE_KOREA_SEOUL_DATA_API_KEY;
  const weather_apiKey = import.meta.env.VITE_CITY_WEATHER_API_KEY;
  const airApiUrl = `http://openapi.seoul.go.kr:8088/${seoul_apiKey}/json/ListAirQualityByDistrictService/1/25/`;

  // 업데이트 타이머를 관리하기 위한 ref
  const updateIntervalRef = useRef(null);

  // AQI 색상 클래스 결정 함수
  const getAqiClass = (aqi) => {
    if (aqi <= 50) return "aqi-good"; // 좋음 (초록)
    if (aqi <= 100) return "aqi-moderate"; // 보통 (노랑)
    if (aqi <= 150) return "aqi-sensitive"; // 민감군 영향 (주황)
    if (aqi <= 200) return "aqi-unhealthy"; // 나쁨 (빨강)
    if (aqi <= 300) return "aqi-very-unhealthy"; // 매우 나쁨 (보라)
    return "aqi-hazardous"; // 위험 (갈색)
  };
  const bgClass = getAqiClass(aqi);

  // 날씨 데이터 가져오기
  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${weather_apiKey}&q=Seoul&days=7&lang=ko`);
      const data = await response.json();

      if (data.forecast?.forecastday) {
        setHourWeather(data.forecast.forecastday[0].hour);
        setDayWeather(data.forecast.forecastday);
      }
    } catch (error) {
      console.error("날씨 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  // 공기질 데이터 가져오기
  const fetchAirQualityData = async () => {
    try {
      const response = await fetch(airApiUrl);
      const data = await response.json();

      if (data?.ListAirQualityByDistrictService?.row) {
        // 필요한 필드만 추출하여 새로운 형식으로 저장
        const formattedData = data.ListAirQualityByDistrictService.row.map((item) => ({
          date: item.MSRDATE,           // 측정 날짜 및 시간
          guno: item.MSRADMCODE,        // 행정 코드
          goname: item.MSRSTENAME,      // 지역명
          aqi: item.MAXINDEX,           // 대기질지수 (AQI)
          grade: item.GRADE,            // 등급 (좋음, 보통, 나쁨 등)
          pollutant: item.POLLUTANT,    // 주요 오염 물질
          no2: item.NITROGEN,           // 이산화질소 (NO2)
          o3: item.OZONE,               // 오존 (O3)
          co: item.CARBON,              // 일산화탄소 (CO)
          so2: item.SULFUROUS,          // 아황산가스 (SO2)
          pm10: item.PM10,              // 미세먼지 (PM10)
          pm25: item.PM25,              // 초미세먼지 (PM2.5)
        }));
  
        setAirData(formattedData);
        console.log("Formatted Air Quality Data:", formattedData);
      }
    } catch (err) {
      console.error("Error fetching air quality data:", err);
    }
  };

  // 특정 구의 공기질 데이터 찾기
  const getCityAirData = (airData, city) => {
    return airData?.find((item) => item.goname === city) || null;
  };

  // 매시 10분(오늘 xx:10)마다 데이터 업데이트
  const updateDataEveryTenMinutes = () => {
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }

    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const delay = ((10 - (minutes % 10)) * 60 - seconds) * 1000; // 다음 10분 정각까지 남은 시간(ms)

    setTimeout(() => {
      fetchWeatherData();
      fetchAirQualityData();
      updateIntervalRef.current = setInterval(() => {
        fetchWeatherData();
        fetchAirQualityData();
      }, 600000); // 10분마다 실행
    }, delay);
  };

  // 최초 실행 (한 번만 실행)
  useEffect(() => {
    fetchWeatherData();
    fetchAirQualityData();
    updateDataEveryTenMinutes();

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, []);

  // 공기질 데이터가 변경될 때만 업데이트
  useEffect(() => {
    if (airData.length > 0) {
      const data = getCityAirData(airData, city);

      if (data && JSON.stringify(cityAir) !== JSON.stringify(data)) {
        setCityAir(data);

        if (data.MAXINDEX && aqi !== data.MAXINDEX) {
          setAqi(data.MAXINDEX);
        }
      }
    }
  }, [airData, city]);

  console.log("AQI:", aqi);
  console.log("City Data:", cityAir);
  return (
    <div className={`weather-container ${bgClass}`}>
      <Container>
        <h1>공기질 지수 (AQI)</h1>
        <p>현재 AQI: {aqi}</p>

        {/* AQI 값 변경 버튼 (테스트용) */}
        <button onClick={() => setAqi(aqi + 20)}>AQI 증가</button>
        <button onClick={() => setAqi(aqi - 20)}>AQI 감소</button>
        {/* <Weather/> */}
        <HourWeather hourweather={hourweather}/>
        <div className="weather-2rows">
          <DayWeather dayweather={dayweather}/>
          <Pollutant cityAir={cityAir}/>
        </div>
      </Container>
    </div>
  );
}

export default Weathers;
