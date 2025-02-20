import React, { useState } from 'react';

function PmModel() {
  const [feature, setFeature] = useState({
    lat, lon, year, month, day, hour
  })
  const [predictPM, setPredictPM] = useState(null);
  const [loading, setLoading] = useState(false);

  // 예측 요청 처리 함수
  const handlePredict = async () => {
    setLoading(true);
    try {
      // Spring Boot 서버의 예측 API로 데이터 전송
      const response = await fetch('http://localhost:8888/pmmodel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features: feature }),
      });
      
      // 예측 결과 받기
      const data = await response.json();
      setPredictPM(data);  // 예측 결과 저장
    } catch (error) {
      console.error('예측 요청 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handlePredict} disabled={loading}>
        {loading ? '예측 중...' : '예측하기'}
      </button>

      {predictPM && (
        <div>
          <h3>예측 결과</h3>
          <div>
            {predictPM.map((hourData, index) => (
              <div key={index}>
                <p>시간: {hourData.hour}</p>
                <p>PM-10: {hourData.pm10} µg/m³</p>
                <p>PM-2.5: {hourData.pm25} µg/m³</p>
                <p>NO2: {hourData.no2} µg/m³</p>
                <p>O3: {hourData.o3} µg/m³</p>
                <p>CO: {hourData.co} µg/m³</p>
                <p>SO2: {hourData.so2} µg/m³</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PmModel;
