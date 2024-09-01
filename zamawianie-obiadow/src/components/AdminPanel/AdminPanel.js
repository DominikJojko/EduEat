import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role_id !== 3) {
    return <div>Dostęp ograniczony. Strona dostępna tylko dla administratorów.</div>;
  }

  return (
    <div className="admin-panel-container">
      <h1>Panel Administracyjny</h1>
      <div className="admin-panel-buttons">
        <button onClick={() => navigate('/admin-panel/list-orders')}>Generowanie listy zamówionych obiadów</button>
        <button onClick={() => navigate('/admin-panel/add-user')}>Dodaj i usuń użytkownika</button>
        <button onClick={() => navigate('/admin-panel/manage-classes')}>Edycja klas</button>
        <button onClick={() => navigate('/admin-panel/make-meals')}>Zarządzaj obiadami</button>
      </div>
    </div>
  );
}

export default AdminPanel;
