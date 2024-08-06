import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Container, InputGroup } from 'react-bootstrap';
import { Person, Envelope, Phone, GeoAlt } from 'react-bootstrap-icons';

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

    const [loading, setLoading] = useState(true);
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
        .then(response => response.json())
        .then(data => {
            if (!data.status === 0) {
                throw new Error('Failed to fetch user profile');
            }
            setUserData(data);
            setLoading(false);
        })
        .catch(error => {
            console.log('Error loading user data:', error);
            setError('Failed to load profile. Please try again later.');
            setLoading(false);
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

            if (data.ok) {
                alert('Profile updated successfully');
            } else {
                alert('Error updating profile: ' + data.error);
            }
        } catch (error) {
            alert('Error updating profile');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <InputGroup>
                                <InputGroup.Text><Person /></InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={userData.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <InputGroup>
                                <InputGroup.Text><Person /></InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    name="lastname"
                                    value={userData.lastname}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <InputGroup>
                        <InputGroup.Text><Envelope /></InputGroup.Text>
                        <Form.Control
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            readOnly
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <InputGroup>
                        <InputGroup.Text><Phone /></InputGroup.Text>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={userData.phone}
                            onChange={handleChange}
                            placeholder="Phone"
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <InputGroup>
                        <InputGroup.Text><GeoAlt /></InputGroup.Text>
                        <Form.Control
                            type="text"
                            name="city"
                            value={userData.city}
                            onChange={handleChange}
                            placeholder="City"
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={userData.description}
                        onChange={handleChange}
                        placeholder="Description"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Proficiency</Form.Label>
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
                <Form.Group className="mb-3">
                    <Form.Label>Training Preferences</Form.Label>
                    <Form.Control
                        type="text"
                        name="trainingPreferences"
                        value={userData.trainingPreferences}
                        onChange={handleChange}
                        placeholder="Training Preferences"
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

