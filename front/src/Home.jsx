import React, { useState, useEffect } from 'react';
import './App.css';
import BaseController from './controllers/BaseController';
import { Container, Row, Col } from 'react-bootstrap';
import ActividadMain from './components/ActividadMain.jsx'


function Home() {

    let array = [];
    const [activities, setActivities] = useState(array);
    const tableName = "users";

    const baseController = new BaseController(tableName);

    useEffect(() => {
        async function getActivities() {
            const activitiesData = baseController.getAll();
            if (activitiesData.length) {
                setActivities(activitiesData);
              } else {
                console.log('No data found:', activitiesData);
              }
        }
        getActivities();
    }, [])

    console.log(activities);

    return (
        <>
            <Container>

            </Container>
        </>
    )
}

export default Home;