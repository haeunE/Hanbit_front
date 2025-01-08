import "../css/Home.css"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetIsMode } from "../../redux/modeState";
import Weather from "../../components/jsx/Weather";
import Location from "../../components/jsx/Location";
import { Container } from "react-bootstrap";

function Home(){
  const isMode = useSelector(state => state.isMode)
  const dispatch = useDispatch();

  useEffect(()=>{
    const savedMode = JSON.parse(localStorage.getItem("isMode"));
    if(savedMode){
      dispatch(SetIsMode(savedMode));
    }
  },[dispatch])

  const changeMode = () => {
    const savedMode = !isMode;  
    dispatch(SetIsMode(savedMode));
    localStorage.setItem("isMode", JSON.stringify(savedMode));  
  };

  return (
    <Container>
      <div className="home">
        <div className={`change-mode ${isMode ? 'day' : 'night'}`}>
          <button
            className="home-change-mode-day"
            onClick={changeMode}
            disabled={isMode}  // isMode가 true일 때 DAY 버튼 비활성화
          >
            DAY
          </button>
          <button
            className="home-change-mode-night"
            onClick={changeMode}
            disabled={!isMode}  // isMode가 false일 때 NIGHT 버튼 비활성화
          >
            NIGHT
          </button>
        </div>
        <div className="location-weather">
          <Location />
          <Weather />
        </div>
        <div className="carousel">
        </div>
        <div className="recommand">

        </div>
      </div>
    </Container>
  );
}

export default Home;