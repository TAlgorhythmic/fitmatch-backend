import React, { useState,useEffect  } from 'react';
import TinderCard from 'react-tinder-card'; // Asegúrate de importar TinderCard correctamente
import  './mf.css'
import BaseController from './controllers/BaseController';

const MakeFriends = () => {
  const [persona, setPersona] = useState([]);
  const tableName = "users";

    const UsersController = new BaseController(tableName);

    useEffect(() => {
        async function getUsers() {
            const data = await UsersController.getAll();
            if (data.length) {
              setPersona(data);
            } else {
                console.log('No data found:', data);
            }
        }
        getUsers();
    }, []);

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
              className="tarjeta" //lo que se ve
              style={{ backgroundImage: `url(${p.img})` }}
            >
              <h2>{p.name}</h2>

            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
};

export default MakeFriends;
