import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/intro.css';

function Intro() {
  const navigate = useNavigate();

  // 낮 모드
  const DayMode = () => {
    navigate('/day');
  };

  //  밤 모드
  const NightMode = () => {
    navigate('/night');
  };

  return (
    <div className="intro-container">
      <div className="image-container">
        {/* 낮 이미지 */}
        <div className="image-box day">
          <img src="public/images/seoulday.jpg" alt="Day Seoul" className="image" />
        </div>

        {/* 밤 이미지 */}
        <div className="image-box night">
          <img src="public/images/seoulnight.jpg" alt="Night Seoul" className="image" />
        </div>
      </div>

      {/* 버튼 */}
      <div className="button-container">
        <button onClick={DayMode}>Day Seoul</button>
        <button onClick={NightMode}>Night Seoul</button>
      </div>
    </div>
  );
}

export default Intro;
