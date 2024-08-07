import Header from './components/Header/Header.jsx';
import { Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';
import SubHeader from './components/Header/SubHeader.jsx';
import 'react-time-picker/dist/TimePicker.css';

function App() {

  return (
    <div className="contenedorPrincipal">
      <Container>
        <Header />
        <SubHeader />
        <div className="mainContent">
          <Outlet />
        </div>
      </Container>
    </div>
  );
}

export default App;
