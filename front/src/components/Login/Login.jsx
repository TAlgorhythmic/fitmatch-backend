import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [resposta, setResposta] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const loginData = {
            field: phone,
            password: password
        };

        const requestOptions = {
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        };

        fetch("http://localhost:3001/api/auth/login", requestOptions)
         .then(response => response.json())
            .then(response => {
                if (response.status === 0) {
                    setResposta('Login successful');
                    const token = response.token;
                    localStorage.setItem('authToken', token);
                    navigate('/');
                } else {
                    setResposta('error: ');
                }
            })
            .catch(error => {
                setResposta('Error connecting to API');
                console.log(error);
            });
    };

    const handleForgotPasswordClick = (e) => {
        e.preventDefault();
        navigate('/nuevaContra');
    };

    return (
        <div className="principal-login">
            <div className="formulario-login">
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grupo-formulario">
                        <label htmlFor="phone">Teléfono</label>
                        <input 
                            type="text" 
                            id="phone"
                            placeholder="Introduce tu teléfono" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            required 
                            className="input-control"
                        />
                    </div>
                    <div className="grupo-formulario">
                        <label htmlFor="password">Contraseña</label>
                        <input 
                            type="password" 
                            id="password"
                            placeholder="Introduce tu contraseña" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="input-control"
                        />
                    </div>
                    <button type="submit" className="boton-login">Iniciar Sesión</button>
                </form>
                <a href="#" onClick={handleForgotPasswordClick} className="enlace-forgot-password">
                    ¿Olvidaste tu contraseña?
                </a>
                <h3>{resposta}</h3> 
            </div>
        </div>
    );
};
export default Login;


