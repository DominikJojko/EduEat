import React, { useState, useEffect } from 'react';
import './Register.css';

function Register() {
  const [userData, setUserData] = useState({
    login: '',
    password: '',
    imie: '',
    nazwisko: '',
    klasa: ''
  });
  const [classes, setClasses] = useState([]);
  const [showPassword, setShowPassword] = useState(false); // State do pokazywania hasła
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

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (password.length < minLength) {
      return 'Hasło musi mieć co najmniej 8 znaków';
    }
    if (!hasUpperCase) {
      return 'Hasło musi zawierać co najmniej jedną dużą literę';
    }
    if (!hasNumber) {
      return 'Hasło musi zawierać co najmniej jedną cyfrę';
    }
    
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const passwordError = validatePassword(userData.password);
    if (passwordError) {
      setError(passwordError);
      setSuccess('');
      return;
    }

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
        setSuccess('');
      } else {
        registerUser(); // Funkcja do rejestracji użytkownika
      }
    })
    .catch(error => {
      console.error('Error checking user:', error);
      setError('Błąd podczas sprawdzania użytkownika');
      setSuccess('');
    });
  };

  const registerUser = () => {
    fetch('http://localhost:5000/api/register-user', {
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
      setSuccess(data.message);
      setError('');
      setUserData({ // Resetowanie formularza
        login: '',
        password: '',
        imie: '',
        nazwisko: '',
        klasa: ''
      });
    })
    .catch(error => {
      console.error('Error registering user:', error);
      setError('Błąd podczas rejestracji');
      setSuccess('');
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-container">
      <h1>Rejestracja</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="imie"
          value={userData.imie}
          onChange={handleChange}
          placeholder="Imię"
          required
        />
        <input
          type="text"
          name="nazwisko"
          value={userData.nazwisko}
          onChange={handleChange}
          placeholder="Nazwisko"
          required
        />
        <select name="klasa" value={userData.klasa} onChange={handleChange} required>
          <option value="">Wybierz klasę</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>

        <div className="spacer"></div>

        <input
          type="text"
          name="login"
          value={userData.login}
          onChange={handleChange}
          placeholder="Login"
          required
        />
        
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={userData.password}
            onChange={handleChange}
            placeholder="Hasło"
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? 'Ukryj' : 'Pokaż'}
          </button>
        </div>
        
        <button type="submit">Zarejestruj się</button>
      </form>
    </div>
  );
}

export default Register;
