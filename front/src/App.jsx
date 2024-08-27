import Header from './components/Header/Header.jsx';
import { OK } from '../../back-end/api/packets/StatusCodes.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet, useNavigate } from 'react-router-dom';
import 'react-time-picker/dist/TimePicker.css';
import '@mobiscroll/react-lite/dist/css/mobiscroll.min.css';
import 'react-step-progress-bar/styles.css';
import { useState, useEffect } from 'react';
import PopupMessage from './Utils/PopupMessage.jsx';
import { setShowPopup, showPopup } from './Utils/Utils.js';

import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

export let setUpdateUser;

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

  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [updateUser, setUpdate] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  setUpdateUser = setUpdate;
  const token = localStorage.getItem('authToken');

  const [showHome, setShowHome] = useState(false);
  const [sideBar, setSideBar] = useState(false);

  useEffect(() => {
    if (token && (location.pathname === '/' || location.pathname === '/create-activity'
      || location.pathname === '/agenda' || location.pathname === '/own-activities'
    )) {
      setShowHome(true);
     
    }
  }, [token, location.pathname]);

  useEffect(() => {
    async function getProfile() {
      fetch('http://localhost:3001/api/users/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => { return response.json() })
        .then(data => {
          if (data.status === OK) {
            setUser(data.data);

          } else {
            showPopup("Data is invalid", data.error, true);
          }
        })
        .catch(error => {
          console.log('Error loading user data:', error);
        });
    }

    if (token && updateUser) {
      getProfile();
      setUpdateUser(false);
    }
  }, [updateUser, token]);

  useEffect(() => {
    if (location.pathname === "/formulario" || location.pathname === "/login" || location.pathname === "/register" ) {
      setShowHeader(false);
      setSideBar(false);
    } else {
      setShowHeader(true);
      setSideBar(true);
      
      
      if (!token) navigate("/register");

    }
  }, [location.pathname, navigate, user]);

  return (
    <>
      <div className={"contenedorPrincipal " + (popupState.isVisible ? "darkened" : "")}>
        {
          showHeader ? <Header /> : <></>
        }
        <div className="mainContent">
          <Outlet />
        </div>
      </div>
      {
          sideBar ? <Sidebar /> : <></>
        }
      <PopupMessage isVisible={popupState.isVisible} title={popupState.title} message={popupState.message} isError={popupState.isError} onClose={onClose} />
    </>
  );
}

export default App;
