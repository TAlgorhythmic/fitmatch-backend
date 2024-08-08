import { useState, useEffect, useRef } from 'react';
import './Notifications.css';
import { Bell } from 'react-bootstrap-icons';

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [isDown, setIsDown] = useState(false);
    const [updateList, setUpdateList] = useState(false);
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
                        if (data.status !== 0) {
                            console.log("Fatal error fetching pendings.");
                            return;
                        }
                        setNotifications(data.data);
                    })

            })
            .catch(error => console.error(error));
    }, [updateList]);

    useEffect(() => {
        const box = boxRef.current;
        setUpdateList(prev => !prev);
        if (isDown) {
            box.style.height = '510px';
            box.style.opacity = 1;
            box.style.pointerEvents = 'auto';
        } else {
            box.style.height = '0px';
            box.style.opacity = 0;
            box.style.pointerEvents = 'none';
        }
    }, [isDown]);

    function toggleNotifi() {
        setIsDown(prevIsDown => !prevIsDown);
    }

    function handleReject(id) {
        const token = localStorage.getItem('authToken');
        fetch(`http://localhost:3001/api/requests/rejectFriendRequest/${id}`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                response.json()
                    .then(data => {
                        data.ok ? alert("Request rejected successfully.") : alert("Error rejecting request.");
                        setUpdateList(prev => !prev);
                    })
            })
    }

    function handleAccept(id) {
        const token = localStorage.getItem('authToken');
        fetch(`http://localhost:3001/api/requests/accept/${id}`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                response.json()
                    .then(data => {
                        console.log(data);
                        data.ok ? alert("Request accepted successfully.") : alert("Error accepting request.");
                        setUpdateList(prev => !prev);
                    })
            })
    }

    return (
        <>
            <div onClick={toggleNotifi} className="notification-icon">
                <Bell size={32} color='blue' />
                {
                    notifications.length > 0 ? <div className='notifi-count'>{notifications.length}</div> : null
                }

            </div>
            <div className="notifi-box" id="box" ref={boxRef}>
                <h2>Notifications <span>{notifications.length}</span></h2>
                {
                    Array.isArray(notifications) && notifications.length >= 0 ? (
                        notifications.map((notification, index) => (
                            <div className="notifi-item" key={index}>
                                <div>
                                    <img src={`http://localhost:3001/uploads/${notification.img}`} />
                                </div>
                                <div className='text'>
                                    <h4>{notification.name} {notification.lastName}</h4>
                                    <p>{notification.description}</p>
                                </div>
                                <div className="buttons">
                                    <button className="accept-button" onClick={() => handleAccept(notification.id)}>
                                        <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                            <g id="SVGRepo_iconCarrier"> <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            </path>
                                            </g>
                                        </svg>
                                    </button>
                                    <button className="reject-button" onClick={() => handleReject(notification.id)}>
                                        <svg fill="#000000" height="15px" width="15px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 460.775 460.775" xmlSpace="preserve">
                                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                            <g id="SVGRepo_iconCarrier">
                                                <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path>
                                            </g>
                                        </svg>
                                    </button>
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
