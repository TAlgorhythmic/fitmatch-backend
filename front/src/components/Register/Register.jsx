import { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { showPopup } from '../../Utils/Utils';
import { INVALID, OK } from '../../Utils/StatusCodes';
import { setUpdateUser } from '../../App';
import { FaEye, FaEyeSlash, FaPhoneAlt, FaUser, FaLock } from 'react-icons/fa';
import { Form, InputGroup } from 'react-bootstrap';
import zxcvbn from 'zxcvbn';

const Register = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    });
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [feedback, setFeedback] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        if (name === 'password') {
            const result = zxcvbn(value);
            setPasswordStrength(result.score);


            const errors = [];


            if (value.length < 8) {
                errors.push("Debe tener 8 caracteres.");
            }
            if (!/[A-Z]/.test(value)) {
                errors.push("Debe contener una letra mayúscula.");
            }
            if (!/[a-z]/.test(value)) {
                errors.push("Debe contener una letra minúscula.");
            }
            if (!/[0-9]/.test(value)) {
                errors.push("Debe contener un número.");
            }
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                errors.push("Debe contener un carácter especial.");
            }


            setFeedback(errors);
        }
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
            if (data.status === OK) {
                const token = data.token;
                localStorage.setItem('authToken', token);
                setSuccess(true);
                setError('');
                setUpdateUser(true);
                setToken(true);
                navigate('/formulario');
            } else if (data.status === INVALID) {
                showPopup("Invalid data", data.error, false);
            } else {
                showPopup("Unexpected error", data.error, true);
            }

        } catch (err) {
            console.error('Error during registration:', err);
            setError('Error during registration. Please try again.');
        }
    };

    const PasswordStrengthMeter = ({ score, errors }) => {
        const strengthLabels = ["Muy débil", "Débil", "Regular", "Fuerte", "Muy fuerte"];
        const strengthColors = ["#ff0000", "#ff4500", "#ffa500", "#32cd32", "#008000"];


        return (
            <div>
                <p style={{ color: strengthColors[score] }}>
                    Nivel de seguridad: {strengthLabels[score]}
                </p>
                <progress max="4" value={score} style={{ width: '100%' }}></progress>
                <ul>
                    {errors.map((error, index) => (
                        <li key={index} style={{ color: 'red' }}>{error}</li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="register-container">
            <div className="formulario-register">
                <h2 className='Cabezera'>Únete a la comunidad Fitmatch</h2>
                {success ? (
                    <p className="mensaje">¡Registro exitoso!</p>
                ) : (
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <InputGroup className="input-group-custom">
                                    <InputGroup.Text className="input-icon">
                                        <FaUser />
                                    </InputGroup.Text>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Username"
                                        className="form-control input-field" 
                                    />
                                </InputGroup>
                            </div>
                            <div className="form-group">
                                <InputGroup className="input-group-custom">
                                    <InputGroup.Text className="input-icon">
                                        <FaPhoneAlt />
                                    </InputGroup.Text>
                                    <input
                                        type="text"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Mobile Number"
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
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Password"
                                        className="form-control input-field"
                                    />
                                    <span className="toggle-password" onClick={togglePasswordVisibility}>
                                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </InputGroup>
                                <PasswordStrengthMeter score={passwordStrength} errors={feedback} />
                            </div>
                            <button type="submit" className="buttonRegister">Crear cuenta</button>
                            <p className="link-to-login">¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a></p>
                            {error && <p className="error-message">{error}</p>}
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;


