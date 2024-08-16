import { useState, useEffect, useRef } from 'react';
import { Form, Button, Row, Col, Container, InputGroup } from 'react-bootstrap';
import { Person, Envelope, Phone, GeoAlt } from 'react-bootstrap-icons';
import { OK, NO_PERMISSION } from './Utils/StatusCodes';
import { showPopup } from './Utils/Utils';
import { Navigate, useNavigate } from 'react-router-dom';
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import './UserProfile.css';

const libraries = ["places"];

const UserProfile = () => {
    const [userData, setUserData] = useState({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        description: '',
        proficiency: '',
        trainingPreferences: [],
        img: '',
        city: '',
        latitude: '',
        longitude: ''
    });

    const navigate = useNavigate();

    const sportsInterests = [
        'Swimming', 'Cycling', 'Powerlifting', 'Yoga', 'Running',
        'CrossFit', 'Bodybuilding', 'Pilates', 'Boxing', 'HIIT',
        'Weightlifting', 'Cardio', 'Zumba', 'Spinning', 'Martial Arts'
    ];

    const [selectedInterests, setSelectedInterests] = useState([]);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCtcO9aN0PUYJuxoL_kwckAAKUU5x1fUYc",
        libraries: libraries
    });

    const ref = useRef(null);

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
            if (data.status === OK) {
                console.log(data.data);
                setUserData(data.data);
                if (data.data.trainingPreferences) {
                    console.log(data.data.trainingPreferences)
                    setSelectedInterests(data.data.trainingPreferences);
                }
            } else if (data.status === NO_PERMISSION) {
                setError(data);
            } else {
                showPopup("Data is invalid", data.error, true);
            }
        })
        .catch(error => {
            console.log('Error loading user data:', error);
            setError('Failed to load profile. Please try again later.');
        });
    }, []);

    if (error && error.status === NO_PERMISSION) {
        return <Navigate to="/login" />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('authToken');
        console.log(selectedInterests);
        setUserData({ ...userData, trainingPreferences: selectedInterests })
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
            if (data.status == 0) {
                console.log()
                alert('Profile updated successfully');
            } else {
                showPopup('Error updating profile', data.error, true);
            }
        } catch (error) {
            showPopup('Error updating profile', error, true);
        }
    };

    const handleInterestClick = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    function onPlaceChanged() {
        if (ref.current.getPlace() && ref.current.getPlace().geometry) {
            setUserData({
                ...userData,
                city: ref.current.getPlace().formatted_address,
                latitude: ref.current.getPlace().geometry.location.lat(),
                longitude: ref.current.getPlace().geometry.location.lng()
            });
        }
    }

    return (
        <Container className="container-profile">
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="form-group-profile mb-3">
                            <InputGroup className="input-group">
                                <InputGroup.Text className="input-group-text-profile">
                                    <Person />
                                </InputGroup.Text>
                                <Form.Control
                                    className="form-control-profile"
                                    type="text"
                                    value={userData.name}
                                    name="name"
                                    onChange={handleChange}
                                    placeholder="Nombre"
                                />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="form-group-profile mb-3">
                            <InputGroup className="input-group">
                                <InputGroup.Text className="input-group-text-profile">
                                    <Person />
                                </InputGroup.Text>
                                <Form.Control
                                    className="form-control-profile"
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
                                <InputGroup.Text className="input-group-text-profile"><Envelope /></InputGroup.Text>
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
                                <InputGroup.Text className="input-group-text-profile"><Phone /></InputGroup.Text>
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
                        {isLoaded ? (
                            <Form.Group className="form-group-profile mb-3">
                                <Autocomplete onLoad={a => ref.current = a} onPlaceChanged={() => onPlaceChanged()}>
                                    <InputGroup className="input-group">
                                        <InputGroup.Text className="input-group-text-profile">
                                            <GeoAlt />
                                        </InputGroup.Text>
                                        <Form.Control
                                            className="form-control-profile"
                                            type="text"
                                            name="city"
                                            value={userData.city}
                                            onChange={handleChange}
                                            placeholder="Ciudad"
                                        />
                                    </InputGroup>
                                </Autocomplete>
                            </Form.Group>
                        ) : <></>}
                    </Col>
                    <Col md={6}>
                        <Form.Group className="form-group-profile mb-3">
                            <Form.Select
                                className="form-select-profile"
                                name="proficiency"
                                value={userData.proficiency}
                                onChange={handleChange}
                            >
                                <option value="Principiante">Principiante</option>
                                <option value="Intermedio">Intermedio</option>
                                <option value="Avanzado">Avanzado</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="form-group-profile mb-3">
                    <div className="d-flex flex-wrap justify-content-center">
                        {sportsInterests.map((interest) => (
                            <Button
                                key={interest}
                                variant={selectedInterests.includes(interest) ? 'primary' : 'outline-primary'}
                                className={`me-2 mb-2 custom-preferences-btn ${selectedInterests.includes(interest) ? 'primary' : 'outline-primary'}`}
                                onClick={() => handleInterestClick(interest)}
                            >
                                {interest}
                            </Button>
                        ))}
                    </div>
                </Form.Group>
                <Form.Group className="form-group-profile mb-3">
                    <Form.Control
                        as="textarea"
                        value={userData.description}
                        onChange={handleChange}
                        placeholder="Escribe una breve descripción sobre ti"
                    />
                </Form.Group>
                <div className="button-group d-flex justify-content-center mt-4">
                    <Button
                        className="submit-button"
                        variant="primary"
                        type="submit"
                    >
                        Guardar
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default UserProfile;
