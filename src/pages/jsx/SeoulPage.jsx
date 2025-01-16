import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import "@/locales/i18n";
import i18n from 'i18next';  
import '../css/SeoulPage.css'
import SeoulPageTOP5 from '../../components/jsx/SeoulPageTOP5';
import { useDispatch, useSelector } from 'react-redux';
import { SetIsMode } from '../../redux/modeState';
import SeoulPageSpots from '../../components/jsx/SeoulPageSpots';
import { SetIsLocation } from '../../redux/locationState';

function SeoulPage() {
  const { t } = useTranslation();
  const isLocation = useSelector((state)=>state.isLocation)
  const dispatch = useDispatch();
  const city = JSON.parse(localStorage.getItem("location")).city
  const [category, setCategory] = useState(`${city}맛집`);
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
  };
  console.log(category)
  return (
    <Container>
      <div className="day-seoul">
        <div className="hashtag-list">
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`${city}관광지`)}>{t("seoul-page.tourist-spots")}</button> 
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`${city}문화시설`)}>{t("seoul-page.cultural-facilities")}</button>
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`${city}음식점`)}>{t("seoul-page.restaurants")}</button>
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`${city}숙박`)}>{t("seoul-page.accommodation")}</button>
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`${city}쇼핑`)}>{t("seoul-page.shopping")}</button>
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`${city}레포츠`)}>{t("seoul-page.leisure")}</button>
        </div>

        <div className="container mt-5">
          <div className="row">
            {isLoading ? (
              <p>{t`loading`}</p>
            ) : (
              <div className='places-list'>
                <div className='TOP5'>      
                  <SeoulPageTOP5 category={category}/>
                </div>
                <div className='items-list'>
                  <SeoulPageSpots category={category}/>
                </div>
              </div>
              
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default SeoulPage;
