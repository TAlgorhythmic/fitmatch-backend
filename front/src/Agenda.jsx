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

    const tableName = "joinedactivities";

    const AgendaController = new BaseController(tableName, token);

    useEffect(() => {
        async function getJoinedActivities() {
            const data = await AgendaController.getAll();
            console.log(data);
            setJoinedActivities(data.data);
            
        }
        getJoinedActivities();
    }, []);

    return (
        <>
        {console.log(joinedActivities)}
        </>
    )
}

export default Agenda;