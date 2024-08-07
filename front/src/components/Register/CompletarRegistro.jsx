import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Container, InputGroup } from 'react-bootstrap';
import { Camera, Phone, Person, Envelope, GeoAlt } from 'react-bootstrap-icons';
import './registerf.css';

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
    longitude: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const sportsInterests = [
    'Swimming', 'Cycling', 'Powerlifting', 'Yoga', 'Running', 
    'CrossFit', 'Bodybuilding', 'Pilates', 'Boxing', 'HIIT',
    'Weightlifting', 'Cardio', 'Zumba', 'Spinning', 'Martial Arts'
  ];

  const [selectedInterests, setSelectedInterests] = useState([]);

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
      if(userData.status==0){
        setFormData((prevFormData) => ({
          ...prevFormData,
          firstName: userData.firstName,
          email: userData.email,
        }));
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const phoneValue = value.replace(/\D/g, ''); // Remove non-numeric characters
      if (phoneValue.length <= 9) { // Limit to 9 digits after +34
        setFormData({ ...formData, phone: phoneValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
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

      if (imageResult.status!==0) {
        alert('HAY UN ERROR');
        return;
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
    if (result.status==0) {
      alert('Formulario successful!');
    } else {
      alert('todo mal!');
    }
  };

  return (
    <Container className="custom-register-form">
      <Form onSubmit={handleSubmit} encType='multipart/form-data'>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label><Person /> First Name</Form.Label>
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
              readOnly
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
              onChange={handleChange}
              maxLength={9} // Limit to 9 digits
              placeholder="Introduce your phone number"
            />
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label><GeoAlt /> City</Form.Label>
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
        </Form.Group>
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
            {/* Añadir más países según sea necesario */}
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
            as="textarea"
            name="description"
            value={formData.description}
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


