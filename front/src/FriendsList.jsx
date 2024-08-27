import { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import UsersController from './controllers/UsersController';
import FriendsListDisplay from './components/FriendsList/FriendsListDisplay';
import { showPopup } from "./Utils/Utils.js"

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

    const handleRemoveFriend = async (id) => {
        const response = await UserControl.removeFriend(id);
        if (response.status === 0) {
            const updatedUsers = users.filter(user => user.id !== id);
            showPopup("Usuario borrado correctamente", "", false);
            setUsers(updatedUsers);
        } else {
            console.log('Error: ', response);
            showPopup("Error deleting User", "", true);
        }
    }

    return (
        <div className="contenedorHome">
            {users.map((user, index) => (
                <Row key={index}>
                    <FriendsListDisplay data={user} handleRemoveFriend={handleRemoveFriend}/>
                </Row>
            ))}
        </div>)
}

export default FriendsList;