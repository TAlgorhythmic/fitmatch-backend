import { useState, useEffect, useRef} from 'react';
import { Form, Button, Row, Col, Container, InputGroup } from 'react-bootstrap';
import { Person, Envelope, Phone, GeoAlt } from 'react-bootstrap-icons';
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];

const UserProfile = () => {
    const [userData, setUserData] = useState({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        description: '',
        proficiency: '',
        trainingPreferences: '',
        img: '',
        city: ''
    });

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCtcO9aN0PUYJuxoL_kwckAAKUU5x1fUYc",
        libraries: libraries
      });
    
      const ref = useRef(null)

    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        fetch('http://localhost:3001/api/users/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {return response.json()})
        .then(data => {
            console.log('User data:', data);
            if (!data.status === 0) {
                throw new Error('Failed to fetch user profile');
            }
            setUserData(data.data);
            
        })
        .catch(error => {
            console.log('Error loading user data:', error);
            setError('Failed to load profile. Please try again later.');
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('authToken');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        };

        try {
            const response = await fetch('http://localhost:3001/api/users/edit', requestOptions);
            const data = await response.json();
            console.log(data);
            if (data.status==0) {
                console.log()
                alert('Profile updated successfully');
            } else {
                alert('Error updating profile: ' + data.error);
            }
        } catch (error) {
            alert('Error updating profile');
        }
    };

    if (error) {
        return <div>{error}</div>;
    }
    
    function onPlaceChanged() {
        if (ref.current.getPlace() && ref.current.getPlace().geometry)
            setUserData({
          ...userData,
          city: ref.current.getPlace().formatted_address,
          latitude: ref.current.getPlace().geometry.location.lat(),
          longitude: ref.current.getPlace().geometry.location.lng()
        })
      }

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <InputGroup>
                                <InputGroup.Text><Person/></InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    value={userData.name}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <InputGroup>
                                <InputGroup.Text><Person /></InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    name="lastname"
                                    value={userData.lastname}
                                    onChange={handleChange}
                                    placeholder="Apellidos"
                                />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                <Col md={6}>
                <Form.Group className="mb-3">
                    <InputGroup>
                        <InputGroup.Text><Envelope /></InputGroup.Text>
                        <Form.Control
                            type="text"
                            value={userData.email}
                            onChange={handleChange}
                            placeholder="fitmatch@gmail.com"
                        />
                    </InputGroup>
                </Form.Group>
                </Col>
                <Col md={6}>
                <Form.Group className="mb-3">
                    <InputGroup>
                        <InputGroup.Text><Phone /></InputGroup.Text>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={userData.phone}
                            onChange={handleChange}
                            readOnly
                        />
                    </InputGroup>
                </Form.Group>
                </Col>
                </Row>
                <Row>
                <Col md={6}>
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
                    value={userData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                  />
                </InputGroup>
              </Autocomplete>
            </Form.Group>
          ) : <></>
        }
                
                </Col>
               <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Nivel</Form.Label>
                    <Form.Select
                        name="proficiency"
                        value={userData.proficiency}
                        onChange={handleChange}
                    >
                        <option value="Beginner">Principiante</option>
                        <option value="Intermediate">Intermedio</option>
                        <option value="Advanced">Avanzado</option>
                    </Form.Select>
                </Form.Group>
                </Col>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label>Intereses</Form.Label>
                    <Form.Control
                        value={userData.trainingPreferences}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        as="textarea"
                        value={userData.description}
                        onChange={handleChange}
                        placeholder="Escribe una breve descripción sobre ti"
                    />
                </Form.Group>
                <div className="d-flex justify-content-center mt-4">
                    <Button variant="primary" type="submit">Save</Button>
                </div>
            </Form>
        </Container>
    );
};

export default UserProfile;

