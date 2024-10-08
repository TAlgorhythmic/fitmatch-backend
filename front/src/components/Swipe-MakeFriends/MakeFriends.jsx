import { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import './MakeFriends.css'; // Importa el archivo CSS
import { NO_PERMISSION, OK } from '../../Utils/StatusCodes';
import { Navigate } from 'react-router-dom';
import { showPopup } from '../../Utils/Utils';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { InfoCircle } from 'react-bootstrap-icons';

const MakeFriends = () => {
  const [persona, setPersona] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tokenValid, setTokenValid] = useState(true);
  const swipeContainerRef = useRef(null);
  
  const chunkArray = (arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  };

  const daysOfWeek = [
    { label: "L", day: "monday"},
    { label: "M", day: "tuesday"},
    { label: "M", day: "wednesday"},
    { label: "J", day: "thursday"},
    { label: "V", day: "friday"},
    { label: "S", day: "saturday"},
    { label: "D", day: "sunday"}
  ];
  
  
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
            {/* Cabecera con el nombre, nivel e icono */}
            <div className="cabecera-perfil">
              <h3 className="nombre-perfil">{person.name} {person.lastname}</h3>
              <InfoCircle className="icono-info" title="Información sobre el nivel" />
            </div>
  
            {/* Imagen del perfil */}
            <div className="imagen-centro">
              <img
                draggable="false"
                src={`http://localhost:3001/uploads/${person.img}`}
                alt={person.name}
                className="imagen-perfil-central"
              />
            </div>
  
            {/* Nivel debajo de la imagen */}
            <div className="nivel-contenedor-horizontal">
  <span className="nivel-texto">Level:</span>
  <span className="nivel-valor">Principiante</span>
</div>

            {/* Días de la semana */}
        <div className="dias-semana">
      {daysOfWeek.map((day, index) => (
        <span
          key={index}
          className={`etiqueta-preferencia-semana me-2 mb-2 ${
            person[day.day] ? "dia-seleccionado" : ""
          }`}
        >
          {day.label}
        </span>
      ))}
    </div>
  
            {/* Horarios debajo de los días */}
            <div className="horarios-gimnasio"><p className="horarios">
    <strong>Horario habitual:</strong> <span className="hora-uno">{person.timetable1}</span>-<span className="hora-dos">{person.timetable2}</span>
    </p></div>
    <div className="informacion-perfil">
  {person.trainingPreferences && person.trainingPreferences.length > 0 ? (
    chunkArray(person.trainingPreferences.filter(preference => preference.trim() !== ""), 4).map((group, groupIndex) => (
      <div
        key={groupIndex}
        className={`fila-preferencias ${group.length < 4 ? 'fila-centrada' : ''}`}
      >
        {group.map((preference, index) => (
          <span key={index} className="etiqueta-preferencia me-2 mb-2 entrenamiento">
            {preference}
          </span>
        ))}
      </div>
    ))
  ) : (
    <p>No training preferences available.</p>  // Mensaje opcional si no hay preferencias
  )}

  {/* Descripción debajo de las preferencias */}
  <p className="descripcion-perfil">{person.description}</p>
</div>


          </div>
        </div>
      ))}
      {/* Flechas de navegación */}
      <div className="flecha-contenedor flecha-izquierda">
        <button className="boton-flecha" onClick={() => handleSwipe('left')} title="Desliza a la izquierda">
          <FaArrowLeft  size={60} color="white" />
        </button>
        <p className="texto-flecha">Rechazar</p>
      </div>
      <div className="flecha-contenedor flecha-derecha">
        <button className="boton-flecha" onClick={() => handleSwipe('right')} title="Desliza a la derecha">
          <FaArrowRight   size={60} color="white"/>
        </button>
        <p className="texto-flecha">Aceptar</p>
      </div>
    </div>
  );
};
export default MakeFriends;

