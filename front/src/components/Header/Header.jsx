import { PersonFillAdd, PersonCircle } from 'react-bootstrap-icons';
import Notifications from '../Notifications/Notifications.jsx';
import './Header.css';

function Header() {

    /*
    <NavDropdown title="" id="basic-nav-dropdown" className='customNavDropdown'>
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>


    <Navbar expand="lg" style={{ background: 'red' }} className="customNavbar bg-body-tertiary fixed-top">
                <Container>
                    <Navbar.Brand href="/" className="customBrand">Fitmatch</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end'>
                        <Nav className="customNav ms-auto ">
                            <Link to="/friends"><PeopleFill size={32} /></Link>
                            <Notifications />
                            <Link to="/user/profile"><PersonCircle size={32} /></Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
    */

    return (
        <>
            <nav className="customNavbar">
                <a href="/" style={{"textDecoration": "none"}}>
                    <img className='logo-img' src='./LogoFitMatch.jpg'/><span className='customTextLogo'>Fitmatch</span>
                </a>

                <div className='navbar-icons-middle'>
                    <button className='buttonMakeFriends'>
                        <a href="/friends" className='makeFriends'>
                            <span>
                                <PersonFillAdd size={32} color='#ff6600' />
                            </span>
                        </a>
                    </button>
                </div>

                <div className='navbar-icons-right'>
                    <Notifications />
                    <a href="/user/profile">
                        <PersonCircle size={32} color='#ff6600' />
                    </a>
                </div>
            </nav>
        </>
    );
}

export default Header;