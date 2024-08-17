import { Button } from "react-bootstrap";
import "./PopupMessage.css";

export default function PopupMessage(props) {
    const isVisible = props.isVisible;
    const onClose = props.onClose;
    const title = props.title;
    const message = props.message;
    const isError = props.isError;

    return (
        <div className={`popup${isVisible ? " visible" : ""}${isError ? " error" : ""}`}>
            <div className="first-item flex"><h1 className="item">{title}</h1></div>
            <div className="flex"><hr className="separator item" /></div>
            <div className="flex">{message}</div>
            <div className="last-item flex"><Button onClick={onClose}>Aceptar</Button></div>
        </div>
    )
}