import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/intro.css';
import { LuSun } from "react-icons/lu";
import { WiMoonWaxingCrescent4 } from "react-icons/wi";
import { useDispatch } from 'react-redux';
import { SetIsMode } from '../../redux/modeState';

function Intro() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  // 낮 모드
  const DayMode = () => {
    dispatch(SetIsMode(true));
    localStorage.setItem("isMode", JSON.stringify(true)); 
    navigate('/home');
  };
  
  //  밤 모드
  const NightMode = () => {
    dispatch(SetIsMode(false));
    localStorage.setItem("isMode", JSON.stringify(false)); 
    navigate('/home');
  };
  

  return (
    <div className='intro'>

      <div className='top'>
        {/* <div className='logo-top'>
          <img src='/img/logo/logo_intro.png' alt="Logo Image" className="image" ></img>
        </div> */}

        <div className='text-top'>
          <p>Click the journey you'd like!<br />
            원하시는 여정을 클릭하세요.</p>
        </div>
      </div>

      <div className="image-overlay">

        <div className="image-wrapper" onClick={DayMode}>
          <img src="/img/intro/introday.jpg" alt="Day Image" className="image" />
          <div className="overlay"><LuSun /> DAY</div>
        </div>

        <div className="image-wrapper" onClick={NightMode}>
          <img src="/img/intro/intronight.jpg" alt="Night Image" className="image" />
          <div className="overlay">NIGHT <WiMoonWaxingCrescent4 /></div>
        </div>
      </div>
    </div>
  );
}

export default Intro;
