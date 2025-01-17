import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';

// 인증 및 권한 확인 로직 (임의의 예시)
const checkAuth = () => {
  try {
    const userinfo = JSON.parse(Cookies.get('userInfo')); // 쿠키에서 사용자 정보 가져오기
    return userinfo && userinfo.role === "ADMIN"; // ADMIN 권한 확인
  } catch (error) {
    console.error("사용자 정보를 파싱하는 중 오류 발생:", error);
    return false; // 파싱 실패 시 인증 실패로 간주
  }
};

const ProtectedRoute = ({ children }) => {
  if (!checkAuth()) {
    return <Navigate to="/unauthorized" />; // 권한 없음 페이지로 리다이렉트
  }
  return children;
};

export default ProtectedRoute;
