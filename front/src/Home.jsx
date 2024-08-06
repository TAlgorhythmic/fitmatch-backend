import { useState, useEffect } from 'react';
import './App.css';
import BaseController from './controllers/BaseController';
import { Row, Col } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import ActivityPostHome from './components/Home/ActivityPostHome';

function Home() {
    const [activities, setActivities] = useState([]);
    const [isValidToken, setIsValidToken] = useState(null);
    const token = localStorage.getItem('authToken');
    if (!token) return <Navigate to="/register" />;
    const tableName = "activities";
    const ActivitiesController = new BaseController(tableName, token);

    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/auth/validate-token', {
                    method: 'GET',
                    headers: {
                        'Content-Type': "application/json",
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
            if (activitiesData.status === 0) {
                if (activitiesData.data.length) setActivities(activitiesData.data);
                else console.log("No data found (array empty).");
            } else {
                console.log('Error: ', activitiesData);
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
            <Col className="d-flex flex-column">
                <div className="contenedorHome ">
                    {activities.map((activity, index) => (
                        <Row key={index}>
                            <ActivityPostHome data={activity} />
                        </Row>
                    ))}
                </div>
            </Col>
        </Row>
    );
}

export default Home;
