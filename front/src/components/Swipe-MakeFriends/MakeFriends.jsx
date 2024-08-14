import { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import './MakeFriends.css';
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
        const response = await fetch('http://localhost:3001/api/users/connect', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });

        const res = await response.json();

        if (res.status === OK) {
          const data = res.data;
          setPersona(data);
          setCurrentIndex(data.length - 1);
        } else if (res.status === NO_PERMISSION) {
          setTokenValid(false);
        } else {
          showPopup("Error", res.error, true);
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
    return <Navigate to="/login" />
  }

  return (
    <div className="swipe-container" ref={swipeContainerRef} tabIndex="0">
      {persona.length > 0 && persona.map((person, index) => (
        <div key={person.id} {...handlers} className={index === currentIndex ? 'active' : 'inactive'} style={{ display: index === currentIndex ? 'block' : 'none' }}>
          <div className="card">
            <div className="card-header">
              <h2>{person.name} {person.lastname}</h2>
              <h4>{person.city}</h4>
            </div>
            <div className="card-content">
              <img draggable="false" src={`http://localhost:3001/uploads/${person.img}`} />
              <div className="card-Makefriends-info">
                <p><strong>Nivel:</strong> {person.proficiency}</p>
                <p><strong>Intereses:</strong> {person.trainingPreferences}</p>
                <p>{person.description}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MakeFriends;





