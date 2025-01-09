import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import '../css/TripPlacesDay.css';

function TripPlacesDay({ contentTypeId, pageNo }) {
  const location = JSON.parse(localStorage.getItem("location"));
  const isLanguage = useSelector(state => state.isLanguage);
  const APIKEY = import.meta.env.VITE_KOREA_TOURIST_DAY_API_KEY;
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);  // 로딩 상태 관리

  useEffect(() => {
    const lat = location.latitude;
    const lon = location.longitude;
    
    let serviceType = "KorService1"; 
    if (isLanguage === "english") {
      serviceType = "EngService1";
    } else if (isLanguage === "japan") {
      serviceType = "JpnService1";
    } else if (isLanguage === "china") {
      serviceType = "ChsService1";
    }

    const URL = `https://apis.data.go.kr/B551011/${serviceType}/locationBasedList1?numOfRows=10&pageNo=${pageNo}&MobileOS=WIN&MobileApp=hanbit&_type=json&mapX=${lon}&mapY=${lat}&radius=10000&contentTypeId=${Number(contentTypeId)}&serviceKey=${APIKEY}`;

    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        const items = data.response.body.items.item || [];
        const filteredItems = items.filter(item => item.firstimage && item.firstimage !== "");
        const randomPlaces = getRandomItems(filteredItems, 4);

        const formattedPlaces = randomPlaces.map((i) => ({
          id: i.contentid,
          add: i.addr1,
          img: i.firstimage,
          lon: i.mapx,
          lat: i.mapy,
          title: i.title
        }));

        setPlaces(formattedPlaces);
        setIsLoading(false);  // 데이터 로딩 완료
      })
      .catch((error) => {
        console.error("API 호출 오류:", error);
      });
  }, [isLanguage, pageNo]);

  const getRandomItems = (arr, n) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random()); 
    return shuffled.slice(0, n); 
  };

  return (
    <div className="place-card">
      {isLoading ? (
        <div className="loading-container">
          <p>로딩 중...</p>  {/* 로딩 중 텍스트 */}
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default TripPlacesDay;
