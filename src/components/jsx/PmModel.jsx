import React, { useState } from 'react';

function PmModel() {
  const [feature, setFeature] = useState({ temperature: '', humidity: '' });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFeatureChange = (e) => {
    const { name, value } = e.target;
    setFeature(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features: feature }),
      });
      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="number"
        name="temperature"
        placeholder="Temperature"
        value={feature.temperature}
        onChange={handleFeatureChange}
      />
      <input
        type="number"
        name="humidity"
        placeholder="Humidity"
        value={feature.humidity}
        onChange={handleFeatureChange}
      />
      <button onClick={handlePredict} disabled={loading}>
        {loading ? '예측 중...' : '예측하기'}
      </button>
      
      {prediction && (
        <div>
          <p>PM-10: {prediction.pm10} µg/m³</p>
          <p>PM-2.5: {prediction.pm25} µg/m³</p>
        </div>
      )}
    </div>
  );
}

export default PmModel;
