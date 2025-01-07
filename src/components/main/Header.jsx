import { Button, Container, Form, Nav, Navbar, NavDropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./Header.css";
import { useDispatch, useSelector } from "react-redux";
import { SetIsMode } from "../../redux/modeState";
import { Link, useLocation } from "react-router-dom";

// localstorage에 Mode저장 해두기 => 사용자 컴퓨터에 저장됨

function Header() {
  const isMode = useSelector(state => state.isMode);
  const dispatch = useDispatch();
  const isPath = useLocation();

  const changeMode = () => {
    dispatch(SetIsMode(!isMode));
  };

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
  

  return (
    <div className={`Header ${isMode ? 'day' : 'night'}`}>
      <div className="Nav">
        <Navbar collapseOnSelect expand="lg">
          <Container>
            <Navbar.Brand href="/">
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
