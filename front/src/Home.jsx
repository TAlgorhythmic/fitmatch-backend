import { useState, useEffect } from 'react';
import './App.css';
import { Row } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import ActivityPostHome from './components/Home/ActivityPostHome';
import './Home.css';
import { showPopup } from './Utils/Utils';
import { OK } from '../../back-end/api/packets/StatusCodes';
import ActivitiesController from './controllers/ActivitiesController';
import AuthController from './controllers/AuthController';
import RequestsController from './controllers/RequestsController';

function Home() {
    const [activities, setActivities] = useState([]);
    const [isValidToken, setIsValidToken] = useState(null);
    const [friends, setFriends] = useState([]);
    const token = localStorage.getItem('authToken');
    const AuthControl = new AuthController(token);
    const ActivityControl = new ActivitiesController(token);
    const ReqControl = new RequestsController(token);

    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await AuthControl.validateToken();

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
            const activitiesData = await ActivityControl.getAllActivities();
            if (activitiesData.status === 0) {
                if (activitiesData.data.length) setActivities(activitiesData.data);
                else console.log("No data found (array empty).");
            } else {
                console.log('Error: ', activitiesData.data);
            }
        }

        if (isValidToken) {
            getActivities();
        }
    }, [isValidToken]); // Dependencia añadida

    useEffect(() => {
        async function getFriends() {
            const friendsData = await ReqControl.getFriends();
            if (friendsData.status === 0) {
                if (friendsData.data.length) setFriends(friendsData.data);
                else console.log("No data found (array empty).");
            } else {
                console.log('Error: ', friendsData.data);
            }
        }
        if (isValidToken) {
            getFriends();
            console.log(friends);
        }
    }, []);

    if (!isValidToken && isValidToken !== null) {
        showPopup("No permission", "Tu sesión ha expirado. Debes iniciar sesión.", false);
        return <Navigate to="/login" />;
    }

    return (
        <>
            <div className="contenedorHome">
                {activities.map((activity, index) => (
                    <Row key={index}>
                        <ActivityPostHome data={activity} friendsList={friends} />
                    </Row>
                ))}
            </div>
        </>

    );
}

export default Home;
