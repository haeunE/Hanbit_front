import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetIsMode } from "../../redux/modeState";
import Weather from "../../components/jsx/Weather";
import Location from "../../components/jsx/Location";
import { Container } from "react-bootstrap";
import TripPlacesDay from "../../components/jsx/TripPlacesDay";
import Festival from "../../components/jsx/Festival";
import "@/locales/i18n";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

function SeoulPageSpots() {
  const { t } = useTranslation();
  const isMode = useSelector((state) => state.isMode);
  const dispatch = useDispatch();

  // 콘텐츠 타입 ID 계산
  const placeContentTypeId = i18n.language === "ko" ? 12 : 76; // 관광지
  const culturalContentTypeId = i18n.language === "ko" ? 14 : 78; // 문화시설
  const restaurantContentTypeId = i18n.language === "ko" ? 39 : 82; // 음식점
  const hotelContentTypeId = i18n.language === "ko" ? 32 : 80; // 숙박
  const shoppingContentTypeId = i18n.language === "ko" ? 38 : 79; // 쇼핑
  const leisureContentTypeId = i18n.language === "ko" ? 28 : 75; // 레포츠

  // 랜덤 페이지 번호 계산
  const PageNo = Math.floor(Math.random() * 2) + 1;

  useEffect(() => {
    const savedLanguage = localStorage.getItem("lang");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []); 

  const changeMode = () => {
    const newMode = !isMode;
    dispatch(SetIsMode(newMode));
    localStorage.setItem("isMode", JSON.stringify(newMode));
  };

  return (
    <Container>
      <div className="">
        <TripPlacesDay />
      </div>
    </Container>
  );
}

export default SeoulPageSpots;
