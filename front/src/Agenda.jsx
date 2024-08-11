import { useState, useEffect } from 'react';
import BaseController from './controllers/BaseController';
import JoinedActivitiesController from './controllers/JoinedActivitiesController';
import { Row, Col, Container } from 'react-bootstrap';
import ActivityDayDisplay from './components/Agenda/ActivityDayDisplay';
import './Agenda.css';

function Agenda() {

    const token = localStorage.getItem('authToken');

    if (!token) {
        return <Navigate to="/" />
    }

    const [joinedActivities, setJoinedActivities] = useState([]);
    const [activitiesDays, setActivitiesDays] = useState([]);

    const tableName = "joinedactivities";

    const AgendaController = new JoinedActivitiesController(token);

    useEffect(() => {
        async function getJoinedActivities() {
            const data = await AgendaController.getAllJoinedActivities();
            console.log(data)
            setJoinedActivities(data);
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

    return (
        <>
            <div className="contenedorHome">
                {joinedActivities.map((activity, index) => (
                    <Row key={index}>
                        <ActivityDayDisplay data={activity} />
                    </Row>
                ))}
            </div>
        </>
    )
}

export default Agenda;