import { useState, useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Button} from 'react-bootstrap';
import { useSwipeable } from 'react-swipeable';
import { showPopup } from './Utils/Utils';
import UsersController from './controllers/UsersController';

function FriendData() {

    const { id } = useParams();
    const token = localStorage.getItem('authToken');
    const UserControl = new UsersController(token);

    const [person, setPerson] = useState({});

    useEffect(() => {
        async function getUser() {
            await UserControl.getProfileById(id)
                .then(response => {
                    setPerson(response);
                })
                .catch(error => {
                    showPopup("Error Loading User", error, false);
                });
        }
        getUser();
    }, []);

    const handleRemoveFriend = async () => {
        const response = await UserControl.removeFriend(person.id);
        if (response.status === 0) {
            showPopup("Usuario eliminado correctamente", error, false);
            redirect("/friends/list");
        } else {
            console.log('Error: ', response);
            showPopup("Error removing User", error, true);
        }
    }

    return (
        <>
            <div className="contenedor-deslizar-perfiles" style={{ position: 'relative' }}>
                <div className="perfil-activo contenedor-perfil">
                    <div className="tarjeta-perfil">
                        <div className="cabecera-perfil">
                            <h3 className="nombre-perfil">{person.name} {person.lastname}</h3>
                            <p className="nivel-perfil"><strong>Nivel:</strong> {person.proficiency}</p>
                        </div>
                        <div className="contenido-perfil">
                            <div className="informacion-horarios">
                                <h5>Mi horario</h5>
                                <div className="dias-horarios">
                                    <div className="dias-semana">
                                        {person.monday ? (
                                            <span className="etiqueta-preferencia me-2 mb-2">Lunes</span>
                                        ) : <> </>}
                                        {person.tuesday ? (
                                            <span className="etiqueta-preferencia me-2 mb-2">Martes</span>
                                        ) : <> </>}
                                        {person.wednesday ? (
                                            <span className="etiqueta-preferencia me-2 mb-2">Miércoles</span>
                                        ) : <></>}
                                        {person.thursday ? (
                                            <span className="etiqueta-preferencia me-2 mb-2">Jueves</span>
                                        ) : <></>}
                                        {person.friday ? (
                                            <span className="etiqueta-preferencia me-2 mb-2">Viernes</span>
                                        ) : <></>}
                                        {person.saturday ? (
                                            <span className="etiqueta-preferencia me-2 mb-2">Sábado</span>
                                        ) : <></>}
                                        {person.sunday ? (
                                            <span className="etiqueta-preferencia me-2 mb-2">Domingo</span>
                                        ) : <></>}
                                    </div>
                                    <div className="horarios-gimnasio">
                                        <p><strong>Entrada:</strong> {person.timetable1}</p>
                                        <p><strong>Salida:</strong> {person.timetable2}</p>
                                    </div>
                                </div>
                            </div>
                            <img
                                draggable="false"
                                src={`http://localhost:3001/uploads/${person.img}`}
                                alt={person.name}
                                className="imagen-perfil-derecha"
                            />
                        </div>
                        <div className="informacion-perfil">
                            <p className="preferencias-perfil">
                                {person.trainingPreferences?.map((preference, index) => (
                                    <span key={index} className="etiqueta-preferencia me-2 mb-2">
                                        {preference}
                                    </span>
                                )) || []}
                            </p>
                            <p className="descripcion-perfil">{person.description}</p>
                            <Button className="friendsButtons" variant="danger" onClick={() => handleRemoveFriend()}>Eliminar</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FriendData;