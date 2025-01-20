import React from "react";
import './UnderConstruction.css'; // 스타일 파일

const UnderConstruction = () => {
  return (
    <div className="container">
      <div className="content">
        <h1>구현중입니다</h1>
        <p>현재 페이지는 개발 중입니다. 잠시 후 다시 방문해주세요.</p>
        <div className="emoji">🚧</div>
      </div>
    </div>
  );
};

export default UnderConstruction;
