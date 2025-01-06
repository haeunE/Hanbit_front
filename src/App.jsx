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
import Intro from './pages/jsx/Intro'


function App() {

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

  return (
    <div className='app'>
      
      <Header />
      <Routes>
        <Route path='/' element={<Intro />} />
        <Route path='/test' element={<Test/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/userprofile' element={<UserProfile/>} />
      </Routes>
      
    </div>
  )
}

export default App
