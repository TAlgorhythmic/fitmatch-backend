import { Alert } from 'react-bootstrap';

function ProfileUser(props) {
    const { data } = props;
    return (
        <div className="activity-container">
            <Alert variant="info">
                <Alert.Heading>{data.name}</Alert.Heading>
                <p>{data.description}</p>
                <hr />
                <p className="mb-0">{data.lastname}</p>
            </Alert>
        </div>
    );
}

export default ProfileUser;