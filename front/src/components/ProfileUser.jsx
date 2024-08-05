import  { useState, useEffect } from 'react';

const UserProfile = () => {
    const [userData, setUserData] = useState({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        description: '',
        proficiency: '',
        trainingPreferences: '',
        img: '',
        city: ''
    });

    useEffect(() => {
        // falta implementar
        fetch('http://localhost:3001/api/profile')
            .then(response => response.json())
            .then(data => setUserData(data))
            .catch(error => console.log('Error loading user data:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('authToken');
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        };

        fetch('http://localhost:3001/api/edit', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    alert('Profile updated successfully');
                } else {
                    alert('Error updating profile: ' + data.error);
                }
            })
            .catch(error => {
                console.log('Error:', error);
                alert('Error updating profile');
            });
    };

    if (!userData || !userData.name) {
        return <div>No puede acceder api</div>;
    }

    return (
        <div>
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    placeholder="Name"
                />
                <input
                    type="text"
                    name="lastname"
                    value={userData.lastname}
                    onChange={handleChange}
                    placeholder="Last Name"
                />
                <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
                <input
                    type="text"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                />
                <input
                    type="text"
                    name="description"
                    value={userData.description}
                    onChange={handleChange}
                    placeholder="Description"
                />
                <input
                    type="text"
                    name="proficiency"
                    value={userData.proficiency}
                    onChange={handleChange}
                    placeholder="Proficiency"
                />
                <input
                    type="text"
                    name="trainingPreferences"
                    value={userData.trainingPreferences}
                    onChange={handleChange}
                    placeholder="Training Preferences"
                />
                <input
                    type="text"
                    name="img"
                    value={userData.img}
                    onChange={handleChange}
                    placeholder="Image URL"
                />
                <input
                    type="text"
                    name="city"
                    value={userData.city}
                    onChange={handleChange}
                    placeholder="City"
                />

                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default UserProfile;


