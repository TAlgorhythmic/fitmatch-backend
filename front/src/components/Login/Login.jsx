import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { Form, InputGroup } from 'react-bootstrap';
import './Login.css';

const Login = () => {
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [resposta, setResposta] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const loginData = {
            field: email,
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
        <div className="auth-container">
    <div className="auth-box">
        <h2 className="auth-header">Te estamos esperando<br/> Inicia tu sesión</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <InputGroup className="input-group-custom">
                    <InputGroup.Text className="input-icon">
                    <FaEnvelope/>
                    </InputGroup.Text>
                    <input
                        type="text"
                        placeholder="fitmatch@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control input-field"
                    />
                </InputGroup>
            </div>
            <div className="form-group">
                <InputGroup className="input-group-custom">
                    <InputGroup.Text className="input-icon">
                        <FaLock />
                    </InputGroup.Text>
                    <input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control input-field"
                    />
                    <span className="toggle-password" onClick={togglePasswordVisibility}>
                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </InputGroup>
            </div>
            <button type="submit" className="auth-buttons">Iniciar sesión</button>
        </form>
        <a href="#" onClick={handleForgotPasswordClick} className="link-to-auth">
            ¿Olvidaste tu contraseña?
        </a>
        <hr className="auth-divider" />
        <p className="link-to-auth">
            ¿No tienes cuenta? <a href="/register">Sing up</a>
        </p>
        <h3>{resposta}</h3>
    </div>
</div>
);
};
export default Login;