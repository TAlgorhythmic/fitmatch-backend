import { PersonFillAdd, PersonCircle, People } from 'react-bootstrap-icons';
import Notifications from '../Notifications/Notifications.jsx';
import { Dropdown } from 'react-bootstrap';
import './Header.css';
import { Link, useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();  // Inicializa useNavigate

    function logoutButtonOnClick() {
        localStorage.removeItem("authToken");
        navigate("/");  // Redirige al usuario a la página de inicio después de cerrar sesión
    }

    return (
        <>
            <nav className="customNavbar">
                <div 
                    onClick={() => navigate('/')} 
                    style={{ textDecoration: "none", cursor: "pointer" }}
                >
                    <img className='logo-img' src='./logo.png' alt="Fitmatch Logo" />
                    <span className='customTextLogo'>Fitmatch</span>
                </div>

                <div className='navbar-icons-middle'>
                    <button className='buttonMakeFriends'>
                        <span onClick={() => navigate('/friends')} className='makeFriends' style={{ position: 'relative', zIndex: 9 }}>
                            <PersonFillAdd size={32} color='#ff6600' style={{ position: 'relative', zIndex: 10 }}/>
                        </span>
                    </button>
                </div>

                <div className='navbar-icons-right'>
                    <span onClick={() => navigate('/friendsList')}>
                        <People size={32} color='#ff6600'  />
                    </span>
                    <Notifications />
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="link" id="dropdown-profile" className="text-decoration-none">
                            <PersonCircle size={32} color='#ff6600' />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => navigate('/userProfile')}>Ver Perfil</Dropdown.Item>
                            <Dropdown.Item onClick={logoutButtonOnClick}>Cerrar Sesión</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </nav>
        </>
    );
}

export default Header;
