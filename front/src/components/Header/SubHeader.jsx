import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";
import './Header.css';

function SubHeader() {

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary subHeaderCustom fixed-top">
                <Container  >
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className='justify-content-center'>
                        <Nav>
                            <Link className="nav-link" to="/">Nuevas actividades</Link>
                            <Link className="nav-link" to="/">Agenda</Link>
                            <Link className="nav-link" to="/">Crear actividad</Link>
                            <Link className="nav-link" to="/">Actividades propias</Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default SubHeader;