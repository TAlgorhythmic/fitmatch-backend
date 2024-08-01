import React, { useState, useEffect } from 'react';
import './App.css';
import BaseController from './controllers/BaseController';
import { Container, Row } from 'react-bootstrap';
import ActividadMain from './components/ActividadMain';

function Home() {
    const [activities, setActivities] = useState([]);
    const tableName = "activities";

    const ActivitiesController = new BaseController(tableName);

    useEffect(() => {
        async function getActivities() {
            const activitiesData = await ActivitiesController.getAll();
            if (activitiesData.length) {
                setActivities(activitiesData);
            } else {
                console.log('No data found:', activitiesData);
            }
        }
        getActivities();
    }, []);

    return (
        <Container>
            {activities.map((activity, index) => (
                <Row key={index}>
                    <ActividadMain data={activity} />
                </Row>
            ))}
        </Container>
    );
}

export default Home;