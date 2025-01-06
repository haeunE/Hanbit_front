import { useEffect, useState } from 'react'
import { Route, Router, Routes } from 'react-router-dom'
import './App.css'

import Header from './components/main/Header'
import Login from './components/main/Login'
import Signup from "./components/main/Signup";
import UserProfile from './components/main/UserProfile'
import Test from './pages/jsx/Test'


import {login, logout} from './redux/userState'
import { useDispatch } from 'react-redux'


function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const jwt = sessionStorage.getItem('jwt');
    if (jwt) {
      // JWT가 있을 경우 로그인 처리 (JWT와 사용자 정보를 payload로 전달)
      const user = JSON.parse(sessionStorage.getItem('user')); // 사용자 정보를 sessionStorage에서 가져옴
      if (user) {
        dispatch(login({ token: jwt, user }));  // JWT와 user 정보로 로그인 상태 설정
      }
    } else {
      // JWT가 없으면 로그아웃 처리
      dispatch(logout());
    }
  }, [dispatch]);  // dispatch가 변경될 때마다 실행되도록 설정

  return (
    <div className='app'>
      
      <Header />
      <Routes>
        <Route path='/test' element={<Test/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/userprofile' element={<UserProfile/>} />
      </Routes>
      
    </div>
  )
}

export default App
