import React, { useState, useEffect, useRef } from 'react';
import './mf.css'; // Archivo CSS para los estilos

const MakeFriends = () => {
  const [persona, setPersona] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRefs = useRef([]);
  const swipeContainerRef = useRef(null);

  useEffect(() => {
    // Llama al endpoint /connect para obtener los usuarios
    async function getUsers() {
      try {
        const response = await fetch('http://localhost:3001/api/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if(data.status===0){
          console.log('todo bien')
        }else{
          console.log('todo mal')
        }

        if (data.length) {
          setPersona(data);
          setCurrentIndex(data.length - 1);
          cardRefs.current = Array(data.length).fill(0).map(() => React.createRef());
        } else {
          console.log('No data found:', data);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    }

    getUsers();

    // Agrega event listener para teclas
    window.addEventListener('keydown', handleKeyDown);

    // Elimina el listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Manejo del evento de teclado
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      swipeCard('right');
    } else if (e.key === 'ArrowLeft') {
      swipeCard('left');
    }
  };

  const swipeCard = (direction) => {
    const card = cardRefs.current[currentIndex].current;

    if (!card) return;

    card.style.transition = 'transform 0.2s ease-out';
    card.style.transform = `translateX(${direction === 'right' ? 1000 : -1000}px)`;

    setTimeout(() => {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      card.style.transition = '';
      card.style.transform = '';
    }, 200);
  };

  // Manejo del evento de swipe con mouse o touch
  const handleMouseDown = (e, index) => {
    const card = cardRefs.current[index].current;
    let startX = e.clientX || e.touches[0].clientX;
    let shiftX = 0;

    const handleMouseMove = (e) => {
      let currentX = e.clientX || e.touches[0].clientX;
      shiftX = currentX - startX;
      card.style.transform = `translateX(${shiftX}px)`; // Eliminamos la rotación
    };

    const handleMouseUp = () => {
      if (Math.abs(shiftX) > 100) {
        swipeCard(shiftX > 0 ? 'right' : 'left');
      } else {
        // Snap back
        card.style.transition = 'transform 0.2s ease-out';
        card.style.transform = 'translateX(0px)';
      }

      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);
  };

  return (
    <div
      className="swipe-container"
      ref={swipeContainerRef}
      tabIndex="0" // Permite que el contenedor reciba el foco
    >
      {persona.map((p, index) => (
        index === currentIndex && (
          <div
            key={p.id}
            ref={cardRefs.current[index]}
            className="tarjeta"
            onMouseDown={(e) => handleMouseDown(e, index)}
            onTouchStart={(e) => handleMouseDown(e, index)}
          >
            <img src={`http://localhost:3001/uploads/${p.img}`} alt={p.name} />
            <div className="user-info">
              <h2>{p.name} {p.lastname}</h2>
              <p>{p.city}</p>
              <p><strong>Proficiency:</strong> {p.proficiency}</p>
              <p><strong>Preferences:</strong> {p.trainingPreferences}</p>
              <p>{p.description}</p>
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default MakeFriends;






