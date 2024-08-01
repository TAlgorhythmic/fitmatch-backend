import React, { useState, useEffect } from 'react';
import './App.css';
import BaseController from './controllers/BaseController';
import { Container, Row, Col } from 'react-bootstrap';
import ActividadMain from './components/ActividadMain';
import HomeLateral from './components/HomeLateral';
import HomeView from './components/HomeView';

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
        <>
            <Container>
                <Row>
                    <Col xs={4}>
                        <HomeLateral  activitiesData={activities}/>
                    </Col>
                    <Col xs={8}>
                        <HomeView activitiesData={activities}/>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Home;