import { Alert, Row, Col, Image } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function ActividadMain(props) {

    const activity = props.data;

    return (
        <>
            <div className="activity-container">
                <Alert variant="info">
                    <Alert.Heading>{activity.title}</Alert.Heading>
                    <p>
                        {activity.description}
                    </p>
                    <hr />
                    <p className="mb-0">
                        {activity.expires}
                    </p>
                </Alert>
            </div>
        </>
    )
}

export default ActividadMain;