import { useState, useEffect } from 'react';
import './App.css';
import { Row, Button } from 'react-bootstrap';
import ActivityPostHome from './components/Home/ActivityPostHome';
import './Home.css';
import ActivitiesController from './controllers/ActivitiesController';
import UsersController from './controllers/UsersController';
import { Link } from "react-router-dom";

function Home() {

    const [activities, setActivities] = useState([]);
    const [friends, setFriends] = useState([]);
    const token = localStorage.getItem('authToken');
    const ActivityControl = new ActivitiesController(token);
    const usersControl = new UsersController(token);
    const [isEnded, setEnded] = useState(false);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        async function getActivities() {
            const activitiesData = await ActivityControl.getCreateFeedSession();
            console.log(activitiesData);
            if (activitiesData.status === 0) {
                if (activitiesData.data.length) setActivities(activitiesData.data);
                else console.log("No data found (array empty).");
            } else {
                console.log('Error: ', activitiesData);
            }
        }

        async function handleScroll() {
            const scrollPos = window.scrollY + window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollPos >= documentHeight - 100) {
                setLoading(true);
                const activitiesData = await ActivityControl.getFeed();
                console.log(activitiesData);
                if (activitiesData.status === 0) {
                    if (activitiesData.data.length) {
                        setActivities([...activities, ...activitiesData.data])
                        setLoading(false);
                    }
                    else {
                        setEnded(true);
                        setLoading(false)
                    }
                } else {
                    console.log('Error: ', activitiesData);
                }
            }
        }

        window.addEventListener("scroll", handleScroll);

        getActivities();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
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
    }, []);

    if (friends.length === 0) {
        return (
            <div className="contenedorHome">
                <div className="homeDisclaimer">
                <h6>Aún no has agregado a nuevos compañeros</h6>
                <Link to="/friends"><Button>Conecta con gente</Button></Link>
            </div>
            </div>
        );
    } else if (activities.length === 0) {
        return (
           
            <div className="contenedorHome">
                <div className="homeDisclaimer">
                    <h6>Aún no hay actividades nuevas de tus compañeros</h6>
                    <Link to="/create-activity" className='BotonNoActividades'><Button>Publica una actividad</Button></Link>
            </div>
            </div>
        );
    }

    return (
        <>
            <div className="contenedorHome">
                {activities.map((activity, index) => (
                    <Row key={index}>
                        <ActivityPostHome data={activity} friendsSet={new Set(friends)} />
                    </Row>
                ))}
                <span className={isLoading ? "loader" : "hidden"}></span>
                {
                    isEnded ? <div className="homeDisclaimer">
                        <h6>Esto es todo por ahora...</h6>
                    </div> : <></>
                }
            </div>
        </>

    );
}

export default Home;