import { Row, Col } from 'react-bootstrap';
import ActividadMain from './ActividadMain';

function HomeLateral(props) {

    const activities = props.activitiesData;

    return (
        <>
            <div className="contenedorLateral">
                {activities.map((activity, index) => (
                    <Row key={index}>
                        <ActividadMain data={activity} />
                    </Row>
                ))}
            </div>
        </>
    );
}

export default HomeLateral;