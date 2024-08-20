import { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import UsersController from './controllers/UsersController';
import FriendsListDisplay from './components/FriendsList/FriendsListDisplay';

function FriendsList() {

    const UserControl = new UsersController();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function getFriends() {
            const friends = await UserControl.getFriends();
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