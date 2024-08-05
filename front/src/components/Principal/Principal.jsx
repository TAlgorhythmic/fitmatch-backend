import  { useState } from 'react';
import HeroSection from './HeroSection';
import AboutUs from './AboutUs';
import AppExplain from './AppExplain';
import Register from '../Register/Register';
import './Principal.css';

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
          <AppExplain />
        </>
      ) : (
        <Register />
      )}
    </div>
  );
};

export default Principal;