import { useEffect, useState } from "react";
import "../css/TripPlacesDay.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import i18n from "i18next";

const TripPlacesDay = ({ contentTypeId, pageNo, num }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const location = JSON.parse(localStorage.getItem("location")) || {};
  const APIKEY = import.meta.env.VITE_KOREA_TOURIST_DAY_API_KEY;

  useEffect(() => {
    const fetchPlaces = async () => {
      const { latitude: lat, longitude: lon } = location;

      if (!lat || !lon) {
        setIsLoading(false);
        return;
      }

      const savedLanguage = localStorage.getItem("lang");
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
      }

      const serviceType = getServiceType(i18n.language);
      const URL = `https://apis.data.go.kr/B551011/${serviceType}/locationBasedList1?numOfRows=10&pageNo=${pageNo}&MobileOS=WIN&MobileApp=hanbit&_type=json&arrange=R&mapX=${lon}&mapY=${lat}&radius=10000&contentTypeId=${Number(contentTypeId)}&serviceKey=${APIKEY}`;

      try {
        const response = await fetch(URL);
        const data = await response.json();
        const items = data.response?.body?.items?.item || [];
        const filteredPlaces = getRandomItems(
          items.filter((item) => item.firstimage),
          num
        );
        setPlaces(filteredPlaces);
      } catch (error) {
        console.error("API 호출 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, [contentTypeId]);

  const getServiceType = (language) => {
    const serviceTypes = {
      en: "EngService1",
      ja: "JpnService1",
      zh: "ChsService1",
      default: "KorService1",
    };
    return serviceTypes[language] || serviceTypes.default;
  };

  const getRandomItems = (arr, n) => arr.sort(() => 0.5 - Math.random()).slice(0, n);

  const handleImageClick = (id, typeid) => {
    navigate(`/places/${id}/${typeid}`);
  };

  return (
    <div className="place-card">
      {isLoading ? (
        <div className="loading-container">
          <p>{t("loading")}</p>
        </div>
      ) : (
        <div className="place-container">
          {places.map((place) => (
            <div
              key={place.id}
              className="place-item"
              style={{
                backgroundImage: `url(${place.img || "default-image.jpg"})`,
              }}
              onClick={() => handleImageClick(place.id, place.typeid)}
            >
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
};

export default TripPlacesDay;
