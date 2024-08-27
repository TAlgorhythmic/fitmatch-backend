import { useEffect, useState } from 'react';
import './components/CreateActivity/CreateActivity.css';
import { showPopup } from './Utils/Utils.js';
import ActivitiesController from './controllers/ActivitiesController.js';
import { OK } from "./Utils/StatusCodes.js";
import { Navigate, useParams } from "react-router-dom";
import MapLocationPicker from './components/Maps/MapLocationPicker.jsx';

function EditActivity() {

    const { id } = useParams();

    const token = localStorage.getItem('authToken');
    const ActivityController = new ActivitiesController(token);
    const [location, setLocation] = useState({
        address: "",
        lng: null,
        lat: null
    });
    const [activity, setActivity] = useState(null);

    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        async function getActivity() {
            console.log(id);
            const data = await ActivityController.getActivityById(parseInt(id))
            console.log(data);
            setActivity({ ...data, expires: new Date(data.expires) });
            setLocation({
                address: data.placeholder,
                lat: parseFloat(data.latitude),
                lng: parseFloat(data.longitude)
            })
        }

        getActivity();
    }, []);

    function onChange(e) {
        const { name, value } = e.target;

        setActivity({ ...activity, [name]: value });
    }

    async function onClick() {

        const titleInput = activity.title;
        const descriptionInput = activity.description;
        const expiresInput = activity.expires;

        try {
            const res = await ActivityController.updateActivity(id, titleInput, descriptionInput, expiresInput, location.address, location.lat, location.lng);
            if (res.status === OK) {
                showPopup("¡Actividad actualizada correctamente!", "", false);
                setRedirect(true);
            } else {
                showPopup("Error al actualizar actividad", res.error, true);
            }
        } catch (error) {
            console.error('Error al crear la actividad:', error);
            showPopup("ERROR AL ACTUALIZAR ACTIVIDAD", "", true);
        }
    }

    if (redirect) return <Navigate to="/" />;

    function formatDate(fechaObj) {
        // Extraer los componentes de la fecha
        let año = fechaObj.getFullYear();
        let mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
        let dia = String(fechaObj.getDate()).padStart(2, '0');
        let horas = String(fechaObj.getHours()).padStart(2, '0');
        let minutos = String(fechaObj.getMinutes()).padStart(2, '0');

        // Construir la cadena en el formato requerido
        let fechaConvertida = `${año}-${mes}-${dia}T${horas}:${minutos}`;
        return fechaConvertida;
    }

    return (
        <>
            <div className='form-create-activity'>
                <h1 className="title">Editar actividad</h1>
                <div className='flexx'>
                    <label className='normal-width marginright'>
                        <span>Título</span>
                        <input
                            id="title"
                            name='title'
                            onChange={onChange}
                            value={activity ? activity.title : ""}
                            className="input-activity-title"
                            type="text"
                            placeholder=""
                            required=""
                        />
                    </label>
                    <label className='normal-width'>
                        <span>Fecha y hora</span>
                        <input
                            id="expires"
                            name='expires'
                            onChange={onChange}
                            value={activity ?
                            formatDate(activity.expires) : ""}
                            className="date-input"
                            style={{ marginBottom: "10px" }}
                            type="datetime-local"
                            placeholder=""
                            required=""
                        />
                    </label>
                </div>

                <div className='flexx'>
                    <MapLocationPicker setLocation={setLocation} location={location} onChange={onChange} />
                    <label>
                        <span>Descripción</span>
                        <textarea id="description" name='description' onChange={onChange} value={activity ? activity.description : ""} className="input-activity-description" type="text" placeholder="" required="" />
                    </label>
                </div>

                
                <button className="plusButton" onClick={onClick}>
                    <svg className="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                        <g mask="url(#mask0_21_345)">
                            <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
                        </g>
                    </svg>
                </button>
            </div>
        </>
    )
}

/*function EditActivity() {
    const token = localStorage.getItem('authToken');
    const ActivityController = new ActivitiesController(token);
    const { id } = useParams();
    const [activity, setActivity] = useState({ title: '', description: '', expires: '' });
    const [expires, setExpires] = useState(undefined);

    function convertirFormato(fecha) {
        // Crear un objeto de fecha a partir de la cadena proporcionada
        let fechaObj = new Date(fecha);
    
        // Extraer los componentes de la fecha
        let año = fechaObj.getFullYear();
        let mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
        let dia = String(fechaObj.getDate()).padStart(2, '0');
        let horas = String(fechaObj.getHours()).padStart(2, '0');
        let minutos = String(fechaObj.getMinutes()).padStart(2, '0');
        let segundos = String(fechaObj.getSeconds()).padStart(2, '0');
        let milisegundos = String(fechaObj.getMilliseconds()).padStart(3, '0');
    
        // Construir la cadena en el formato requerido
        let fechaConvertida = `${año}-${mes}-${dia}T${horas}:${minutos}`;
    
        // Añadir segundos y milisegundos si es necesario
        if (segundos !== '00' || milisegundos !== '000') {
            fechaConvertida += `:${segundos}`;
            if (milisegundos !== '000') {
                fechaConvertida += `.${milisegundos}`;
            }
        }
    
        return fechaConvertida;
    }    

    useEffect(() => {
        async function getActivity() {
            await ActivityController.getActivityById(id)
                .then(response => {
                    setActivity(response);
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
                    <input id="expires" className="date-input" style={{ marginBottom: "10px" }} type="datetime-local" placeholder="" required="" value={convertirFormato(activity.expires).toString()}  />
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
}*/

export default EditActivity;