import { Button, Container, Form, Nav, Navbar, NavDropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./Header.css";
import { useDispatch, useSelector } from "react-redux";
import { SetIsMode } from "../../redux/modeState";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";


function Header() {
  const isMode = useSelector(state => state.isMode);
  const dispatch = useDispatch();

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

                <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip("사용자 정보")}>
                  <Nav.Link as={Link} to="/userinfo" onClick={(e) => e.stopPropagation()}>
                    <i className="fa-solid fa-user me-2"></i>
                  </Nav.Link>
                </OverlayTrigger>
              </Form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </div>
  );
}

export default Header;
