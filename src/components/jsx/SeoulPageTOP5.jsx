import axios from "axios";
import { useEffect, useState } from "react";
import SeoulPage from "../../pages/jsx/SeoulPage";

function SeoulPageTOP5({ title }) {
  const [isLoading, setIsLoading] = useState(true);
  const [spots, setSpots] = useState([]);
  const clientId = import.meta.env.VITE_NAVER_SEARCH_CLIENT_ID;  // 클라이언트 아이디
  const clientSecret = import.meta.env.VITE_NAVER_SEARCH_CLIENT_SECRET;  // 클라이언트 비밀


  useEffect(() => {
    const handleSearch = async () => {
      if (!title) return; // title이 없는 경우 API 호출하지 않음
      const searchTitle = title.split('(')[0].trim();
      console.log(searchTitle)
      const url = `/api/v1/search/local.json`;
      try {
        const response = await axios.get(url, {
          params: {
            query: searchTitle, // 검색어
            display: 5,  // 결과 개수
            sort : 'comment' // comment: 업체 및 기관에 대한 카페, 블로그의 리뷰 개수순으로 내림차순 정렬
          },
          headers: {
            'X-Naver-Client-Id': clientId,
            'X-Naver-Client-Secret': clientSecret,
          },
        });
        console.log(response.data.items)
      } catch (error) {
        console.error('검색 오류:', error);
      }
    };

    handleSearch();
  }, [title]); // title 변경 시 API 호출

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          <SeoulPage />
        </ul>
      )}
    </div>
  );
}

export default SeoulPageTOP5;
