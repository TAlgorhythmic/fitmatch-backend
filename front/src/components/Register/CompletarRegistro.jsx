import { useState, useEffect, useRef } from 'react';
import { Form, Button, Row, Col, Container, InputGroup } from 'react-bootstrap';
import { Camera, Person, Envelope, GeoAlt, Clock,Phone  } from 'react-bootstrap-icons';
import { useNavigate, Navigate } from 'react-router-dom';
import TimePicker from 'react-time-picker';
import './CompletarRegistro.css';
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { NO_PERMISSION, OK } from "./../../Utils/StatusCodes.js";
import { ProgressBar, Step } from 'react-step-progress-bar';
import Switch from 'react-switch';
import { showPopup } from '../../Utils/Utils.js';
import styled from 'styled-components';
import { setUpdateUser } from '../../App';

const libs = ["maps", "marker", "places"];

const FormContainer = styled(Container)`
  background-color: #1b1b1b;
  padding: 20px;
  border-radius: 8px;
  color: #fff;
  max-width: 680px;
  margin: auto;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.5);
  font-family: 'Roboto', sans-serif;
`;

const StyledButton = styled(Button)`
  background-color: ${(props) => props.bgColor || '#f0bb31'};
  border: none;
  color: ${(props) => props.textColor || '#000'};
  font-weight: bold;
  padding: 10px 10px;
  border-radius: 5px;
  margin-top: ${(props) => props.marginTop || '20px'};
  width: 30%;
  text-align: center;
  &:hover {
     background-color: ${(props) => props.hoverColor || '#f0a51e'} !important;
  }
`;

const PrivacyCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
  color: #fff;
`;

const PrivacyLabel = styled.h1`
  font-size: 12px;
  margin-left: 10px;
  font-family: 'Roboto', sans-serif;
`;

const StyledTitle = styled.div`
  font-size: ${(props) => props.fontSize || '24px'};
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

const StepIndicator = styled.div`
  color: #fff;
  background-color: ${(props) => (props.accomplished ? '#f0bb31' : '#333')};
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
`;
const RegisterForm = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: 'Spain',
    proficiency: 'Principiante',
    description: '',
    img: '',
    preferences: '',
    latitude: '',
    longitude: '',
    timetable1: '06:00',
    timetable2: '23:00',
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const isApiLoaded = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCtcO9aN0PUYJuxoL_kwckAAKUU5x1fUYc",
    libraries: libs
  }).isLoaded;

  const handleSwitchChange = (day, checked) => {
    setFormData((prevState) => ({
      ...prevState,
      [day]: checked,
    }));
  };
    
  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const ref = useRef(null)

  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [tokenValid, setTokenValid] = useState(true);

  const sportsInterests = [
    'Swimming', 'Cycling', 'Powerlifting', 'Yoga', 'Running',
    'CrossFit', 'Bodybuilding', 'Pilates', 'Boxing', 'HIIT',
    'Weightlifting', 'Cardio', 'Zumba', 'Spinning', 'Martial Arts'
  ];

  const [selectedInterests, setSelectedInterests] = useState(['']);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');

      const response = await fetch('http://localhost:3001/api/users/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const userData = await response.json();
      if (userData.status === OK) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          firstName: userData.data.name,
          email: userData.data.email,
        }));
      } else if (userData.status === NO_PERMISSION) {
        setTokenValid(false);
      } else {
        showPopup("Something went wrong", userData.error, true);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const phoneValue = value.replace(/\D/g, '');
      if (phoneValue.length <= 9) {
        setFormData({ ...formData, phone: phoneValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleTimeChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0] || null);
  };

  const handleInterestClick = (interest) => {
    let newSelectedInterests;
    if (selectedInterests.includes(interest)) {
      newSelectedInterests = selectedInterests.filter(i => i !== interest);
    } else {
      newSelectedInterests = [...selectedInterests, interest];
    }
    setSelectedInterests(newSelectedInterests);
    setFormData({ ...formData, preferences: newSelectedInterests.join(', ') });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (imageFile) {
      const formDataImage = new FormData();
      formDataImage.append('img', imageFile);

      const imageUploadResponse = await fetch('http://localhost:3001/api/users/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataImage,
      });

      const imageResult = await imageUploadResponse.json();

      if (imageResult.status === 0) {
        setFormData({ ...formData, img: imageResult.imageUrl });
      } else if (imageResult.status === NO_PERMISSION) {
        setTokenValid(false);
      } else {
        showPopup("Something went wrong", imageResult.error, true);
      }

    }

    console.log(formData); //pasar preferences otra vez a form data
    const response = await fetch('http://localhost:3001/api/users/setup', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(formData),
    });

    const result = await response.json();
    console.log(result);
    if (result.status === 0) {
      navigate('/');
      console.log('Usuario registrado con éxito');
      setUpdateUser(true);
    } else  {
      setTokenValid(false);
      showPopup("Something went wrong", result.error, true);
    } 
  };

  function onPlaceChanged() {
    if (ref.current.getPlace() && ref.current.getPlace().geometry)
    setFormData({
      ...formData,
      city: ref.current.getPlace().formatted_address,
      latitude: ref.current.getPlace().geometry.location.lat(),
      longitude: ref.current.getPlace().geometry.location.lng()
    })
  }

  if (!tokenValid) {
    showPopup("No permission", "Tu sesión ha expirado. Debes iniciar sesión.", false);
    return <Navigate to="/login" />
}
return (
  <FormContainer>
    <ProgressBar
      className="progress-bar"
      percent={(step / 2) * 100}
      filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
    >
      <Step transition="scale">
        {({ accomplished }) => <StepIndicator accomplished={accomplished}>1</StepIndicator>}
      </Step>
      <Step transition="scale">
        {({ accomplished }) => <StepIndicator accomplished={accomplished}>2</StepIndicator>}
      </Step>
      <Step transition="scale">
        {({ accomplished }) => <StepIndicator accomplished={accomplished}>3</StepIndicator>}
      </Step>
    </ProgressBar>

    <Form onSubmit={handleSubmit} encType="multipart/form-data">
      {step === 0 && (
        <div>
          <StyledTitle>Formulario de registro</StyledTitle>
          <StyledTitle fontSize="18px">Datos personales</StyledTitle>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <h1 className="nombre">Nombre</h1>
                <InputGroup>
                  <InputGroup.Text><Person /></InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    readOnly
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <h1 className="apellidos">Apellidos</h1>
                <InputGroup>
                  <InputGroup.Text><Person /></InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <h1 className="correo">Introduce tu mejor numero</h1>
                <InputGroup>
                  <InputGroup.Text><Phone /></InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="697415616"
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              {isApiLoaded ? (
                <Form.Group className="mb-3">
                  <h1 className="ubicacion">Selecciona la teva ubicació</h1>
                  <Autocomplete
                    onLoad={(a) => (ref.current = a)}
                    onPlaceChanged={() => onPlaceChanged()}
                  >
                    <InputGroup>
                      <InputGroup.Text><GeoAlt /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Barcelona"
                      />
                    </InputGroup>
                  </Autocomplete>
                </Form.Group>
              ) : null}
            </Col>
          </Row>
          <PrivacyCheckboxContainer>
            <input
              type="checkbox"
              id="politicaPrivacitat"
              name="politicaPrivacitat"
              required
            />
            <PrivacyLabel>He leído y acepto la Política de Privacidad</PrivacyLabel>
          </PrivacyCheckboxContainer>
          <StyledButton bgColor="#f0bb31" hoverColor="#f0a51e" onClick={handleNextStep}>
            Siguiente
          </StyledButton>
        </div>
      )}

      {step === 1 && (
        <div className="formulari-activitat-personalitzat">
          <div className="horari-entrenament">
            <Form.Group className="mb-3">
              <h1 className="actividad">Mi actividad</h1>
              <h1 className="horario-habitual">Horario habitual de entrenamiento</h1>
              <div className="contenidor-time-picker d-flex justify-content-between">
              <h1 className="entrada">Entrada:</h1>
                <InputGroup className="me-3 grup-time-picker">
                  <InputGroup.Text className="icona-time-picker">
                    <Clock />
                  </InputGroup.Text>
                  <TimePicker
                    onChange={(value) => handleTimeChange('timetable1', value)}
                    value={formData.timetable1}
                    disableClock={true}
                    format="HH:mm"
                    step={30}
                    className="input-time-picker"
                  />
                </InputGroup>
                <h1 className="entrada">Salida:</h1>
                <InputGroup className="grup-time-picker">
                  <InputGroup.Text className="icona-time-picker">
                    <Clock />
                  </InputGroup.Text>
                  <TimePicker
                    onChange={(value) => handleTimeChange('timetable2', value)}
                    value={formData.timetable2}
                    disableClock={true}
                    format="HH:mm"
                    step={30}
                    className="input-time-picker"
                  />
                </InputGroup>
              </div>
            </Form.Group>
          </div>

          <div className="dies-setmana">
  <h1 className="rutina">Mi rutina diaria:</h1>
  <div className="rutina-diaria-container">
    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
      <Form.Group className="mb-3 rutina-item" key={day}>
        <Form.Label className="rutina-label">{day.charAt(0).toUpperCase() + day.slice(1)}</Form.Label>
        <Switch
          onChange={(checked) => handleSwitchChange(day, checked)}
          checked={formData[day]}
          offColor="#000000"
          onColor="#ff6600"
        />
      </Form.Group>
    ))}
  </div>
</div>

          <Form.Group className="nivell-entrenament">
            <h1 className="nivel">Mi nivel:</h1>
            <Form.Select
              name="proficiency"
              value={formData.proficiency}
              onChange={handleChange}
              className="select-nivell"
            >
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="activitats-favorites">
            <h1 className="actividades-favoritas">Actividades favoritas:</h1>
            <div className="botones-intereses">
              {sportsInterests.map((interest) => (
                <StyledButton
                  key={interest}
                  bgColor={selectedInterests.includes(interest) ? '#ff6600' : '#333'}
                  textColor={selectedInterests.includes(interest) ? '#fff' : '#fff'}
                  hoverColor={selectedInterests.includes(interest) ? '#e65c00' : '#555'}
                  onClick={() => handleInterestClick(interest)}
                >
                  {interest}
                </StyledButton>
              ))}
            </div>
          </Form.Group>

          <div className="grup-botons d-flex justify-content-between">
            <StyledButton bgColor="#333" textColor="#fff" hoverColor="#555" onClick={handlePrevStep}>
              Anterior
            </StyledButton>
            <StyledButton bgColor="#f0bb31" hoverColor="#f0a51e" onClick={handleNextStep}>
              Siguiente
            </StyledButton>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 className="miperfil">Mi perfil</h1>
          <Form.Group className="mb-3">
            <h1 className="sonrie">Foto de perfil, sonríe!</h1>
            <Form.Control
              type="file"
              name="img"
              onChange={handleImageChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <h1 className="sobremi">Sobre mí:</h1>
            <Form.Control
              type="text"
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="En este campo explica datos que te diferencian de los demás :)"
            />
          </Form.Group>

          <StyledButton bgColor="#333" textColor="#fff" hoverColor="#555" onClick={handlePrevStep}>
            Anterior
          </StyledButton>
          <StyledButton bgColor="#f0bb31 !important" hoverColor="#f0a51e"  type="submit" onClick={handleSubmit}>
            
            Completar
          </StyledButton>
        </div>
      )}
    </Form>
  </FormContainer>
);
};
export default RegisterForm;

