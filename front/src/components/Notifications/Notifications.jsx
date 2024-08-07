import { useState, useEffect, useRef } from 'react';
import './Notifications.css';
import { Bell } from 'react-bootstrap-icons';

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [isDown, setIsDown] = useState(false);
    const boxRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        fetch('http://localhost:3001/api/requests/pendings', {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                response.json()
                .then(data => {
                    // TODO yang
                    if (data.status !== 0) {
                        console.log("Fatal error fetching pendings.");
                        console.log(data);
                        return;
                    }
                    console.log(data.data);
                    setNotifications(data.data);
                })

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
                <h2>Notifications <span>{notifications.length}</span></h2>
                {
                    Array.isArray(notifications) && notifications.length >= 0 ? (
                        notifications.map((notification, index) => (
                            <div className="notifi-item" key={index}>
                                <div className="notifi-item-img">
                                    <img src={`http://localhost:3001/uploads/${notification.img}`} />
                                </div>
                                <div className="notifi-item-text">
                                    <p>{notification.name} <span>{notification.lastName}</span></p>
                                </div>
                                <div className="notifi-item-buttons">
                                    <button className="accept-button">Accept</button>
                                    <button className="reject-button">Reject</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No notifications available.</p> // Mensaje opcional cuando no hay notificaciones
                    )
                }
            </div>
        </>
    );
}

export default Notifications;
