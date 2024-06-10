import React from 'react';
import { useAuth } from '../../context/AuthContext';

function AdminPanel() {
  const { user } = useAuth();

  if (!user || user.role_id !== 3) {
    return <div>Dostęp ograniczony. Strona dostępna tylko dla administratorów.</div>;
  }

  return (
    <div>
      <h1>Panel Administracyjny</h1>
      <ul>
        <li><a href="/admin-panel/list-orders">Generowanie listy zamówionych obiadów</a></li>
        <li><a href="/admin-panel/add-user">Dodaj i usuń użytkownika</a></li>
        <li><a href="/admin-panel/manage-classes">Edycja klas</a></li>
        <li><a href="/admin-panel/make-meals">Zarządzaj obiadami</a></li>
      </ul>
    </div>
  );
}

export default AdminPanel;