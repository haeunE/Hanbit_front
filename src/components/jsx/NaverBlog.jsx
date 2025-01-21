import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/NaverBlog.css';
import { useTranslation } from 'react-i18next';

const NaverBlog = ({ title }) => {
  const { t } = useTranslation();
  const [results, setResults] = useState([]);

  const clientId = import.meta.env.VITE_NAVER_API_ID; // 네이버 Client ID
  const clientSecret = import.meta.env.VITE_NAVER_API_SECRET; // 네이버 Client Secret

  useEffect(() => {
    let searchTitle = ''
    if (localStorage.getItem("lang") != "kr"){
      searchTitle = title.match(/[가-힣\s(),]+/g).join("").trim();
    }else{
      searchTitle = title.split('(')[0].trim();
    }
    const handleSearch = async () => {
      if (!title) return; // title이 없는 경우 API 호출하지 않음
      console.log(searchTitle)
      const url = `/api/v1/search/blog.json`;
      try {
        const response = await axios.get(url, {
          params: {
            query: searchTitle, // 검색어
            display: 10,  // 결과 개수
            start: 1,     // 시작 위치
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

    handleSearch();
  }, [title,t]); // title 변경 시 API 호출

  return (
    <div className="blog-container">
      <ul className="blog-list">
        {results.map((item, index) => (
          <li key={index} className="blog-item">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="result-link"
            >
              {item.title.replace(/<[^>]+>/g, ' ').replace(/&[^;]+;/g, ' ')} {/* HTML 태그 제거 */}
            </a>
            <p className="blog-description">
              {item.description.replace(/<[^>]+>/g, ' ').replace(/&[^;]+;/g, ' ')}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NaverBlog;
