import React, { useState, useEffect } from 'react';

function Subtest() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <div>
      {location.latitude && location.longitude ? (
        <p>
          위도: {location.latitude}, 경도: {location.longitude}
        </p>
      ) : (
        <p>{error || '위치 정보를 가져오는 중입니다...'}</p>
      )}
    </div>
  );
}

export default Subtest;