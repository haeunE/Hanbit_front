import React, { useState } from 'react';
import './User.css';
import { Container } from 'react-bootstrap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <Container>
      <div className="user-body">
        <div className="login-container">
          <h2 className='user_h2'>로그인</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className='user_label' htmlFor="email">이메일:</label>
              <input
                className='user_input'
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              />
            </div>
            <button className='user_button' type="submit">로그인</button>
            <div className="signup-link">
              <a href="/signup">회원가입</a>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Login;