import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import NaverMap from "../../components/jsx/NaverMap";
import '../css/SafeArea.css'
import { useDispatch, useSelector } from "react-redux";
import { SetIsMode } from "../../redux/modeState";
import { useTranslation } from "react-i18next";


function SafeArea(){
  const { t } = useTranslation();
  const KEY = import.meta.env.VITE_DANGERAREA_API_KEY;
  const ID = import.meta.env.VITE_DANGERAREA_USER_ID;
  const [items, setItems] = useState([]);
  const isMode = useSelector((state)=>state.isMode);
  const dispatch = useDispatch();

  // 안전지역 약 300건 다저장해서 map에 보이게 하기
  useEffect(() => {
    const fetchSafeZones = async () => {
      try {
        const pageIndexes = [1, 2, 3, 4, 5, 6, 7]; // 여러 페이지
        const requests = pageIndexes.map((page) => {
          const URL = `/danger-api/api/lcm/safeMap.do?esntlId=${ID}&authKey=${KEY}&pageIndex=${page}&pageUnit=100&minX=126.0&minY=37.4&maxX=127.5&maxY=37.7`;
          return fetch(URL).then((response) => response.json());
        });
  
        const responses = await Promise.all(requests);
        console.log(responses)
        const allPlaces = responses.flatMap((data) =>
          data.list.map((i) => ({
            title: i.bsshNm,
            addr: i.adres,
            lon: i.lcinfoLo,
            lat: i.lcinfoLa,
          }))
        );
  
        setItems(allPlaces);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
  
    fetchSafeZones();
  
    const savedMode = JSON.parse(localStorage.getItem("isMode"));
    if (savedMode !== null) {
      dispatch(SetIsMode(savedMode));
    }
  }, []);
  
   

    const handleClick = () => {
      window.open('https://www.sexoffender.go.kr/', '_blank');
    };

  return(
    <Container>
      <div className="safeArea">
      <h2 
        className="safeArea-h2" 
        style={{ 
          color: isMode ? "black" : "white", 
          borderBottom: isMode ? "2px solid #00b493" : "2px solid rgb(248, 73, 108)" 
        }}
      >
        {t('safety.title')}
      </h2>
        <div className="safe-info" style={{ backgroundColor: isMode ? "#5ed1bc" : "white" }}>{t('safety.info')}</div>
        <div className="safe-bg">
          <div className="safeArea-map">
            <NaverMap items={[...items]} zoom={13}/>
            <button 
            className={`safeArea-btn ${isMode ? "day" : "night"}`}
            onClick={handleClick}>{t('notification')}</button>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default SafeArea