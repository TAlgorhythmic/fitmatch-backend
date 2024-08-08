import { useState, useEffect, useRef } from 'react';
import SwipeCard from './SwipeCard'; 
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
        const data = res.data;
        if (data.length) {
          setPersona(data);
          setCurrentIndex(data.length - 1);
        } else {
          console.log('No data found:', data);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    }

    getUsers();

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      swipeCard('right');
    } else if (e.key === 'ArrowLeft') {
      swipeCard('left');
    }
  };

  const swipeCard = async (direction) => {
    const currentUser = persona[currentIndex];
    if (!currentUser) return;

    // Llama al endpoint basado en la dirección del swipe
    if (direction === 'right') {
      await handleAccept(currentUser.id);
    } else {
      await handleReject(currentUser.id);
    }

    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const handleAccept = async (otherId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/friends/accept/${otherId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      const res = await response.json();
      console.log(res)
      if (res.ok) {
        console.log(`User ${otherId} accepted!`);
      } else {
        console.error(`Failed to accept user ${otherId}:`, res.error);
      }
    } catch (error) {
      console.error('Error accepting user:', error);
    }
  };

  const handleReject = async (otherId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/friends/reject/${otherId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      const res = await response.json();
      console.log(res)
      if (res.ok) {
        console.log(`User ${otherId} rejected!`);
      } else {
        console.error(`Failed to reject user ${otherId}:`, res.error);
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  return (
    <div className="swipe-container" ref={swipeContainerRef} tabIndex="0">
      {persona.map((p, index) => (
        <SwipeCard
          key={p.id}
          person={p}
          index={index}
          currentIndex={currentIndex}
          onSwipe={swipeCard}
        />
      ))}
    </div>
  );
};

export default MakeFriends;





