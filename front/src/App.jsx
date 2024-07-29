import Header from './components/Header.jsx'
import { Outlet } from "react-router-dom";
import { Container } from 'react-bootstrap';

function App() {

  return (
    <>
      <Container>
        <Header />
        <Outlet />
      </Container>
    </>
  )
}

export default App;
