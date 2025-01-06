import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SetIsLocation } from '../../redux/locationState';

function Subtest() {
  const location = useSelector(state => state.location);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);  
  

  useEffect(() => {
    // 네이버 지도 API 로딩 여부 확인
    const loadNaverMapApi = () => {
      if (window.naver && window.naver.maps) {
        return Promise.resolve();  // 네이버 지도 API가 로드되면 Promise 반환
      }
      
      return new Promise((resolve, reject) => {
        // 네이버 지도 API 스크립트가 없다면 로딩
        const script = document.createElement('script');
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?clientId=YOUR_CLIENT_ID&submodules=geocoder`;
        script.onload = () => resolve();  // 로드 완료 시 resolve
        script.onerror = (error) => reject(error);  // 로드 실패 시 reject
        document.head.appendChild(script);
      });
    };

    // 네이버 지도 API 로딩 후 위치 정보 가져오기
    loadNaverMapApi()
      .then(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              dispatch(SetIsLocation({ latitude, longitude }));

              // 위치 정보를 localStorage에 저장
              localStorage.setItem('latitude', latitude);
              localStorage.setItem('longitude', longitude);

              // 네이버 Geocoder 사용하여 지역명(주소) 얻기
              const geocoder = new window.naver.maps.Geocoder();
              geocoder.coordToAddress(longitude, latitude, (status, response) => {
                if (status === window.naver.maps.Service.Status.OK) {
                  const region = response.result.items[0].address;  // 지역명(주소)
                  dispatch(SetIsLocation({ region }));
                } else {
                  setError('주소를 가져오는 데 실패했습니다.');
                }
              });

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
      })
      .catch((error) => {
        setError('네이버 지도 API 로딩에 실패했습니다.');
        setLoading(false);
      });
  }, [dispatch]);

  return (
    <div>
      {loading ? (
        <p>위치 정보를 가져오는 중입니다...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <p>위도: {location.latitude}, 경도: {location.longitude}</p>
          <p>지역: {region}</p>  {/* 지역명 표시 */}
        </div>
      )}
    </div>
  );
}

export default Subtest;
