import { useState, useEffect, useRef } from 'react';
import { Form, Button, Row, Col, Container, InputGroup } from 'react-bootstrap';
import { Camera, Phone, Person, Envelope, GeoAlt } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import TimePicker from 'react-time-picker';
import './registerf.css';
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];


const RegisterForm = () => {

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCtcO9aN0PUYJuxoL_kwckAAKUU5x1fUYc",
    libraries: libraries
  });

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

  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
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
      if (userData.status == 0) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          firstName: userData.data.name,
          phone: userData.data.phone,
        }));
      }
    };

    fetchUserData();
  }, []);

  const ref = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const phoneValue = value.replace(/\D/g, '');
      if (phoneValue.length <= 9) {
        setFormData({ ...formData, phone: phoneValue });
      }
    } else if (name === "city") {
      setFormData({
        ...formData,
        city: value,
      });
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

      if (imageResult.status !== 0) {
        alert('hay error');
      }

      setFormData({ ...formData, img: imageResult.imageUrl });
    }

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
    } else {
      alert('todo mal!');
      console.log(result.error);
    }
  };

  function onPlaceChanged(e) {
    if (!isLoaded) {
      console.log("not loaded.");
      return;
    }
    const place = ref.current.getPlace();
    if (place && place.geometry) {
      setFormData({
        ...formData,
        city: place.formatted_address,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      });
    }
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
                  name="firstName"
                  value={formData.firstName}
                  readOnly
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label><Person /> Last Name</Form.Label>
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
          isLoaded ? (<Form.Group className="mb-3">
            <Form.Label><GeoAlt /> City</Form.Label>
            <InputGroup>
              <InputGroup.Text><GeoAlt /></InputGroup.Text>
              <Autocomplete onLoad={e => ref.current = e} onPlaceChanged={e => onPlaceChanged(e)}>
                <Form.Control
                  type="text"
                  name="city"
                  value={formData.city}
                  placeholder="Enter your city"
                  onChange={handleChange}
                />
              </Autocomplete>
            </InputGroup>
          </Form.Group>) : <></>
        }
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Latitude</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="Enter latitude"
                  readOnly
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Longitude</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="Enter longitude"
                  readOnly
                />
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Country</Form.Label>
          <Form.Select
            name="country"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="Spain">Spain</option>
            <option value="Europe">Europe</option>

          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Proficiency</Form.Label>
          <Form.Control
            type="text"
            name="proficiency"
            value={formData.proficiency}
            onChange={handleChange}
          />
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
          <TimePicker
            onChange={(value) => handleTimeChange('timetable1', value)}
            value={formData.timetable1}
            disableClock={true}
            placeholder="Selecciona tu hora habitual de entrada"

          />
        </Form.Group>
        <Form.Group className="mb-3">
          <TimePicker
            onChange={(value) => handleTimeChange('timetable2', value)}
            value={formData.timetable2}
            disableClock={true}
            format="HH:mm"
            step={30}
            placeholder="Selecciona tu hora habitual de entrada"
          />
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