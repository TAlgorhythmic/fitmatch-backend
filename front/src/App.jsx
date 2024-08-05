import Header from './components/Header.jsx';
import { Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import  { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function App() {
  const [isValidToken, setIsValidToken] = useState(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/auth/validate-token', {  // Ruta completa aquí
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`  // Enviar el token en los headers
          }
        });

        // Verifica si la respuesta es JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setIsValidToken(data.valid);
        } else {
          console.error('Expected JSON, but got:', contentType);
          setIsValidToken(false);
        }
      } catch (error) {
        console.error('Error validating token', error);
        setIsValidToken(false);
      }
    };

    if (token) {
      validateToken();
    } else {
      setIsValidToken(false);
    }
  }, [token]);  // El token está en la lista de dependencias para que el efecto se ejecute cada vez que cambie el token

  if (isValidToken === null) {
    // Renderizar un indicador de carga mientras se valida el token
    return <div>Loading...</div>;
  }

  if (isValidToken === false) {
    return (
      <div className="contenedorPrincipal">
        <Header />
         {/* Redirige a la página de login si el token no es válido, <Navigate to="/" />  */}
        <Outlet />
      </div>
    );
  }

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
