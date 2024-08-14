import Header from './components/Header/Header.jsx';

import { Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';
import 'react-time-picker/dist/TimePicker.css';
import '@mobiscroll/react-lite/dist/css/mobiscroll.min.css';
import { useState, useEffect } from 'react';
import PopupMessage from './Utils/PopupMessage.jsx';
import { setShowPopup } from './Utils/Utils.js';
import SubHeader from './components/Header/SubHeader.jsx';
import { useLocation } from 'react-router-dom'

function App() {

  const location = useLocation()

  const [showHome, setShowHome] = useState(false);

  const [popupState, setPopupState] = useState({
    isVisible: false,
    title: "",
    message: "",
    isError: false
  });

  setShowPopup(setPopupState);

  function onClose() {
    setPopupState({
      ...popupState,
      isVisible: false
    })
  }

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/create-activitie'
      || location.pathname === '/agenda' || location.pathname === '/own-activities'
    ) {
      setShowHome(true);
    }
  }, [location])


  return (
    <>
      <div className={"contenedorPrincipal " + (popupState.isVisible ? "darkened" : "")}>
        <Header />
        {
          showHome ? <SubHeader /> : <></>
        }
        <div className='mainContainer'>
          <div className="mainContent">
            <Outlet />
          </div>
        </div>
      </div>
      <PopupMessage isVisible={popupState.isVisible} title={popupState.title} message={popupState.message} isError={popupState.isError} onClose={onClose} />
    </>
  );
}

export default App;
