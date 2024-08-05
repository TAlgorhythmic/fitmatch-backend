import React, { useState, useEffect } from 'react';
import './App.css';
import BaseController from './controllers/BaseController';
import { Container, Row, Col } from 'react-bootstrap';
import ActividadMain from './components/ActividadMain';
import HomeLateral from './components/HomeLateral';
import HomeView from './components/HomeView';
import BarraLateral from './components/BarraLateral';
import { Navigate } from 'react-router-dom';

function Home() {
    const [activities, setActivities] = useState([]);
    const tableName = "activities";

    const [isValidToken, setIsValidToken] = useState(null);
    const token = localStorage.getItem('authToken');

    const ActivitiesController = new BaseController(tableName);


    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/auth/validate-token', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`  // Enviar el token en los headers
                    }
                });

                // Verifica si la respuesta es JSON
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    setIsValidToken(data.valid);
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
    }, [token]);  // El token está en la lista de dependencias para que el efecto se ejecute cada vez que cambie el token


    if (isValidToken === null) {
        // Renderizar un indicador de carga mientras se valida el token
        return <div>Loading...</div>;
    }

    if (isValidToken === false) {
        return (
            <Navigate to="/login" />
        );
    } else if(isValidToken == true){
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
    } else {
        return(
            <>
            <div style={{widt: "100px", height: "100px", backgroundColor: "red"}}>
                <h1>ERROR</h1>
            </div>
            </>
        )
    }
}

export default Home;