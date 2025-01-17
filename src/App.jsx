import { useEffect, useState } from 'react'
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

import { login, logout } from './redux/userState'
import { SetIsMode } from './redux/modeState'
import { clearAllStorage } from './utils/clearAllStorage'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie';
import SeoulPageDay from './pages/jsx/SeoulPageDay'
import SeoulPageNight from './pages/jsx/SeoulPageNight'
import Directions from './pages/jsx/Directions'

function App() {
  const isMode = useSelector(state => state.isMode);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();  // 현재 경로 가져오기
  const [isTranslated, setIsTranslated] = useState(false); // 번역 여부 상태 추가

  useEffect(() => {
    const jwt = localStorage.getItem("jwt")
    const userinfo = Cookies.get('userInfo')
    console.log(jwt)
    if (jwt && userinfo) {
      dispatch(login({ token: jwt, user: JSON.parse(userinfo) }));
    } else if (jwt && !userinfo) {
      dispatch(logout())
      clearAllStorage()
      alert('로그인정보가 만료되어 재로그인 해야합니다.')
      navigate('/login')
    } else {
      dispatch(logout())
    }
  }, [dispatch]);  // dispatch가 변경될 때마다 실행되도록 설정

  useEffect(() => {
    const savedMode = JSON.parse(localStorage.getItem("isMode"));
    if (savedMode !== null) {
      dispatch(SetIsMode(savedMode));  // 저장된 모드 상태 불러오기
    }
  }, [dispatch]);

  // 🔹 Google Translate 번역 감지 (MutationObserver)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const googleWidget = document.querySelector(".goog-te-combo");
      if (googleWidget) {
        setIsTranslated(true);  // 번역이 활성화됨
      } else {
        setIsTranslated(false); // 번역이 비활성화됨
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  // 🔹 현재 페이지가 `/places/:id/:typeid`인지 확인
  const isPlaceDetailPage = location.pathname.startsWith("/places/");

  return (
    <div className={`app ${isMode ? 'day' : 'night'}`}>
      {/* 특정 페이지에서 Header 위치 조정 */}
      <div
        className="header-container"
        style={{
          transform: isPlaceDetailPage && isTranslated ? "translateY(50px)" : "translateY(0)",
          transition: "transform 0.3s ease-in-out",
          position: 'relative',  /* or 'absolute' */
          zIndex: 9999  /* 헤더가 최상위 */
        }}
      >
        <Header />
      </div>

      <div className='main-content'>
        <Routes>
          <Route path='/' element={<Intro />} />
          <Route path='/home' element={<Home />} />
          <Route path='/test' element={<Test />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/userprofile' element={<UserProfile />} />
          <Route path='/bicycle' element={<Bicycle />} />
          <Route path='/places/:id/:typeid' element={<PlaceDetail />} />
          <Route path='/daySeoul' element={<SeoulPageDay />} />
          <Route path='/nightSeoul' element={<SeoulPageNight />} />
          <Route path='/myreviews' element={<MyReviews />} />
          <Route path='/directions' element={<Directions />} />
        </Routes>
      </div>

      {!['/login', '/signup', '/userprofile'].includes(location.pathname) && <Footer />}
    </div>
  )
}

export default App
