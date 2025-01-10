import "../css/Home.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetIsMode } from "../../redux/modeState";
import Weather from "../../components/jsx/Weather";
import Location from "../../components/jsx/Location";
import { Container } from "react-bootstrap";
import Population from "../../components/jsx/Population";
import TripPlacesDay from "../../components/jsx/TripPlacesDay";
import Festival from "../../components/jsx/Festival";
import "@/locales/i18n";
import i18n from 'i18next';  // i18n을 import
import { SetLanguage } from "../../redux/languageState";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();
  const isMode = useSelector((state) => state.isMode);
  const isLanguage = useSelector((state) => state.isLanguage);
  const dispatch = useDispatch();
  
  // 초기값을 useState로 설정
  const [placeContentTypeId, setPlaceContentTypeId] = useState(12);
  const [restaurantContentTypeId, setRestaurantContentTypeId] = useState(39);
  const [hotelContentTypeId, setHotelContentTypeId] = useState(32);
  
  // 랜덤 페이지 번호 설정 (각각의 범위에 맞춰)
  const [placePageNo, setPlacePageNo] = useState(Math.floor(Math.random() * 5) + 1); 
  const [restaurantPageNo, setRestaurantPageNo] = useState(Math.floor(Math.random() * 20) + 1); 
  const [hotelPageNo, setHotelPageNo] = useState(Math.floor(Math.random() * 2) + 1);
  

  useEffect(() => {
    const savedMode = JSON.parse(localStorage.getItem("isMode"));
    if (savedMode) {
      dispatch(SetIsMode(savedMode));
    }
  }, [dispatch]);

  useEffect(() => {
    // isLanguage 상태에 따라 contentTypeId 변경
    if (isLanguage === "ko") {
      setPlaceContentTypeId(12);  // 한국어일 때
      setRestaurantContentTypeId(39);
      setHotelContentTypeId(32);  // 한국어일 때 추천 음식
    } else {
      setPlaceContentTypeId(76);  // 다른 언어일 때
      setRestaurantContentTypeId(82);
      setHotelContentTypeId(80);  // 다른 언어일 때 추천 음식
    }

    // i18n 라이브러리에서 언어 변경
    i18n.changeLanguage(isLanguage);

  }, [isLanguage]);

  const changeMode = () => {
    const savedMode = !isMode;
    dispatch(SetIsMode(savedMode));
    localStorage.setItem("isMode", JSON.stringify(savedMode));
  };

  return (
    <Container>
      <div className="home">
        <div className={`change-mode ${isMode ? "day" : "night"}`}>
          <button
            className="home-change-mode-day"
            onClick={changeMode}
            disabled={isMode} // isMode가 true일 때 DAY 버튼 비활성화
          >
            {t`home.day`}
          </button>
          <button
            className="home-change-mode-night"
            onClick={changeMode}
            disabled={!isMode} // isMode가 false일 때 NIGHT 버튼 비활성화
          >
            {t`home.night`}
          </button>
        </div>
        <div className="location-weather">
          <Location />
          <Weather />
        </div>
        <div className="carousel">
        </div>
        <div className="recommand">
          <TripPlacesDay />
        </div>
        <div className="population-density">
          <Population />
        </div>
        <div className="carousel"></div>
        {isMode?
        <div>
          <div className="recommend-place">
            <TripPlacesDay contentTypeId={placeContentTypeId} pageNo={placePageNo} />
          </div>
          <div className="population"></div>
          <div className="homepage-buttom">
            <div className="recommend-festival">
              <div className="event-banner">{t`home.event`}/{t`home.performance`}</div>
              <Festival />
            </div>
            <div className="recommend-restaurant">
              <div className="restaurant-banner">{t`home.recommended-restaurants`}</div>
              <TripPlacesDay contentTypeId={restaurantContentTypeId} pageNo={restaurantPageNo} />
            </div>
            <div className="recommend-hotel">
              <div className="hotel-banner">{t`home.recommended-accommodation`}</div>
              <TripPlacesDay contentTypeId={hotelContentTypeId} pageNo={hotelPageNo} />
            </div>
          </div>
        </div>  
        :
        <div>
        </div>  
        }
      </div>
    </Container>
  );
}

export default Home;
