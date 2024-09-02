import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Uzytkownicy() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role_id !== 3) {
    return <div>Dostęp ograniczony. Strona dostępna tylko dla administratorów.</div>;
  }

  return (
    <div className="admin-panel-container">
      <h1 style={{ fontSize: '45px' }}>UŻYTKOWNICY</h1>
      <div className="admin-panel-buttons">
        <button onClick={() => navigate('/admin-panel/manage-users')}>Zarządzanie użytkownikami</button>
        <button onClick={() => navigate('/admin-panel/add-user')}>Dodaj i usuń użytkownika</button>
        <button onClick={() => navigate('/admin-panel/manage-classes')}>Edycja klas</button>
      </div>
    </div>
  );
}

export default Uzytkownicy;
