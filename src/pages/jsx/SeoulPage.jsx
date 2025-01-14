import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import '../css/SeoulPage.css'
import "@/locales/i18n";
import i18n from 'i18next';  // i18n을 import
import axiosInstance from '../../axiosInstance';

function SeoulPage({ location }) {
  const { t } = useTranslation();
  const [category, setCategory] = useState('맛집');
  const [spots, setSpots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleCategoryClick = (newCategory) => {
    setCategory(newCategory);
    if (location) {
      const { latitude: lat, longitude: lon } = location;
      fetchPlaces(newCategory, lat, lon);
    }
  };

  return (
    <div className="day-seoul">
      <div className="hashtag-list">
        <button className="hashtag-btn" onClick={() => handleCategoryClick('맛집')}>음식점</button>
        <button className="hashtag-btn" onClick={() => handleCategoryClick('카페')}>카페</button>
        <button className="hashtag-btn" onClick={() => handleCategoryClick('여행지')}>여행지</button>
        <button className="hashtag-btn" onClick={() => handleCategoryClick('관광지')}>관광지</button>
      </div>

      <div className="container mt-5">
        <h2>내 주변 1km {category}</h2>
        <div className="row">
          {isLoading ? (
            <p>{t`loading`}</p>
          ) : (
            <div id="map" style={{ width: "100%", height: "500px" }}></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SeoulPage;
