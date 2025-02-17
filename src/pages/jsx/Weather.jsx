import { useEffect, useState } from "react";
import '../css/Weather.css'
import Pollutant from "./Pollutant";

function Weather() {

  const [hour, setHour] = useState(null);

  const [day, setDay] = useState(null);

  
  useEffect(() => {
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=3659e27ee7bd4e23a7f45544250502&q=Seoul&days=7&lang=ko`)
    .then((response) => response.json())
    .then((data) => {
      const up = (data['forecast']['forecastday'][0]['hour'])
      setHour(up);
      console.log(up)
      const down = (data['forecast']['forecastday'])
      setDay(down);
     })
  }, []);

  function transWeek(date) {
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    let temp = new Date(date);
    let week = temp.getDay();
    week = daysOfWeek[week];

    return week;
  }
  

  if(!hour)
    return <div>로딩중</div>

  return (
    <div id='Weather'>
      <section className="bundle1">
        <b className="title1">시간대별 일기 예보</b>
        <p className="subtitle">서울시 공기질 지수(AQI*) 예보</p>
      {
        hour.slice(0, 12).map((data, index) => {
          return (
            <div key={index} className="one">
              <p>{data.time.slice(11, 16)}</p>
              <p>200</p>
              <img className="image1" src={data['condition']['icon']} alt="날씨 아이콘" />
              <p>{data['temp_c']}˚</p>
            </div>
          );
        }) 
            
      }
      </section>
      <div className="grid">
      <section className="bundle2">
        <b className="title2">오늘의 기상예보</b>
        <p className="subtitle">서울시 공기질 지수(AQI*) 예보</p>
      {
        day.map((data, index) => {
          return(
            <div key={index} className="two">
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
      </section>
      <Pollutant/>
      </div>
    </div>
  )
  
}

export default Weather