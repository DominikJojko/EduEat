import React from 'react';
import { useAuth } from '../../context/AuthContext';

function ManageUsers() {
  const { user } = useAuth();

  if (!user || user.role_id !== 3) {
    return <div>Dostęp ograniczony. Strona dostępna tylko dla administratorów.</div>;
  }

  return (
    <div className="manage-users-container">
      <h1 style={{ fontSize: '30px' }}>Zarządzanie użytkownikami</h1>
      {/* Dodaj tutaj funkcjonalności zarządzania użytkownikami */}
    </div>
  );
}

export default ManageUsers;
