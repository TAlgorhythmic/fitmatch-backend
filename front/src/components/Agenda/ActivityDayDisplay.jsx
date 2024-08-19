import { Alert, Row, Col, Image, Button } from 'react-bootstrap';
import './ActivityDayDisplay.css';
import { useState, useEffect } from 'react';
import { meses } from '../../data/meses';
import JoinedActivitiesController from '../../controllers/JoinedActivitiesController';
import { showPopup } from '../../Utils/Utils.js';

function ActivityDayDisplay(props) {

    const { data, handleLeaveActivity } = props;

    let expireDate = new Date(data.expires);

    const token = localStorage.getItem('authToken');
    const AgendaController = new JoinedActivitiesController(token);

    async function leaveActivity() {
        try {
            await AgendaController.leaveActivity(data.id);
            showPopup("Leaved Successfully", "", false);
            handleLeaveActivity(data.id);
        } catch (error) {
            showPopup("Error Leaving Activity", error, false);
        }
    }

    return (
        <>
            <Alert variant="info" className='customAlert'>
                <Row>
                    <Col md={2}>
                        <div className='actDayLeftVisor'>
                            <h3 className='actDayNumber'>{expireDate.getDate()}</h3>
                            <h5 classname="actDayMonth">{meses[expireDate.getMonth()]}</h5>
                        </div>
                    </Col>
                    <Col md={10}>
                        <div className="actDayRightVisor">
                            <p><span>{expireDate.getHours() + ":" + expireDate.getMinutes()}</span> &#9;&#9;&#9;{data.title} &#9;&#9;&#9;<Button variant="primary" onClick={leaveActivity}>Abandonar</Button></p>
                        </div>
                    </Col>
                </Row>
            </Alert>
        </>
    );
}

export default ActivityDayDisplay;