import { useState } from 'react';
import './registerf.css'; // Archivo CSS para los estilos

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    proficiency: '',
    description: '',
    img: '',
    latitude: '',
    longitude: '',
    preferences: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');

    const response = await fetch('http://localhost:3001/api/users/setup', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (result.error) {
      alert(result.error);
    } else {
      alert('Registration successful!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          readOnly
        />
      </div>
      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          readOnly
        />
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          readOnly
        />
      </div>
      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Country</label>
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
        >
          <option value="United States">Spain</option>
          <option value="United States">Europe</option>
          {/* Añadir más países según sea necesario */}
        </select>
      </div>
      <div className="form-group">
        <label>Proficiency</label>
        <input
          type="text"
          name="proficiency"
          value={formData.proficiency}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Image URL</label>
        <input
          type="text"
          name="img"
          value={formData.img}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Preferences</label>
        <input
          type="text"
          name="preferences"
          value={formData.preferences}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="update-button">Update</button>
    </form>
  );
};

export default RegisterForm;
