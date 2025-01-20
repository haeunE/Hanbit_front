import { Button, Container, Dropdown, Form, Modal, Nav, Navbar, NavDropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./Header.css";
import { useDispatch, useSelector } from "react-redux";
import { SetIsMode } from "../../redux/modeState";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { logout } from "../../redux/userState";
import SearchModal from "../jsx/SearchModal";
import { SetLanguage } from "../../redux/languageState";
import { useTranslation } from "react-i18next";
import "@/locales/i18n";
import i18n from 'i18next';  // i18n을 import
import { clearAllStorage } from "../../utils/clearAllStorage";


function Header() {
  const { t } = useTranslation();
  const isMode = useSelector(state => state.isMode);
  const dispatch = useDispatch();
  const isPath = useLocation();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const {isAuth} = useSelector((state) => state.auth);
  const jwt = localStorage.getItem('jwt')

  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);  // 초기값 false로 설정
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // 페이지 로드 시 localStorage에서 모드 불러오기
  useEffect(() => {
    const savedLanguage = localStorage.getItem("lang");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      dispatch(SetLanguage(savedLanguage));
    }
  }, [dispatch]); // isMode와 isPath.pathname 추가
  
  useEffect(() => {
    const savedMode = JSON.parse(localStorage.getItem("isMode"));
    if (savedMode !== null) dispatch(SetIsMode(savedMode));
    if (location.pathname === "/daySeoul" && isMode === false) {
      navigate("/nightSeoul");
    } else if (location.pathname === "/nightSeoul" && isMode === true) {
      navigate("/daySeoul");
    }
  }, [isMode, location.pathname]); // `isPath` 대신 `location` 사용
  
  
  const changeMode = () => {
    const newMode = !isMode;
    dispatch(SetIsMode(newMode));
    localStorage.setItem("isMode", JSON.stringify(newMode));
  
  };
  

  // Intro 페이지에서 헤더 숨기기
  if (isPath.pathname === '/') {
    return null; // '/' 경로에서는 헤더를 렌더링하지 않음
  }

  const handleUserIconClick = (e) => {
    e.stopPropagation();
    if (jwt) {
      setShowDropdown(!showDropdown); // 드롭다운 메뉴 토글
    } else {
      alert("로그인이 필요합니다.");
      window.location.href = "/login"; // 로그인 페이지로 이동
    }
  };

  const handleMyReviews = () =>{
    navigate("/myreviews");
  }

  const handlePasswordSubmit = async () => {
    try {
      // 비밀번호를 객체로 전달 (JSON 형식)
      const response = await axiosInstance.post('/usercheck', {
        password : password
      });
  
      if (response.status === 200) {
        alert("비밀번호 확인 성공!");
        setShowPasswordModal(false);
        navigate("/userprofile");
      } else {
        console.error('비밀번호 확인 실패:', response.status);
        alert('인증에 실패했습니다.');
      }
    } catch (error) {
      console.error('오류 발생:', error);
      alert('오류가 발생했습니다. 다시 시도하세요.');
    }
  }

  const handleLogout = () => {
    dispatch(logout());
    // 로컬 스토리지 및 세션 스토리지, 쿠키 초기화
    clearAllStorage();
    setShowPasswordModal(false);
    alert("로그아웃 되었습니다.");
    window.location.href = "/home"; // 로그인 페이지로 리다이렉트
  };

  const navDropdownItems = (items) =>
    items.map((item, index) => (
      <NavDropdown.Item key={index} className={`custom-dropdown-item ${isMode ? "day" : "night"}`} href={item.href}>
        <i className={`fa-solid ${item.icon}`}></i>
        &nbsp;&nbsp;&nbsp;{item.label}
      </NavDropdown.Item>
    ));

  const renderTooltip = (message) => (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {message}
    </Tooltip>
  );

  // 언어 설정 변경
  const changeLanguage = (lang) => {
    dispatch(SetLanguage(lang)); // Redux 상태 업데이트
    i18n.changeLanguage(lang); // i18n 언어 변경
    localStorage.setItem('lang', lang);
  };
  
  // 검색 모달 열기/닫기
  const toggleSearchModal = () => {
    setShowSearchModal(!showSearchModal);
  };

  // 검색어 처리 함수
  const handleSearch = (searchQuery) => {
    console.log("검색어:", searchQuery);
    // 여기서 API 호출 등 실제 검색 작업을 수행할 수 있습니다.
    // 예: searchResults(searchQuery);
  };

  return (
    <div className={`Header ${isMode ? "day" : "night"}`}>
      <Navbar collapseOnSelect expand="lg">
        <Container>
          <Navbar.Brand href="/home">
            <img
              src={isMode ? "/img/logo/hanbit_day_logo.PNG" : "/img/logo/hanbit_night_logo.PNG"}
              width="120"
              height="50"
              alt="logo"
              className="nav-img"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href={isMode ? "/daySeoul" : "/nightSeoul"}>
                {isMode ? t("header.day-seoul") : t("header.night-seoul")}
              </Nav.Link>
              <NavDropdown title={t("header.amenities")} id="navbarScrollingDropdown">
                {navDropdownItems([
                  { icon: "fa-store", label: t("header.amenities"), href: "/amenities" },
                  { icon: "fa-ban", label: t("header.danger-area"), href: "#action5" },
                ])}
              </NavDropdown>
              <NavDropdown title={t("header.food-map")} id="navbarScrollingDropdown">
                {navDropdownItems([
                  { icon: "fa-bowl-food", label: t("header.food-map"), href: "#action3" },
                  { icon: "fa-motorcycle", label: t("header.delivery"), href: "#action4" },
                ])}
              </NavDropdown>
              <NavDropdown title={t("header.traffic")} id="navbarScrollingDropdown">
                {navDropdownItems([
                  { icon: "fa-map-pin", label: t("header.directions"), href: "/directions" },
                  { icon: "fa-bus", label: t("header.public-transportation"), href: "#action4" },
                  { icon: "fa-person-biking", label: t("header.Ddareungi"), href: "/bicycle" },
                ])}
              </NavDropdown>
            </Nav>

              <Form className={`d-flex header-icons ${isMode ? 'day' : 'night'}`}>
                <Nav.Link as={Link} to="#" onClick={changeMode}>
                  <i className={`toggle-icon ${isMode ? 'fa-solid fa-toggle-on' : 'fa-solid fa-toggle-off'} me-2`} 
                    style={{ fontSize: '45px', color: isMode ? '#e9fef7' : '#f8496c'}}
                  ></i>
                </Nav.Link>
                <div className="gap"></div>

                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip((t`header.help`))}>
                  <Nav.Link as={Link} to="/tip" onClick={(e) => e.stopPropagation()}>
                    <i className="fa-solid fa-info me-2"></i>
                  </Nav.Link>
                </OverlayTrigger>

                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip((t`header.exchangeRate`))}>
                  <Nav.Link as={Link} to="/exchageRate" onClick={(e) => e.stopPropagation()}>
                    <i className="fa-solid fa-calculator"></i>
                  </Nav.Link>
                </OverlayTrigger>

                {/* 언어 설정 아이콘 */}
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip((t`header.language-settings`))}>
                  <Nav.Link as={Link} to="#" onClick={(e) => {
                    e.preventDefault(); // 기본 링크 동작 방지
                    setShowLanguageDropdown(!showLanguageDropdown); // 드롭다운 토글
                  }}>
                    <i className="fa-solid fa-globe me-2"></i>
                  </Nav.Link>
                </OverlayTrigger>
              
                {/* 언어 설정 드롭다운 */}
                {showLanguageDropdown && (
                <NavDropdown align="end" className="language-dropdown" show>
                  <NavDropdown.Item onClick={() => {changeLanguage("ko"); setShowLanguageDropdown(!showLanguageDropdown);}}>한국어</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => {changeLanguage("en"); setShowLanguageDropdown(!showLanguageDropdown);}}>English</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => {changeLanguage("zh"); setShowLanguageDropdown(!showLanguageDropdown);}}>中文</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => {changeLanguage("ja"); setShowLanguageDropdown(!showLanguageDropdown);}}>日本語</NavDropdown.Item>
                </NavDropdown>
                )}

                {/* 검색 설정 아이콘 */}
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip((t`header.search`))}>
                  <Nav.Link as={Link} to="/search" onClick={(e) => {
                    e.preventDefault();
                    toggleSearchModal(); // 모달 토글
                  }}>
                    <i className="fa-solid fa-magnifying-glass me-2"></i>
                  </Nav.Link>
                </OverlayTrigger>
              
                {/* SearchModal이 화면에 보이도록 설정 */}
                <SearchModal show={showSearchModal} handleClose={toggleSearchModal} handleSearch={handleSearch} />

                {/* 사용자 아이콘 클릭 시 드롭다운 메뉴 */}
                <div className="user-icon-dropdown-container" autoComplete="off">
                  <Nav.Link as={Link} to="#" onClick={handleUserIconClick}>
                    <i className="fa-solid fa-user me-2"></i>
                  </Nav.Link>

                  {/* 드롭다운 메뉴 */}
                  {showDropdown && isAuth && (
                    <Dropdown.Menu align="end" className="user_dropdown" show>
                      <Dropdown.Item onClick={handleMyReviews}>나의 리뷰</Dropdown.Item>
                      <Dropdown.Item onClick={() => setShowPasswordModal(true)}>회원정보수정</Dropdown.Item>
                      <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
                    </Dropdown.Menu>
                  )}
                </div>
              </Form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      

      {/* 비밀번호 확인 모달 */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} >
        <Modal.Header closeButton>
          <Modal.Title>비밀번호 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>비밀번호를 입력해주세요.</p>
          <input
            type="password"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            autoComplete="off"  // autocomplete 속성 추가
            autoCapitalize="none"  // 자동 대문자화 방지
            autoCorrect="off"  // 자동 수정 방지
            spellCheck="false"  // 맞춤법 검사 방지
            name="new-password-field"  // 유니크한 name 속성
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={handlePasswordSubmit}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Header;
