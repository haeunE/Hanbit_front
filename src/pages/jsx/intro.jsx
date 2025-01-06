import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/intro.css';
import { LuSun } from "react-icons/lu";
import { WiMoonWaxingCrescent4 } from "react-icons/wi";

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
    <div className='intro'>

      <div className='top'>
        <div className='logo-top'>
          <img src='/img/logo_intro.png' alt="Logo Image" id='logo' className="image" ></img>
        </div>

        <div className='text-top'>
          <p>Click the journey you'd like!<br />
            원하시는 여정을 클릭하세요.</p>
        </div>
      </div>

      <div className="image-container">

        <div className="image-wrapper" onClick={DayMode}>
          <img src="/img/introday.jpg" alt="Day Image" className="image" />
          <div className="overlay"><LuSun /> DAY</div>
        </div>

        <div className="image-wrapper" onClick={NightMode}>
          <img src="/img/intronight.jpg" alt="Night Image" className="image" />
          <div className="overlay">NIGHT <WiMoonWaxingCrescent4 /></div>
        </div>
      </div>
    </div>
  );
}

export default Intro;
