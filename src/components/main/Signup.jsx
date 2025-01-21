import React, { useState } from 'react';
import './User.css';
import axiosInstance from '../../axiosInstance';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Signup = () => {
  const { t } = useTranslation();
  const [userForm, setSignupForm] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    tel: '',
    foreignYN: false,
  });

  const navigate = useNavigate();
  const [emailVerified, setEmailVerified] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [emailVerificationPending, setEmailVerificationPending] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
        alert(t('signup.email_verification_sent'));
      }
    } catch (error) {
      alert(t('signup.email_verification_error'));
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
        alert(t('signup.email_verified'));
      } else {
        alert(t('signup.verification_error'));
      }
    } catch (error) {
      alert(t('signup.verification_error'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userForm.password && userForm.password !== confirmPassword) {
      setPasswordError(t('signup.password_mismatch'));
      return;
    }
    setPasswordError('');

    if (!emailVerified) {
      alert(t('signup.email_verification_pending'));
      return;
    }

    try {
      const response = await axiosInstance.post('/signup', userForm);
      if (response.status === 200) {
        alert(t('signup.signup_success'));
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        alert(t('signup.server_error', { status: error.response.status, message: error.response.data.message }));
      } else if (error.request) {
        alert(t('signup.network_error'));
      } else {
        alert(t('signup.signup_error'));
      }
    }
  };

  return (
    <Container>
      <div className="user-body">
        <div className="signup-container">
          <h2>{t('signup.signup_button')}</h2>
          <form onSubmit={handleSubmit}>
            {/* 입력 필드 */}
            <div className="form-group">
              <label className='user_label' htmlFor="username">{t('signup.username')}:</label>
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
              <label className='user_label' htmlFor="password">{t('signup.password')}:</label>
              <input
                className='user_input'
                type="password"
                id="password"
                name="password"
                value={userForm.password}
                onChange={handleChange}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                required
              />
            </div>
            <div className="form-group">
              <label className="user_label" htmlFor="confirmPassword">{t('signup.confirmPassword')}:</label>
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
              <label className='user_label' htmlFor="email">{t('signup.email')}:</label>
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
              {emailVerificationPending ? t('signup.email_verification_in_progress') : t('signup.email_verification_button')}
            </button>
            <div className="form-group">
              <label className='user_label' htmlFor="verification">{t('signup.verification')}:</label>
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
              {t('signup.verify_code_button')}
            </button>
            {/* 추가 필드 */}
            <div className="form-group">
              <label className='user_label' htmlFor="name">{t('signup.name')}:</label>
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
              <label className='user_label' htmlFor="tel">{t('signup.tel')}:</label>
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
              <label className="chk-label">{t('signup.foreignYN')} </label>
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
            {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
            <button className='user_button' type="submit">{t('signup.signup_button')}</button>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Signup;
