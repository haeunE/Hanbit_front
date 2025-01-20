import { useEffect, useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import NaverBlog from "../../components/jsx/NaverBlog";
import "../css/PlaceDetail.css"
import Placeimg from "../../components/jsx/placeimg";
import { useParams } from "react-router-dom";
import Details from "../../components/jsx/Details";
import axios from "axios";
import Review from "../../components/jsx/Review";
import { useTranslation } from "react-i18next";

function PlaceDetail() {
  const { t } = useTranslation();
  const { id, typeid } = useParams();
  const [activeKey, setActiveKey] = useState('blog');
  const apiKey = import.meta.env.VITE_KOREA_TOURIST_DAY_API_KEY;
  const [placedata, setPlacedata] = useState(null); // API 응답 데이터를 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [typeId, setTypeId] = useState(typeid);

  

  // 데이터 가져오기
  useEffect(() => {
  
    const serviceType = {
      en: "EngService1",
      ja: "JpnService1",
      zh: "ChsService1",
      default: "KorService1",
    }[lang] || "KorService1";

    const fetchData = async () => {
      try {
        const url = `http://apis.data.go.kr/B551011/${serviceType}/detailCommon1?serviceKey=${apiKey}&MobileOS=ETC&MobileApp=hanbit&contentId=${id}&contentTypeId=${typeid}&_type=json`;
        const response = await axios.get(url+"&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y");
        const items = response.data.response.body.items.item || [];
        const placedetail = items.map((i) => ({
          title: i.title,
          tel: i.tel,
          img: i.firstimage,
          img2: i.firstimage2,
          homepage: i.homepage,
          cat: i.cat3,
          add: i.addr1 + i.addr2,
          addrcode: i.zipcode,
          lon: i.mapx,
          lat: i.mapy,
          some: i.overview
        }));
        setPlacedata(...placedetail); // 데이터 저장
      } catch (err) {
        setError(err); // 에러 처리
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchData();
  }, [id, typeId, lang]);  // typeId와 lang이 변경되면 데이터 다시 요청

  // 로딩 중이나 에러가 발생하면 그에 대한 처리를 해준다.
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // 탭 선택 처리
  const handleSelect = (key) => {
    setActiveKey(key);
  };
  console.log(placedata)
  return (
    <Container>
      {/* 컨텐츠 영역 */}
      <div className="detail-container">
        <h2>{placedata.title}</h2>
        <Placeimg contentId={id} contype={typeid} firstimage={placedata.img} className="place-imgs"/>
        {/* 버튼 영역 */}
        <div className="detail-tab-container">
          <Tabs activeKey={activeKey} onSelect={handleSelect} className="detail-tab mb-3" fill>
            <Tab eventKey="blog" title="BLOG">
              <div className="naver-blog">
                <NaverBlog title={placedata.title}/>
              </div>
            </Tab>
            <Tab eventKey="img" title="DETAILS">
              <div className="naver-img">
                <Details data={placedata}/>
              </div>
            </Tab>
            <Tab eventKey="review" title="REVIEW">
              <div className="review">
                <Review placeid={id} typeid={typeid} placetitle={placedata.title}/>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </Container>
  );
}

export default PlaceDetail;
