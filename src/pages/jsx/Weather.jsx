import { useEffect, useState } from "react";
import '../css/Weather.css'
import Pollutant from "./Pollutant";

function Weather() {

  const [Hour, setHour] = useState(null);

  const [Day, setDay] = useState(null);

  
  useEffect(() => {
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=3659e27ee7bd4e23a7f45544250502&q=Seoul&days=7&lang=ko`)
    .then((response) => response.json())
    .then((data) => {
      const up = (data['forecast']['forecastday'][0]['hour'])
      setHour(up);
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
  

  if(!Hour)
    return <div>로딩중</div>

  return (
    <div id='Weather'>
      <section className="bundle1">
        <b className="title1">시간대별 일기 예보</b>
        <p className="subtitle">서울시 공기질 지수(AQI*) 예보</p>
      {
        Hour.map((data) => {
          return(
            <div className="one">
            <p>{data.time.slice(11, 16)}</p>
            <p>200</p>
            <img className="image1" src={data['condition']['icon']}></img>
            <p className="">{data['temp_c']}˚</p>
           </div>
          )
        }) 
            
      }
      </section>
      <div className="grid">
      <section className="bundle2">
        <b className="title2">오늘의 기상예보</b>
        <p className="subtitle">서울시 공기질 지수(AQI*) 예보</p>
      {
        Day.map((data) => {
          return(
            <div className="two">
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