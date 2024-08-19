import { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import './MakeFriends.css'; // Importa el archivo CSS
import { NO_PERMISSION, OK } from '../../Utils/StatusCodes';
import { Navigate } from 'react-router-dom';
import { showPopup } from '../../Utils/Utils';

const MakeFriends = () => {
  const [persona, setPersona] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tokenValid, setTokenValid] = useState(true);
  const swipeContainerRef = useRef(null);

  useEffect(() => {
    async function getUsers() {
      try {
        const firstResponse = await fetch('http://localhost:3001/api/users/connect', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });
    
        const firstRes = await firstResponse.json();
    
        if (firstRes.status === OK) {
          const data = firstRes.data;
          setPersona(data);
          setCurrentIndex(data.length - 1);
    
          // Verifica la condición para iniciar la segunda petición
          if (data.length > 1) {
            console.log("La condición se cumple, iniciando segunda petición...");
            // Inicia la segunda petición automáticamente
            const secondResponse = await fetch('http://localhost:3001/api/users/connect', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
              }
            });
    
            const secondRes = await secondResponse.json();
    
            if (secondRes.status === OK) {
              console.log("Datos de la segunda petición:", secondRes.data);
              // Aquí puedes manejar los datos de la segunda petición
            } else {
              showPopup("Error", secondRes.error, true);
            }
          }
        } else if (firstRes.status === NO_PERMISSION) {
          setTokenValid(false);
        } else {
          showPopup("Error", firstRes.error, true);
        }
    
      } catch (error) {
        console.log('Error al obtener los usuarios:', error);
      }
    }
    
    getUsers();
  }, []);

  const handleSwipe = async (direction) => {
    if (direction === 'left') {
      const otherId = persona[currentIndex]?.id;
      if (otherId) {
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(`http://localhost:3001/api/requests/reject/${otherId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          const res = await response.json();

          if (res.status !== OK) {
            showPopup("Something went wrong.", res.error, true);
          }

        } catch (error) {
          console.error('Error during rejection request:', error);
        }
      }

    } else if (direction === 'right') {
      const otherId = persona[currentIndex]?.id;

      if (otherId) {
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(`http://localhost:3001/api/requests/send/${otherId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          const res = await response.json();

          if (res.status !== OK) {
            showPopup("Something went wrong.", res.error, true);
          }

        } catch (error) {
          console.error('Error during connection request:', error);
        }
      }
    }

    // Mueve al siguiente índice después de un swipe
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true // Esto permite que el swipe funcione también con el mouse
  });

  if (!tokenValid) {
    showPopup("No permission", "Tu sesión ha expirado. Debes iniciar sesión.", false);
    return <Navigate to="/login" />;
  }
  return (
    <div className="contenedor-deslizar-perfiles" ref={swipeContainerRef} tabIndex="0">
      {persona.length > 0 && persona.map((person, index) => (
        <div
          key={person.id}
          {...handlers}
          className={index === currentIndex ? 'perfil-activo contenedor-perfil' : 'perfil-inactivo contenedor-perfil'}
          style={{ display: index === currentIndex ? 'block' : 'none' }}
        >
          <div className="tarjeta-perfil">
            <div className="cabecera-perfil">
              <h2 className="nombre-perfil">{person.name}</h2>
              <p className="nivel-perfil"><strong>Nivel:</strong> {person.proficiency}</p>
            </div>
            <div className="contenido-perfil">
              <img
                draggable="false"
                src={`http://localhost:3001/uploads/${person.img}`}
                alt={person.name}
                className="imagen-perfil"
              />
              <div className="informacion-perfil">
                <p className="preferencias-perfil">{person.trainingPreferences}</p>
                <p className="descripcion-perfil">{person.description}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );  
};  

export default MakeFriends;
