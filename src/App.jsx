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



function App() {

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
  }, auth.token); 

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
