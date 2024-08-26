import { useEffect, useState } from 'react';
import './CreateActivity.css';
import { showPopup } from './Utils/Utils.js';
import ActivitiesController from './controllers/ActivitiesController.js';
import { OK } from "./Utils/StatusCodes.js";
import { Navigate } from "react-router-dom";
import MapLocationPicker from './components/Maps/MapLocationPicker.jsx';
import { isApiLoaded } from './App.jsx';

function CreateActivity() {

    const token = localStorage.getItem('authToken');
    const ActivityController = new ActivitiesController(token);
    const [location, setLocation] = useState({
        address: "",
        lng: null,
        lat: null
    });
 
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        async function getPressedButton() {
            // Obtener los valores de los inputs usando el id
            const titleInput = document.getElementById('title').value;
            const descriptionInput = document.getElementById('description').value;
            const expiresInput = document.getElementById('expires').value;

            if (!location.address || !location.lat || !location.lng) {
                showPopup("Error al crear una actividad", "Debes especificar el lugar en donde se realizará esta actividad", true);
                return;
            }

            try {
                const res = await ActivityController.createActivity(titleInput, descriptionInput, expiresInput, location.address, location.lat, location.lng);
                if (res.status === OK) {
                    showPopup("¡Actividad creada correctamente!", "", false);
                    document.getElementById('title').value = "";
                    document.getElementById('description').value = "";
                    document.getElementById('expires').value = "";
                    setRedirect(true);
                } else {
                    showPopup("Error al crear actividad", res.error, true);
                }
            } catch (error) {
                console.error('Error al crear la actividad:', error);
                showPopup("ERROR AL CREAR ACTIVIDAD", "", true);
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

    if (redirect) return <Navigate to="/agenda" />;

    return (
        <>
            <form className='form-create-activity'>
                <h1 className="title">Crear actividad</h1>
                <div className='flexx'>
                    <label className='normal-width marginright'>
                        <span>Título</span>
                        <input id="title" className="input-activity-title" type="text" placeholder="" required="" />
                    </label>
                    <label className='normal-width'>
                        <span>Fecha y hora</span>
                        <input id="expires" className="date-input" style={{ marginBottom: "10px" }} type="datetime-local" placeholder="" required="" />
                    </label>
                </div>

                <label>
                    <span>Descripción</span>
                    <textarea id="description" className="input-activity-description" type="text" placeholder="" required="" />
                </label>
                {
                    isApiLoaded ? <MapLocationPicker setLocation={setLocation} location={location}/> : <></>
                }
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

export default CreateActivity;
