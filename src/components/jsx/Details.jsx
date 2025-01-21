import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Details.css';  
import { useNavigate, useParams } from 'react-router-dom';
import placeDic from '../../utils/placeDic.js'
import NaverMap from './NaverMap.jsx';
import "@/locales/i18n";
import i18n from 'i18next';
import { useTranslation } from "react-i18next";

const Details = ({ data }) => {
  const { t } = useTranslation();
  const { id, typeid } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const clientId = import.meta.env.VITE_NAVER_API_ID;
  const clientSecret = import.meta.env.VITE_NAVER_API_SECRET;
  const apiKey = import.meta.env.VITE_KOREA_TOURIST_DAY_API_KEY;
  const [details, setDetails] = useState([]);
  const navigate = useNavigate();  // useNavigate 훅으로 navigate 정의

  console.log(data);

  const handleSearch = async () => {
    let searchTitle = '';
    if (!data.title) return;
  
    // 한국어일 때 처리
    if (localStorage.getItem("lang") !== "kr") {
      searchTitle = data.title.match(/[가-힣\s(),]+/g).join("").trim();  // 한국어가 아니면 한글만 필터링
    } else {
      searchTitle = data.title.trim();  // 한국어일 경우, title을 그대로 사용
    }
  
    setLoading(true);
    console.log(searchTitle);
  
    try {
      const response = await axios.get('/api/v1/search/image.json', {
        params: {
          query: searchTitle,
          display: 30,
          start: 1,
        },
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
      });
  
      setImages(response.data.items || []);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const serviceType = {
      en: "EngService1",
      ja: "JpnService1",
      zh: "ChsService1",
      default: "KorService1",
    }[localStorage.getItem("lang")] || "KorService1";
    const fetchData = async () => {
      try {
        const url = `http://apis.data.go.kr/B551011/${serviceType}/detailIntro1?serviceKey=${apiKey}&MobileOS=ETC&MobileApp=hanbit&contentId=${id}&contentTypeId=${typeid}&_type=json`;
        console.log(url);

        const response = await axios.get(url);
        const item = response.data.response.body.items.item || [];
        setDetails(item[0]);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    handleSearch();
  }, [data, id, typeid]);

  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  const handleDirectionsClick = () => {
    navigate("/directions", { state: { data } });  // data를 state로 전달
  };

  return (
    <div className="naver-img-container">
      {loading && <p className="naver-img-loading">{t("loading")}</p>}
      <div className="details-content details-item">
        {Object.keys(details).map((key) => {
          const label = placeDic[key];
          const value = details[key];
          if (label && value && value !== 0 && value !== "없음") {
            const formattedValue = value.replace(/<br\s*\/?>/g, '. ');
            return (
              <div key={key}>
                <strong>{label}:</strong> {formattedValue}
              </div>
            );
          }
          return null;
        })}
        <div style={{ width: '100%', height: '300px' }}>
          <NaverMap items={[data]} language={i18n.language} zoom={11} />
        </div>
        <button className='direction-btn' onClick={handleDirectionsClick}>{t("direction")}</button>  {/* 버튼 클릭 시 navigate */}
      </div>
      {images.length > 0 ? (
        <div className="naver-img-image-list">
          {images.map((image, index) => (
            <div key={index} className="naver-img-image-item">
              <a href={image.link} target="_blank" rel="noopener noreferrer" className="naver-img-link">
                <img
                  src={image.link}
                  alt={image.title}
                  className="naver-img-thumbnail"
                  onError={handleImageError}
                />
              </a>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="naver-img-no-images">이미지가 없습니다.</p>
      )}
    </div>
  );
};

export default Details;
