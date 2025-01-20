import React, { useState, useEffect } from 'react';
import './User.css';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { updateUser, logout } from "../../redux/userState";
import { useTranslation } from 'react-i18next';

function UserProfile() {
  const { t } = useTranslation(); // i18next hook 사용
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
    if (formData.password && formData.password !== confirmPassword) {
      setPasswordError(t('profile.passwordError'));
      return;
    }
    setPasswordError('');
    const updatedData = {};
    if (formData.password) updatedData.password = formData.password;
    if (formData.tel !== user.tel) updatedData.tel = formData.tel;
    if (formData.foreignYN !== user.foreignYN) updatedData.foreignYN = formData.foreignYN;

    try {
      const response = await axiosInstance.put('/updateUser', updatedData);
      if (response.status === 200) {
        alert(t('profile.updateSuccess'));
        dispatch(updateUser(updatedData));
        navigate("/home");
      }
    } catch (error) {
      console.error('회원 정보 수정 실패:', error);
      alert(t('profile.updateFailure'));
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.post("/deleteUser");
      if (response.status === 200) {
        alert(t('profile.deleteSuccess'));
        dispatch(logout());
        navigate("/");
      } else {
        alert(t('profile.deleteFailure'));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(t('profile.deleteError'));
    } finally {
      setShowConfirmModal(false);
    }
  };

  return (
    <Container>
      <div className="user-body">
        <div className="signup-container">
          <h2>{t('profile.updateButton')}</h2>
          <div className="form-group">
            <label className="user_label" htmlFor="username">{t('profile.username')}:</label>
            <input
              className="user_input"
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>
          <div className="form-group">
            <label className="user_label" htmlFor="password">{t('profile.password')}:</label>
            <input
              className="user_input"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>
          <div className="form-group">
            <label className="user_label" htmlFor="confirmPassword">{t('profile.confirmPassword')}:</label>
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
            <label className="user_label" htmlFor="email">{t('profile.email')}:</label>
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
            <label className="user_label" htmlFor="name">{t('profile.name')}:</label>
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
            <label className="user_label" htmlFor="tel">{t('profile.tel')}:</label>
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
            <label className="chk-label">{t('profile.foreignYN')}</label>
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

          <button className="user_button" onClick={handleUpdate}>{t('profile.updateButton')}</button>
          <div>
            <button
              className="user_button"
              onClick={() => setShowConfirmModal(true)}
              style={{ backgroundColor: "#ff4d4d" }}
            >
              {t('profile.deleteButton')}
            </button>

            {showConfirmModal && (
              <div className="modal show d-block" tabIndex="-1">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">{t('profile.confirmModal.title')}</h5>
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => setShowConfirmModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <p>{t('profile.confirmModal.message')}</p>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowConfirmModal(false)}
                      >
                        {t('profile.confirmModal.cancelButton')}
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handleDelete}
                      >
                        {t('profile.confirmModal.confirmButton')}
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
