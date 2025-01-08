import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SetIsLocation } from '../../redux/locationState';
import axiosInstance from '../../axiosInstance';
import '../css/Weather.css';

function Location() {
  const location = useSelector(state => state.isLocation);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedLocation = localStorage.getItem('location');
    if (storedLocation) {
      const { latitude, longitude, region } = JSON.parse(storedLocation);
      dispatch(SetIsLocation({ latitude, longitude, region }));
    } else {
      const watchId = getLocation();
      return () => {
        if (watchId) {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    }
  }, [dispatch]);

  const getLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(SetIsLocation({ latitude, longitude, region: null }));
          fetchAddress(latitude, longitude);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );
      return watchId;
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await axiosInstance.get("/location", {
        params: { latitude, longitude }
      });
      const district = response.data.results[0].region.area2.name;
      const neighborhood = response.data.results[0].region.area3.name;
      const region = `${district} ${neighborhood}`;
      dispatch(SetIsLocation({ latitude, longitude, region }));
      localStorage.setItem('location', JSON.stringify({ latitude, longitude, region }));
    } catch (error) {
      setError('주소 정보를 가져오는 데 실패했습니다.');
    }
  };

  return (
    <div>
      {loading ? (
        <p>위치 정보를 가져오는 중입니다...</p>
      ) : location.latitude && location.longitude ? (
        <div style={{ color: "black", fontWeight: 'bold' }}>
          {location.region}
        </div>
      ) : (
        <p>{error || '위치 정보가 없습니다.'}</p>
      )}
    </div>
  );
}

export default Location;
