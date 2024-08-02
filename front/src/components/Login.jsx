import React, { useState } from 'react';
import './Login.css'; // Asegúrate de crear este archivo con los estilos

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes manejar la lógica de autenticación
        console.log('Email:', email, 'Password:', password);
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
            </div>
        </div>
    );
};

export default Login;
