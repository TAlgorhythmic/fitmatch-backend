import { Alert, Row, Col, Image, Button } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from "react-router-dom";
import './ActivityPostHome.css';
import { meses } from '../../data/meses';
import JoinedActivitiesController from '../../controllers/JoinedActivitiesController.js';
import { showPopup } from '../../Utils/Utils.js';

function ActivityPostHome(props) {

    const { data, friendsSet } = props;
    const [isJoined, setIsJoined] = useState(false);
    let postDate = new Date(data.postDate);
    let expireDate = new Date(data.expires);
    const token = localStorage.getItem('authToken');
    const AgendaController = new JoinedActivitiesController(token);

    const friends = data.joinedUsers.filter(user => friendsSet.has(user.id));

    const shownUsers = [];

    for (let i = 0; i < 6; i++) {
        const user = friends[i];
        if (!user) break;
        shownUsers.push(user);
    }

    let isLimited = shownUsers.length < friends.length;

    function handleStateChange() {
        setIsJoined(!isJoined);
    }

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
                        <a href={`/friendsView/${data.user.id}`}>
                            <Image src={`http://localhost:3001/uploads/${data.user.img}`} alt="userImage" className="activityUserImage" roundedCircle />
                        </a>
                    </Col>
                    <Col md={10}>
                        <h5 className='actUserName'>
                            <a href={`/friendsView/${data.user.id}`}>{data.user.name} {data.user.lastname}</a> <span>posteó el {postDate.getDate()} de {meses[postDate.getMonth()]} de {postDate.getFullYear()}</span>
                        </h5>
                        <hr />
                        <div className="actPostBody">
                            <Alert.Heading>{data.title}</Alert.Heading>
                            <p>{data.description}</p>
                        </div>
                        <div className="joinedUsers">
                            <h5 className='actUserName'>Participantes: {data.joinedUsers.length} {data.joinedUsers.length !== 1 ? 'usuarios' : 'usuario'}</h5>
                            <p>{shownUsers.map((user, index) => (
                                <span key={user.id}>
                                    <Link className="customActLink" to={`/friendsView/${user.id}`}>{user.name} {user.lastname}</Link>{index !== shownUsers.length - 1 ? ", " : ""}
                                </span>
                            ))}{isLimited ? "..." : ""}</p>
                        </div>
                        <div>
                            <iframe className="customIframeGoogleMaps"
                                width="100%"
                                height="100"
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDRX596iAVeF6aX9PT3PkgeN-GK0ytG99A&q=${data.latitude},${data.longitude}`}>
                            </iframe>
                            <h5 className='actUserName'>Localización: {data.placeholder}</h5>
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