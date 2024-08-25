import { useState, useEffect, useRef } from 'react';
import { Form, Button, Row, Col, Container, InputGroup } from 'react-bootstrap';
import { Camera, Person, Envelope, GeoAlt, Clock } from 'react-bootstrap-icons';
import { useNavigate, Navigate } from 'react-router-dom';
import TimePicker from 'react-time-picker';
import './CompletarRegistro.css';
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { NO_PERMISSION, OK } from "./../../Utils/StatusCodes.js";
import { ProgressBar, Step } from 'react-step-progress-bar';
import Switch from 'react-switch';
import { showPopup } from '../../Utils/Utils.js';


const libraries = ["places"];

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
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCtcO9aN0PUYJuxoL_kwckAAKUU5x1fUYc",
    libraries: libraries
  });

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
      console.log('Usuario registrado con éxito');
      setUpdateUser(true);
      setToken(true);
      navigate('/');
    } else if (result.status === NO_PERMISSION) {
      setTokenValid(false);
    } else {
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
  <Container className="custom-register-form">
    <ProgressBar
      percent={(step / 2) * 100}
      filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
    >
      <Step transition="scale">
        {({ accomplished }) => (
          <div className={`indexedStep ${accomplished ? "accomplished" : null}`}>
            1
          </div>
        )}
      </Step>
      <Step transition="scale">
        {({ accomplished }) => (
          <div className={`indexedStep ${accomplished ? "accomplished" : null}`}>
            2
          </div>
        )}
      </Step>
      <Step transition="scale">
        {({ accomplished }) => (
          <div className={`indexedStep ${accomplished ? "accomplished" : null}`}>
            3
          </div>
        )}
      </Step>
    </ProgressBar>

    <Form onSubmit={handleSubmit} encType='multipart/form-data'>
      {step === 0 && (
        <div>
          <div className="Titulo">Formulario de registro</div>
          <div className="Datos"> Datos personales
          <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
            <h1 className='mensajes'>Nombre</h1>
              <InputGroup>
                <InputGroup.Text><Person /></InputGroup.Text>
                <Form.Control
                  type="text"
                  name="Nombre"
                  value={formData.firstName}
                  readOnly
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
            <h1 className='mensajes'>Apellidos</h1>
              <InputGroup>
                <InputGroup.Text> <Person/></InputGroup.Text>
                
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder='Rios Aguilar'
                />
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
        <Row>
        <Col md={6}>
        <Form.Group className="mb-3">
        <h1 className='mensajes'>Coloca tu mejor email</h1>
          <InputGroup>
            <InputGroup.Text><Envelope /></InputGroup.Text>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              placeholder='fitmatch@gmail.com'
              readOnly
            />
          </InputGroup>
        </Form.Group>
        </Col>
        <Col md={6}>
        {
          isLoaded ? (
            <Form.Group className="mb-3">
               <h1 className='mensajes'>Selecciona tu ubicación</h1>
              <Autocomplete onLoad={a => ref.current = a} onPlaceChanged={() => onPlaceChanged()}>
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
          ) : <></>
        }
        </Col>
        
          </Row>
          <form className="Politica" >
        <input
          type="checkbox"
          id="privacyPolicy"
          name="privacyPolicy"
          required
        />
        <h1 className='politica'>He leído y acepto la Política de Privacidad</h1>
    </form>
          
          <Button variant="primary" onClick={handleNextStep}>Siguiente</Button>
        </div>
        </div>
      )}
      {step === 1 && (
        <div>
          {/* Paso 2: Mi Actividad */}
          {/* Aquí se incluiría el contenido de la segunda imagen */}
          <div className='horario-entrenamiento'>

  <Form.Group className="mb-3">
  <h1 className='mensajes' >Mi actividad</h1>
  <h1 className='mensajes' >Horario habitual de entrenamiento</h1>
  <h1 className='mensajes'> Entrada: </h1>
  <div className="time-picker-container d-flex justify-content-between">
    <InputGroup className="me-3 time-picker-group">
      <InputGroup.Text className="time-picker-icon">
        <Clock />
      </InputGroup.Text>
      <TimePicker
        onChange={(value) => handleTimeChange('timetable1', value)}
        value={formData.timetable1}
        disableClock={true}
        format="HH:mm"
        step={30}
       
        className="time-picker-input"
      />
    </InputGroup>
    <h1 className='mensajes'> Salida: </h1>
    <InputGroup className="time-picker-group">
      <InputGroup.Text className="time-picker-icon">
        <Clock />
      </InputGroup.Text>
      <TimePicker
        onChange={(value) => handleTimeChange('timetable2', value)}
        value={formData.timetable2}
        disableClock={true}
        format="HH:mm"
        step={30}
        className="time-picker-input"
      />
    </InputGroup>
  </div>
</Form.Group>
</div>
<div className='dias-semana'>
<h1 className='mensajes'> Mi rutina diaria: </h1>
<Form.Group className="mb-3">
          <Form.Label>Lunes</Form.Label>
          <Switch
            onChange={(checked) => handleSwitchChange('monday', checked)}
            checked={formData.monday}
            offColor="#0000"
            onColor="#ff6600"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Martes</Form.Label>
          <Switch
            onChange={(checked) => handleSwitchChange('tuesday', checked)}
            checked={formData.tuesday}
            offColor="#0000"
            onColor="#ff6600"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Miércoles</Form.Label>
          <Switch
            onChange={(checked) => handleSwitchChange('wednesday', checked)}
            checked={formData.wednesday}
            offColor="#0000"
            onColor="#ff6600"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Jueves</Form.Label>
          <Switch
            onChange={(checked) => handleSwitchChange('thursday', checked)}
            checked={formData.thursday}
            offColor="#0000"
            onColor="#ff6600"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Viernes</Form.Label>
          <Switch
            onChange={(checked) => handleSwitchChange('friday', checked)}
            checked={formData.friday}
            offColor="#0000"
            onColor="#ff6600"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Sábado</Form.Label>
          <Switch
            onChange={(checked) => handleSwitchChange('saturday', checked)}
            checked={formData.saturday}
            offColor="#0000"
            onColor="#ff6600"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Domingo</Form.Label>
          <Switch
            onChange={(checked) => handleSwitchChange('sunday', checked)}
            checked={formData.sunday}
            offColor="#0000"
            onColor="#ff6600"
          />
        </Form.Group>
</div>
<Form.Group className="niveles">
<h1 className='mensajes'> Mi nivel: </h1>
          <Form.Select
            name="proficiency"
            value={formData.proficiency}
            onChange={handleChange}
          >
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </Form.Select>
        </Form.Group>

<Form.Group className="actividades">
<h1 className='mensajes'> Actividades favoritas: </h1>
          <div className="d-flex flex-wrap justify-content-center">
            {sportsInterests.map((interest) => (
            <Button
            key={interest}
            className={`me-2 mb-2 custom-preferences-btn ${selectedInterests.includes(interest) ? 'custom-button-selected' : 'custom-button-unselected'}`}
            onClick={() => handleInterestClick(interest)}
>
            {interest}
            </Button>

            ))}
          </div>
        </Form.Group>
          <Button variant="secondary" onClick={handlePrevStep}>Anterior</Button>
          <Button variant="primary" onClick={handleNextStep}>Siguiente</Button>
        </div>
      )}

      {step === 2 && (
        <div>
          {/* Paso 3: Mi Perfil */}
          <h1 className='mensajes'> Mi perfil </h1>
          <Form.Group className="mb-3">
          <h1 className='mensajes'> Sobre mí: </h1>
          <Form.Control
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
        <h1 className='mensajes'> Foto de perfil, sonríe </h1>
          <Form.Control
            type="file"
            name="img"
            onChange={handleImageChange}
          />
        </Form.Group>
          <Button variant="secondary" onClick={handlePrevStep}>Anterior</Button>
          <Button variant="success" type="submit" className="custom-submit-btn">
            Completar
          </Button>
        </div>
      )}
    </Form>
  </Container>
);
};
export default RegisterForm;

