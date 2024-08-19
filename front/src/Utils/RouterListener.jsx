import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function RouterCheckerListener(props) {

    const check = props.check;
    const actionIfFalse = props.actionIfFalse;
    const whereToNavigate = props.whereToNavigate;

    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {
        if (!check()) {
            actionIfFalse();
            navigate(whereToNavigate);
        }
    }, [location])

    return null;
}