import { useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { OK } from "../../Utils/StatusCodes";
import { useNavigate } from "react-router-dom";
import { showPopup } from "../../Utils/Utils";

export default function Verify() {

    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const ref4 = useRef(null);
    const ref5 = useRef(null);

    const [isDisabled, setDisabled] = useState(true);

    const navigate = useNavigate();

    function submit() {
        const one = document.getElementById("one").value;
        const two = document.getElementById("two").value;
        const three = document.getElementById("three").value;
        const four = document.getElementById("four").value;
        const five = document.getElementById("five").value;

        const token = localStorage.getItem("authToken");

        fetch("http://localhost:3001/api/auth/verify", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({code: ""+one+two+three+four+five})
        }).then(e => e.json()).then(data => {
            if (data.status === OK) {
                showPopup("Info", "¡Te has verificado con éxito!");
                navigate("/formulario");
            }
        });
    }

    function onChange1() {
        if (ref2.current && document.getElementById("one").value.toString().length > 0) ref2.current.focus;
    }
    function onChange2() {
        if (ref3.current && document.getElementById("two").value.toString().length > 0) ref3.current.focus;
        else ref1.current.focus;
    }
    function onChange3() {
        if (ref4.current && document.getElementById("three").value.toString().length > 0) ref4.current.focus;
        else ref2.current.focus;
    }
    function onChange4() {
        if (ref5.current && document.getElementById("four").value.toString().length > 0) ref5.current.focus;
        else ref3.current.focus;
    }
    function onChange5() {
        if (ref5.current && document.getElementById("five").value.toString().length > 0) setDisabled(false);
        else {
            setDisabled(true);
            ref4.current.focus;
        }
    }

    return (
        <>
            <div className="container">
                <div className="icono-seguridad">
                    🔒
                </div>
                <div className="titulo">
                    2FA
                </div>
                <div className="subtitulo">
                    Hemos enviado un SMS con el código al número introducido, comprueba tus mensajes.
                </div>
                <div className="input-container">
                    <input ref={ref1} onChange={onChange1} id="one" type="number" maxLength="1" className="input-digit" />
                    <input ref={ref2} onChange={onChange2} id="two" type="number" maxLength="1" className="input-digit" />
                    <input ref={ref3} onChange={onChange3} id="three" type="number" maxLength="1" className="input-digit" />
                    <input ref={ref4} onChange={onChange4} id="four" type="number" maxLength="1" className="input-digit" />
                    <input ref={ref5} onChange={onChange5} id="five" type="number" maxLength="1" className="input-digit" />
                </div>
                <Button disabled={isDisabled} onClick={submit} />
            </div>
        </>
    );
}