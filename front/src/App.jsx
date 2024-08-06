import Header from './components/Header/Header.jsx';
import { Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';
import SubHeader from './components/Header/SubHeader.jsx';

function App() {

  return (
    <div className="contenedorPrincipal">
      <Container fluid="lg">
        <Header />
        <SubHeader/>
        <Outlet />
      </Container>
    </div>
  );
}

export default App;
