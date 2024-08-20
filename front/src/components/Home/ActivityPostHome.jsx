import { Alert, Row, Col, Image, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import './ActivityPostHome.css';
import { meses } from '../../data/meses';
import JoinedActivitiesController from '../../controllers/JoinedActivitiesController.js';
import { showPopup } from '../../Utils/Utils.js';
import UsersController from '../../controllers/UsersController.js';

function ActivityPostHome(props) {

    const { data, friendsList } = props;

    let postDate = new Date(data.postDate);
    let expireDate = new Date(data.expires);

    const [isJoined, setIsJoined] = useState(false);
    const [joinedFriends, setJoinedFriends] = useState([]);

    const token = localStorage.getItem('authToken');
    const AgendaController = new JoinedActivitiesController(token);
    const UserControl = new UsersController(token);

    function handleStateChange() {
        setIsJoined(!isJoined);
    };

    async function joinActivity() {
        await AgendaController.joinActivity(data.activity_id)
            .then(response => {
                showPopup("Joined Succesfully", "", false);
                handleStateChange();
            })
            .catch(error => {
                showPopup("Error Joining Activity", error, false);
            });
    }

    async function leaveActivity() {
        await AgendaController.leaveActivity(data.activity_id)
            .then(response => {
                showPopup("Left Succesfully", "", false);
                handleStateChange();
            })
            .catch(error => {
                showPopup("Error Leaving Activity", error, false);
            });
    }

    useEffect(() => {
        async function filterFriends() {
            let joinedData = data.joinedUsers;
            console.log('amigos unidos: ' + data.joinedUsers);
            let joinedFriends = joinedData.filter(data => friendsList.includes(data.id))
            console.log('amigos unidos: ' + joinedFriends)
            setJoinedFriends(joinedFriends);
        }
        filterFriends();
    }, []);

    return (
        <div className="activityContainer">
            <Alert variant="info" className='customAlert'>
                <Row>
                    <Col md={2}>
                        <Image src={`http://localhost:3001/uploads/${data.img}`} alt="userImage" className="activityUserImage" roundedCircle />
                    </Col>
                    <Col md={10}>
                        <h5 className='actUserName'>{data.friend_name} {data.friend_lastname} <span>posteó el {postDate.getDate()} de {meses[postDate.getMonth()]} de {postDate.getFullYear()}</span> </h5>
                        <hr />
                        <Alert.Heading>{data.title}</Alert.Heading>
                        <p>{data.description} {data.description} {data.description} {data.description} {data.description} {data.description} {data.description} {data.description} {data.description} </p>
                        <div className="dateCheck">
                            <h5 className='actExpireDate'>{expireDate.getDate()} de {meses[expireDate.getMonth()]} de {expireDate.getFullYear()}</h5>
                            {isJoined ? <Button variant="danger" onClick={leaveActivity}>Abandonar</Button> : <Button variant="primary" onClick={joinActivity}>Unirse</Button>}
                        </div>
                        <div className="joinedUsers">
                            <h5 className='actUserName'>Participantes: {data.joinedUsers} {data.joinedUsers !== 1 ? 'usuarios' : 'usuario'}</h5>
                            <p>{data.friendsData.map((user, index) => (
                                <span key={user.friend_id}>
                                    <Link to="/">{user.friend_name} {user.friend_lastname}</Link>{index !== data.friendsData.length - 1 ? ", " : ""}
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