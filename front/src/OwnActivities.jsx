import { useState, useEffect } from 'react';
import './App.css';
import { Row, Col } from 'react-bootstrap';
import { Navigate, useParams } from 'react-router-dom';
import OwnActivityPost from './components/OwnActivities/OwnActivityPost';
import ActivitiesController from './controllers/ActivitiesController';
import AuthController from './controllers/AuthController';
import './OwnActivities.css';

function OwnActivities() {
    const [activities, setActivities] = useState([]);
    const [isValidToken, setIsValidToken] = useState(null);
    const token = localStorage.getItem('authToken');
    const ActivityController = new ActivitiesController(token);
    const AuthControl = new AuthController(token);

    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await AuthControl.validateToken();

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
            const activitiesData = await ActivityController.getOwnActivities();
            console.log(activitiesData);
            if (activitiesData.status === 0) {
                if (activitiesData.data.length) setActivities(activitiesData.data);
                else console.log("No data found (array empty).");
            } else {
                console.log('Error: ', activitiesData);
            }
        }

        getActivities();

        if (isValidToken) {
            getActivities();
        }
    }, [isValidToken]); // Dependencia añadida

    if (!isValidToken === null) {
        // Renderizar un indicador de carga mientras se valida el token
        return <div>Loading...</div>;
    }

    if (isValidToken === false) {
        return <Navigate to="/" />;
    }

    return (
        <>
            <div className="contenedorHome">
                {activities.map((activity, index) => (
                    <Row key={index}>
                        <OwnActivityPost data={activity} />
                    </Row>
                ))}
            </div>
        </>

    );
}

export default OwnActivities;
