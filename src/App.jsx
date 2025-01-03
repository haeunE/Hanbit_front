import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Test from './pages/jsx/Test'
import { Route, Router, Routes } from 'react-router-dom'
import Login from './components/main/Login'
import Signup from "./components/main/Signup";
import UserProfile from './components/main/UserProfile'
import {login, logout} from './redux/userState'
import { useDispatch } from 'react-redux'


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
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/test' element={<Test/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/userprofile' element={<UserProfile/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
