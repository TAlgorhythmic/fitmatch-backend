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
import SubHeader from './components/Header/SubHeader.jsx';
import { useLocation } from 'react-router-dom';
import AuthController from "./controllers/AuthController.js";
import SideSheet from './Sidesheet.jsx';

export let setToken;
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
  const [isValidToken, setIsValidToken] = useState(null);
  const [updateUser, setUpdate] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  setUpdateUser = setUpdate;
  setToken = setIsValidToken;
  const token = localStorage.getItem('authToken');
  const AuthControl = new AuthController(token);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await AuthControl.validateToken();

        // Verifica si la respuesta es JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setIsValidToken(data.status === OK ? true : false);
        } else {
          console.error('Expected JSON, but got:', contentType);
          setIsValidToken(false);
        }
      } catch (error) {
        console.error('Error validating token', error);
        setIsValidToken(false);
      }
    };

    if (token) {
      validateToken();
    } else {
      setIsValidToken(false);
    }
  }, []);

  const [showHome, setShowHome] = useState(false);

  useEffect(() => {
    if (isValidToken && (location.pathname === '/' || location.pathname === '/create-activity'
      || location.pathname === '/agenda' || location.pathname === '/own-activities'
    )) {
      setShowHome(true);
    }
  }, [isValidToken, location.pathname])

  useEffect(() => {
    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === "/formulario" || location.pathname === "/verify") {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  });

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

    if (isValidToken && updateUser) {
      getProfile();
      setUpdateUser(false);
    }
  }, [isValidToken, updateUser, token]);

  useEffect(() => {
    if (location.pathname === "/formulario" || location.pathname === "/login" || location.pathname === "/register" ) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
    if (isValidToken && user && !user.isSetup) {
      if (location.pathname !== "/formulario" && location.pathname !== "/register" && location.pathname !== "/login") {
        navigate("/formulario");
      }
    } else if (isValidToken && user && user.isSetup) {
      if (location.pathname === "/formulario") {
        navigate("/");
      }
    } else {
      if (!isValidToken && isValidToken !== null) {
        if (!token) {
          navigate("/register");
        } else {
          showPopup("No permission", "Tu sesión ha expirado.", false);
          navigate("/login");
        }
      }
    }
  }, [isValidToken, location.pathname, navigate, user]);

  return (
    <>
      <div className={"contenedorPrincipal " + (popupState.isVisible ? "darkened" : "")}>
        {
          showHeader ? <Header /> : <></>
        }
        {
          showHome ? <SubHeader /> : <></>
        }
         <SideSheet />
        <div className="mainContent">
          <Outlet />
        </div>
      </div>
      <PopupMessage isVisible={popupState.isVisible} title={popupState.title} message={popupState.message} isError={popupState.isError} onClose={onClose} />
    </>
  );
}

export default App;
