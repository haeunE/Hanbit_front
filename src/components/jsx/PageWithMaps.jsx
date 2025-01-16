import { useEffect, useState } from "react";
import NaverMap from "./NaverMap";  // 지도 컴포넌트
import axios from "axios";
import "@/locales/i18n";
import i18n from 'i18next';  
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../css/PageWithMaps.css";

function PageWithMaps({ category, contentTypeId, pageNo }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [spots, setSpots] = useState([]);
  const [places, setPlaces] = useState([]);
  const clientId = import.meta.env.VITE_NAVER_API_ID;
  const clientSecret = import.meta.env.VITE_NAVER_API_SECRET;
  const APIKEY = import.meta.env.VITE_KOREA_TOURIST_DAY_API_KEY;
  const location = JSON.parse(localStorage.getItem("location")) || {};
  const navigate = useNavigate();

  // 서울 TOP5 검색
  useEffect(() => {
    if (!category) return;
    const searchCategory = category.split("(")[0].trim();

    const fetchSpots = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get("/api/v1/search/local.json", {
          params: {
            query: searchCategory,
            display: 5,
            sort: "comment",
          },
          headers: {
            "X-Naver-Client-Id": clientId,
            "X-Naver-Client-Secret": clientSecret,
          },
        });
        setSpots(data.items);
      } catch (error) {
        console.error("검색 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpots();
  }, [category]);

  // 여행지 데이터 불러오기
  useEffect(() => {
    const fetchPlaces = async () => {
      const { latitude: lat, longitude: lon } = location;
      if (!lat || !lon) return;

      const serviceType = {
        en: "EngService1",
        ja: "JpnService1",
        zh: "ChsService1",
        default: "KorService1",
      }[localStorage.getItem("lang")] || "KorService1";

      const URL = `https://apis.data.go.kr/B551011/${serviceType}/locationBasedList1?numOfRows=10&pageNo=${pageNo}&MobileOS=WIN&MobileApp=hanbit&_type=json&arrange=R&mapX=${lon}&mapY=${lat}&radius=10000&contentTypeId=${Number(contentTypeId)}&serviceKey=${APIKEY}`;

      try {
        const response = await fetch(URL);
        const data = await response.json();
        setPlaces(data.response?.body?.items?.item.map(item => ({
          id: item.contentid,
          add: item.addr1,
          img: item.firstimage,
          lon: item.mapx,
          lat: item.mapy,
          title: item.title,
          typeid: item.contenttypeid,
        })) || []);
      } catch (error) {
        console.error("API 호출 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, [contentTypeId, i18n.language]);

  // HTML 태그 제거 함수
  const removeHTMLTags = (text) => text.replace(/<[^>]*>/g, '');

  return (
    <div className="page-with-maps">
      <div className="map-container">
        {isLoading ? (
          <p>{t("loading")}</p>
        ) : (
          <div className="map-with-top5">
            <div className="map">
            <NaverMap items={[...spots, ...places]} language={i18n.language} />
            </div>
            <ul className="spot-list">
              {spots.map((spot, index) => (
                <li key={index} className="spot-item">
                  <a href={spot.link} target="_blank" rel="noopener noreferrer">
                    <h3>{removeHTMLTags(spot.title)}</h3>
                    <p>{removeHTMLTags(spot.address)}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="lists-container">
        <div className="place-card">
          {places.map((place) => (
            <div
              key={place.id}
              className="place-item"
              onClick={() => navigate(`/places/${place.id}/${place.typeid}`)}
              style={{ backgroundImage: `url(${place.img || "default-image.jpg"})` }}
            >
              <div className="img-info">
                <div className="place-addr">{place.add}</div>
                <div className="place-title">{place.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PageWithMaps;
