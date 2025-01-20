import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import "@/locales/i18n";
import i18n from 'i18next';  
import '../css/SeoulPage.css'
import { useDispatch, useSelector } from 'react-redux';
import { SetIsMode } from '../../redux/modeState';
import { SetIsLocation } from '../../redux/locationState';
import DaySeoulPlace from '../../components/jsx/DaySeoulPlace';



function SeoulPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const city = JSON.parse(localStorage.getItem("location")).city;
  
  const [category, setCategory] = useState(`${city}`);
  const [contentId, setContentId] = useState(39);
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
  }, []);

  // 카테고리별 콘텐츠 ID 매핑
  const categoryToContentIdMap = {
    관광지: i18n.language === "ko" ? 12 : 76,
    문화시설: i18n.language === "ko" ? 14 : 78,
    음식점: i18n.language === "ko" ? 39 : 82,
    숙박: i18n.language === "ko" ? 32 : 80,
    쇼핑: i18n.language === "ko" ? 38 : 79,
    레포츠: i18n.language === "ko" ? 28 : 75,
  };

  // 카테고리가 변경될 때 contentId 업데이트
  useEffect(() => {
    const categoryKey = category.replace(`${city} `, ''); // '서울맛집' → '맛집'
    setContentId(categoryToContentIdMap[categoryKey] || 39); // 기본값 39 설정
  }, [category]);

  // 버튼 클릭 시 category만 변경
  const handleCategoryClick = (newCategory) => {
    setCategory(newCategory);
  };

  console.log("현재 카테고리:", category);
  console.log("현재 contentId:", contentId);

  return (
    <Container>
      <div className="day-seoul">
        <div className="hashtag-list">
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`${city} 문화시설`)}>{t("seoulDay-page.cultural-facilities")}</button>
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`${city} 음식점`)}>{t("seoulDay-page.restaurants")}</button>
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`${city} 숙박`)}>{t("seoulDay-page.accommodation")}</button>
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`${city} 쇼핑`)}>{t("seoulDay-page.shopping")}</button>
          <button className="hashtag-btn" onClick={() => handleCategoryClick(`${city} 레포츠`)}>{t("seoulDay-page.leisure")}</button>
        </div>

        <div className="container mt-5">
          <div className="row">
            {isLoading ? (
              <p>{t`loading`}</p>
            ) : (
              <div className='places-list'>
                <div>
                  <DaySeoulPlace category={category} contentTypeId={contentId} />
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
