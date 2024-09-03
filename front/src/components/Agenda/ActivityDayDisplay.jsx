import { Alert, Row, Col, Image, Button } from 'react-bootstrap';
import './ActivityDayDisplay.css';
import { useState, useEffect } from 'react';
import { meses } from '../../data/meses';
import JoinedActivitiesController from '../../controllers/JoinedActivitiesController';
import { showPopup } from '../../Utils/Utils.js';
import { OK } from '../../Utils/StatusCodes.js';

function ActivityDayDisplay(props) {

    const { data, handleLeaveActivity } = props;
    let expireDate = new Date(data.expires);
    const token = localStorage.getItem('authToken');
    const AgendaController = new JoinedActivitiesController(token);

    const [apiKey, setApiKey] = useState("");

    useEffect(() => {

        fetch("http://localhost:3001/api/credentials/mapskey", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }).then(raw => raw.json()).then(res => {
            if (res.status === OK) setApiKey(res.data);
            else showPopup("Error", "Error fetching maps api key.", true);
        });
    });

    async function leaveActivity() {
        try {
            await AgendaController.leaveActivity(data.id);
            showPopup("Left Successfully", "", false);
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
                            <h5 className="actDayMonth">{meses[expireDate.getMonth()]}</h5>
                        </div>
                    </Col>
                    <Col md={10}>
                        <div className="actDayRightVisor">
                            <h5><span>{expireDate.getHours() + ":" + expireDate.getMinutes()}</span> &#9;&#9;&#9;{data.title} &#9;&#9;&#9;</h5>
                            <iframe className="customIframeGoogleMaps"
                                width="100%"
                                height="100"
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${data.latitude},${data.longitude}`}>
                            </iframe>
                            <p className='actUserName'>Localización: {data.placeholder}</p>
                            <div className="actDayLeaveButton">
                                <Button variant="danger" onClick={leaveActivity}>Abandonar</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Alert>
        </>
    );
}

export default ActivityDayDisplay;