import { Alert, Row, Col, Image, Button } from 'react-bootstrap';
import { CheckCircleFill, CheckCircle } from 'react-bootstrap-icons';
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

    /*const icon1 = <CheckCircle className="actCheckIcon" color="grey" size={28} onMouseEnter={() => setIcon(1)} onMouseOut={() => setIcon(2)} />;
    const icon2 = <CheckCircleFill className="checkPointer" color="green" size={28} onMouseEnter={() => setIcon(1)} onMouseOut={() => setIcon(2)} />;
    
    const [icon, setIcon] = useState(1);*/

    const token = localStorage.getItem('authToken');
    const AgendaController = new JoinedActivitiesController(token);

    async function joinActivity() {
        await AgendaController.joinActivity(data.id)
            .then(response => {
                showPopup("Joined Succesfully", "", false);
            })
            .catch(error => {
                showPopup("Error Joining Activity", error, false);
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
                        <p>{data.description} {data.description} {data.description} {data.description} {data.description} {data.description} {data.description} {data.description} {data.description} </p>
                        <div className="dateCheck">
                            <h5 className='actExpireDate'>{expireDate.getDate()} de {meses[expireDate.getMonth()]} de {expireDate.getFullYear()}</h5>
                            {/*icon == 1 ? icon2 : icon1*/}
                            <Button variant="primary" onClick={joinActivity}>Unirse</Button>
                        </div>
                        <div className="joinedUsers">
                            <h5 className='actUserName'>Participantes: {data.joinedUsers.length} {data.joinedUsers.length !== 1 ? 'usuarios' : 'usuario'}</h5>
                            <p>{data.joinedUsers.map((user, index) => (
                                <span key={user.id}>
                                    <Link to="/">{user.name} {user.lastname}</Link>{index !== data.joinedUsers.length - 1 ? ", " : ""}
                                </span>
                            ))}</p>
                        </div>
                    </Col>
                </Row>
            </Alert>
        </div>
    );
}

export default ActivityPostHome;