import { Button } from 'react-bootstrap';
import './HeroSection.css';

const HeroSection = ({ onGetStarted }) => {
  return (
    <div className="hero-section d-flex align-items-center justify-content-center">
      <div className="hero-content text-center text-white">
        <h1 className="display-4">Meet Your Gym Buddy</h1>
        <p className="lead">Connecting fitness enthusiasts around the world</p>
        <Button variant="primary" size="lg" onClick={onGetStarted}>
          GET STARTED
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
