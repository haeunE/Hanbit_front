import React from "react";
import '../css/UnderConstruction.css'; // 스타일 파일
import { useTranslation } from "react-i18next";
import "@/locales/i18n";

const UnderConstruction = () => {
  const { t } = useTranslation();
  return (
    <div className="under-container">
      <div className="content">
        <h1>{t('underConstruction.title')}</h1>
        <p>{t('underConstruction.message')}</p>
        <div className="emoji">🚧</div>
      </div>
    </div>
  );
};

export default UnderConstruction;

