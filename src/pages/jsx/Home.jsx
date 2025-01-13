import "../css/Home.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetIsMode } from "../../redux/modeState";
import { SetLanguage } from "../../redux/languageState";
import Weather from "../../components/jsx/Weather";
import Location from "../../components/jsx/Location";
import { Container } from "react-bootstrap";
import TripPlacesDay from "../../components/jsx/TripPlacesDay";
import Festival from "../../components/jsx/Festival";
import "@/locales/i18n";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();
  const isMode = useSelector((state) => state.isMode);
  const isLanguage = useSelector((state) => state.isLanguage);
  const dispatch = useDispatch();

  // 콘텐츠 타입 ID 계산
  const placeContentTypeId = isLanguage === "ko" ? 12 : 76;
  const restaurantContentTypeId = isLanguage === "ko" ? 39 : 82;
  const hotelContentTypeId = isLanguage === "ko" ? 32 : 80;

  // 랜덤 페이지 번호 계산
  const placePageNo = Math.floor(Math.random() * 5) + 1;
  const restaurantPageNo = Math.floor(Math.random() * 20) + 1;
  const hotelPageNo = Math.floor(Math.random() * 2) + 1;

  useEffect(() => {
    // 로컬 스토리지에서 모드 및 언어 설정 불러오기
    const savedMode = JSON.parse(localStorage.getItem("isMode"));
    if (savedMode !== null) {
      dispatch(SetIsMode(savedMode));
    }

    const savedLanguage = localStorage.getItem("lang");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      dispatch(SetLanguage(savedLanguage));
    }
  }, []); // 초기 로드 시 한 번만 실행

  const changeMode = () => {
    const newMode = !isMode;
    dispatch(SetIsMode(newMode));
    localStorage.setItem("isMode", JSON.stringify(newMode));
  };

  return (
    <Container>
      <div className="home">
        {/* 모드 변경 버튼 */}
        <div className={`change-mode ${isMode ? "day" : "night"}`}>
          <button
            className="home-change-mode-day"
            onClick={changeMode}
            disabled={isMode}
          >
            {t("home.day")}
          </button>
          <button
            className="home-change-mode-night"
            onClick={changeMode}
            disabled={!isMode}
          >
            {t("home.night")}
          </button>
        </div>

        {/* 위치 및 날씨 */}
        <div className="location-weather">
          <Location />
          <Weather />
        </div>

        {/* 콘텐츠 렌더링 */}
        <div className="carousel"></div>
        {isMode && (
          <div>
            <div className="recommend-place">
              <TripPlacesDay contentTypeId={placeContentTypeId} pageNo={placePageNo} />
            </div>
            <div className="population"></div>
            <div className="homepage-buttom">
              <div className="recommend-festival">
                <div className="event-banner">
                  {t("home.event")} / {t("home.performance")}
                </div>
                <Festival />
              </div>
              <div className="recommend-restaurant">
                <div className="restaurant-banner">{t("home.recommended-restaurants")}</div>
                <TripPlacesDay
                  contentTypeId={restaurantContentTypeId}
                  pageNo={restaurantPageNo}
                />
              </div>
              <div className="recommend-hotel">
                <div className="hotel-banner">{t("home.recommended-accommodation")}</div>
                <TripPlacesDay
                  contentTypeId={hotelContentTypeId}
                  pageNo={hotelPageNo}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

export default Home;
