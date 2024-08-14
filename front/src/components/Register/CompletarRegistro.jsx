import { useState, useEffect, useRef } from 'react';
import { Form, Button, Row, Col, Container, InputGroup } from 'react-bootstrap';
import { Camera, Phone, Person, Envelope, GeoAlt, Clock } from 'react-bootstrap-icons';
import { useNavigate, Navigate } from 'react-router-dom';
import TimePicker from 'react-time-picker';
import './registerf.css';
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { NO_PERMISSION, OK } from "./../../Utils/StatusCodes.js";
import { showPopup } from '../../Utils/Utils.js';

const libraries = ["places"];

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: 'Spain',
    proficiency: '',
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
    thursday: true,
    friday: false,
    saturday: false,
    sunday: false,
  });

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
          phone: userData.data.phone,
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

    console.log(formData);
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
      <Form onSubmit={handleSubmit} encType='multipart/form-data'>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label> First Name</Form.Label>
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
              <Form.Label>Last Name</Form.Label>
              <InputGroup>
                <InputGroup.Text> <Person style={{ fontSize: '100%', color: 'blue' }} /></InputGroup.Text>
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
        <Form.Group className="mb-3">
          <Form.Label><Envelope /> Email Address</Form.Label>
          <InputGroup>
            <InputGroup.Text><Envelope /></InputGroup.Text>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}

            />
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label><Phone /> Phone Number</Form.Label>
          <InputGroup>
            <InputGroup.Text>+34</InputGroup.Text>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}

              maxLength={9}
              placeholder="Introduce your phone number"
              readOnly
            />
          </InputGroup>
        </Form.Group>
        {
          isLoaded ? (
            <Form.Group className="mb-3">
              <Form.Label><GeoAlt /> City</Form.Label>
              <Autocomplete onLoad={a => ref.current = a} onPlaceChanged={() => onPlaceChanged()}>
                <InputGroup>
                  <InputGroup.Text><GeoAlt /></InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                  />
                </InputGroup>
              </Autocomplete>
            </Form.Group>
          ) : <></>
        }
        <Form.Group className="mb-3">
          <Form.Label>Proficiency</Form.Label>
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
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
  <Form.Label>Selecciona tu horario de entrenamiento</Form.Label>
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

        <Form.Group className="mb-3">
          <Form.Label>Lunes</Form.Label>
          <Form.Control
            type="text"
            name="lunes"
            value={formData.monday}
            onChange={handleChange}
            placeholder="Enter schedule for Monday"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Martes</Form.Label>
          <Form.Control
            type="text"
            name="martes"
            value={formData.tuesday}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Miercoles</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={formData.wednesday}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>jueves</Form.Label>
          <Form.Control
            type="text"
            name="jueves"
            value={formData.thursday}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>viernes</Form.Label>
          <Form.Control
            type="text"
            name="viernes"
            value={formData.friday}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>saturday</Form.Label>
          <Form.Control
            type="text"
            name="saturday"
            value={formData.saturday}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>sunday</Form.Label>
          <Form.Control
            type="text"
            name="sunday"
            value={formData.sunday}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label><Camera /> Image Upload</Form.Label>
          <Form.Control
            type="file"
            name="img"
            onChange={handleImageChange}
          />
        </Form.Group>
        <Form.Group className="mb-3 custom-preferences">
          <Form.Label>Preferences</Form.Label>
          <div className="d-flex flex-wrap justify-content-center">
            {sportsInterests.map((interest) => (
              <Button
                key={interest}
                variant={selectedInterests.includes(interest) ? 'primary' : 'outline-primary'}
                className="me-2 mb-2 custom-preferences-btn"
                onClick={() => handleInterestClick(interest)}
              >
                {interest}
              </Button>
            ))}
          </div>
        </Form.Group>
        <div className="d-flex justify-content-center mt-4">
          <Button variant="success" type="submit" className="custom-submit-btn">
            Complete
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default RegisterForm;


