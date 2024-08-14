import { useState, useEffect } from 'react';
import './App.css';
import BaseController from './controllers/BaseController';
import { Row } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import ActivityPostHome from './components/Home/ActivityPostHome';
import './Home.css';
import { showPopup } from './Utils/Utils';
import { OK } from '../../back-end/api/packets/StatusCodes';

function Home() {
    const [activities, setActivities] = useState([]);
    const [isValidToken, setIsValidToken] = useState(null);
    const token = localStorage.getItem('authToken');
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
                    setIsValidToken(data.status === OK ? true : false);
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

    if (!isValidToken && isValidToken !== null) {
        showPopup("No permission", "Tu sesión ha expirado. Debes iniciar sesión.", false);
        return <Navigate to="/login" />;
    }
    
    return (
        <>
            <div className="contenedorHome">
                {activities.map((activity, index) => (
                    <Row key={index}>
                        <ActivityPostHome data={activity} />
                    </Row>
                ))}
            </div>
        </>

    );
}

export default Home;
