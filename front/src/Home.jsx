import React, { useState, useEffect } from 'react';
import './App.css';
import BaseController from './controllers/BaseController';
import { Container, Row, Col } from 'react-bootstrap';
import ActividadMain from './components/ActividadMain.jsx';


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
    }, [])

    console.log(activities)

    return (
        <>
            <Row>
            </Row>
            {activities.map(activity => (
                <Row>
                    <ActividadMain data={activity} />
                </Row>
            ))}
        </>
    )
}

export default Home;