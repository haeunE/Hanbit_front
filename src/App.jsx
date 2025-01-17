import { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'

import Test from './pages/jsx/Test'
import Header from './components/main/Header'
import Footer from './components/main/Footer'
import Login from './components/main/Login'
import Signup from "./components/main/Signup";
import UserProfile from './components/main/UserProfile'
import Intro from './pages/jsx/intro'
import Home from './pages/jsx/Home'
import Bicycle from './pages/jsx/Bicycle'
import PlaceDetail from './pages/jsx/PlaceDetail'
import MyReviews from './pages/jsx/MyReviews'

import {login, logout} from './redux/userState'
import { SetIsMode } from './redux/modeState'
import { clearAllStorage } from './utils/clearAllStorage'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie';
import SeoulPageDay from './pages/jsx/SeoulPageDay'
import SeoulPageNight from './pages/jsx/SeoulPageNight'
import AdminPage from './admin/AdminPage'
import UnauthorizedPage from './admin/UnauthorizedPage'
import CsvUpload from './admin/components/CsvUpload'
import ProtectedRoute from './utils/ProtectedRoute'
import PlaceUpload from './admin/components/PlaceUpload'



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
      dispatch(login({ token: jwt, user: JSON.parse(userinfo) }));
    }else if(jwt&&!userinfo){
      dispatch(logout())
      clearAllStorage()
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
        {/* 관리자 페이지 */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage /> {/* 공통 레이아웃 */}
            </ProtectedRoute>
          }
        >
          {/* /admin/ 하위 경로 */}
          <Route path="csv" element={<CsvUpload />} />
          <Route path="place" element={<PlaceUpload />} />
        </Route>
        {/* 권한 없음 페이지 */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        {/* 메인 페이지 */}
        <Route path='/' element={<Intro />} />
        <Route path='/home' element={<Home />} />
        <Route path='/test' element={<Test/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/userprofile' element={<UserProfile/>} />
        <Route path='/bicycle' element={<Bicycle />} />
        <Route path='/places/:id/:typeid' element={<PlaceDetail/>} />
        <Route path='/daySeoul' element={<SeoulPageDay />} />
        <Route path='/nightSeoul' element={<SeoulPageNight />} />
        <Route path='/myreviews' element={<MyReviews />} />
      </Routes>
      </div>
      {!['/login', '/signup', '/userprofile'].includes(useLocation().pathname) && <Footer />}
    </div>
  )
}

export default App
