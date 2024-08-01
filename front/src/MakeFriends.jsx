import React, { useState, useEffect, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import './mf.css'
import BaseController from './controllers/BaseController';


const MakeFriends = () => {
  const [persona, setPersona] = useState([]);
  const [currentIndex, setCurrentIndex] = useState([]);
  const tableName = "users";
  const childRefs = useRef([]);
  const UsersController = new BaseController(tableName);



  useEffect(() => {
    async function getUsers() {
      const data = await UsersController.getAll();
      if (data.length) {
        setPersona(data);
        childRefs.current = Array(data.length).fill(0).map(() => React.createRef());
        setCurrentIndex(data.length - 1);
      } else {
        console.log('No data found:', data);
      }
    }
    getUsers();
  }, []);

  const swipe = async (dir) => {
    if (currentIndex >= 0 && currentIndex < persona.length) {
      await childRefs.current[currentIndex].current.swipe(dir); // Disparar el swipe programáticamente
      setCurrentIndex(currentIndex - 1); // Actualizar el índice al siguiente (anterior en la lista)
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'ArrowRight') {
      swipe('right');
    } else if (event.key === 'ArrowLeft') {
      swipe('left');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [persona]);

  return (
    <div className="TargetasUser">
      <div className="TargetasUser_contenedor">
        {persona.map((p) => (
          <TinderCard
            className="swipe"
            key={p.id}
            preventSwipe={['up', 'down']} //swipe no permitido para arriba-abajo
          >
            <div
<<<<<<< HEAD
              className="tarjeta" //lo que se ve
              style={{ backgroundImage: `url(${p.img})` }}
=======
              className="tarjeta"
              style={{ backgroundImage: `url(http://localhost:3001/uploads/${p.img})` }}
>>>>>>> 1c61d83b054f66ba057cb8099fc9fe07cb3ca195
            >
              <h2>{p.name}</h2>

            </div>
          </TinderCard>

        ))}
      </div>
    </div>
  );
}


export default MakeFriends;