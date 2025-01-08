import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SetIsLocation } from '../../redux/locationState';
import axiosInstance from '../../axiosInstance';

function Location() {
  const isMode = useSelector(state => state.isMode);
  const location = useSelector(state => state.location);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 위치 정보 가져오기 (로컬스토리지 확인 후, 없으면 요청)
  useEffect(() => {
    const storedLocation = localStorage.getItem('location');
    
    if (storedLocation) {
      const { latitude, longitude, region } = JSON.parse(storedLocation);
      dispatch(SetIsLocation({ latitude, longitude, region }));
    } else {
      getLocation();
    }
  }, [dispatch]);

  const getLocation = () => {
    setLoading(true);  // 로딩 상태 활성화
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(SetIsLocation({ latitude, longitude, region: null }));
          fetchAddress(latitude, longitude);  // 주소 정보 요청
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await axiosInstance.get("/location", {
        params: { latitude, longitude } // 위치 데이터를 URL 쿼리 파라미터로 전달
      });
      console.log(response.data);

      // JSON 응답에서 필요한 부분 추출
      const district = response.data.results[0].region.area2.name;  // 강동구
      const neighborhood = response.data.results[0].region.area3.name;  // 둔촌동

      // district와 neighborhood를 하나의 문자열로 이어서 저장
      const region = `${district} ${neighborhood}`;

      // Redux에 위치 정보와 region 저장
      dispatch(SetIsLocation({ latitude, longitude, region }));

      // 로컬스토리지에 위치 정보 저장
      localStorage.setItem('location', JSON.stringify({ latitude, longitude, region }));
    } catch (error) {
      console.error(error);
      setError('주소 정보를 가져오는 데 실패했습니다.');
    }
  };

  return (
    <div>
      {loading ? (
        <p>위치 정보를 가져오는 중입니다...</p>
      ) : location.latitude && location.longitude ? (
        <p style={{ color: isMode ? 'black' : 'white', fontWeight:'bold' }}>{location.region}</p>
      ) : (
        <p>{error || '위치 정보가 없습니다.'}</p>
      )}
    </div>
  );
}

export default Location;
