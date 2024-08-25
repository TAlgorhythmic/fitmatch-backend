import { useState, useEffect } from 'react';
import './App.css';
import { Row } from 'react-bootstrap';
import ActivityPostHome from './components/Home/ActivityPostHome';
import './Home.css';
import ActivitiesController from './controllers/ActivitiesController';
import UsersController from './controllers/UsersController';

function Home() {

    const [activities, setActivities] = useState([]);
    const [friends, setFriends] = useState([]);
    const token = localStorage.getItem('authToken');
    const ActivityControl = new ActivitiesController(token);
    const usersControl = new UsersController(token);

    useEffect(() => {
        async function getActivities() {
            const activitiesData = await ActivityControl.getFeed();
            console.log(activitiesData);
            if (activitiesData.status === 0) {
                if (activitiesData.data.length) setActivities(activitiesData.data);
                else console.log("No data found (array empty).");
            } else {
                console.log('Error: ', activitiesData);
            }
        }
        getActivities();

    }, []); // Dependencia añadida

    useEffect(() => {
        async function getFriends() {
            const friendsData = await usersControl.getFriends();
            if (friendsData.status === 0) {
                if (friendsData.data.length) setFriends(friendsData.data);
                else console.log("No data found (array empty).");
            } else {
                console.log('Error: ', friendsData);
            }
        }
        getFriends();
        console.log(friends);
    }, []);
    

    return (
        <>
            <div className="contenedorHome">
                {activities.map((activity, index) => (
                    <Row key={index}>
                        <ActivityPostHome data={activity} friendsList={friends} />
                    </Row>
                ))}
            </div>
        </>

    );
}

export default Home;