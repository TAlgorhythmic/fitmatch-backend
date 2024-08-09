import { useEffect, useState} from 'react';
import './CreateActivitie.css'

function CreateActivitie() {
    const [messageBack, setmessageBack] = useState('');

    useEffect(() => {
        function getPressedButton() {
            const token = localStorage.getItem('authToken');
            // Obtener los valores de los inputs usando el id
            const titleInput = document.getElementById('title').value;
            const descriptionInput = document.getElementById('description').value;
            const expiresInput = document.getElementById('expires').value;

            console.log(expiresInput)

            fetch('http://localhost:3001/api/activities/create', {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: titleInput,
                    description: descriptionInput,
                    expires: expiresInput,
                })
            })
                .then(res => res.json())
                .then(res => {
                    if (res.ok) {
                        setmessageBack("Activitie created successfully");
                        titleInput.value = "";
                        descriptionInput.value = "";
                        expiresInput.value = "";
                    } else {
                        setmessageBack("Error creating activitie");
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
            <form className='form-create-activitie'>
                <p className="title">CREATE ACTIVITIE</p>
                <div className="flex">
                    <label>
                        <span>Title</span>
                        <input id="title" className="input-activitie" type="text" placeholder="" required="" />
                    </label>

                    <label>
                        <span>Description</span>
                        <input id="description" className="input-activitie" type="text" placeholder="" required="" />
                    </label>
                </div>

                <label>
                    <span>Expires</span>
                    <input id="expires" className="date-input" style={{ marginBottom: "10px" }} type="datetime-local" placeholder="" required="" />
                </label>
                <a className="plusButton" href="#popup1">
                    <svg className="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                        <g mask="url(#mask0_21_345)">
                            <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
                        </g>
                    </svg>
                </a>

                <div id="popup1" className="overlay">
                    <div className="popup">
                        <h2>{messageBack}</h2>
                        <a className="close" href="#">&times;</a>
                        <div className="content">
                            <p>Si tiene dudas pregunte al servicio tecnico</p>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default CreateActivitie;
