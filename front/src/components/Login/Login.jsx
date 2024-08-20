import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../../App';
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
                    setToken(true);
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
        <div className="login-container">
            <div className="login-box">
                <h2 className="h2OfLogin">LOGIN</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="buttonOfLogin">Log In</button>
                </form>
                {/* Aquí cambiamos el botón por un enlace */}
                <a href="#" onClick={handleForgotPasswordClick} className="link-to-register">
                    Forgot your password?
                </a>
                <hr className='hrOfLogin' />
                <p className='link-to-register'>
                    Dont have an account? <a href="/register">REGISTER</a>
                </p>
                <h3>{resposta}</h3>
            </div>
        </div>
    );
};
export default Login;


