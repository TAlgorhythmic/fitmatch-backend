import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CambioContra.css'; // Puedes añadir estilos personalizados si es necesario

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const requestOptions = {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Asume que el token está almacenado en localStorage
            },
            body: JSON.stringify({ password: newPassword })
        };

        fetch("http://localhost:3001/api/changepasswd", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Password updated successfully') {
                    setMessage('Password updated successfully');
                    navigate('/'); // Redirigir al usuario después de cambiar la contraseña
                } else {
                    setMessage('Error: ' + data.message);
                }
            })
            .catch(error => {
                setMessage('Error connecting to the server');
                console.log('Error:', error);
            });
    };

    return (
        <div className="change-password-container">
            <div className="change-password-box">
                <h1>Change Password</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input 
                            type="password" 
                            placeholder="Enter new password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="change-password-button">Update Password</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default ChangePassword;
