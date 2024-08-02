import Header from './components/Header.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function App() {
  const [isValidToken, setIsValidToken] = useState(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch('/api/validate-token', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setIsValidToken(data.valid);
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
  }, [token]);

  if (isValidToken === null) {
    // Renderizar un indicador de carga mientras se valida el token
    return <div>Loading...</div>;
  }

  if (isValidToken === false) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="contenedorPrincipal">
        <Header />
        <Outlet />
      </div>
    </>
  );
}

export default App;
