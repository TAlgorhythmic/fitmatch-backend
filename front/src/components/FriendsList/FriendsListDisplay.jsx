import { useState, useEffect } from 'react';
import { Alert, Row, Col, Image, Button } from 'react-bootstrap';
import { Link, useLocation } from "react-router-dom";
import './FriendsListDisplay.css';

function FriendsList(props) {

    const { data } = props;
    const { handleRemoveFriend } = props;

    return (
        <>
            <Alert variant="info" className='customAlert'>
                <div className="FriendsList">
                    <Row>
                        <Col md={2}>
                            <div className='actDayLeftVisor'>
                                <Image src={`http://localhost:3001/uploads/${data.img}`} alt="userImage" className="activityUserImage" roundedCircle />
                            </div>
                        </Col>
                        <Col md={8}>
                            <div className="actDayRightVisor">
                                <h5>{data.name} {data.lastname}</h5>
                                <p>{data.description}</p>
                            </div>
                        </Col>
                        <Col md={2}>
                            <Button className="friendsButtons" variant="danger" onClick={handleRemoveFriend(data.id)}>Eliminar</Button>
                            <Link to={`/friends/view/${data.id}`}>
                                <Button className="friendsButtons" variant="primary">Ver</Button>
                            </Link>
                        </Col>
                    </Row>
                </div>
            </Alert>
        </>
    )
}

export default FriendsList;