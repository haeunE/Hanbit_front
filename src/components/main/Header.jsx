import { Button, Container, Form, Modal, Nav, Navbar, NavDropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./Header.css";
import { useDispatch, useSelector } from "react-redux";
import { SetIsMode } from "../../redux/modeState";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// localstorage에 Mode저장 해두기 => 사용자 컴퓨터에 저장됨

function Header() {
  const isMode = useSelector(state => state.isMode);
  const dispatch = useDispatch();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const token = localStorage.getItem("token"); // 토큰 가져오기
  const navigate = useNavigate();

  const changeMode = () => {
    dispatch(SetIsMode(!isMode));
  };

  // 툴팁 렌더링 함수
  const renderTooltip = (message) => (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {message}
    </Tooltip>
  );
  const handleUserIconClick = (e) => {
    e.stopPropagation();

    if (token) {
      // 토큰이 있을 경우 비밀번호 확인 팝업 열기
      setShowPasswordModal(true);
    } else {
      // 토큰이 없으면 알림 후 로그인 페이지로 이동
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
    }
  };

  const handlePasswordSubmit = () => {
    // 비밀번호 확인 로직 (예: API 요청)
    if (password === "examplePassword") {
      alert("비밀번호 확인 성공!");
      setShowPasswordModal(false);
      navigate("/userprofile"); // 사용자 정보 페이지로 이동
    } else {
      alert("비밀번호가 틀렸습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className={`Header ${isMode ? 'day' : 'night'}`}>
      <div className="Nav">
        <Navbar collapseOnSelect expand="lg">
          <Container>
            <Navbar.Brand href="/">
              <img src={isMode ? "/img/hanbit_day_logo.PNG" : "/img/hanbit_night_logo.PNG"} width='120' height='50' alt="logo"/>
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
                <Nav.Link as={Link} to={isMode ? "/day" : "/night"} onClick={changeMode}>
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

                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip("사용자 정보")}
                >
                  <Nav.Link as={Link} to="#" onClick={handleUserIconClick}>
                    <i className="fa-solid fa-user me-2"></i>
                  </Nav.Link>
                </OverlayTrigger>

                {/* 비밀번호 확인 모달 */}
                <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>비밀번호 확인</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>비밀번호를 입력해주세요.</p>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호"
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
              </Form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </div>
  );
}

export default Header;
