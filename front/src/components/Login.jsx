import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 


const Login = () => {
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

        fetch("http://localhost:3001/api" + "/auth/login", requestOptions)
         .then(response => response.json())
            .then(response => {
                if (response.status===0) {
                    setResposta('Login successful');
                    const token = response.token;
                    localStorage.setItem('authToken', token);
                    navigate('/');
                } else {
                    setResposta('Login failed: ' + response.message);
                }
            })
            .catch(error => {
                setResposta('Error connecting to API');
                console.log(error);
            });
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="logo-text">W</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
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
                    <button type="submit" className="login-button">Log In</button>
                </form>
                <a href="#" className="forgot-password">Forgot your password?</a>
                <h3>{resposta}</h3> 
            </div>
        </div>
    );
};

export default Login;

