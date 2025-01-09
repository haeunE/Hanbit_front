import "../css/Home.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetIsMode } from "../../redux/modeState";
import Weather from "../../components/jsx/Weather";
import Location from "../../components/jsx/Location";
import { Container } from "react-bootstrap";
import TripPlacesDay from "../../components/jsx/TripPlacesDay";
import Festival from "../../components/jsx/Festival";

function Home() {
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
    if (isLanguage === "korean") {
      setPlaceContentTypeId(12);  // 한국어일 때
      setRestaurantContentTypeId(39);
      setHotelContentTypeId(32);  // 한국어일 때 추천 음식
    } else {
      setPlaceContentTypeId(76);  // 다른 언어일 때
      setRestaurantContentTypeId(82);
      setHotelContentTypeId(80);  // 다른 언어일 때 추천 음식
    }
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
            DAY
          </button>
          <button
            className="home-change-mode-night"
            onClick={changeMode}
            disabled={!isMode} // isMode가 false일 때 NIGHT 버튼 비활성화
          >
            NIGHT
          </button>
        </div>
        <div className="location-weather">
          <Location />
          <Weather />
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
              <div className="event-banner">행사/공연</div>
              <Festival />
            </div>
            <div className="recommend-restaurant">
              <div className="restaurant-banner">추천맛집</div>
              <TripPlacesDay contentTypeId={restaurantContentTypeId} pageNo={restaurantPageNo} />
            </div>
            <div className="recommend-hotel">
              <div className="hotel-banner">추천숙소</div>
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
