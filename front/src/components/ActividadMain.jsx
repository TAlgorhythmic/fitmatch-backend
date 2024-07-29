import { Row, Col, Image } from 'react-bootstrap';
import { Link } from "react-router-dom";

function ActividadMain(props) {

    const activity = props.data;

    return (
        <>
            <div className="activity-container">
                <Alert variant="info">
                    {activity.description}
                </Alert>
            </div>
        </>
    )
}

export default ActividadMain;