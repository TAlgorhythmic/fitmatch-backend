import  { useState } from 'react';
import HeroSection from './HeroSection';
import AboutUs from './AboutUs';
import Programs from './Programs';
import Trainers from './Trainers';
import Amenities from './Amenities';
import ContactUs from './ContactUs';
import Register from '../Register/Register';
import './Home.css';

const Principal = () => {
  const [showLogin, setShowLogin] = useState(false);

  const handleGetStarted = () => {
    setShowLogin(true);
  };

  return (
    <div className="principal-container">
      {!showLogin ? (
        <>
          <HeroSection onGetStarted={handleGetStarted} />
          <AboutUs />
          <Programs />
          <Trainers />
          <Amenities />
          <ContactUs />
        </>
      ) : (
        <Register />
      )}
    </div>
  );
};

export default Principal;