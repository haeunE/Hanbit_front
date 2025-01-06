import React, { useState, useEffect } from 'react';
import './User.css';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';
import axiosInstance from '../../axiosInstance';

function UserProfile() {
  // redux에서 auth 상태 가져오기
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    tel: '',
    foreignYN: false,
    password: '',
    name: '',
    email: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 컴포넌트가 처음 렌더링될 때 redux에서 가져온 사용자 정보로 초기화
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        tel: user.tel || '',
        foreignYN: user.foreignYN || false,
        password: '',
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);  // user가 변경될 때마다 실행

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleTelChange = (e) => {
    const { value } = e.target;
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    setFormData({
      ...formData,
      tel: sanitizedValue,
    });
  };

  const handleUpdate = async () => {
    // 비밀번호 확인
    if (formData.password && formData.password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setPasswordError('');

    // 변경된 데이터만 추출
    const updatedData = {};
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (formData.password) updatedData.password = formData.password; // 비밀번호 변경된 경우
    if (formData.tel !== user.tel) updatedData.tel = formData.tel; // 연락처 변경된 경우
    if (formData.foreignYN !== user.foreignYN) updatedData.foreignYN = formData.foreignYN; // 외국인 여부 변경된 경우
    console.log(updatedData)
    try {
      // 서버에 업데이트 요청 보내기 (필요한 필드만 포함)
      const response = await axiosInstance.put('/updateUser', updatedData);

      if (response.status === 200) {
        alert('회원 정보가 수정되었습니다.');
        sessionStorage.setItem('user', JSON.stringify({ ...user, ...updatedData }));
      }
    } catch (error) {
      console.error('회원 정보 수정 실패:', error);
      alert('회원 정보 수정 실패');
    }
  };

  const handleDelete = () => {
    console.log('User deleted');
    alert('회원 탈퇴가 완료되었습니다.');
  };

  return (
    <Container>
      <div className="user-body">
        <div className="signup-container">
          <h2>회원 정보 수정</h2>
          <div className="form-group">
            <label className="user_label" htmlFor="username">아이디:</label>
            <input
              className="user_input"
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="form-group">
            <label className="user_label" htmlFor="password">새 비밀번호:</label>
            <input
              className="user_input"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="user_label" htmlFor="confirmPassword">비밀번호<br />확인:</label>
            <input
              className="user_input"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="user_label" htmlFor="email">이메일:</label>
            <input
              className="user_input"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="form-group">
            <label className="user_label" htmlFor="name">이름:</label>
            <input
              className="user_input"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="form-group">
            <label className="user_label" htmlFor="tel">비상 연락처:</label>
            <input
              className="user_input"
              type="tel"
              id="tel"
              name="tel"
              value={formData.tel}
              onChange={handleTelChange}
            />
          </div>
          <div className="form-group">
            <label className="user_label">외국인 여부:</label>
            <div className="chk-box">
              <input
                className="forign_check"
                type="checkbox"
                name="foreignYN"
                checked={formData.foreignYN}
                onChange={handleChange}
              />
            </div>
          </div>

          {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}

          <button className="user_button" onClick={handleUpdate}>회원 수정</button>
          <button className="user_button" onClick={handleDelete} style={{ backgroundColor: '#ff4d4d' }}>
            회원 탈퇴
          </button>
        </div>
      </div>
    </Container>
  );
}

export default UserProfile;
