import { useState, useEffect } from 'react';
import BaseController from './controllers/BaseController';
import { Row, Col, Container } from 'react-bootstrap';
import './Agenda.css';

function Agenda() {

    const token = localStorage.getItem('authToken');

    if (!token) {
        return <Navigate to="/" />
    }

    const [joinedActivities, setJoinedActivities] = useState([]);
    const [activitiesDays, setActivitiesDays] = useState([]);

    const tableName = "joinedactivities";

    const AgendaController = new BaseController(tableName, token);

    useEffect(() => {
        async function getJoinedActivities() {
            const data = await AgendaController.getAll();
            setJoinedActivities(data.data);
        }
        getJoinedActivities();
    }, []);

    return (
        <>
            <div className="contenedorHome">
                
            </div>
        </>
    )
}

export default Agenda;