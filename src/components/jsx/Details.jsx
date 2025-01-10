import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Details.css';  
import { useParams } from 'react-router-dom';
import placeDic from '../../utils/placeDic.js'

const Details = ({ data }) => {
  const { id, typeid } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const clientId = import.meta.env.VITE_NAVER_API_ID;
  const clientSecret = import.meta.env.VITE_NAVER_API_SECRET;
  const apiKey = import.meta.env.VITE_KOREA_TOURIST_DAY_API_KEY;
  const [details,setDetails] = useState([])

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
      console.log(response.data.items)
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // setLoading(true); // 로딩 시작
        const url = `http://apis.data.go.kr/B551011/KorService1/detailIntro1?serviceKey=${apiKey}&MobileOS=ETC&MobileApp=hanbit&contentId=${id}&contentTypeId=${typeid}&_type=json`
        console.log(url)

        const response = await axios.get(url);
        const item = response.data.response.body.items.item || [];
        console.log(item)
        setDetails(item[0]); // 데이터 저장
      } catch (err) {
        setError(err); // 에러 저장
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchData();
  }, [id]); // 빈 배열로 한 번만 실행

  useEffect(() => {
    handleSearch();
  }, [data, id, typeid]);

  const handleImageError = (e) => {
    // 이미지 로드 실패 시 해당 이미지 숨기기
    e.target.style.display = 'none';
  };

  return (
    <div className="naver-img-container">
      {loading && <p className="naver-img-loading">로딩 중...</p>}
      <div className="details-content details-item">
        {Object.keys(details).map((key) => {
          const label = placeDic[key]; 
          const value = details[key];
          if (label && value && value!=0 && value!="없음") {
            const formattedValue = value.replace(/<br\s*\/?>/g, '. '); 
            return (
              <div key={key} >
                <strong>{label}:</strong> {formattedValue}
              </div>
            );
          }
          return null; // 정보가 없으면 렌더링하지 않음
        })}
      </div>
      {images.length > 0 ? (
        <div className="naver-img-image-list">
          {images.map((image, index) => (
            <div key={index} className="naver-img-image-item">
              <a
                href={image.link}
                target="_blank"
                rel="noopener noreferrer"
                className="naver-img-link"
              >
                <img
                  src={image.link}
                  alt={image.title}
                  className="naver-img-thumbnail"
                  onError={handleImageError}  // 이미지 로딩 실패 시 처리
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



