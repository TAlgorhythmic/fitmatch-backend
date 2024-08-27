import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, Button } from '@mui/material';
import { FaPlus, FaCalendarAlt, FaList } from 'react-icons/fa';
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
    <div style={{ display: 'flex', position: "sticky", top: "0"}}>
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
            paddingTop: '5%',
            paddingBottom: '5%',
          },
        }}
      >
        <List>
        <ListItem button onClick={() => navigate('/create-activity')}>
            <ListItemIcon style={{ color: '#fff', justifyContent: 'center', paddingRight: '60%', marginBottom: '10%'}}>
              <FaPlus size={24} />
            </ListItemIcon>
          </ListItem>
          <ListItem button onClick={toggleDrawer(true, <Agenda />)}>
            <ListItemIcon style={{ color: '#fff', justifyContent: 'center', paddingRight: '60%',marginBottom: '10%', backgroundColor: 'black'}}>
              <FaCalendarAlt size={24} />
            </ListItemIcon>
          </ListItem>
          <ListItem button onClick={toggleDrawer(true, <OwnActivities />)}>
            <ListItemIcon style={{ color: '#fff', justifyContent: 'center', paddingRight: '60%',marginBottom: '10%', backgroundColor: 'black'}}>
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
  //transparente, efecto blur
    role="presentation"
    onClick={toggleDrawer(false)}
    onKeyDown={toggleDrawer(false)}
    style={{ 
      width: '650px', 
      padding: '20px', 
      backgroundColor:'rgba(50, 50, 50, 1)', // Fondo 100% transparente
      backdropFilter: 'blur(10px)',
      textAlign: 'center',
      height: '100%'  // Asegura que el fondo cubra toda la altura del Drawer
    }}
  >
    <div style={{ 
       backgroundColor: 'transparent', // Fondo 100% transparente
       backdropFilter: 'blur(10px)', 

       padding: '15px', 
       borderBottom: '2px solid #FF6A00'  // Puedes ajustar el color del borde según tu preferencia
    }}>
      <h2 style={{ 
        margin: 0, 
        color: '#FFF' // Ajusta el color del texto del título
      }}>
        Mi agenda
      </h2>
    </div>
    <div style={{ 
      marginTop: '20px'  // Espacio entre el título y los componentes
    }}>
      {drawerContent} {/* Aquí se renderiza el componente dinámico */}
    </div>
  </div>
</Drawer>
      <div style={{ marginLeft: '20px', padding: '5px', width: '100%', height:'100%' }}>
        {selectedComponent} {/* Muestra el componente seleccionado o la Home si ninguno está seleccionado */}
      </div>
    </div>
    
  );
};

export default SideSheet;
