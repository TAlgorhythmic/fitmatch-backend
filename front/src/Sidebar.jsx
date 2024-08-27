import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, Button } from '@mui/material';
import { FaPlus, FaCalendarAlt, FaList } from 'react-icons/fa';
import CreateActivity from './CreateActivity';
import OwnActivities from './OwnActivities';
import { useNavigate } from 'react-router-dom'; 
import Home from './Home';
import Agenda from './Agenda';
import './SideBar.css';

const SideSheet = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState();
  const [drawerContent, setDrawerContent] = useState(null);

  const toggleDrawer = (open, component = null) => () => {
    setIsOpen(open);
    setDrawerContent(component);
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        anchor="left"
        variant="permanent"
        open
        sx={{
          '& .MuiDrawer-paper': {
            width: '5%',
            boxSizing: 'border-box',
            backgroundColor: '#000',
            color: '#fff',
            height: '100%',
            marginTop: '10%',
         
          },
        }}
      >
        <List>
        <ListItem button onClick={() => navigate('/create-activity')}>
            <ListItemIcon style={{ color: '#fff', justifyContent: 'center' }}>
              <FaPlus size={24} />
            </ListItemIcon>
          </ListItem>
          <ListItem button onClick={toggleDrawer(true, <Agenda />)}>
            <ListItemIcon style={{ color: '#fff', justifyContent: 'center' }}>
              <FaCalendarAlt size={24} />
            </ListItemIcon>
          </ListItem>
          <ListItem button onClick={toggleDrawer(true, <OwnActivities />)}>
            <ListItemIcon style={{ color: '#fff', justifyContent: 'center' }}>
              <FaList size={24} />
            </ListItemIcon>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <div style={{ marginLeft: '5px', padding: '5px', width: '100%',height:'100%' }}>
       
        {/* Aquí puedes tener un contenido por defecto o dinámico */}
      </div>

      {/* Drawer para mostrar contenido dinámico */}
      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
        <div
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          style={{ width: '630px', padding: '10px' }}
        >
          {drawerContent} {/* Aquí se renderiza el componente dinámico */}
        </div>
      </Drawer>
      <div style={{ marginLeft: '20px', padding: '5px', width: '100%', height:'100%' }}>
        {selectedComponent} {/* Muestra el componente seleccionado o la Home si ninguno está seleccionado */}
      </div>
    </div>
    
  );
};

export default SideSheet;
