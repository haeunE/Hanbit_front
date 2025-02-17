function DayWeather({dayweather}){
  if (!dayweather || dayweather.length === 0) {
    return <p>데이터를 불러오는 중...</p>;
  }

  function transWeek(date) {
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    let temp = new Date(date);
    let week = temp.getDay();
    week = daysOfWeek[week];

    return week;
  }
  
  return(
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
  )
}
export default DayWeather;