import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './AddUser.css';

function AddUser() {
  const { user: currentUser } = useContext(AuthContext);
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
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/classes')
      .then(response => response.json())
      .then(data => setClasses(data))
      .catch(error => console.error('Error fetching classes:', error));

    fetch('http://localhost:5000/api/roles')
      .then(response => response.json())
      .then(data => setRoles(data))
      .catch(error => console.error('Error fetching roles:', error));

    fetch('http://localhost:5000/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
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
          // Odśwież listę użytkowników po dodaniu nowego użytkownika
          fetch('http://localhost:5000/api/users')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
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

  const handleDeleteUser = () => {
    fetch(`http://localhost:5000/api/delete-user/${selectedUser}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Nie udało się usunąć użytkownika');
      }
      return response.json();
    })
    .then(data => {
      alert(data.message);
      setUsers(users.filter(user => user.id !== selectedUser));
      setSelectedUser('');
    })
    .catch(error => {
      console.error('Error deleting user:', error);
    });
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

      <h2>Usuń użytkownika</h2>
      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="">Wybierz użytkownika</option>
        {users.map(user => (
          user.id !== currentUser.id && <option key={user.id} value={user.id}>{`${user.nazwisko} ${user.imie}`}</option>
        ))}
      </select>
      <button onClick={handleDeleteUser}>Usuń użytkownika</button>
    </div>
  );
}

export default AddUser;
