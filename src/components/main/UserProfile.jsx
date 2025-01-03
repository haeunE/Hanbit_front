import React, { useState } from 'react';
import './UserProfile.css'


function UserProfile() {
  const [formData, setFormData] = useState({
    tel: '',
    foreignYN: false,
    password: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleTelChange = (e) => {
    const { value } = e.target;
    // 숫자만 입력되도록 처리
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    setFormData({
      ...formData,
      tel: sanitizedValue,
    });
  };

  const handleTelKeyDown = (e) => {
    // 입력된 키가 숫자가 아니면 이벤트를 막음
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleUpdate = () => {
    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setPasswordError(''); // 에러 메시지 초기화

    // 사용자 정보 수정 API 호출 등의 작업을 여기서 처리
    console.log('Updated user info:', formData);
    alert('회원 정보가 수정되었습니다.');
  };

  const handleDelete = () => {
    // 회원 탈퇴 처리 API 호출 등의 작업을 여기서 처리
    console.log('User deleted');
    alert('회원 탈퇴가 완료되었습니다.');
  };

  return (
    <div className="signup-container">
      <h2>회원 정보 수정</h2>

      <div className="form-group">
        <label htmlFor="password">새 비밀번호:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="confirmPassword">비밀번호<br></br>확인:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>


      <div className="form-group">
        <label htmlFor="tel">비상 연락처:</label>
        <input
          type="tel"
          id="tel"
          name="tel"
          value={formData.tel}
          onChange={handleTelChange}
          required
        />
      </div>
      

      {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}

      <button onClick={handleUpdate}>회원 수정</button>
      <button onClick={handleDelete} style={{ backgroundColor: '#ff4d4d' }}>
        회원 탈퇴
      </button>
    </div>
  );
}

export default UserProfile;

