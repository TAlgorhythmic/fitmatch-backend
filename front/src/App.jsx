import Header from './components/Header.jsx';
import { Outlet } from "react-router-dom";
import {Container} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <div className="contenedorPrincipal">
        <Container fluid="lg">
          <Header />
          <Outlet />
        </Container>
      </div>
    </>
  )
}

export default App;
