import { useEffect, useState } from 'react'
import { Route, Router, Routes, useLocation, useNavigate } from 'react-router-dom'
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
import Footer from './components/main/Footer'
import Bicycle from './pages/jsx/Bicycle'
import Cookies from 'js-cookie';





function App() {
  const isMode = useSelector(state => state.isMode);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const naviagte = useNavigate();
  


  useEffect(() => {
    const jwt = localStorage.getItem("jwt")
    const userinfo = Cookies.get('userInfo')
    console.log(jwt)
    if (jwt&&userinfo) {
      dispatch(login({ token: jwt, user: userinfo }));
    }else if(jwt&&!userinfo){
      dispatch(logout())
      alert('로그인정보가 만료되어 재로그인 해야합니다.')
      naviagte('/login')
    }
    else (
      dispatch(logout())
    )
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
      <div className='main-content'>
      <Routes>
        <Route path='/' element={<Intro />} />
        <Route path='/home' element={<Home />} />
        <Route path='/test/:id/:typeid' element={<Test/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/userprofile' element={<UserProfile/>} />
        <Route path='/bicycle' element={<Bicycle />} />
      </Routes>
      </div>
      {!['/login', '/signup', '/userprofile'].includes(useLocation().pathname) && <Footer />}
    </div>
  )
}

export default App
