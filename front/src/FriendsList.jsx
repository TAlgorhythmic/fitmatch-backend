import { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import UsersController from './controllers/UsersController';
import FriendsListDisplay from './components/FriendsList/FriendsListDisplay';

function FriendsList() {

    const token = localStorage.getItem('authToken');
    const UserControl = new UsersController(token);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function getFriends() {
            const friends = await UserControl.getConnections();
            if (friends.status === 0) {
                if (friends.data.length) setUsers(friends.data);
                else console.log("No data found (array empty).");
            } else {
                console.log('Error: ', friends);
            }
        }
        getFriends();
    }, []);

    return (
        <div className="contenedorHome">
            {users.map((user, index) => (
                <Row key={index}>
                    <FriendsListDisplay data={user} />
                </Row>
            ))}
        </div>)
}

export default FriendsList;