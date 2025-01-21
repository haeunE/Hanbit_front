import React, { useEffect, useState } from 'react';
import './User.css';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import { login } from '../../redux/userState';
import { useDispatch } from 'react-redux';
import { setCookie } from '../../utils/cookieUtils';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import "@/locales/i18n";
import i18n from 'i18next'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();  // 번역 함수

  // 페이지 로드 시 localStorage에서 모드 불러오기
  useEffect(() => {
    const savedLanguage = localStorage.getItem("lang");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n.language]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 서버에 전송할 데이터
      const loginData = {
        login_username: username,
        login_password: password
      };
      console.log(loginData);
      
      // HTTP POST 요청
      const response = await axiosInstance.post('/login', loginData);

      if (response.status === 200) {
        const { token, id, username, name, email, tel, foreignYN, role } = response.data;

        console.log('로그인 성공:', { token, id, username, name, email, tel, foreignYN, role });
        localStorage.setItem("jwt", token);
        
        // 사용자 정보를 클라이언트 쿠키에 저장
        setCookie('userInfo', JSON.stringify({ id, username, name, email, tel, foreignYN, role }), {
          path: '/',
          expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1일 후 만료
        });
        
        dispatch(login({ token: token, user: { id, username, name, email, tel, foreignYN, role } }));
        
        navigate('/home');
      } else {
        console.error('로그인 실패:', response.status);
        alert(t('login-page.login_fail'));  // 번역된 실패 메시지
      }
    } catch (error) {
      if (error.response) {
        // 서버가 응답을 보낸 경우
        console.error('서버 응답 오류:', error.response);
        alert(t('login-page.server_error', { status: error.response.status, message: error.response.data.message }));
      } else if (error.request) {
        // 서버로 요청을 보냈지만 응답을 받지 못한 경우
        console.error('서버로 요청을 보냈지만 응답을 받지 못했습니다:', error.request);
        alert(t('login-page.network_error'));
      } else {
        // 요청 설정 중 오류가 발생한 경우
        console.error('요청 설정 오류:', error.message);
        alert(t('login-page.request_error'));
      }
    }
  };

  const handleNavigate = () => {
    navigate('/signup');
  };
  return (
    <Container>
      <div className="user-body">
        <div className="login-container">
          <h2 className='user_h2'>{t('login-page.login')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className='user_label' htmlFor="username">{t('login-page.username')}:</label>
              <input
                className='user_input'
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className='user_label' htmlFor="password">{t('login-page.password')}:</label>
              <input
                className='user_input'
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>
            <button className='user_button' type="submit">{t('login-page.login_button')}</button>
          </form>
          <div className="signup-link">
            <button
              type="button"
              onClick={handleNavigate}
              style={{
                background: "none",
                color: "blue",
                textDecoration: "underline",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontSize: "inherit",
              }}
            >
              {t('login-page.signup_button')}
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};


export default Login;