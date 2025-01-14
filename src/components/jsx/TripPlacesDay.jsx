import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../css/TripPlacesDay.css";
import { useTranslation } from "react-i18next";
import { SetLanguage } from "../../redux/languageState";
import PlaceCard from "./PlaceCard";
import SeoulPageSpotDetails from "./SeoulPageSpotDetails";
import NaverMap from "./NaverMap";

import { useNavigate } from "react-router-dom";

function TripPlacesDay({ contentTypeId, pageNo, num, page }) {
  const { t } = useTranslation();
  const location = JSON.parse(localStorage.getItem("location")) || {};
  const isLanguage = useSelector((state) => state.isLanguage);
  const APIKEY = import.meta.env.VITE_KOREA_TOURIST_DAY_API_KEY;
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(places);

  useEffect(() => {
    const { latitude: lat, longitude: lon } = location;

    if (!lat || !lon) {
      console.error("위치 정보가 없습니다.");
      return;
    }

    const savedLanguage = localStorage.getItem("lang");
    if (savedLanguage) {
      dispatch(SetLanguage(savedLanguage));
    }

    const serviceType = getServiceType(isLanguage);

    const URL = `https://apis.data.go.kr/B551011/${serviceType}/locationBasedList1?numOfRows=10&pageNo=${pageNo}&MobileOS=WIN&MobileApp=hanbit&_type=json&mapX=${lon}&mapY=${lat}&radius=10000&contentTypeId=${Number(contentTypeId)}&serviceKey=${APIKEY}`;

    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        const items = data.response?.body?.items?.item || [];
        const filteredPlaces = getRandomItems(
          items.filter((item) => item.firstimage),
          num
        ).map(formatPlace);
        const items = data.response.body.items.item || [];
        const filteredItems = items.filter(item => item.firstimage && item.firstimage !== "");
        const randomPlaces = getRandomItems(filteredItems, 4);

        const formattedPlaces = randomPlaces.map((i) => ({
          id: i.contentid,
          add: i.addr1,
          img: i.firstimage,
          lon: i.mapx,
          lat: i.mapy,
          title: i.title,
          typeid: i.contenttypeid
        }));

        setPlaces(filteredPlaces);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("API 호출 오류:", error);
      });
  }, [isLanguage]);

  const getServiceType = (language) => {
    switch (language) {
      case "en":
        return "EngService1";
      case "ja":
        return "JpnService1";
      case "zh":
        return "ChsService1";
      default:
        return "KorService1";
    }
  };

  const getRandomItems = (arr, n) => arr.sort(() => 0.5 - Math.random()).slice(0, n);

  const formatPlace = (item) => ({
    id: item.contentid,
    add: item.addr1,
    img: item.firstimage,
    lon: item.mapx,
    lat: item.mapy,
    title: item.title,
  });
  const getRandomItems = (arr, n) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random()); 
    return shuffled.slice(0, n); 
  };

  // 이미지 클릭 핸들러
  const handleImageClick = (id,typeid) => {
    navigate(`/places/${id}/${typeid}`); // URL에 ID 포함
  };

  return (
    <div className="place-card">
      {isLoading ? (
        <div className="loading-container">
          <p>{t("loading")}</p>
        </div>
      ) : page === "home" ? (
        <PlaceCard places={places} />
      ) : (
        <div>
          <NaverMap />
          <SeoulPageSpotDetails places={places} />
        </div>       
      ) : (
        <div className="place-container">
          {places.map((place) => (
            <div key={place.id} className="place-item" style={{ backgroundImage: `url(${place.img})` }} onClick={() => handleImageClick(place.id,place.typeid)}>
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
