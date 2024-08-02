import React, { useState, useEffect } from 'react';
import './App.css';
import BaseController from './controllers/BaseController';
import { Container, Row, Col } from 'react-bootstrap';
import ActividadMain from './components/ActividadMain';
import HomeLateral from './components/HomeLateral';
import HomeView from './components/HomeView';
import BarraLateral from './components/BarraLateral';

function Home() {
    const [activities, setActivities] = useState([]);
    const tableName = "activities";

    const ActivitiesController = new BaseController(tableName);

    useEffect(() => {
        async function getActivities() {
            const activitiesData = await ActivitiesController.getAll();
            if (activitiesData.data.length) {
                setActivities(activitiesData.data);
            } else {
                console.log('No data found:', activitiesData);
            }
        }
        getActivities();
    }, []);

    return (
        <>
            <Row>
                <Col xs={1}>
                    <BarraLateral />
                </Col>
                <Col xs={7} className="d-flex flex-column">
                    <HomeView activitiesData={activities} />
                </Col>
                <Col xs={4} className="d-flex flex-column">
                    <HomeLateral activitiesData={activities} />
                </Col>
            </Row>
        </>
    );
}

export default Home;