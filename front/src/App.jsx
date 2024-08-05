import Header from './components/Header.jsx';
import { Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function App() {

  return (
    <div className="contenedorPrincipal">
      <Container fluid="lg">
        <Header />
        <Outlet />
      </Container>
    </div>
  );
}

export default App;
