import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "@/locales/i18n";
import i18n from "i18next";
import { Container } from "react-bootstrap";
import "../css/Directions.css";


const Directions = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [destination, setDestination] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const locationFromStorage = JSON.parse(localStorage.getItem("location"));

    if (locationFromStorage) {
      const { latitude, longitude, region, city } = locationFromStorage;
      setCurrentLocation({
        lat: latitude,
        lon: longitude,
        region,
        city,
      });
    }

    const { data } = location.state || {};
    if (data?.lat && data?.lon) {
      setDestination({
        lat: data.lat,
        lon: data.lon,
        add: data.destination || t("directions.noDestination"),
        title: data.title || t("directions.destination"),
      });
    }

    loadNaverMapAPI()
      .then(() => setMapLoaded(true))
      .catch(console.error);
  }, [location.state, t]);

  const loadNaverMapAPI = () => {
    return new Promise((resolve, reject) => {
      if (window.naver && window.naver.maps) return resolve();

      const MAP_CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
      const script = document.createElement("script");
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${MAP_CLIENT_ID}&language=${i18n.language}`;
      script.async = true;
      script.onload = () => (window.naver?.maps ? resolve() : reject("Naver 지도 API 로드 실패"));
      script.onerror = () => reject("Naver 지도 API 스크립트 로드 실패");
      document.head.appendChild(script);
    });
  };

  const displayMap = (currentLocation, destination) => {
    if (!currentLocation || !destination) return;

    const { lat, lon } = currentLocation;
    const map = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(lat, lon),
      zoom: 13,
    });

    const currentPosition = new window.naver.maps.LatLng(lat, lon);
    new window.naver.maps.Marker({
      position: currentPosition,
      map,
      icon: {
        content: `<div style="background-color:red;width:20px;height:20px;border-radius:50%;"></div>`,
        size: new window.naver.maps.Size(20, 20),
        anchor: new window.naver.maps.Point(10, 10),
      },
    });

    const destinationPosition = new window.naver.maps.LatLng(destination.lat, destination.lon);
    const destinationMarker = new window.naver.maps.Marker({
      position: destinationPosition,
      map,
    });

    const infoWindow = new window.naver.maps.InfoWindow({
      content: `<div>${destination.title} (${destination.add})</div>`,
    });

    window.naver.maps.Event.addListener(destinationMarker, "click", () => {
      infoWindow.open(map, destinationMarker);
    });

    new window.naver.maps.Polyline({
      path: [currentPosition, destinationPosition],
      strokeColor: "#FF0000",
      strokeWeight: 4,
      strokeOpacity: 0.8,
      map,
    });
  };

  const openNaverMapApp = () => {
    if (!currentLocation || !destination) return;

    const naverMapURL = `nmap://route/walk?slat=${currentLocation.lat}&slng=${currentLocation.lon}&sname=내 위치&dlat=${destination.lat}&dlng=${destination.lon}&dname=${destination.title}`;
    const appStoreURL = "https://apps.apple.com/kr/app/naver-map/id311867728";
    const playStoreURL = "https://play.google.com/store/apps/details?id=com.nhn.android.nmap";

    window.location.href = naverMapURL;
    setTimeout(() => {
      window.location.href = /iPhone|iPad|iPod/.test(navigator.userAgent) ? appStoreURL : playStoreURL;
    }, 1000);
  };

  useEffect(() => {
    if (mapLoaded && currentLocation && destination) {
      displayMap(currentLocation, destination);
    }
  }, [mapLoaded, currentLocation, destination]);

  return (
    <Container>
      <div className="directions-container">
        <h2 className="directions-title">{t("directions.title")}</h2>
        {currentLocation ? (
          <div className="current-location">
            <p>
              {t("directions.currentLocation")}: {currentLocation.city} {currentLocation.region}
            </p>
          </div>
        ) : (
          <p className="error-message">{t("directions.noCurrentLocation")}</p>
        )}

        {destination ? (
          <>
            <div className="directions-address">
              <p>
                {t("directions.destination")}: {destination.title} ({destination.add})
              </p>
            </div>
            <div id="map" className="map"></div>
            <div className="button-container">
              <button className="open-naver-map-btn" onClick={openNaverMapApp}>
                {t("directions.openNaverMap")}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="error-message">{t("directions.noDestination")}</p>
            <div className="button-container">
              <button className="open-naver-map-btn" onClick={openNaverMapApp}>
                {t("directions.openNaverMap")}
              </button>
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

export default Directions;
