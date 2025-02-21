import React, { useState } from 'react';

function PmModel() {
  const [predictPM, setPredictPM] = useState(null);
  const [loading, setLoading] = useState(false);

  // 예측 요청 처리 함수
  const handlePredict = async () => {
    setLoading(true);
    try {
      // Spring Boot 서버의 예측 API로 데이터 전송
      const response = await fetch('http://localhost:5000//dust/model_sw', {
        method: 'POST',
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
            <p>PM 10: {predictPM.pm10} µg/m³</p>
            <p>PM 2.5: {predictPM.pm25} µg/m³</p>
            <p>CO: {predictPM.co} µg/m³</p>
            <p>NO2: {predictPM.no2} µg/m³</p>
            <p>O3: {predictPM.o3} µg/m³</p>
            <p>SO2: {predictPM.so2} µg/m³</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PmModel;
