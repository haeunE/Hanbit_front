import { useEffect, useState } from 'react'
import { Route, Router, Routes, useLocation } from 'react-router-dom'
import './App.css'

import Header from './components/main/Header'
import Intro from './pages/jsx/Intro'
import Login from './components/main/Login'
import Signup from "./components/main/Signup";
import UserProfile from './components/main/UserProfile'
import Test from './pages/jsx/Test'
import {login, logout} from './redux/userState'

import { useDispatch, useSelector } from 'react-redux'
import Home from './pages/jsx/Home'
import { SetIsMode } from './redux/modeState'
import Footer from './components/main/Footer'
import TripPlacesDay from './components/jsx/TripPlacesDay'





function App() {
  const isMode = useSelector(state => state.isMode);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    // 만약 auth.token이 존재하면 sessionStorage에 저장
    if (auth.token) {
      sessionStorage.setItem("jwt", auth.token);  // auth.token을 sessionStorage에 저장
    } else {
      // auth.token이 없다면 로그아웃 처리
      localStorage.removeItem("jwt");
      sessionStorage.removeItem("jwt");
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }, auth.token);  // dispatch가 변경될 때마다 실행되도록 설정

  useEffect(() => {
    const savedMode = JSON.parse(localStorage.getItem("isMode"));
    if (savedMode !== null) {
      dispatch(SetIsMode(savedMode));  // 저장된 모드 상태 불러오기
    }
  }, [dispatch]);

  return (
    <div className={`app ${isMode ? 'day' : 'night'}`}>
      
      <Header />
      <Routes>
        <Route path='/' element={<Intro />} />
        <Route path='/home' element={<Home />} />
        <Route path='/test' element={<Test/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/userprofile' element={<UserProfile/>} />
        <Route path='/trip' element={<TripPlacesDay/>} />
      </Routes>
      {!['/login', '/signup', '/userprofile'].includes(useLocation().pathname) && <Footer />}
      
    </div>
  )
}

export default App
