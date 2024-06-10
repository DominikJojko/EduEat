import React, { useState, useEffect } from 'react';
import './AddUser.css';

function AddUser() {
  const [userData, setUserData] = useState({
    login: '',
    password: '',
    imie: '',
    nazwisko: '',
    klasa: '',
    role_id: ''
  });

  const [classes, setClasses] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/classes')
      .then(response => response.json())
      .then(data => setClasses(data))
      .catch(error => console.error('Error fetching classes:', error));

    fetch('http://localhost:5000/api/roles')
      .then(response => response.json())
      .then(data => setRoles(data))
      .catch(error => console.error('Error fetching roles:', error));
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/check-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ login: userData.login })
    })
    .then(response => response.json())
    .then(data => {
      if (data.exists) {
        setError('Użytkownik o tym loginie już istnieje');
      } else {
        fetch('http://localhost:5000/api/add-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          alert(data.message);
          console.log(data);
        })
        .catch(error => {
          console.error('Error adding user:', error);
        });
      }
    })
    .catch(error => {
      console.error('Error checking user:', error);
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="add-user-container">
      <h1>Dodaj użytkownika</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="add-user-form">
        <input
          type="text"
          name="login"
          value={userData.login}
          onChange={handleChange}
          placeholder="Login"
        />
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={userData.password}
            onChange={handleChange}
            placeholder="Hasło"
          />
          <button type="button" onClick={toggleShowPassword}>
            {showPassword ? 'Ukryj' : 'Pokaż'} hasło
          </button>
        </div>
        <input
          type="text"
          name="imie"
          value={userData.imie}
          onChange={handleChange}
          placeholder="Imię"
        />
        <input
          type="text"
          name="nazwisko"
          value={userData.nazwisko}
          onChange={handleChange}
          placeholder="Nazwisko"
        />
        <select name="klasa" value={userData.klasa} onChange={handleChange}>
          <option value="">Wybierz klasę</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
        <select name="role_id" value={userData.role_id} onChange={handleChange}>
          <option value="">Wybierz rolę</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
        <button type="submit">Dodaj użytkownika</button>
      </form>
    </div>
  );
}

export default AddUser;
