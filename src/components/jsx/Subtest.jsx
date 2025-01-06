import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SetIsLocation } from '../../redux/locationState';

function Subtest() {
  const location = useSelector(state => state.location);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);  // 로딩 상태 추가

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(SetIsLocation({ latitude, longitude }));
          // localStorage에도 위치 정보와 지역 정보 저장
          localStorage.setItem('latitude', latitude);
          localStorage.setItem('longitude', longitude);

          setLoading(false);  // 위치 정보를 받아오면 로딩 종료
        },
        (err) => {
          setError(err.message);
          setLoading(false);  // 에러 발생 시 로딩 종료
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);  // 미지원 환경 처리
    }
  }, []);

  return (
    <div>
      {loading ? (
        <p>위치 정보를 가져오는 중입니다...</p>
      ) : location.latitude && location.longitude ? (
        <p>
          위도: {location.latitude}, 경도: {location.longitude}
        </p>
      ) : (
        <p>{error}</p>
      )}
    </div>
  );
}

export default Subtest;