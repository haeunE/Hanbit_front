import { Button, Container, Dropdown, Form, Modal, Nav, Navbar, NavDropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./Header.css";
import { useDispatch, useSelector } from "react-redux";
import { SetIsMode } from "../../redux/modeState";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { logout } from "../../redux/userState";
import { clearAllStorage } from "../../utils/clearAllStorage";


function Header() {
  const isMode = useSelector(state => state.isMode);
  const dispatch = useDispatch();
  const isPath = useLocation();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const {isAuth} = useSelector((state) => state.auth);
  const jwt = localStorage.getItem('jwt')

  // 모드 변경 및 localStorage 저장
  const changeMode = () => {
    const savedMode = !isMode;  // savedMode에 상태 업데이트
    dispatch(SetIsMode(savedMode));
    localStorage.setItem("isMode", JSON.stringify(savedMode));  // localStorage에 저장
  };

  // 페이지 로드 시 localStorage에서 모드 불러오기
  useEffect(() => {
    const savedMode = JSON.parse(localStorage.getItem("isMode"));
    if (savedMode !== null) {
      dispatch(SetIsMode(savedMode));  // 저장된 모드 상태 불러오기
    }
  }, [dispatch]);
  

  // 툴팁 렌더링 함수
  const renderTooltip = (message) => (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {message}
    </Tooltip>
  );

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
  

  return (
    <div className={`Header ${isMode ? 'day' : 'night'}`}>
      <div className="Nav">
        <Navbar collapseOnSelect expand="lg">
          <Container>
            <Navbar.Brand href="/home">
              <img src={isMode ? "/img/logo/hanbit_day_logo.PNG" : "/img/logo/hanbit_night_logo.PNG"} width='120' height='50' alt="logo"/>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="">{isMode ? 'DAY SEOUL' : 'NIGHT SEOUL'}</Nav.Link>
                <NavDropdown title="편의시설" id="navbarScrollingDropdown">
                  <NavDropdown.Item className={`custom-dropdown-item ${isMode ? 'day' : 'night'}`} href="#action3">
                    <i className="fa-solid fa-store"></i>
                    &nbsp;&nbsp;&nbsp;편의시설 
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item className={`custom-dropdown-item ${isMode ? 'day' : 'night'}`} href="#action5">
                    <i className="fa-solid fa-ban"></i>
                    &nbsp;&nbsp;&nbsp;위험지역 
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="음식지도" id="navbarScrollingDropdown">
                  <NavDropdown.Item className={`custom-dropdown-item ${isMode ? 'day' : 'night'}`} href="#action3">
                    <i class="fa-solid fa-bowl-food"></i>
                    &nbsp;&nbsp;&nbsp;음식지도
                  </NavDropdown.Item>
                  <NavDropdown.Item className={`custom-dropdown-item ${isMode ? 'day' : 'night'}`} href="#action4">
                    <i class="fa-solid fa-motorcycle"></i>
                    &nbsp;&nbsp;&nbsp;배달의 나라 
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="교통" id="navbarScrollingDropdown">
                  <NavDropdown.Item className={`custom-dropdown-item ${isMode ? 'day' : 'night'}`} href="#action3">
                    <i class="fa-solid fa-map-pin"></i>
                    &nbsp;&nbsp;&nbsp;길찾기
                  </NavDropdown.Item>
                  <NavDropdown.Item className={`custom-dropdown-item ${isMode ? 'day' : 'night'}`} href="#action4">
                    <i class="fa-solid fa-bus"></i>
                    &nbsp;&nbsp;&nbsp;대중교통
                  </NavDropdown.Item>
                  <NavDropdown.Item className={`custom-dropdown-item ${isMode ? 'day' : 'night'}`} href="#action4">
                    <i class="fa-solid fa-person-biking"></i>
                    &nbsp;&nbsp;&nbsp;따릉이
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <Form className={`d-flex header-icons ${isMode ? 'day' : 'night'}`}>
                <Nav.Link as={Link} to="#" onClick={changeMode}>
                  <i className={`toggle-icon ${isMode ? 'fa-solid fa-toggle-on' : 'fa-solid fa-toggle-off'} me-2`} 
                    style={{ fontSize: '45px', color: isMode ? '#e9fef7' : '#f8496c'}}
                  ></i>
                </Nav.Link>
                <div className="gap"></div>

                {/* 툴팁이 있는 Nav.Link들 */}
                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip("도움말")}>
                  <Nav.Link as={Link} to="/tip" onClick={(e) => e.stopPropagation()}>
                    <i className="fa-solid fa-info me-2"></i>
                  </Nav.Link>
                </OverlayTrigger>

                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip("검색")}>
                  <Nav.Link as={Link} to="/search" onClick={(e) => e.stopPropagation()}>
                    <i className="fa-solid fa-magnifying-glass me-2"></i>
                  </Nav.Link>
                </OverlayTrigger>

                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip("언어 설정")}>
                  <Nav.Link as={Link} to="/lanuage" onClick={(e) => e.stopPropagation()}>
                    <i className="fa-solid fa-globe me-2"></i>
                  </Nav.Link>
                </OverlayTrigger>

                <div className="user-icon-dropdown-container" autoComplete="off">
                  {/* 사용자 아이콘 클릭 시 드롭다운 메뉴 */}
                  <Nav.Link as={Link} to="#" onClick={handleUserIconClick}>
                    <i className="fa-solid fa-user me-2"></i>
                  </Nav.Link>

                  {/* 드롭다운 메뉴 */}
                  {showDropdown && isAuth && (
                    <Dropdown.Menu align="end" className="user_dropdown" show>
                      <Dropdown.Item onClick={() => setShowPasswordModal(true)}>회원정보수정</Dropdown.Item>
                      <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
                    </Dropdown.Menu>
                  )}

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
              </Form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </div>
  );
}

export default Header;
