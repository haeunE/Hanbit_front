import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import '../css/TripPlacesDay.css';
import { useTranslation } from "react-i18next";
import "@/locales/i18n";
import i18n from 'i18next';  // i18n을 import
import { SetLanguage } from "../../redux/languageState";

function TripPlacesDay({ contentTypeId, pageNo }) {
  const { t } = useTranslation();
  const location = JSON.parse(localStorage.getItem("location"));
  const isLanguage = useSelector(state => state.isLanguage);
  const isMode = useSelector(state => state.isMode);
  const APIKEY = import.meta.env.VITE_KOREA_TOURIST_DAY_API_KEY;
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);  // 로딩 상태 관리
  const dispatch = useDispatch();

  useEffect(() => {
    const lat = location.latitude;
    const lon = location.longitude;
    
    const savedLanguage = localStorage.getItem('lang');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage); // 로컬스토리지에서 언어 불러와 적용
      dispatch(SetLanguage(savedLanguage)); 
    }
    let serviceType = "KorService1"; 
    if( isLanguage === "ko"){
     serviceType = "KorService1";
    }else if (isLanguage === "en") {
      serviceType = "EngService1";
    } else if (isLanguage === "ja") {
      serviceType = "JpnService1";
    } else if (isLanguage === "zh") {
      serviceType = "ChsService1";
    }
    

    const URL = `https://apis.data.go.kr/B551011/${serviceType}/locationBasedList1?numOfRows=10&pageNo=${pageNo}&MobileOS=WIN&MobileApp=hanbit&_type=json&mapX=${lon}&mapY=${lat}&radius=10000&contentTypeId=${Number(contentTypeId)}&serviceKey=${APIKEY}`;
    console.log(URL)
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
  }, [isLanguage]);

  const getRandomItems = (arr, n) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random()); 
    return shuffled.slice(0, n); 
  };

  return (
    <div className="place-card">
      {isLoading ? (
        <div className="loading-container">
          <p>{t`loading`}</p>  {/* 로딩 중 텍스트 */}
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
