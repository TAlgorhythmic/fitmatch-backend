import { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import './MakeFriends.css'; // Importa el archivo CSS
import { NO_PERMISSION, OK } from '../../Utils/StatusCodes';
import { Navigate } from 'react-router-dom';
import { showPopup } from '../../Utils/Utils';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const MakeFriends = () => {
  const [persona, setPersona] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tokenValid, setTokenValid] = useState(true);
  const swipeContainerRef = useRef(null);

  async function getUsers() {
    try {
      const response = await fetch('http://localhost:3001/api/users/connect', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      const res = await response.json();

      if (res.status === OK) {  // Corregido: 'OK' debería ser una cadena
        const data = res.data;
        setPersona([...persona, ...data]);
      } else if (res.status === NO_PERMISSION) {  
        setTokenValid(false);
      } else {
        showPopup("Error", res.error, true);
      }

    } catch (error) {
      console.log('Error al obtener los usuarios:', error);
    }
  }

  useEffect(() => {
    requestMoreIfNeeded();
  }, [currentIndex]);
  
  console.log(persona);

  async function requestMoreIfNeeded() {
    if (!persona.length || currentIndex >= persona.length - 3) {
      getUsers();
    }
  }

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
    setCurrentIndex((prevIndex) => (prevIndex + 1));
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true // Esto permite que el swipe funcione también con el mouse
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        handleSwipe('left');
      } else if (event.key === 'ArrowRight') {
        handleSwipe('right');
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, persona]); // Asegúrate de actualizar los índices y personas
  
  if (!tokenValid) {
    showPopup("No permission", "Tu sesión ha expirado. Debes iniciar sesión.", false);
    return <Navigate to="/login" />;
  }
  return (
    <div className="contenedor-deslizar-perfiles" ref={swipeContainerRef} tabIndex="0" style={{ position: 'relative' }}>
      {persona.length > 0 && persona.map((person, index) => (
        <div
          key={person.id}
          {...handlers}
          className={index === currentIndex ? 'perfil-activo contenedor-perfil' : 'perfil-inactivo contenedor-perfil'}
          style={{ display: index === currentIndex ? 'block' : 'none' }}
        >
          <div className="tarjeta-perfil">
            <div className="cabecera-perfil">
              <h3 className="nombre-perfil">{person.name} {person.lastname}</h3>
              <p className="nivel-perfil"><strong>Nivel:</strong> {person.proficiency}</p>
            </div>
            <div className="contenido-perfil">
              <div className="informacion-horarios">
                <h5>Mi horario</h5>
                <div className="dias-horarios">
                  <div className="dias-semana">
                    {person.monday ? (
                      <span className="etiqueta-preferencia me-2 mb-2">Lunes</span>
                    ) : <> </>}
                    {person.tuesday ? (
                      <span className="etiqueta-preferencia me-2 mb-2">Martes</span>
                    ) : <> </>}
                    {person.wednesday ? (
                      <span className="etiqueta-preferencia me-2 mb-2">Miércoles</span>
                    ) : <></>}
                    {person.thursday ? (
                      <span className="etiqueta-preferencia me-2 mb-2">Jueves</span>
                    ) : <></>}
                    {person.friday ?(
                      <span className="etiqueta-preferencia me-2 mb-2">Viernes</span>
                    ) : <></>}
                    {person.saturday ? (
                      <span className="etiqueta-preferencia me-2 mb-2">Sábado</span>
                    ) : <></>}
                    {person.sunday ? (
                      <span className="etiqueta-preferencia me-2 mb-2">Domingo</span>
                    ) : <></>}
                  </div>
                  <div className="horarios-gimnasio">
                    <p><strong>Entrada:</strong> {person.timetable1}</p>
                    <p><strong>Salida:</strong> {person.timetable2}</p>
                  </div>
                </div>
              </div>
              <img
                draggable="false"
                src={`http://localhost:3001/uploads/${person.img}`}
                alt={person.name}
                className="imagen-perfil-derecha"
              />
            </div>
            <div className="informacion-perfil">
              <p className="preferencias-perfil">
                {person.trainingPreferences?.map((preference, index) => (
                  <span key={index} className="etiqueta-preferencia me-2 mb-2">
                    {preference}
                  </span>
                )) || []}
              </p>
              <p className="descripcion-perfil">{person.description}</p>
            </div>
          </div>
        </div>
      ))}
      <div className="flecha-contenedor flecha-izquierda">
        <button className="boton-flecha" onClick={() => handleSwipe('left')} title="Desliza a la izquierda">
          <FaArrowLeft />
        </button>
        <p className="texto-flecha">Anterior</p>
      </div>
      <div className="flecha-contenedor flecha-derecha">
        <button className="boton-flecha" onClick={() => handleSwipe('right')} title="Desliza a la derecha">
          <FaArrowRight />
        </button>
        <p className="texto-flecha">Siguiente</p>
      </div>
    </div>
  );  
};  

export default MakeFriends;

