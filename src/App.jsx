import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Test from './pages/jsx/Test'
import { Route, Routes } from 'react-router-dom'

function App() {
  const [isAuth, setIsAuth] = useState(false); // 유저 로그인 상태
  const [userInfo, setUserInfo] = useState(); // 유저 정보

  useEffect(()=>{
    if (sessionStorage.getItem('jwt')) {
      setIsAuth(true); // 로그인 상태
    } else {
      setIsAuth(false); // 로그아웃 상태
    }
  }, []);

  return (
    <div className='App'>
      <Routes>
        <Route path='/hanbit/test' element={<Test/>} />
      </Routes>
    </div>
  )
}

export default App
