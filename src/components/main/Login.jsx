import React, { useState } from 'react';
import './User.css';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import { login } from '../../redux/userState';
import { useDispatch } from 'react-redux';
import { setCookie } from '../../utils/cookieUtils';
import Cookies from 'js-cookie';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 서버에 전송할 데이터
      const loginData = {
        login_username: username,
        login_password: password
      };
      console.log(loginData)
      // HTTP POST 요청
      const response = await axiosInstance.post('/login', 
        loginData
      );

      if (response.status === 200) {
        const { token, id, username, name, email, tel, foreignYN } = response.data;

<<<<<<< HEAD
      console.log('로그인 성공:', { token, username, name, email, tel, foreignYN  });

      // JWT와 사용자 정보를 sessionStorage에 저장
      sessionStorage.setItem('jwt', token);
     
      dispatch(login({ token, user: { username, name, email, tel, foreignYN  }}));  
      
      navigate('/home');
=======
        console.log('로그인 성공:', {token, id, username, name, email, tel, foreignYN  });
        localStorage.setItem("jwt",token)
        // 사용자 정보를 클라이언트 쿠키에 저장
        setCookie('userInfo', JSON.stringify({ id, username, name, email, tel, foreignYN }), {
          path: '/',
          expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1일 후 만료
        });
        
        dispatch(login({ token:token, user: { id, username, name, email, tel, foreignYN  }}));  
        
        navigate('/home');
>>>>>>> cf998b4422fbe7afcef97d48374d493a103cdd9b
      } else {
        console.error('로그인 실패:', response.status);
        alert('로그인 실패! 아이디와 비밀번호를 확인하세요.');
      }
    } catch (error) {
      if (error.response) {
        // 서버가 응답을 보낸 경우
        console.error('서버 응답 오류:', error.response);
        alert(`서버 오류: ${error.response.status} - ${error.response.data.message}`);
      } else if (error.request) {
        // 서버로 요청을 보냈지만 응답을 받지 못한 경우
        console.error('서버로 요청을 보냈지만 응답을 받지 못했습니다:', error.request);
        alert('서버와 연결할 수 없습니다. 네트워크를 확인해주세요.');
      } else {
        // 요청 설정 중 오류가 발생한 경우
        console.error('요청 설정 오류:', error.message);
        alert('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
    
  }
  const handleNavigate = () => {
    navigate('/signup');
  };

  return (
    <Container>
      <div className="user-body">
        <div className="login-container">
          <h2 className='user_h2'>로그인</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className='user_label' htmlFor="username">아이디:</label>
              <input
                className='user_input'
                type="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className='user_label' htmlFor="password">비밀번호:</label>
              <input
                className='user_input'
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="off"  // autocomplete 속성 추가
                autoCapitalize="none"  // 자동 대문자화 방지
                autoCorrect="off"  // 자동 수정 방지
                spellCheck="false"  // 맞춤법 검사 방지
              />
            </div>
            <button className='user_button' type="submit">로그인</button>
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
          >회원가입</button>
          </div>
        </div>
      </div>
    </Container>
  );
};


export default Login;