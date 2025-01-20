import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import "@/locales/i18n";
import i18n from 'i18next';  
import '../css/SeoulPage.css'
import { useDispatch, useSelector } from 'react-redux';
import { SetIsMode } from '../../redux/modeState';
import { SetIsLocation } from '../../redux/locationState';
import NightSeoulPlace from '../../components/jsx/NightSeoulPlace';


function SeoulPageNight() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const city = JSON.parse(localStorage.getItem("location")).city;
  const [category, setCategory] = useState(`${city} 클럽`);
  const [isLoading, setIsLoading] = useState(true);
  const [contentId, setContentId] = useState(103);

  useEffect(() => {
    const savedMode = JSON.parse(localStorage.getItem("isMode"));
    if (savedMode !== null) {
      dispatch(SetIsMode(savedMode));
    }

    const savedLocation = JSON.parse(localStorage.getItem("location"));
    if (savedLocation !== null) {
      dispatch(SetIsLocation(savedLocation));
    }

    const savedLanguage = localStorage.getItem("lang");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
    setIsLoading(false);
  }, []);


  const handleCategoryClick = (newCategory, contentId) => {
    setContentId(contentId)
    setCategory(newCategory);
  };


  return (
    <Container>
      <div className="day-seoul">
        <div className="hashtag-list">
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`${city} 술집`, 101)}>{t("seoulNight-page.hotBars")}</button> 
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`${city} 조용한술집`, 101)}>{t("seoulNight-page.quietBars")}</button>
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`메이드/집사카페`, 102)}>{t("seoulNight-page.maidButlerCafe")}</button>
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`클럽`, 103)}>{t("seoulNight-page.club")}</button>
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`헌팅포차`, 104)}>{t("seoulNight-page.pickUpTargets")}</button>
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`헌팅핫플`, 105)}>{t("seoulNight-page.pickUpSpots")}</button>
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`카지노`, 106)}>{t("seoulNight-page.pickUpSpots")}</button>
        </div>

        <div className="container mt-5">
          <div className="row">
            {isLoading ? (
              <p>{t`loading`}</p>
            ) : (
              <div className='places-list'>
                <div>
                  <NightSeoulPlace category={category} contentId={contentId}/>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default SeoulPageNight;
