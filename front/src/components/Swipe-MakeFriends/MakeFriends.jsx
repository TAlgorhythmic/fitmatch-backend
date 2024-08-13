import { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import './MakeFriends.css'; 

const MakeFriends = () => {
  const [persona, setPersona] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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

        if (res.status !== 0) {
          console.log('No hay usuarios disponibles');
          return;
        }
        
        const data = res.data;
        console.log(data);
        setPersona(data);
        setCurrentIndex(data.length - 1);
        
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

          if (res.status === 0) {
            console.log('Rejection sent successfully');
          } else {
            console.error('Error sending rejection:');
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

          if (res.status === 0) {
            console.log('se ha enviado');

          } else {
           console.log('todo mal');
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

  return (
    <div className="swipe-container" ref={swipeContainerRef} tabIndex="0">
      {persona.length > 0 && persona.map((person, index) => (
        <div key={person.id} {...handlers} className={index === currentIndex ? 'active' : 'inactive'} style={{display: index === currentIndex ? 'block' : 'none'}}>
          <div className="card">
            <div className="card-header">
              <h2>{person.name}</h2>
            </div>
            <div className="card-content">
              <img draggable="false"  src={`http://localhost:3001/uploads/${person.img}`} />
              <div className="card-Makefriends-info">
                <p><strong>Nivel:</strong> {person.proficiency}</p>
                <p>{person.trainingPreferences}</p>
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





