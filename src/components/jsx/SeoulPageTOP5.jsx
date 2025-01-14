import { useEffect, useState } from "react";
import NaverMap from "./NaverMap";
import axios from "axios";
import '../css/SeoulPageTOP5.css';
import "@/locales/i18n";
import i18n from 'i18next';  
import { useTranslation } from "react-i18next";


function SeoulPageTOP5({ category }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [spots, setSpots] = useState([]);
  const clientId = import.meta.env.VITE_NAVER_SEARCH_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_NAVER_SEARCH_CLIENT_SECRET;

  useEffect(() => {
    const handleSearch = async () => {
      if (!category) return;
      const searchCategory = category.split('(')[0].trim();

      const url = `/api/v1/search/local.json`;
      try {
        setIsLoading(true);
        const response = await axios.get(url, {
          params: {
            query: searchCategory,
            display: 5,
            sort: 'comment',
          },
          headers: {
            'X-Naver-Client-Id': clientId,
            'X-Naver-Client-Secret': clientSecret,
          },
        });
        setSpots(response.data.items);
      } catch (error) {
        console.error('검색 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    handleSearch();
  }, [category]);

  // HTML 태그를 제거하는 함수
  const removeHTMLTags = (str) => {
    return str.replace(/<[^>]*>/g, "");  // <태그>...</태그> 제거
  };

  return (
    <div className="seoul-page-container">
      {isLoading ? (
        <p>{t`loading`}</p>
      ) : (
        <div className="map-list-container">
          <NaverMap items={spots} language={i18n.language} />
          <ul className="spot-list">
            {spots.map((spot, index) => (
              <li key={index} className="spot-item">
                <a href={spot.link} target="_blank" rel="noopener noreferrer">
                  <h3>{removeHTMLTags(spot.title)}</h3>  {/* HTML 태그 제거하고 출력 */}
                  <p>{spot.address}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SeoulPageTOP5;
