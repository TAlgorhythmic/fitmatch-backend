import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CreateActivity.css';
import { showPopup } from './Utils/Utils.js';
import ActivitiesController from './controllers/ActivitiesController.js';

function EditActivity() {
    const token = localStorage.getItem('authToken');
    const ActivityController = new ActivitiesController(token);
    const { id } = useParams();
    const [activity, setActivity] = useState({});
    const [expires, setExpires] = useState(undefined);

    useEffect(() => {
        async function getActivity() {
            await ActivityController.getActivityById(id)
                .then(response => {
                    setActivity(response);
                    setExpires(response.expires);
                })
                .catch(error => {
                    showPopup("Error Loading Activity", error, false);
                });
        }

        getActivity();
    }, []);

    useEffect(() => {
        async function getPressedButton() {
            // Obtener los valores de los inputs usando el id
            const titleInput = document.getElementById('title').value;
            const descriptionInput = document.getElementById('description').value;
            const expiresInput = document.getElementById('expires').value;

            try {
                await ActivityController.updateActivity(id, titleInput, descriptionInput, expiresInput);
                showPopup("ACTIVIDAD ACTUALIZADA CORRECTAMENTE", "", false);
            } catch (error) {
                console.error('Error al actualizar la actividad:', error);
                showPopup("ERROR AL ACTUALIZAR ACTIVIDAD", error.message, true);
            }
        }

        // Agregar evento de clic al botón plusButton
        const plusButton = document.querySelector('.plusButton');
        plusButton.addEventListener('click', getPressedButton);

        // Limpieza del evento al desmontar el componente
        return () => {
            plusButton.removeEventListener('click', getPressedButton);
        };
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setActivity(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    return (
        <>
            <form className='form-create-activity'>
                <p className="title">EDIT ACTIVITY</p>
                <div>
                    <label>
                        <span>Title</span>
                        <input id="title" className="input-activity" type="text" placeholder="" required="" value={activity.title} onChange={handleChange} />
                    </label>

                    <label>
                        <span>Description</span>
                        <input id="description" className="input-activity" type="text" placeholder="" required="" value={activity.description} onChange={handleChange} />
                    </label>
                </div>

                <label>
                    <span>Expires</span>
                    <input id="expires" className="date-input" style={{ marginBottom: "10px" }} type="datetime-local" placeholder="" required="" />
                </label>
                <a className="plusButton">
                    <svg className="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                        <g mask="url(#mask0_21_345)">
                            <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
                        </g>
                    </svg>
                </a>
            </form>
        </>
    )
}

export default EditActivity;