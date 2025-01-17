import { useEffect, useState } from "react";
import NaverMap from "./NaverMap";  // 지도 컴포넌트
import axios from "axios";
import "@/locales/i18n";
import i18n from 'i18next';  
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../css/DaySeoulPlace.css";

function DaySeoulPlace({ category, contentTypeId }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [spots, setSpots] = useState([]);
  const [places, setPlaces] = useState([]);
  const [expandedState, setExpandedState] = useState({});
  const clientId = import.meta.env.VITE_NAVER_API_ID;
  const clientSecret = import.meta.env.VITE_NAVER_API_SECRET;
  const APIKEY = import.meta.env.VITE_KOREA_TOURIST_DAY_API_KEY;
  const location = JSON.parse(localStorage.getItem("location")) || {};
  const navigate = useNavigate();

  const getRandomItems = (arr, n) => {
    if (!Array.isArray(arr) || n <= 0) {
      return [];
    }
    return arr.sort(() => Math.random() - 0.5).slice(0, n);
  };

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

        // 검색된 장소 정보를 spots 상태에 저장
        setSpots(data.items.map(item => ({
          add: item.address,
          link: item.link,
          lon: item.mapx / 10000000, // 경도
          lat: item.mapy / 10000000, // 위도
          title: item.title.replace(/<[^>]*>/g, '') // HTML 태그 제거
        })) || []);
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

      const URL = `https://apis.data.go.kr/B551011/${serviceType}/locationBasedList1?numOfRows=10&pageNo=1&MobileOS=WIN&MobileApp=hanbit&_type=json&mapX=${lon}&mapY=${lat}&radius=10000&contentTypeId=${Number(contentTypeId)}&serviceKey=${APIKEY}`;

      try {
        const response = await fetch(URL);
        const data = await response.json();
        const items = data.response?.body?.items?.item || [];

        const filteredPlaces = await Promise.all(
          getRandomItems(
            items.filter((item) => item.firstimage),
            10
          ).map(async (item) => {
            // 추가 API 호출로 상세 정보를 가져오기
            const detailURL = `http://apis.data.go.kr/B551011/${serviceType}/detailCommon1?serviceKey=${APIKEY}&MobileOS=ETC&MobileApp=hanbit&contentId=${item.contentid}&contentTypeId=${item.contenttypeid}&_type=json&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y`;
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
  }, [contentTypeId, i18n.language]);
  console.log(places)

  // HTML 태그 제거 함수
  const removeHTMLTags = (text) => text.replace(/<[^>]*>/g, '');

  return (
    <div className="page-with-maps">
      {isLoading ? (
        <p>{t("loading")}</p> // 전체 로딩 메시지
      ) : (
        <>
          <div className="map-container">
            <div className="map-with-top5">
              <div className="spot-map">
                <NaverMap items={[...spots, ...places]} language={i18n.language} zoom={13} />
              </div>
              <div className="spot-container">
                <h4 className="top5">{t("top5")}</h4>
                {spots.map((spot, index) => (
                  <div key={index} className="spot-item">
                    <a href={spot.link} target="_blank" rel="noopener noreferrer">
                      <h3>{removeHTMLTags(spot.title)}</h3>
                      <p className="spot-address">{removeHTMLTags(spot.add)}</p>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="spot-lists-container">
            {places.map((place) => {
              const isExpanded = expandedState[place.id] || false;

              // Overview를 일정 길이로 잘라 표시
              const maxOverviewLength = 100;
              const shortenedOverview =
                place.overview.length > maxOverviewLength
                  ? place.overview.slice(0, maxOverviewLength) + "..."
                  : place.overview;

              return (
                <div key={place.id} className="spot-place-list">
                  {/* 이미지 영역 */}
                  <div
                    className="spot-place-item"
                    style={{ backgroundImage: `url(${place.img || "default-image.jpg"})` }}
                  ></div>

                  {/* 텍스트 정보 영역 */}
                  <div className="spot-img-info">
                    <p
                      className="spot-place-title"
                      onClick={() => navigate(`/places/${place.id}/${place.typeid}`)}
                    >
                      {place.title}
                    </p>

                    <p className="spot-place-addr">{place.add}</p>
                    <div className="spot-place-overview">
                      {/* Overview 텍스트 */}
                      {isExpanded ? place.overview : shortenedOverview}
                      {/* 더보기/접기 버튼 */}
                      {place.overview.length > maxOverviewLength && (
                        <button
                          className="overview-toggle-btn"
                          onClick={(e) => {
                            e.stopPropagation(); // 부모 클릭 이벤트 방지
                            setExpandedState((prevState) => ({
                              ...prevState,
                              [place.id]: !isExpanded,
                            }));
                          }}
                        >
                          {isExpanded ? "접기" : "더보기"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default DaySeoulPlace;
