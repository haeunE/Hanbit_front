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
  const isLocation = useSelector((state) => state.isLocation);
  const dispatch = useDispatch();
  const city = JSON.parse(localStorage.getItem("location")).city;
  const [category, setCategory] = useState(`${city}`);
  const [isLoading, setIsLoading] = useState(true);

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
  }, [category]);

  const handleCategoryClick = (newCategory) => {
    setCategory(newCategory);
    const categoryKey = newCategory.replace(`${city}`, '');  // '서울맛집' → '맛집'
  };

  return (
    <Container>
      <div className="day-seoul">
        <div className="hashtag-list">
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`술집`)}>{t("seoulNight-page.hotBars")}</button> 
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`조용한술집`)}>{t("seoulNight-page.quietBars")}</button>
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`메이드/집사카페`)}>{t("seoulNight-page.maidButlerCafe")}</button>
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`헌팅핫플`)}>{t("seoulNight-page.pickUpSpots")}</button>
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`헌팅포차`)}>{t("seoulNight-page.pickUpTargets")}</button>
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`이태원클럽`)}>{t("seoulNight-page.club")}</button>
        </div>

        <div className="container mt-5">
          <div className="row">
            {isLoading ? (
              <p>{t`loading`}</p>
            ) : (
              <div className='places-list'>
                <div>
                  <NightSeoulPlace category={category}/>
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
