import { Alert, Row, Col, Image } from 'react-bootstrap';
import './ActivityPostHome.css';

function ActivityPostHome(props) {
    const { data } = props;
    return (
        <div className="activityContainer">
            <Alert variant="info" className='customAlert'>
                <Row>
                    <Col md={2}>
                        <Image src={`http://localhost:3001/uploads/${data.user.img}`} alt="userImage" className="activityUserImage" roundedCircle />
                    </Col>
                    <Col md={10}>
                        <Alert.Heading>{data.title}</Alert.Heading>
                        <p>{data.description}</p>
                        <hr />
                        <p className="mb-0">{data.expires}</p>
                    </Col>
                </Row>

            </Alert>
        </div>
    );
}

export default ActivityPostHome;