import Header from './components/Header/Header.jsx';

import { Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';
import SubHeader from './components/Header/SubHeader.jsx';
import 'react-time-picker/dist/TimePicker.css';
import '@mobiscroll/react-lite/dist/css/mobiscroll.min.css';
import { useState } from 'react';
import PopupMessage from './Utils/PopupMessage.jsx';
import { setShowPopup } from './Utils/Utils.js';

function App() {

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

  return (
    <>
      <div className={"contenedorPrincipal " + (popupState.isVisible ? "darkened" : "")}>
        <Container>
          <Header />
          <SubHeader />
          <div className="mainContent">
            <Outlet />
          </div>
        </Container>
      </div>
      <PopupMessage isVisible={popupState.isVisible} title={popupState.title} message={popupState.message} isError={popupState.isError} onClose={onClose} />
    </>
  );
}

export default App;
