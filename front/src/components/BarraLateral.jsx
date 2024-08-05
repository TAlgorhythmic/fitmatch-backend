import { ArrowRight, HandThumbsUp, PeopleFill } from 'react-bootstrap-icons';

function BarraLateral() {

    return (
        <>
            <div className="barraLateral">
                <PeopleFill size={32} />
                <HandThumbsUp size={32} />
                <ArrowRight size={32} />
            </div>
        </>
    )
}

export default BarraLateral;