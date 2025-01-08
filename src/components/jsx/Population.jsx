import React, { useState, useEffect } from 'react';

function Population() {
  const location = localStorage.getItem('location');
  const [populationData, setPopulationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const region = location ? JSON.parse(location).region : '천호역'; // 기본 지역 설정

  // 서울시 실시간 인구 데이터 API URL
  const MAP_APIKEY = import.meta.env.VITE_POPULATION_API_KEY; // 서울시 공공데이터 API 키를 여기에 넣으세요.
  const POPULATION_MAP_API_URL = `http://openapi.seoul.go.kr:8088/${MAP_APIKEY}/json/citydata_ppltn/1/5/%EC%B2%9C%ED%98%B8%EC%97%AD`;

  // 데이터 fetching 함수
  const fetchPopulationData = async () => {
    try {
      const response = await fetch(POPULATION_MAP_API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setPopulationData(data);
      console.log(data)
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    fetchPopulationData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // 인구 데이터가 있을 경우 출력
  return (
    <div className="Population">
      <h1>서울시 실시간 인구데이터</h1>
      <div>
        {/* 인구 데이터 출력 */}
        <p>지역: {populationData.AREA_NM}</p>
        <p>최대 인구: {populationData.AREA_PPLTN_MAX}</p>
        <p>최소 인구: {populationData.AREA_PPLTN_MIN}</p>
        <p>혼잡도 수준: {populationData.AREA_CONGEST_LVL}</p>

        {/* 밀집도 메시지 출력 */}
        <div>
          <h2>혼잡도 안내</h2>
          <p>{populationData.AREA_CONGEST_MSG}</p>
        </div>
      </div>
    </div>
  );
}

export default Population;
