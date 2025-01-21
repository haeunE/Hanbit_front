import React from "react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div style={{ padding: "100px", textAlign: "center" }}>
      <h1>권한 없음</h1>
      <p>이 페이지에 접근할 권한이 없습니다.</p>
      <button onClick={goHome}>홈으로 이동</button>
    </div>
  );
};

export default UnauthorizedPage;
