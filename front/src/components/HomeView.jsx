import { Row, Col } from 'react-bootstrap';
import ActividadMain from './ActividadMain';

function HomeView(props) {

    const activities = props.activitiesData;

    return (
        <>
            <div className="contenedorHome">
                {activities.map((activity, index) => (
                    <Row key={index}>
                        <ActividadMain data={activity} />
                    </Row>
                ))}
            </div>
        </>
    );
}

export default HomeView;