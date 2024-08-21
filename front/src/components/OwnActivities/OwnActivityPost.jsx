import './OwnActivityPost.css';
import { meses } from '../../data/meses';
import JoinedActivitiesController from '../../controllers/ActivitiesController';
import { Alert, Row, Col, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

function OwnActivityPost(props) {

    const { data } = props;

    let postDate = new Date(data.postDate);
    let expireDate = new Date(data.expires);

    const token = localStorage.getItem('authToken');
    const AgendaController = new JoinedActivitiesController(token);

    async function deleteActivity() {
        await AgendaController.leaveActivity(data.id)
            .then(response => {
                showPopup("Deleted Succesfully", "", false);
            })
            .catch(error => {
                showPopup("Error Deleting Activity", error, false);
            });
    }

    return (
        <>
            <div className="activityContainer">
                <Alert variant="info" className='customAlert'>
                    <Row>
                        <Col className="dataActivity">
                            <h2>{data.title}</h2>
                            <br />
                            <p>{data.description}</p>
                            <br />
                            <Button variant="danger" className="btn-danger" onClick={deleteActivity}>Eliminar</Button>
                            <Link to={`/activities/edit/${data.id}`} className="btn btn-success">Editar</Link>
                        </Col>
                    </Row>
                </Alert>
            </div>
        </>
    )
}

export default OwnActivityPost;