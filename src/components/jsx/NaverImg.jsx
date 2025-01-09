import React, { useState } from 'react';
import axios from 'axios';
import '../css/NaverImg.css';  

const NaverImg = () => {
  const [query, setQuery] = useState('동대문엽기떡볶이+길동점');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const clientId = import.meta.env.VITE_NAVER_API_ID; // 네이버 개발자 센터에서 발급받은 Client ID
  const clientSecret = import.meta.env.VITE_NAVER_API_SECRET;

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);

    try {
      const response = await axios.get('api/v1/search/image.json', {
        params: {
          query: query,
          display: 30,  // 표시할 이미지 개수
          start: 1,     // 시작 페이지
        },
        headers: {
          'X-Naver-Client-Id': clientId,  // 네이버에서 발급받은 클라이언트 ID
          'X-Naver-Client-Secret': clientSecret,  // 네이버에서 발급받은 클라이언트 Secret
        },
      });
      
      setImages(response.data.items);
    } catch (error) {
      console.error('Error fetching data', error);
    }

    setLoading(false);
  };

  return (
    <div className="naver-img-container">
      <div className="naver-img-search-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      {loading && <p className="naver-img-loading">로딩 중...</p>}

      <div>
        {images.length > 0 ? (
          <div className="naver-img-image-list">
            {images.map((image, index) => (
              <div key={index} className="naver-img-image-item">
                <img
                  src={image.link}
                  alt={image.title}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="naver-img-no-images">이미지가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default NaverImg;
