import React, { useState, useEffect, useRef } from 'react';
import './Notifications.css';
import { Bell } from 'react-bootstrap-icons';

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [isDown, setIsDown] = useState(false);
    const boxRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        fetch('http://localhost:3001/api/requests/pendings', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data); // Esto te permitirá ver los datos en la consola
                setNotifications(data);
            })
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        const box = boxRef.current;
        if (isDown) {
            box.style.height = '510px';
            box.style.opacity = 1;
        } else {
            box.style.height = '0px';
            box.style.opacity = 0;
        }
    }, [isDown]);

    function toggleNotifi() {
        setIsDown(prevIsDown => !prevIsDown);
    }

    return (
        <>
            <div className="icon" onClick={toggleNotifi}>
                <Bell size={32} />
            </div>
            <div className="notifi-box" id="box" ref={boxRef}>
                <h2>Notifications <span>1</span></h2>
                {
                    
                    notifications.map((notification, index) => (
                        <div className="notifi-item" key={index}>
                            <div className="notifi-item-text">
                                <p>{notification.message}</p>
                            </div>
                            <div className="notifi-item-buttons">
                                <button className="accept-button">Accept</button>
                                <button className="reject-button">Reject</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    );
}

export default Notifications;
