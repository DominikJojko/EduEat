import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Błąd logowania');
        } else {
          throw new Error('Błąd serwera, odpowiedź nie jest w formacie JSON');
        }
      }

      const data = await response.json();
      console.log('Response data:', data);
      login(data.token, { username: data.username, role_id: data.role_id, id: data.id }, () => navigate('/order'));

    } catch (error) {
      setError(error.message || 'Nie udało się zalogować');
      console.error(error);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Login"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Hasło"
          />
          <button type="submit">Zaloguj się</button>
        </form>
        <button type="button" className="register-button" onClick={handleRegister}>Zarejestruj się</button>
      </div>
    </div>
  );
}

export default Login;
