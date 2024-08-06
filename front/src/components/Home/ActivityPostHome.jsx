import { Alert } from 'react-bootstrap';

function ActivityPostHome(props) {
    const { data } = props;
    return (
        <div className="activity-container">
            <Alert variant="info">
                <Alert.Heading>{data.title}</Alert.Heading>
                <p>{data.description}</p>
                <hr />
                <p className="mb-0">{data.expires}</p>
            </Alert>
        </div>
    );
}

export default ActivityPostHome;