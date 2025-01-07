import React, { useState, useEffect } from 'react';
import './User.css';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { updateUser, logout } from "../../redux/userState";

function UserProfile() {
  // redux에서 auth 상태 가져오기
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const dispatch = useDispatch();

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
  }, [user]);  
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
    console.log("user")
    console.log(user.tel)
    // 변경된 데이터만 추출
    const updatedData = {};
    
    if (formData.password) updatedData.password = formData.password; // 비밀번호 변경된 경우
    if (formData.tel !== user.tel) updatedData.tel = formData.tel; // 연락처 변경된 경우
    if (formData.foreignYN !== user.foreignYN) updatedData.foreignYN = formData.foreignYN; // 외국인 여부 변경된 경우
    try {
      // 서버에 업데이트 요청 보내기 (필요한 필드만 포함)
      const response = await axiosInstance.put('/updateUser', updatedData);
      if (response.status === 200) {
        alert('회원 정보가 수정되었습니다.');
        dispatch(updateUser(updatedData)); 
        navigate("/home");
      }
    } catch (error) {
      console.error('회원 정보 수정 실패:', error);
      alert('회원 정보 수정 실패');
    }
  };


  const handleDelete = async () => {
    try {
      // 서버에 DELETE 요청 보내기
      const response = await axiosInstance.post("/deleteUser");

      // 성공적으로 응답이 왔을 때
      if (response.status === 200) {
        console.log("User deleted");
        alert("휴면 계정으로 전환되었습니다. \n3일 안으로 로그인 하시면 회원님의 정보가 삭제되지 않습니다.");
        dispatch(logout())
        navigate("/"); 
      } else {
        // 에러 메시지가 있을 경우
        alert(`삭제 실패: ${response.data.message || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("삭제 요청 중 오류가 발생했습니다.");
    } finally {
      setShowConfirmModal(false); // 모달 닫기
    }
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
              autoComplete="off"  // autocomplete 속성 추가
              autoCapitalize="none"  // 자동 대문자화 방지
              autoCorrect="off"  // 자동 수정 방지
              spellCheck="false"  // 맞춤법 검사 방지
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
              autoComplete="off"  // autocomplete 속성 추가
              autoCapitalize="none"  // 자동 대문자화 방지
              autoCorrect="off"  // 자동 수정 방지
              spellCheck="false"  // 맞춤법 검사 방지
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
            <label className="chk-label">외국인이신가요? </label>
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
          <div>
            {/* 탈퇴 버튼 */}
            <button
              className="user_button"
              onClick={() => setShowConfirmModal(true)}
              style={{ backgroundColor: "#ff4d4d" }}
            >
              회원 탈퇴
            </button>

            {/* Bootstrap Confirm Modal */}
            {showConfirmModal && (
              <div className="modal show d-block" tabIndex="-1">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">확인</h5>
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => setShowConfirmModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <p>정말 탈퇴하시겠습니까? <br /> 휴면계정으로 전환되고 3일 뒤 회원님의 모든 정보가 삭제됩니다.</p>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowConfirmModal(false)}
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handleDelete}
                      >
                        확인
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default UserProfile;
