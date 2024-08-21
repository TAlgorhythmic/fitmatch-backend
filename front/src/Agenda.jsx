import { useState, useEffect } from 'react';
import JoinedActivitiesController from './controllers/JoinedActivitiesController';
import { Row, Col, Container } from 'react-bootstrap';
import ActivityDayDisplay from './components/Agenda/ActivityDayDisplay';
import { Navigate } from "react-router-dom";
import { NO_PERMISSION, OK } from "./Utils/StatusCodes.js";
import { showPopup } from "./Utils/Utils.js"
import './Agenda.css';

function Agenda() {

    const [tokenValid, setTokenValid] = useState(true);
    const token = localStorage.getItem('authToken');
    const [joinedActivities, setJoinedActivities] = useState([]);
    // const [activitiesDays, setActivitiesDays] = useState([]);
    const AgendaController = new JoinedActivitiesController(token);
    const handleLeaveActivity = (activityId) => {
        const updatedActivities = joinedActivities.filter(activity => activity.id !== activityId);
        setJoinedActivities(updatedActivities);
    };

    useEffect(() => {
        async function getJoinedActivities() {
            const data = await AgendaController.getAllJoinedActivities();
            if (data.status === OK) {
                setJoinedActivities(data.data);
            } else if (data.status === NO_PERMISSION) {
                setTokenValid(false);
            } else {
                showPopup("Error fetching joined activities.", data.error);
            }
        }
        getJoinedActivities();
    }, []);

    //Hacer función para obtener todos los días en los que hay actividades

    /*function getActivitiesDays(activities) {
        const days = [];
        joinedActivities.forEach(activity => (
            days.push(activity.expires)
        ))
        days
    }*/

    if (!tokenValid) {
        showPopup("No permission", "Tu sesión ha expirado. Debes iniciar sesión.", false);
        return <Navigate to="/login" />
    }
    
    return (
        <>
            <div className="contenedorHome">
                {joinedActivities.map((activity, index) => (
                    <Row key={index}>
                        <ActivityDayDisplay data={activity} handleLeaveActivity={handleLeaveActivity} />
                    </Row>
                ))}
            </div>
        </>
    )
}

export default Agenda;