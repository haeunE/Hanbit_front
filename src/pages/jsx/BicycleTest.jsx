import { useEffect, useState } from "react";
import "../css/Bicycle.css";
import { useTranslation } from "react-i18next";
import "@/locales/i18n";
import { useDispatch, useSelector } from "react-redux";
import { SetIsLocation } from "../../redux/locationState";
import { SetLanguage } from "../../redux/languageState";
import NaverMap from "../../components/jsx/NaverMap";
import { SetIsMode } from "../../redux/modeState";
import i18n from "i18next";

function BicycleTest() {
  const { t } = useTranslation();
  const location = useSelector((state) => state.isLocation);
  const isMode = useSelector((state) => state.isMode); 
  const isLanguage = useSelector((state) => state.isLanguage);
  const dispatch = useDispatch();
  const APIKEY = import.meta.env.VITE_KOREA_SEOUL_DATA_API_KEY;
  const [isLoading, setIsLoading] = useState(true);
  const [stations, setStations] = useState([]);

  // 위치와 언어 설정을 로컬 스토리지에서 가져와 리덕스 상태 업데이트
  useEffect(() => {
    const savedLocation = JSON.parse(localStorage.getItem("location"));
    const savedLanguage = localStorage.getItem("lang");
    const savedMode = JSON.parse(localStorage.getItem("isMode"));

    if (savedMode !== null) {
      dispatch(SetIsMode(savedMode));
    }

    if (savedLocation) {
      dispatch(SetIsLocation(savedLocation));
    }
    if (savedLanguage) {
      dispatch(SetLanguage(savedLanguage)); // 리덕스 상태 업데이트
    }
  }, [dispatch]);

  // 자전거 대여소 정보 가져오기
  useEffect(() => {
    if (!location || !location.latitude || !location.longitude) return;

    const URL = `http://openapi.seoul.go.kr:8088/${APIKEY}/json/tbCycleStationInfo/1/500/`;

    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        const items = data.stationInfo.row || [];
        setStations(items);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("API 호출 오류:", error);
        setIsLoading(false);
      });
  }, [location]);

  return (
    <div className="bicycle">
      <h2 className={`bicycle-title ${isMode ? "day" : "night"}`}>
        {t`Ddareungi-page.bicycle-rental-location`}
      </h2>
      {isLoading ? (
        <p>{t`loading`}</p>
      ) : (
        <NaverMap items={stations} location={location} language={i18n.language} />
      )}

      {/* 따릉이 사용법 섹션 추가 */}
      <div className="instructions">
        <h3>{t`Ddareungi-page.title`}</h3>
        <ul>
          <li>{t`Ddareungi-page.steps1`}</li>
          <li>{t`Ddareungi-page.steps2`}</li>
          <li>{t`Ddareungi-page.steps3`}</li>
          <li>{t`Ddareungi-page.steps4`}</li>
          <li>{t`Ddareungi-page.steps5`}</li>
        </ul>

        {/* 앱과 웹사이트 링크 추가 */}
        <div className={`button-container ${isMode ? 'day' : 'night'}`}>
          <a
            href="https://www.bikeseoul.com" // 서울 따릉이 웹사이트
            target="_blank"
            rel="noopener noreferrer"
          >
            {t`Ddareungi-page.go-to-website`}
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.bikeseoul" // 안드로이드 앱 다운로드 링크
            target="_blank"
            rel="noopener noreferrer"
          >
            {t`Ddareungi-page.download-android`}
          </a>
          <a
            href="https://apps.apple.com/kr/app/%EB%94%B0%EB%A6%89%EC%9D%B4/id963513619" // iOS 앱 다운로드 링크
            target="_blank"
            rel="noopener noreferrer"
          >
            {t`Ddareungi-page.download-ios`}
          </a>
        </div>
      </div>
    </div>
  );
}

export default BicycleTest;
