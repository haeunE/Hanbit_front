import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import '../css/TripPlacesDay.css';

function TripPlacesDay() {
  const location = JSON.parse(localStorage.getItem("location"));
  const isLanguage = useSelector(state => state.isLanguage);
  const APIKEY = import.meta.env.VITE_KOREA_TOURIST_DAY_API_KEY;
  const [places, setPlaces] = useState([]);
  console.log(places);

  useEffect(() => {
    const lat = location.latitude;
    const lon = location.longitude;
    const pageNo = Math.floor(Math.random() * 60) + 1;
    
    // 한국어 URL
    let URL = `https://apis.data.go.kr/B551011/KorService1/locationBasedList1?numOfRows=4&pageNo=${pageNo}&MobileOS=WIN&MobileApp=hanbit&_type=json&mapX=${lon}&mapY=${lat}&radius=10000&contentTypeId=12&serviceKey=${APIKEY}`;

    if (isLanguage === "english") {
      URL = `https://apis.data.go.kr/B551011/EngService1/locationBasedList1?numOfRows=4&pageNo=${pageNo}&MobileOS=WIN&MobileApp=hanbit&_type=json&mapX=${lon}&mapY=${lat}&radius=10000&contentTypeId=76&serviceKey=${APIKEY}`;
    }
    
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        const items = data.response.body.items.item || [];
        const formattedPlaces = items.map((i) => ({
          id: i.contentid,
          add: i.addr1,
          img: i.firstimage,
          lon: i.mapx,
          lat: i.mapy,
          title: i.title
        }));

        setPlaces((prev) => [...prev, ...formattedPlaces]);  // 이전 상태에 새 데이터 추가
      })
      .catch((error) => {
        console.error("API 호출 오류:", error);
      });
  }, []);  // location과 isLanguage 의존성 추가

  return (
    <div className="place-card">
      <div className="place-container">
        {places.map((place) => (
          <div key={place.id} className="place-item" style={{ backgroundImage: `url(${place.img})` }}>
            <div className="img-info">
              <div className="place-addr">{place.add}</div>
              <div className="place-title">{place.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TripPlacesDay;
