import { useEffect, useState } from 'react'
import './App.css'
import Test from './pages/jsx/Test'
import { Route, Routes } from 'react-router-dom'
import Header from './components/main/Header'
import Intro from './pages/jsx/intro'

function App() {
  const [isAuth, setIsAuth] = useState(false); // 유저 로그인 상태

  useEffect(()=>{
    if (sessionStorage.getItem('jwt')) {
      setIsAuth(true); // 로그인 상태
    } else {
      setIsAuth(false); // 로그아웃 상태
    }
  }, []);

  return (
    <div className='App'>
      <Header />
      <Routes>
        <Route path='/hanbit/test' element={<Test/>} />
        <Route path='/intro' element={<Intro />} /> 
      </Routes>
    </div>
  )
}

export default App
