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
        const pageIndexes = [1, 2, 3]; // 여러 페이지
        const requests = pageIndexes.map((page) => {
          const URL = `/danger-api/api/lcm/safeMap.do?esntlId=${ID}&authKey=${KEY}&pageIndex=${page}&pageUnit=100&minX=126.8017&minY=37.5302&maxX=127.1831&maxY=37.6050`;
          return fetch(URL).then((response) => response.json());
        });
  
        const responses = await Promise.all(requests);
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
        <h2 className="safeArea-h2" style={{ color: isMode ? "black" : "white" }}>{t('safety_Area')}</h2>
        <div className="safeArea-map">
          <NaverMap items={[...items]} zoom={13}/>
          <button 
          className={`safeArea-btn ${isMode ? "day" : "night"}`}
          onClick={handleClick}>{t('notification')}</button>
        </div>
      </div>
    </Container>
  )
}

export default SafeArea