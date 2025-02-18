import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/intro.css';
import { LuSun } from "react-icons/lu";
import { WiMoonWaxingCrescent4 } from "react-icons/wi";
import { useDispatch } from 'react-redux';
import { SetIsMode } from '../../redux/modeState';
import { PiArrowBendDownLeftBold } from "react-icons/pi";
import { PiArrowBendUpRightBold } from "react-icons/pi";

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
    <div className='Intro'>
      <div className='imageframe'>
        <div className='top'>
          <div className='logo-top'>
            <img src='/img/logo/logo_intro.png' alt="Logo Image" className="image" ></img>
          </div>

          <div className='text-top'>
            <p>Click the journey you'd like!<br />
              원하시는 여정을 클릭하세요.</p>
          </div>
        </div>

        <div className="image-overlay">
          <div className="image-wrapper" onClick={DayMode}>
            <div className="intro-message">한국적인 여행지를 원하시나요?</div>
            
            {/* 이미지와 overlay를 감싼 새로운 div 추가 */}
            <div className="image-container">
              <img src="/img/intro/introday.jpg" alt="Day Image" className="image" />
              <div className="overlay"><LuSun /> DAY</div>
            </div>

            <div className="intro-places">관광지/숙소/카페</div>
          </div>

          <div className="middlebox">
            <div className="dayclick">DAY<br />Click!<br /><PiArrowBendDownLeftBold /></div>
            <div className="nigntclick"><PiArrowBendUpRightBold /><br />NIGHT<br />Click!</div>
          </div>

          <div className="image-wrapper" onClick={NightMode}>
            <div className="intro-message">색다른 한국의 모습을 원하시나요?</div>
            
            <div className="image-container">
              <img src="/img/intro/intronight.jpg" alt="Night Image" className="image" />
              <div className="overlay">NIGHT <WiMoonWaxingCrescent4 /></div>
            </div>

            <div className="intro-places">술집/핫플/포차</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Intro;