import { useRef } from 'react';

const SwipeCard = ({ person, index, currentIndex, onSwipe }) => {
  const cardRef = useRef(null);

  const handleMouseDown = (e) => {
    const card = cardRef.current;
    let startX = e.clientX || e.touches[0].clientX;
    let shiftX = 0;

    const handleMouseMove = (e) => {
      let currentX = e.clientX || e.touches[0].clientX;
      shiftX = currentX - startX;
      card.style.transform = `translateX(${shiftX}px)`;
    };

    const handleMouseUp = () => {
      if (Math.abs(shiftX) > 100) {
        onSwipe(shiftX > 0 ? 'right' : 'left');
      } else {
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
      ref={cardRef}
      className="tarjeta"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      style={{ display: index === currentIndex ? 'block' : 'none' }}
    >
      <img src={`http://localhost:3001/uploads/${person.img}`} alt={person.name} />
      <div className="user-info">
        <h2>{person.name} {person.lastname}</h2>
        <p>{person.city}</p>
        <p><strong>Proficiency:</strong> {person.proficiency}</p>
        <p><strong>Preferences:</strong> {person.trainingPreferences}</p>
        <p>{person.description}</p>
      </div>
    </div>
  );
};

export default SwipeCard;
