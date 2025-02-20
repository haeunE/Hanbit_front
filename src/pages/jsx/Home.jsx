import "../css/Home.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetIsMode } from "../../redux/modeState";
import Weather from "../../components/jsx/Weather";
import Location from "../../components/jsx/Location";
import { Container, OverlayTrigger, Tooltip } from "react-bootstrap";
import Population from "../../components/jsx/Population";
import TripPlacesDay from "../../components/jsx/TripPlacesDay";
import Festival from "../../components/jsx/Festival";
import "@/locales/i18n";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import TripPlacesNight from "../../components/jsx/TripPlacesNight";
import GoogleTranslate from "../../components/jsx/GoogleTranslate";
import { Link } from "react-router-dom";

function Home() {
  const { t } = useTranslation();
  const isMode = useSelector((state) => state.isMode);
  const dispatch = useDispatch();

  // 콘텐츠 타입 ID 계산
  const placeContentTypeId = i18n.language === "ko" ? 12 : 76;
  const restaurantContentTypeId = i18n.language === "ko" ? 39 : 82;
  const hotelContentTypeId = i18n.language === "ko" ? 32 : 80;

  // 랜덤 페이지 번호 계산
  const placePageNo = Math.floor(Math.random() * 5) + 1;
  const restaurantPageNo = Math.floor(Math.random() * 10) + 1;
  const hotelPageNo = Math.floor(Math.random() * 2) + 1;

  useEffect(() => {
    const savedMode = JSON.parse(localStorage.getItem("isMode"));
    if (savedMode !== null) {
      dispatch(SetIsMode(savedMode));
    }

    const savedLanguage = localStorage.getItem("lang");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n.language]);

  const changeMode = () => {
    const newMode = !isMode;
    dispatch(SetIsMode(newMode));
    localStorage.setItem("isMode", JSON.stringify(newMode));
  };

  const renderTooltip = (message) => (props) => (
    <Tooltip id="button-tooltip" style={{ zIndex: 9999 }} {...props} >
      {message}
    </Tooltip>
  );

  return (
    <Container>
      <div className="home">

        {/* 위치 및 날씨 */}
        <div className="location-weather">
          <div className="location-weather-today">
            <Location />
            <Weather />
          </div>
          <div className="location-weather-link">
          <Link to="/weathers">
            <span>{t("home.weather-page")}</span>
            <i className="fa-solid fa-angles-right"></i>
          </Link>
          </div>
        </div>

        {/* 모드 변경 버튼 */}
        <div className={`change-mode ${isMode ? "day" : "night"}`}>
          <OverlayTrigger placement="bottom" delay={{show:250, hide:400}} overlay={renderTooltip((t`header.mode-day`))}>
            <button
              className="home-change-mode-day"
              onClick={changeMode}
              disabled={isMode}
            >
              {t("home.day")}
            </button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" delay={{show:250, hide:400}} overlay={renderTooltip((t`header.mode-night`))}>
            <button
              className="home-change-mode-night"
              onClick={changeMode}
              disabled={!isMode}
            >
              {t("home.night")}
            </button>
          </OverlayTrigger>
        </div>

        {/* 케러셀 */}
        <div className="carousel"></div>

        {/* 콘텐츠 렌더링 */}
        {isMode && (
          <div>
            <div className="recommend-place">
              <TripPlacesDay contentTypeId={placeContentTypeId} pageNo={placePageNo} />
            </div>
            <div className="population">
              <Population />
            </div>
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
        {!isMode && (
        <div>
          <div className="google">
            <GoogleTranslate />
          </div>
          <div className="recommend-place">
            <TripPlacesNight contentId={103} />
          </div>
          <div className="homepage-buttom">
            <div className="recommend-restaurant">
              <div className="restaurant-banner">{t("seoulNight-page.club")}</div>
              <TripPlacesNight
                contentId={103}
              />
            </div>
            <div className="recommend-hotel">
              <div className="hotel-banner">{t("seoulNight-page.maidButlerCafe")}</div>
              <TripPlacesNight
                contentId={102}
              />
            </div>
            <div className="recommend-hotel">
              <div className="hotel-banner">{t("seoulNight-page.pickUpTargets")}</div>
              <TripPlacesNight
                contentId={104}
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
