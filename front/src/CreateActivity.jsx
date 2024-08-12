import { useEffect, useState } from 'react';
import './CreateActivity.css';
import { showPopup } from './Utils/Utils.js';
import ActivitiesController from './controllers/ActivitiesController.js';

function CreateActivity() {

    const ActivityController = new ActivitiesController();

    useEffect(() => {
        function getPressedButton() {
            const token = localStorage.getItem('authToken');
            // Obtener los valores de los inputs usando el id
            const titleInput = document.getElementById('title').value;
            const descriptionInput = document.getElementById('description').value;
            const expiresInput = document.getElementById('expires').value;

            console.log(expiresInput)

            ActivityController.createActivity(titleInput, descriptionInput, expiresInput, token)
                .then(res => res.json())
                .then(res => {
                    if (res.ok) {
                        showPopup("ACTIIVIDAD CREADA CORRECTAMENTE", "", false);
                        titleInput.value = "";
                        descriptionInput.value = "";
                        expiresInput.value = "";
                    } else {
                        showPopup("ERROR AL CREAR ACTIVIDAD", "", true);
                    }
                })
        }

        // Agregar evento de clic al botón plusButton
        const plusButton = document.querySelector('.plusButton');
        plusButton.addEventListener('click', getPressedButton);

        // Limpieza del evento al desmontar el componente
        return () => {
            plusButton.removeEventListener('click', getPressedButton);
        };
    }, []);

    return (
        <>
            <form className='form-create-activity'>
                <p className="title">CREATE ACTIVITY</p>
                <div>
                    <label>
                        <span>Title</span>
                        <input id="title" className="input-activity" type="text" placeholder="" required="" />
                    </label>

                    <label>
                        <span>Description</span>
                        <input id="description" className="input-activity" type="text" placeholder="" required="" />
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

export default CreateActivity;
