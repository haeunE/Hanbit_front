import { useEffect, useState } from "react";
import NaverMap from "./NaverMap";  // 지도 컴포넌트
import axios from "axios";
import "@/locales/i18n";
import i18n from 'i18next';  
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../css/DaySeoulPlace.css";

function NightSeoulPlace({ category }) {
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
        setSpots(data.items.map(item => ({
          add: item.address,
          link: item.link,
          lon: item.mapx / 10000000, // 경도
          lat: item.mapy / 10000000, // 위도
          title: item.title.replace(/<[^>]*>/g, '')
        })) || []);
      } catch (error) {
        console.error("검색 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpots();
  }, [category]);

  // 여행지 데이터 불러오기 -night


  return (
    <div className="page-with-maps">
      <div className="map-container">
        {isLoading ? (
          <p>{t("loading")}</p>
        ) : (
          <div className="map-with-top5">
            <div className="map">
            <NaverMap items={[...spots]} language={i18n.language} zoom={13}/>
            </div>
            <div className="spot-container">
              <h4 className="top5">{t("top5")}</h4>
              {spots.map((spot, index) => (
                <div key={index} className="spot-item">
                  <a href={spot.link} target="_blank" rel="noopener noreferrer">
                    <h3>{spot.title}</h3>
                    <p className="spot-address">{spot.add}</p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NightSeoulPlace;
