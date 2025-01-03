import React, { useState } from 'react';
import './User.css';
import axiosInstance from '../../axiosInstance';
import { Container } from 'react-bootstrap';

const Signup = () => {
  const [userForm, setSignupForm] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    tel: '',
    foreignYN: false,
  });

  const [emailVerified, setEmailVerified] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [emailVerificationPending, setEmailVerificationPending] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupForm({
      ...userForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleEmailVerification = async () => {
    try {
      setEmailVerificationPending(true);
      console.log(userForm.email)
      const response = await axiosInstance.post('/api/email/send-verification-email', {
        email: userForm.email,
      });
      if (response.status === 200) {
        alert('인증 코드가 이메일로 발송되었습니다.');
      }
    } catch (error) {
      alert('이메일 인증 요청 중 오류가 발생했습니다.');
    } finally {
      setEmailVerificationPending(false);
    }
  };

  const verifyCode = async () => {
    try {
      const response = await axiosInstance.post('/api/email/verify-code', {
        email: userForm.email,
        code: inputCode,
      });
      if (response.status === 200) {
        setEmailVerified(true);
        alert('이메일 인증이 완료되었습니다.');
      } else {
        alert('인증 코드가 올바르지 않습니다.');
      }
    } catch (error) {
      alert('인증 코드 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    try {
      const response = await axiosInstance.post('/signup', userForm);
      if (response.status === 200) {
        alert('회원가입 완료');
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data);
      } else {
        console.error('An error occurred:', error);
      }
    }
  };

  return (
    <Container>
      <div className="user-body">
        <div className="signup-container">
          <h2>회원가입</h2>
          <form onSubmit={handleSubmit}>
            {/* 입력 필드 */}
            <div className="form-group">
              <label className='user_label' htmlFor="username">아이디:</label>
              <input
                className='user_input'
                type="text"
                id="username"
                name="username"
                value={userForm.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className='user_label' htmlFor="password">비밀번호:</label>
              <input
                className='user_input'
                type="password"
                id="password"
                name="password"
                value={userForm.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className='user_label' htmlFor="email">이메일:</label>
              <input
                className='user_input'
                type="email"
                id="email"
                name="email"
                value={userForm.email}
                onChange={handleChange}
                required
              />
              
            </div>
            <button
              className='user_button'
              type="button"
              onClick={handleEmailVerification}
              disabled={emailVerificationPending || emailVerified}
            >
              {emailVerificationPending ? '발송 중...' : '인증 코드 발송'}
            </button>
            <div className="form-group">
              <label className='user_label' htmlFor="verification">인증 코드:</label>
              <input
                className='user_input'
                type="text"
                id="verification"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
              />
            </div>
            <button
              className='user_button'
              type="button"
              onClick={verifyCode}
              disabled={emailVerified}
            >
              인증하기
            </button>
            {/* 추가 필드 */}
            <div className="form-group">
              <label className='user_label' htmlFor="name">이름:</label>
              <input
                className='user_input'
                type="text"
                id="name"
                name="name"
                value={userForm.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className='user_label' htmlFor="tel">비상 연락처:</label>
              <input
                className='user_input'
                type="tel"
                id="tel"
                name="tel"
                value={userForm.tel}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="user_label">외국인 여부:</label>
              <div className='chk-box'>
              <input
                className='forign_check'
                type="checkbox"
                name="foreignYN"
                checked={userForm.foreignYN}
                onChange={handleChange}
              />
              </div>
            </div>
            <button className='user_button' type="submit">회원가입</button>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Signup;
