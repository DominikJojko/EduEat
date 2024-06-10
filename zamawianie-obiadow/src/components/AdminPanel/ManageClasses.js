import React, { useState, useEffect } from 'react';
import './ManageClasses.css';

function ManageClasses() {
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = () => {
    fetch('http://localhost:5000/api/classes')
      .then(response => response.json())
      .then(data => setClasses(data))
      .catch(error => console.error('Error fetching classes:', error));
  };

  const handleAddClass = () => {
    if (classes.some(cls => cls.name === newClassName.trim())) {
      setMessage('Klasa o tej nazwie już istnieje');
      return;
    }

    fetch('http://localhost:5000/api/classes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newClassName.trim() })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          fetchClasses();
          setNewClassName('');
          setMessage('Klasa dodana pomyślnie');
        } else {
          console.error('Error adding class:', data.message);
          setMessage('Błąd przy dodawaniu klasy');
        }
      })
      .catch(error => {
        console.error('Error adding class:', error);
        setMessage('Błąd przy dodawaniu klasy');
      });
  };

  const handleDeleteClass = (classId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę klasę?')) {
      return;
    }

    fetch(`http://localhost:5000/api/classes/${classId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          fetchClasses();
          setMessage('Klasa usunięta pomyślnie');
        } else {
          console.error('Error deleting class:', data.message);
          setMessage('Błąd przy usuwaniu klasy');
        }
      })
      .catch(error => {
        console.error('Error deleting class:', error);
        setMessage('Błąd przy usuwaniu klasy');
      });
  };

  return (
    <div className="manage-classes-container">
      <h1>Zarządzaj klasami</h1>
      {message && <p className="message">{message}</p>}
      <div className="add-class">
        <input
          type="text"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          placeholder="Nazwa klasy"
        />
        <button onClick={handleAddClass}>Dodaj klasę</button>
      </div>
      <div className="class-list">
        <ul>
          {classes.map(cls => (
            <li key={cls.id}>
              <span>{cls.name}</span>
              <button onClick={() => handleDeleteClass(cls.id)}>Usuń</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ManageClasses;
