import { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { showPopup } from '../../Utils/Utils';

const Register = () => {

    const [formData, setFormData] = useState({
        phone: '',
        password: '',
        name: '',
    });
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.status == 0) {
                const token = data.token;
                localStorage.setItem('authToken', token);
                setSuccess(true);
                setError('');
                navigate('/formulario');
            } else {
                showPopup("Error", data.error, true);
            }

        } catch (err) {
            console.error('Error during registration:', err);
            setError('Error during registration. Please try again.');
        }
    };

    return (
        <>
            <div className="register-container">
                <div className="formulario-register">
                    <h2 className='h2OfRegister'>Sign Up</h2>
                    {success ? (
                        <p className="mensaje">Registration successful!</p>
                    ) : (
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your phone"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Introduce tu contraseña"
                                    />
                                </div>
                                <div className="form-group">
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
                                <button type="submit" className="buttonRegister">Sign Up</button>
                                <p className="link-to-login">¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a></p>
                                {error && <p className="error-message">{error}</p>}
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Register;


