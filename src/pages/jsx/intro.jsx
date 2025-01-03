import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/intro.css';
import { TbSun } from "react-icons/tb";
import { IoMoonSharp } from "react-icons/io5";

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
    <div className="outer-container">
      <div className="image-container">

        <div className='image-logo'>
          <img src=''></img>
        </div>

        <div className="image-wrapper" onClick={DayMode}>
          <img src="/img/introday.jpg" alt="Day Image" className="image" />
          <div className="overlay">DAY</div>
        </div>
        
        <div className="image-wrapper" onClick={NightMode}>
          <img src="/img/intronight.jpg" alt="Night Image" className="image" />
          <div className="overlay">NIGHT</div>
        </div>
      </div>
    </div>

  );
}

export default Intro;
