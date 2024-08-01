import { useState } from 'react';
import BaseController from './../controllers/BaseController';
import './Register.css';

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

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Sign Up</h2>
                {success ? (
                    <p className="success-message">Registration successful!</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Gmail Address</label>
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
                                type="name"
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
                )}
            </div>
        </div>
    );
};

export default Register;


