import React from 'react';
import './LoadingSpinner.css'; // CSS 파일을 추가하여 스타일링

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
