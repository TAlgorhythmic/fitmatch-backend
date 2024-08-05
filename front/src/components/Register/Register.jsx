import { useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { EyeFill, EyeSlashFill, LockFill, EnvelopeFill } from 'react-bootstrap-icons';
import './Register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [showPassword, setShowPassword] = useState(false);
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

            if (response.status !== 0) {
                throw new Error('Failed to register: ' + response.error);
            }

            const data = await response.json();
            console.log('User registered:', data);
            const token = response.token;
            localStorage.setItem('authToken', token);
            setSuccess(true);
            setError('');
            navigate('/formulario');
        } catch (err) {
            console.error('Error during registration:', err);
            setError('Error during registration. Please try again.');
        }
    };

    return (
        <div className="page-container-custom">
            <div className="register-container-custom">
                <div className="register-card-custom">
                    <h2>Sign Up</h2>
                    {success ? (
                        <p className="success-message-custom">Registration successful!</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group-custom">
                                <InputGroup className="mb-3">
                                    <InputGroup.Text><EnvelopeFill /></InputGroup.Text>
                                    <FormControl
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your Gmail"
                                    />
                                </InputGroup>
                            </div>
                            <div className="form-group-custom">
                                <InputGroup className="mb-3">
                                    <InputGroup.Text><LockFill /></InputGroup.Text>
                                    <FormControl
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your password"
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeSlashFill /> : <EyeFill />}
                                    </Button>
                                </InputGroup>
                            </div>
                            <div className="form-group-custom">
                                <FormControl
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your name"
                                />
                            </div>
                            <Button type="submit" className="register-button-custom">Sign Up</Button>
                            {error && <p className="error-message-custom">{error}</p>}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;



