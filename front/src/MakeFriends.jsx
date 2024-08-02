import React, { useState, useEffect, useRef } from 'react';
import './mf.css'; // Archivo CSS para los estilos
import BaseController from './controllers/BaseController';


const MakeFriends = () => {
  const [persona, setPersona] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRefs = useRef([]);
  const tableName = "users";
  const UsersController = new BaseController(tableName);

  useEffect(() => {
    async function getUsers() {
      const data = await UsersController.getAll();
      if (data.length) {
        setPersona(data);
        setCurrentIndex(data.length - 1); // Inicia en la última tarjeta
        cardRefs.current = Array(data.length).fill(0).map(() => React.createRef());
      } else {
        console.log('No data found:', data);
      }
    }
    getUsers();
  }, []);

  // Manejo del evento de swipe
  const handleMouseDown = (e, index) => {
    const card = cardRefs.current[index].current;
    let startX = e.clientX || e.touches[0].clientX;
    let shiftX;

    const handleMouseMove = (e) => {
      let currentX = e.clientX || e.touches[0].clientX;
      shiftX = currentX - startX;
      card.style.transform = `translateX(${shiftX}px) rotate(${shiftX / 10}deg)`;
    };

    const handleMouseUp = () => {
      if (Math.abs(shiftX) > 100) {
        // Swipe out card
        card.style.transition = 'transform 0.2s ease-out';
        card.style.transform = `translateX(${shiftX > 0 ? 1000 : -1000}px) rotate(${shiftX / 10}deg)`;
        setTimeout(() => {
          setCurrentIndex((prevIndex) => prevIndex - 1);
          card.style.transition = '';
          card.style.transform = '';
        }, 200);
      } else {
        // Snap back
        card.style.transition = 'transform 0.2s ease-out';
        card.style.transform = 'translateX(0px) rotate(0deg)';
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
    <div className="swipe-container">
      {persona.map((p, index) => (
        index === currentIndex && (
          <div
            key={p.id}
            ref={cardRefs.current[index]}
            className="tarjeta"
            style={{ backgroundImage: `url(http://localhost:3001/uploads/${p.img})` }}
            onMouseDown={(e) => handleMouseDown(e, index)}
            onTouchStart={(e) => handleMouseDown(e, index)}
          >
            <h3>{p.name}</h3>
          </div>
        )
      ))}
    </div>
  );
};

export default MakeFriends;


