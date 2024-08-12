import { useState, useEffect, useRef } from 'react';
import mobiscroll from '@mobiscroll/react-lite';
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

        if (res.status != 0) {
         console.log('No hay user');
        }
        const data = res.data;
        console.log(data)
        setPersona(data);
        setCurrentIndex(data.length - 1);
        
      } catch (error) {
        console.log('hay un error')
      } 
    }

    getUsers();
  }, []);

  return (
    <div className="swipe-container" ref={swipeContainerRef} tabIndex="0">
      {persona.map((person, index) => (
        <mobiscroll.Card 
          key={person.id}
          className={index === currentIndex ? 'active' : 'inactive'}
          lang="es"
          theme="ios" 
          themeVariant="light"
        > 
          <mobiscroll.CardHeader>
            <mobiscroll.CardTitle>{person.name} {person.lastname}</mobiscroll.CardTitle>
            <mobiscroll.CardSubtitle>{person.city}</mobiscroll.CardSubtitle>
          </mobiscroll.CardHeader>
          <mobiscroll.CardContent>
            <img draggable="false" src={`http://localhost:3001/uploads/${person.img}`} alt={`${person.name}`} />
            <div className="card-Makefriends-info">
              <p><strong>Level:</strong> {person.proficiency}</p>
              <p><strong>Preferences:</strong> {person.trainingPreferences}</p>
              <p>{person.description}</p>
            </div>
          </mobiscroll.CardContent>
        </mobiscroll.Card>
      ))}
    </div>
  );
};

export default MakeFriends;





