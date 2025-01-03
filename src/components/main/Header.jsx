import { Button, Container, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import "./Header.css";
import { useDispatch, useSelector } from "react-redux";
import { SetIsMode } from "../../redux/modeState";

function Header(){

  const isMode = useSelector(state => state.isMode)
  const dispatch = useDispatch();

  const changeMode=()=>{
    dispatch(SetIsMode(!isMode));
  }

  return(
    <div className={`Header ${isMode ? 'day' : 'night'}`}>
      <div className="Nav">
        <Navbar expand="lg" className={`custom-navbar ${isMode ? 'day' : 'night'}`}>
          <Container fluid>
            {isMode? <Navbar.Brand href="/"><img src="/img/hanbit_day_logo.PNG" width='120' height='50'/></Navbar.Brand>:
            <Navbar.Brand href="/"><img src="/img/hanbit_night_logo.PNG" width='120' height='50'/></Navbar.Brand>
            }
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll
              >
              <Nav.Link href="">{isMode?'DAY SEOUL':'NIGHT SEOUL'}</Nav.Link>
                <NavDropdown title="편의시설" id="navbarScrollingDropdown">
                  <NavDropdown.Item className={`custom-dropdown-item ${isMode ? 'day' : 'night'}`} href="#action3">
                    편의시설 
                    <i class="fa-solid fa-store"></i>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item className={`custom-dropdown-item ${isMode ? 'day' : 'night'}`} href="#action5">
                    위험지역 
                    <i class="fa-solid fa-ban"></i>
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="음식지도" id="navbarScrollingDropdown">
                  <NavDropdown.Item className={`custom-dropdown-item ${isMode ? 'day' : 'night'}`} href="#action3">
                    음식
                    <i class="fa-solid fa-map"></i>
                  </NavDropdown.Item>
                  <NavDropdown.Item className={`custom-dropdown-item ${isMode ? 'day' : 'night'}`} href="#action4">
                    배달의 
                    <i class="fa-solid fa-chess-king"></i>
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="교통" id="navbarScrollingDropdown">
                  <NavDropdown.Item className={`custom-dropdown-item ${isMode ? 'day' : 'night'}`} href="#action3">
                    경로찾기
                  </NavDropdown.Item>
                  <NavDropdown.Item className={`custom-dropdown-item ${isMode ? 'day' : 'night'}`} href="#action4">
                    대중교통
                  </NavDropdown.Item>
                  <NavDropdown.Item className={`custom-dropdown-item ${isMode ? 'day' : 'night'}`} href="#action4">
                    따릉이
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <Form className={`d-flex header-icons ${isMode ? 'day' : 'night'}`}>
                <Nav.Link href="" onClick={changeMode}> 
                  {/* MODE변경 */}
                  <i className={`fa-solid fa-toggle-on me-2 ${isMode ? 'fa-flip-horizontal' : ''}`} 
                    style={{ fontSize: '45px', color: isMode ? '#FF6600' : '#0047AB' }}
                  ></i>
                </Nav.Link>
                <Nav.Link href="/tip">
                  <i class="fa-solid fa-info me-2"></i>
                </Nav.Link>
                <Nav.Link href="/search">                  
                  <i class="fa-solid fa-magnifying-glass me-2"></i>
                </Nav.Link>
                <Nav.Link href="/lanuage">
                  <i class="fa-solid fa-globe me-2"></i>
                </Nav.Link>
                <Nav.Link href="/userinfo">  
                  <i class="fa-solid fa-user me-2"></i>
                </Nav.Link>
              </Form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </div>  
  );
}

export default Header;