import { useEffect, useState } from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import './App.css'

import Header from './components/main/Header'
import Intro from './pages/jsx/intro'
import Login from './components/main/Login'
import Signup from "./components/main/Signup";
import UserProfile from './components/main/UserProfile'
import Test from './pages/jsx/Test'
import {login, logout} from './redux/userState'
import { useDispatch, useSelector } from 'react-redux'
import Home from './pages/jsx/Home'
import { SetIsMode } from './redux/modeState'




function App() {
  const isMode = useSelector(state => state.isMode);
  const dispatch = useDispatch();

  useEffect(() => {
    const jwt = sessionStorage.getItem('jwt');
    if (jwt) {
      // JWT가 있을 경우 로그인 처리 (JWT를 payload로 전달)
      dispatch(login({ token: jwt, user }));
    } else {
      // JWT가 없으면 로그아웃 처리
      dispatch(logout());
    }
  }, [dispatch]);  // dispatch가 변경될 때마다 실행되도록 설정

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
      </Routes>
      
    </div>
  )
}

export default App
