import React, { useEffect, useState } from 'react';
import './User.css';
import axiosInstance from '../../axiosInstance';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "@/locales/i18n";
import i18n from 'i18next'; 


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
  const [errors, setErrors] = useState({});

  // 페이지 로드 시 localStorage에서 모드 불러오기
  useEffect(() => {
    const savedLanguage = localStorage.getItem("lang");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n.language]);

  // 유효성 검사 함수
  const validate = (field, value) => {
    const validationRules = {
      username: /^[a-zA-Z0-9]{8,}$/,
      password: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/,
      name: /^[a-zA-Z]+$|^[가-힣]+$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      tel: /^\d{10,11}$/, // 전화번호는 10~11자리 숫자
    };
  
    const messages = {
      username: t('signup.username_error'),
      password: t('signup.password_error'),
      name: t('signup.name_error'),
      email: t('signup.email_error'),
      tel: t('signup.tel_error'),
    };
  
    if (!validationRules[field].test(value)) {
      return messages[field];
    }
    return '';
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === 'checkbox' ? checked : value;
  
    // 바로 유효성 검사 실행
    const errorMessage = validate(name, updatedValue);
  
    // 상태 업데이트
    setSignupForm((prevForm) => ({
      ...prevForm,
      [name]: updatedValue,
    }));
  
    // 에러 상태 업데이트
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
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
    const newErrors = {};
  
    // 전체 유효성 검사
    Object.keys(userForm).forEach((field) => {
      if (field === 'foreignYN') return;
      const errorMessage = validate(field, userForm[field]);
      if (errorMessage) {
        newErrors[field] = errorMessage;
      }
    });
  
    // 비밀번호 확인 검사
    if (userForm.password && userForm.password !== confirmPassword) {
      newErrors.confirmPassword = t('signup.password_mismatch');
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    if (!emailVerified) {
      alert(t('signup.email_verification_pending'));
      return;
    }
  
    try {
      const response = await axiosInstance.post('/signup', userForm);
      if (response.status === 200) {
        alert(t('signup.signup_success'));
        navigate('/login');
      }
    } catch (error) {
      if (error.response) {
        alert(t('signup.server_error', {
          status: error.response.status,
          message: error.response.data.message,
        }));
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
            {errors.username && <div className='signup-error' style={{ color: 'red', fontSize: '0.9em' }}>{errors.username}</div>}

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
            {errors.password && <div className='signup-error' style={{ color: 'red', fontSize: '0.9em' }}>{errors.password}</div>}

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
            {errors.confirmPassword && <div className='signup-error' style={{ color: 'red', fontSize: '0.9em' }}>{errors.confirmPassword}</div>}

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
            {errors.name && <div className='signup-error' style={{ color: 'red', fontSize: '0.9em' }}>{errors.name}</div>}

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
            {errors.tel && <div className='signup-error' style={{ color: 'red', fontSize: '0.9em' }}>{errors.tel}</div>}

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
