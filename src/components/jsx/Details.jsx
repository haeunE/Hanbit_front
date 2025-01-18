import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Details.css';  
import { useNavigate, useParams } from 'react-router-dom';
import placeDic from '../../utils/placeDic.js'
import NaverMap from './NaverMap.jsx';
import "@/locales/i18n";
import i18n from 'i18next';

const Details = ({ data }) => {
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
    if (!data.title) return;
    const searchTitle = data.title.split('(')[0].trim();
    setLoading(true);

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
    const fetchData = async () => {
      try {
        const url = `http://apis.data.go.kr/B551011/KorService1/detailIntro1?serviceKey=${apiKey}&MobileOS=ETC&MobileApp=hanbit&contentId=${id}&contentTypeId=${typeid}&_type=json`;
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
      {loading && <p className="naver-img-loading">로딩 중...</p>}
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
        <button className='direction-btn' onClick={handleDirectionsClick}>Directions</button>  {/* 버튼 클릭 시 navigate */}
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
