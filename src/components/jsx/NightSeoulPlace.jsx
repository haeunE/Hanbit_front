import { useEffect, useState } from "react";
import NaverMap from "./NaverMap";  // 지도 컴포넌트
import axios from "axios";
import "@/locales/i18n";
import i18n from 'i18next';  
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../css/DaySeoulPlace.css";
import axiosInstance from "../../axiosInstance";

function NightSeoulPlace({ category, contentId}) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [spots, setSpots] = useState([]);
  const [places, setPlaces] = useState([]);
  const clientId = import.meta.env.VITE_NAVER_API_ID;
  const clientSecret = import.meta.env.VITE_NAVER_API_SECRET;
  const APIKEY = import.meta.env.VITE_KOREA_TOURIST_DAY_API_KEY;
  const location = JSON.parse(localStorage.getItem("location")) || {};
  const navigate = useNavigate();
  const defaultImage = "/public/img/non_img.png"
  console.log(category)
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
  }, [category, category]);
  useEffect(() => {
    axiosInstance.get(`/places/nightlist?contentId=${contentId}`)
    .then(response => {
      // 서버 응답이 배열인지를 확인
      if (Array.isArray(response.data)) {
        setPlaces(response.data);
      } else {
        setPlaces([]); // 배열이 아닐 경우 빈 배열로 초기화
      }
    })
    .catch(error => {
      console.error("Error fetching places", error);
      setPlaces([]); // 에러 발생 시 빈 배열로 설정
    });
  }, [contentId]);
  console.log(contentId)

  return (
    <div className="page-with-maps">
      <div className="map-container">
        {isLoading ? (
          <p>{t("loading")}</p>
        ) : (
          <div className="map-with-top5">
            <div className="spot-map">
            <NaverMap items={[...spots]} language={i18n.language} />
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

      <div className="night-container">
        <h1 className="night-title">장소 리스트</h1>
        <div className="night-placeList">
          <ul>
            {places.length === 0 ? (
              <li className="night-noPlace">장소 목록이 없습니다.</li>
            ) : (
              places.map(place => (
                <li key={place.id} className="night-placeItem">
                  {/* 장소 이미지 */}
                  <img
                    src={place.image || defaultImage}  // 이미지가 없으면 기본 이미지 사용
                    alt={place.title}
                    className="night-placeImage"
                  />
                  <div className="night-placeDetails">
                    {/* 장소 제목, 주소, 전화번호 */}
                    <h3 className="night-placeTitle">{place.title}</h3>
                    <p className="night-placeAddress">{place.addn}</p>
                    <p className="night-placePhone">tel {place.tel}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NightSeoulPlace;
