import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../css/TripPlacesDay.css";
import { useTranslation } from "react-i18next";
import { SetLanguage } from "../../redux/languageState";
import PlaceCard from "./PlaceCard";
import SeoulPageSpotDetails from "./SeoulPageSpotDetails";
import NaverMap from "./NaverMap";


function TripPlacesDay({ contentTypeId, pageNo, num, page }) {
  const { t } = useTranslation();
  const location = JSON.parse(localStorage.getItem("location")) || {};
  const isLanguage = useSelector((state) => state.isLanguage);
  const APIKEY = import.meta.env.VITE_KOREA_TOURIST_DAY_API_KEY;
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

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
      )}
    </div>
  );
}

export default TripPlacesDay;
