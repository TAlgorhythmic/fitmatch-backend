import { Navbar, Nav, NavDropdown, Row, Col, Container } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { ArrowRight, HandThumbsUp, PeopleFill } from 'react-bootstrap-icons';

function BarraLateral() {

    return (
        <>
            <div className="barraLateral">
                <PeopleFill size={32} />
                <HandThumbsUp size={32} />
                <ArrowRight size={32} />
            </div>
        </>
    )
}

export default BarraLateral;