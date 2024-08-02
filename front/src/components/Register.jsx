import { useState } from 'react';
import BaseController from './../controllers/BaseController';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './Register.css';

const CLIENT_ID = '913371404323-ngqfki68d7olj5dq9osqtv1ig493iab8.apps.googleusercontent.com';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name:''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const authController = new BaseController('auth/register');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authController.createItem(formData);
            console.log('User registered:', response);
            setSuccess(true);
            setError('');
        } catch (err) {
            console.error('Error during registration:', err);
            setError('Failed to register. Please try again.');
        }
    };

    const handleGoogleLoginSuccess = (credentialResponse) => {
        console.log('Login Success:', credentialResponse);
        // Enviar el token al backend para verificación
        fetch('http://localhost:3001/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: credentialResponse.credential }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('User authenticated:', data);

        })
        .catch(error => {
            console.error('Error during Google sign-in:', error);
        });
    };

    const handleGoogleLoginFailure = (error) => {
        console.error('Google Login Failed:', error);
    };

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <div className="page-container">
                <div className="register-container">
                    <div className="register-card">
                        <h2>Sign Up</h2>
                        {success ? (
                            <p className="success-message">Registration successful!</p>
                        ) : (
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="email">Gmail</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your Gmail"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your password"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <button type="submit" className="register-button">Sign Up</button>
                                    {error && <p className="error-message">{error}</p>}
                                </form>
                                <GoogleLogin
                                    onSuccess={handleGoogleLoginSuccess}
                                    onError={handleGoogleLoginFailure}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="slogan-container">
                    <p className="slogan-text">
                        Encuentra a tu compañero ideal...  
                    </p>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Register;

