import { useState, useEffect, useRef } from 'react';
import './Notifications.css';
import {showPopup} from '../../Utils/Utils.js';

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [isDown, setIsDown] = useState(false);
    const [updateList, setUpdateList] = useState(false);
    const boxRef = useRef(null);

    useEffect(() => {
        function recursive() {
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
                .catch(error => console.error(error))
                .finally(e => {
                    setTimeout(() => {
                        recursive();
                    }, 12000);
                })
        }
        
        recursive();
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
                        data.ok ? showPopup("Request rejected successfully.", "", false) : showPopup("Error rejecting request.", "", true);
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
                        data.ok ? showPopup("Request accepted successfully.", "", false) : alert("Error accepting request.", "", true);
                        setUpdateList(prev => !prev);
                    })
            })
    }

    return (
        <>
            <div onClick={toggleNotifi} className="notification-icon">
                <svg className='bell-icon' fill="#ff6600" width="32px" height="32px" viewBox="-1.5 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path d="m19.945 15.512c-.8-.786-1.619-1.6-1.619-5.44-.005-3.881-2.832-7.101-6.539-7.717l-.046-.006c.165-.237.263-.531.263-.848 0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5c0 .317.098.611.266.853l-.003-.005c-3.753.623-6.579 3.843-6.584 7.723v.001c0 3.84-.822 4.655-1.619 5.44-.653.577-1.062 1.417-1.062 2.352 0 1.732 1.404 3.135 3.135 3.135h.007 4.36c0 1.657 1.343 3 3 3s3-1.343 3-3h4.363.007c1.732 0 3.135-1.404 3.135-3.135 0-.935-.409-1.775-1.059-2.349l-.003-.003zm-9.441 6.613c-.621-.001-1.124-.504-1.125-1.125h2.251c-.001.621-.505 1.125-1.126 1.125zm7.36-3.376h-14.726c-.487-.003-.881-.398-.881-.886 0-.243.098-.463.256-.623 1.34-1.34 2.418-2.612 2.418-7.17 0-3.077 2.495-5.572 5.572-5.572s5.572 2.495 5.572 5.572c0 4.578 1.089 5.84 2.418 7.17.158.16.256.38.256.623 0 .488-.394.883-.881.886z"></path>
                    </g>
                </svg>
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
