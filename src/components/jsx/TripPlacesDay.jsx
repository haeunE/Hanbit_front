import { useEffect, useState } from "react";
import "../css/TripPlacesDay.css";
import { useTranslation } from "react-i18next";
import NaverMap from "./NaverMap";
import SeoulPageSpotDetails from "./SeoulPageSpotDetails";
import { useNavigate } from "react-router-dom";
import i18n from "i18next";
import { Container } from "react-bootstrap";

function TripPlacesDay({ contentTypeId, pageNo, num, page }) {
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
        console.error("위치 정보가 없습니다.");
        return;
      }

      const savedLanguage = localStorage.getItem("lang");
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
      }

      const serviceType = getServiceType(i18n.language);
      const URL = `https://apis.data.go.kr/B551011/${serviceType}/locationBasedList1?numOfRows=10&pageNo=${pageNo}&MobileOS=WIN&MobileApp=hanbit&_type=json&mapX=${lon}&mapY=${lat}&radius=10000&contentTypeId=${Number(contentTypeId)}&serviceKey=${APIKEY}`;

      try {
        const response = await fetch(URL);
        const data = await response.json();
        const items = data.response?.body?.items?.item || [];

        const filteredPlaces = await Promise.all(
          getRandomItems(
            items.filter((item) => item.firstimage),
            num
          ).map(async (item) => {
            // 추가 API 호출로 상세 정보를 가져오기
            const detailURL = `http://apis.data.go.kr/B551011/KorService1/detailCommon1?serviceKey=${APIKEY}&MobileOS=ETC&MobileApp=hanbit&contentId=${item.contentid}&contentTypeId=${item.contenttypeid}&_type=json&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y`;
            try {
              const detailResponse = await axios.get(detailURL);
              const detailItems = detailResponse.data.response.body.items.item || [];
              const overview = detailItems[0]?.overview || "";

              return {
                id: item.contentid,
                add: item.addr1,
                img: item.firstimage,
                lon: item.mapx,
                lat: item.mapy,
                title: item.title,
                typeid: item.contenttypeid,
                overview, // 설명 추가
              };
            } catch (detailError) {
              console.error("상세 정보 API 호출 오류:", detailError);
              return {
                id: item.contentid,
                add: item.addr1,
                img: item.firstimage,
                lon: item.mapx,
                lat: item.mapy,
                title: item.title,
                typeid: item.contenttypeid,
                overview: "설명 데이터를 가져올 수 없습니다.",
              };
            }
          })
        );

        setPlaces(filteredPlaces);
      } catch (error) {
        console.error("API 호출 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, [i18n.language]);

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
    console.log("Clicked Place ID:", id, "TypeID:", typeid);
    navigate(`/places/${id}/${typeid}`);
  };
  console.log(places)
  return (
    <Container>
      <div className="place-card">
        {isLoading ? (
          <div className="loading-container">
            <p>{t("loading")}</p>
          </div>
        ) : page === "home" ? (
          <div className="place-container">
            {places.map((place) => (
              <div
                key={place.id}
                className="place-item"
                style={{ backgroundImage: `url(${place.img})` }}
                onClick={() => handleImageClick(place.id, place.typeid)}
              >
                <div className="img-info">
                  <div className="place-addr">{place.add}</div>
                  <div className="place-title">{place.title}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <>
              <NaverMap />
              <SeoulPageSpotDetails places={places} />
            </>
          </div>
        )}
      </div>
    </Container>
  );
}

export default TripPlacesDay;
