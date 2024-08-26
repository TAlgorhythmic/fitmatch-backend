import React, { useState } from 'react';
import UserProfile from './UserProfile'; // Importa el componente UserProfile
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';

const SideSheet = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setIsOpen(open);
  };

  return (
    <>
      <Button variant="contained" onClick={toggleDrawer(true)}>
        Open User Profile
      </Button>
      
      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
        <div
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          style={{ width: '300px', padding: '16px' }}
        >
          <h3>User Profile</h3>
          <UserProfile />  {/* Inserta aquí el componente UserProfile */}
        </div>
      </Drawer>
    </>
  );
};

export default SideSheet;

