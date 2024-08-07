import { Alert, Row, Col, Image } from 'react-bootstrap';
import { CheckCircleFill, CheckCircle } from 'react-bootstrap-icons';
import './ActivityPostHome.css';

function ActivityPostHome(props) {
    const { data } = props;
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let postDate = new Date(data.postDate);
    let expireDate = new Date(data.expires);
    return (
        <div className="activityContainer">
            <Alert variant="info" className='customAlert'>
                <Row>
                    <Col md={2}>
                        <Image src={`http://localhost:3001/uploads/${data.user.img}`} alt="userImage" className="activityUserImage" roundedCircle />
                    </Col>
                    <Col md={10}>
                        <h5 className='actUserName'>{data.user.name} {data.user.lastname} <span>posteó el {postDate.getDate()} de {meses[postDate.getMonth()]} de {postDate.getFullYear()}</span> </h5>
                        <hr />
                        <Alert.Heading>{data.title}</Alert.Heading>
                        <p>{data.description} {data.description} {data.description} {data.description} {data.description} {data.description} {data.description} {data.description} {data.description} </p>
                        <div className="dateCheck">
                            <h5 className='actExpireDate'>{expireDate.getDate()} de {meses[expireDate.getMonth()]} de {expireDate.getFullYear()}</h5>
                            <CheckCircle color="grey" size={28} />
                        </div>
                    </Col>
                </Row>

            </Alert>
        </div>
    );
}

export default ActivityPostHome;