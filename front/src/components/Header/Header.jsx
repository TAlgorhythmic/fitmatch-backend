import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { PersonCircle, PeopleFill } from 'react-bootstrap-icons';
import Notifications from '../Notifications/Notifications.jsx';
import './Header.css';

function Header() {

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary customNavbar fixed-top">    
                <Container>
                    <Navbar.Brand href="/" className="customBrand">Fitmatch</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end'>
                        <Nav>
                            <Link to="/friends"><PeopleFill size={32} /></Link>
                            <Notifications />
                            <Link to="/user/profile"><PersonCircle size={32} /></Link>
                            <NavDropdown title="" id="basic-nav-dropdown" className='customNavDropdown'>
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;