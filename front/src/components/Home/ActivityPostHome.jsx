import { Alert, Row, Col } from 'react-bootstrap';
import './ActivityPostHome.css';

function ActivityPostHome(props) {
    const { data } = props;
    return (
        <div className="activityContainer">
            <Alert variant="info" className='customAlert'>
                <Row>
                    <Col md={3}>
                    </Col>
                </Row>
                <Alert.Heading>{data.title}</Alert.Heading>
                <p>{data.description}</p>
                <hr />
                <p className="mb-0">{data.expires}</p>
            </Alert>
        </div>
    );
}

export default ActivityPostHome;