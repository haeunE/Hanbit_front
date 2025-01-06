import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";  // axiosInstance import
import { useNavigate } from "react-router-dom";
import '../css/Test.css';  // CSS 파일 임포트

function Test() {
  const navigate = useNavigate();

  const handleImageClick = (path) => {
    navigate(path); // 이미지 클릭 시 해당 경로로 이동
  };

  return (
    <div className="outer-container">
      <div className="image-container">
        {/* 이미지 1 */}
        <div className="image-wrapper" onClick={() => handleImageClick('/hanbit/test')}>
          <img src="public/img/seoul_night.jpg" alt="Image 1" className="image" />
          <div className="overlay">DAY</div>
        </div>
        
        {/* 이미지 2 */}
        <div className="image-wrapper" onClick={() => handleImageClick('/userprofile')}>
          <img src="public/img/seoul_day.jpg" alt="Image 2" className="image" />
          <div className="overlay">NIGHT</div>
        </div>
      </div>
    </div>
  );
};

export default Test;
