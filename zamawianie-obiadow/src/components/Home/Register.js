import React, { useState, useEffect } from 'react';
import './Register.css';

function Register() {
  const [userData, setUserData] = useState({
    login: '',
    password: '',
    imie: '',
    nazwisko: '',
    class_id: ''
  });

  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/classes')
      .then(response => response.json())
      .then(data => setClasses(data))
      .catch(error => console.error('Error fetching classes:', error));
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Błąd rejestracji');
      }
      return response.json();
    })
    .then(data => {
      setSuccess('Rejestracja zakończona sukcesem');
      setError('');
    })
    .catch(error => {
      setError('Nie udało się zarejestrować');
      setSuccess('');
    });
  };

  return (
    <div className="register-container">
      <h1>Zarejestruj się</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="login"
          value={userData.login}
          onChange={handleChange}
          placeholder="Login"
        />
        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          placeholder="Hasło"
        />
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
        <select name="class_id" value={userData.class_id} onChange={handleChange}>
          <option value="">Wybierz klasę</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
        <button type="submit">Zarejestruj się</button>
      </form>
    </div>
  );
}

export default Register;
