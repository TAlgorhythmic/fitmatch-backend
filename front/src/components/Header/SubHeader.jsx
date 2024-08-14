import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import './Header.css';

function SubHeader() {
    const location = useLocation();
    const [actualRoute, setActualRoute] = useState('');
    const [hoveredLink, setHoveredLink] = useState(null);

    useEffect(() => {
        setActualRoute(location.pathname);
    }, [location]);

    return (
        <>
            <Navbar expand="lg" className="subHeaderCustom fix-on-top">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className='justify-content-center'>
                        <Nav>
                            <Link
                                className={`customNavLinkSubHeader ${actualRoute === '/create-activitie' && !hoveredLink ? 'active' : ''}`}
                                to="/create-activitie"
                                onMouseEnter={() => setHoveredLink('/create-activitie')}
                                onMouseLeave={() => setHoveredLink(null)}
                            >
                                Crear actividad
                            </Link>
                            <Link
                                className={`customNavLinkSubHeader ${actualRoute === '/' && !hoveredLink ? 'active' : ''}`}
                                to="/"
                                onMouseEnter={() => setHoveredLink('/')}
                                onMouseLeave={() => setHoveredLink(null)}
                            >
                                Nuevas actividades
                            </Link>
                            <Link
                                className={`customNavLinkSubHeader ${actualRoute === '/agenda' && !hoveredLink ? 'active' : ''}`}
                                to="/agenda"
                                onMouseEnter={() => setHoveredLink('/agenda')}
                                onMouseLeave={() => setHoveredLink(null)}
                            >
                                Agenda
                            </Link>
                            <Link
                                className={`customNavLinkSubHeader ${actualRoute === '/own-activities' && !hoveredLink ? 'active' : ''}`}
                                to="/own-activities"
                                onMouseEnter={() => setHoveredLink('/own-activities')}
                                onMouseLeave={() => setHoveredLink(null)}
                            >
                                Actividades propias
                            </Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default SubHeader;
