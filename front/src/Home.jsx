import { useState, useEffect } from 'react';
import './App.css';
import BaseController from './controllers/BaseController';
import { Row, Col } from 'react-bootstrap';
import HomeLateral from './components/HomeLateral';
import HomeView from './components/HomeView';
import BarraLateral from './components/BarraLateral';
import { Navigate } from 'react-router-dom';

function Home() {
    const [activities, setActivities] = useState([]);
    const [isValidToken, setIsValidToken] = useState(null);
    const token = localStorage.getItem('authToken');
    const tableName = "activities";
    const ActivitiesController = new BaseController(tableName);

    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/auth/validate-token', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`  // Enviar el token en los headers
                    }
                });

                // Verifica si la respuesta es JSON
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    setIsValidToken(data.valid);
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
    }, [token]);

    useEffect(() => {
        async function getActivities() {
            const activitiesData = await ActivitiesController.getAll();
            if (activitiesData.data.length) {
                setActivities(activitiesData.data);
            } else {
                console.log('No data found:', activitiesData);
            }
        }

        if (isValidToken) {
            getActivities();
        }
    }, [isValidToken]); // Dependencia añadida

    if (isValidToken === null) {
        // Renderizar un indicador de carga mientras se valida el token
        return <div>Loading...</div>;
    }

    if (isValidToken === false) {
        return <Navigate to="/login" />;
    }

    return (
        <Row>
            <Col xs={1}>
                <BarraLateral />
            </Col>
            <Col xs={7} className="d-flex flex-column">
                <HomeView activitiesData={activities} />
            </Col>
            <Col xs={4} className="d-flex flex-column">
                <HomeLateral activitiesData={activities} />
            </Col>
        </Row>
    );
}

export default Home;
