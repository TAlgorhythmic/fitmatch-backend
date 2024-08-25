import { Alert, Row, Col, Image, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import './ActivityPostHome.css';
import { meses } from '../../data/meses';
import JoinedActivitiesController from '../../controllers/JoinedActivitiesController.js';
import { showPopup } from '../../Utils/Utils.js';

function ActivityPostHome(props) {

    const { data } = props;

    let postDate = new Date(data.postDate);
    let expireDate = new Date(data.expires);

    const [isJoined, setIsJoined] = useState(false);

    const token = localStorage.getItem('authToken');
    const AgendaController = new JoinedActivitiesController(token);

    function handleStateChange() {
        setIsJoined(!isJoined);
    };

    async function joinActivity() {
        await AgendaController.joinActivity(data.id)
            .then(response => {
                showPopup("Joined Succesfully", "", false);
                handleStateChange();
            })
            .catch(error => {
                showPopup("Error Joining Activity", error, false);
            });
    }

    async function leaveActivity() {
        await AgendaController.leaveActivity(data.id)
            .then(response => {
                showPopup("Left Succesfully", "", false);
                handleStateChange();
            })
            .catch(error => {
                showPopup("Error Leaving Activity", error, false);
            });
    }

    return (
        <div className="activityContainer">
            <Alert variant="info" className='customAlert'>
                <Row>
                    <Col md={2}>
                        <Image src={`http://localhost:3001/uploads/${data.user.img}`} alt="userImage" className="activityUserImage" roundedCircle />
                    </Col>
                    <Col md={10}>
                        <h5 className='actUserName'>{data.user.name} {data.user.lastname} <span>posteó el {postDate.getDate()} de {meses[postDate.getMonth()]} de {postDate.getFullYear()}</span> </h5>
                        <hr />
                        <Alert.Heading>{data.title}</Alert.Heading>
                        <p>{data.description}</p>
                        <div className="joinedUsers">
                            <h5 className='actUserName'>Participantes: {data.joinedUsers.length} {data.joinedUsers.length !== 1 ? 'usuarios' : 'usuario'}</h5>
                            <p>{data.joinedUsers.map((user, index) => (
                                <span key={user.id}>
                                    <Link to={`/friends/view/${user.id}`}>{user.name} {user.lastname}</Link>{index !== data.joinedUsers.length - 1 ? ", " : ""}
                                </span>
                            ))}</p>
                        </div>
                        <div className="dateCheck">
                            <h5 className='actExpireDate'>{expireDate.getDate()} de {meses[expireDate.getMonth()]} de {expireDate.getFullYear()}</h5>
                            {isJoined ? <Button variant="danger" onClick={leaveActivity}>Abandonar</Button> : <Button variant="primary" onClick={joinActivity}>Unirse</Button>}
                        </div>
                    </Col>
                </Row>
            </Alert>
        </div>
    );
}

export default ActivityPostHome;