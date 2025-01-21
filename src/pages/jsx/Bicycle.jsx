import { useEffect, useState } from "react";
import "../css/Bicycle.css";
import { useTranslation } from "react-i18next";
import "@/locales/i18n";
import i18n from 'i18next';  // i18n을 import
import { useDispatch, useSelector } from "react-redux";
import { SetIsMode } from "../../redux/modeState";
import { SetLanguage } from "../../redux/languageState";
import { Container } from "react-bootstrap";

function Bicycle() {
  const { t } = useTranslation();
  const isMode = useSelector((state) => state.isMode);
  const dispatch = useDispatch();
  const location = JSON.parse(localStorage.getItem("location"));
  const APIKEY = import.meta.env.VITE_KOREA_SEOUL_DATA_API_KEY;
  const CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
  const [isLoading, setIsLoading] = useState(true);
  const [stations, setStations] = useState([]);

  // Naver 지도 API 스크립트를 로드하는 함수
  const loadNaverMapAPI = () => {
    return new Promise((resolve, reject) => {
      if (window.naver && window.naver.maps) {
        return resolve(); // 이미 로드된 경우 바로 리턴
      }

      const script = document.createElement("script");
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${CLIENT_ID}&language=${i18n.language}`;
      script.async = true;
      script.onload = () => {
        if (!window.naver || !window.naver.maps) {
          return reject("Naver 지도 API가 로드되지 않았습니다.");
        }
        resolve();
      };
      script.onerror = () => reject("Naver 지도 API 스크립트를 로드할 수 없습니다.");
      document.head.appendChild(script);
    });
  };
  
  // 모드, 언어, 위치, 따릉이 정보들 가져오는 useEffect
  useEffect(() => {
    const savedMode = JSON.parse(localStorage.getItem("isMode"));
    if (savedMode !== null) {
      dispatch(SetIsMode(savedMode));
    } else {
      dispatch(SetIsMode(true));
    }

    const savedLanguage = localStorage.getItem("lang");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }

    if (!location || !location.latitude || !location.longitude) return;

    loadNaverMapAPI()
      .then(() => {
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
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  // 지도 로드 후 마커 표시 함수
  useEffect(() => {
    if (stations.length > 0 && window.naver && window.naver.maps) {
      const map = new window.naver.maps.Map("map", {
        center: new window.naver.maps.LatLng(location.latitude, location.longitude),
        zoom: 13,
      });

      stations.forEach((station) => {
        const { STA_LAT, STA_LONG, RENT_NM, HOLD_NUM } = station;
        const position = new window.naver.maps.LatLng(STA_LAT, STA_LONG);

        const marker = new window.naver.maps.Marker({
          position: position,
          map: map,
        });

        const infoWindow = new window.naver.maps.InfoWindow({
          content: `<div>${RENT_NM}, 대여 가능 수: ${HOLD_NUM}</div>`,
        });

        window.naver.maps.Event.addListener(marker, "click", () => {
          infoWindow.open(map, marker);
        });
      });
    }
  }, [stations]);

  // 언어 변경 시 페이지 새로 고침
  useEffect(() => {
    const langChangeHandler = () => {
      window.location.reload();
      loadNaverMapAPI()
    };

    i18n.on("languageChanged", langChangeHandler);

    return () => {
      i18n.off("languageChanged", langChangeHandler);
    };
  }, []);

  // 앱 설치 여부 확인 후 처리 함수
  const openAppOrRedirect = (e, platform) => {
    e.preventDefault();
    const appUrls = {
      android: "intent://#Intent;scheme=nmap;package=com.nhn.android.nmap;end", // 안드로이드 앱 인텐트 URL
      ios: "nmap://", // iOS 앱 URL
    };

    const appUrl = appUrls[platform];

    // 모바일에서 앱을 여는 코드
    if (navigator.userAgent.match(/iPhone|iPad|iPod/)) {
      window.location = appUrl;
      setTimeout(() => {
        window.location = 'https://apps.apple.com/kr/app/%EB%94%B0%EB%A6%89%EC%9D%B4/id963513619'; // App Store로 리다이렉트
      }, 1500);
    } else if (navigator.userAgent.match(/Android/)) {
      window.location = appUrl;
      setTimeout(() => {
        window.location = 'https://play.google.com/store/apps/details?id=com.bikeseoul'; // Google Play로 리다이렉트
      }, 1500);
    }
  };

  return (
    <Container>
      <div className="bicycle">
        <h2 className={`bicycle-title ${isMode ? "day" : "night"}`}>{t`Ddareungi-page.bicycle-rental-location`}</h2>
        {isLoading ? (
          <p>{t`loading`}</p>
        ) : (
          <div id="map" style={{ width: "100%", height: "500px" }}></div>
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
              href="#"
              onClick={(e) => openAppOrRedirect(e, 'android')} // Android 앱 다운로드
            >
              {t`Ddareungi-page.download-android`}
            </a>
            <a
              href="#"
              onClick={(e) => openAppOrRedirect(e, 'ios')} // iOS 앱 다운로드
            >
              {t`Ddareungi-page.download-ios`}
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Bicycle;
