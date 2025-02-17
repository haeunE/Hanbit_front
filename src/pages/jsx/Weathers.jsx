import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import "../css/Weathers.css"; // CSS 파일 불러오기
import Pollutant from "./Pollutant";
import FineDustGraph from "../../components/jsx/FineDustGraph";

function Weathers() {
  // AQI 상태 변수
  const [aqi, setAqi] = useState(75); // 초기 AQI 값 (예제)
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

  const [hourweather, setHourweather] = useState([]);
  const [dayweather, setDayweather] = useState([]);



  useEffect(() => {
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=3659e27ee7bd4e23a7f45544250502&q=Seoul&days=7&lang=ko`)
    .then((response) => response.json())
    .then((data) => {
      const up = (data['forecast']['forecastday'][0]['hour'])
      setHourweather(up);
      console.log(up)
      const down = (data['forecast']['forecastday'])
      setDayweather(down);
      })
  }, []);

  function transWeek(date) {
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    let temp = new Date(date);
    let week = temp.getDay();
    week = daysOfWeek[week];

    return week;
  }

  return (
    <div className={`weather-container ${bgClass}`}>
      <Container>
        <h1>공기질 지수 (AQI)</h1>
        <p>현재 AQI: {aqi}</p>

        {/* AQI 값 변경 버튼 (테스트용) */}
        <button onClick={() => setAqi(aqi + 20)}>AQI 증가</button>
        <button onClick={() => setAqi(aqi - 20)}>AQI 감소</button>
        {/* <Weather/> */}
        <section className="hour-weathers">
          <b className="hour-title">시간대별 일기 예보</b><br></br>
          <p className="hour-subtitle">서울시 공기질 지수(AQI*) 예보</p><br/>
          <div className="hour-datas">
            {
              hourweather.slice(0,12).map((data, index) => {
                return(
                  <div key={index} className="hour-data">
                    <p>{data.time.slice(11, 16)}</p>
                    <p>200</p>
                    <img className="hour-i" src={data['condition']['icon']}></img>
                    <p className="hour-d">{data['temp_c']}˚</p>
                  </div>
                )
              })      
            }
          </div>
        </section>
        <div className="weather-2rows">
          <section className="day-weathers">
            <b className="day-title">오늘의 기상예보</b>
            <p className="day-subtitle">서울시 공기질 지수(AQI*) 예보</p>
            <div className="day-datas">
              {
                dayweather.map((data, index) => {
                  return(
                    <div key={index} className="day-data">
                      <p>{ transWeek(data.date) }</p>
                      <p>200</p>
                      <img className="image2" src={data['day']['condition']['icon']}></img>
                      <p>{data['day']['maxtemp_c']}˚</p>
                      <p>{data['day']['mintemp_c']}˚</p>
                      <p>{data['day']['maxwind_kph']}km/h</p>
                      <p>{data['day']['avghumidity']}%</p>
                    </div>
                  )
                })
              }
            </div>
          </section>
          <Pollutant/>
          <div>
            <FineDustGraph />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Weathers;
