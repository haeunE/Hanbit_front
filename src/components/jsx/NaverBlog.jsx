import React, { useState } from 'react';
import axios from 'axios';
import '../css/NaverBlog.css';
import { Container } from 'react-bootstrap';

const NaverBlog = () => {
  const [query, setQuery] = useState('동대문엽기떡볶이+길동점');
  const [results, setResults] = useState([]);
  
  const clientId = import.meta.env.VITE_NAVER_API_ID; // 네이버 개발자 센터에서 발급받은 Client ID
  const clientSecret = import.meta.env.VITE_NAVER_API_SECRET; // 네이버 개발자 센터에서 발급받은 Client Secret
  
  const handleSearch = async () => {
    if (!query) return;

    const url = `/api/v1/search/blog.json`;
    try {
      const response = await axios.get(url, {
        params: {
          query: query,  // 검색어
          display: 10,    // 결과 개수
          start: 1,       // 시작 위치
        },
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
      });
      setResults(response.data.items); // 결과 배열 저장
    } catch (error) {
      console.error('검색 오류:', error);
    }
  };

  return (
    
      <div className="blog-container">
        <div className="blog-box">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="네이버 블로그 검색"
            className="blog-input"
          />
          <button className="blog-button" onClick={handleSearch}>검색</button>
        </div>
        
        <ul className="blog-list">
          {results.map((item, index) => (
            <li key={index} className="blog-item">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="result-link">
                {item.title.replace(/<[^>]+>/g, '')} {/* HTML 태그 제거 */}
              </a>
              <p className="blog-description">{item.description.replace(/<[^>]+>/g, '')}</p>
            </li>
          ))}
        </ul>
      </div>
    
  );
};

export default NaverBlog;
