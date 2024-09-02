import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './UserProfile.css';

function UserProfile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [balance, setBalance] = useState(null);
  const [filter, setFilter] = useState('upcoming');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 7;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const response = await fetch(`http://localhost:5000/api/orders?userId=${user.id}&filter=${filter}&page=${page}&limit=${limit}`);
        if (!response.ok) {
          throw new Error('Nie udało się pobrać zamówień');
        }
        const data = await response.json();
        console.log('Fetched orders:', data);

        const sortedOrders = data.orders.sort((a, b) => new Date(a.date) - new Date(b.date));
        setOrders(sortedOrders || []);
        setTotalPages(Math.ceil(data.totalCount / limit));
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchOrders();
  }, [user, filter, page]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user) return;

      try {
        const response = await fetch(`http://localhost:5000/api/user-balance?userId=${user.id}`);
        if (!response.ok) {
          throw new Error('Nie udało się pobrać salda użytkownika');
        }
        const data = await response.json();
        setBalance(data.balance);
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchBalance();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cancel-order/${orderId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Błąd podczas anulowania zamówienia');
      }
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (error) {
      alert("Błąd podczas anulowania zamówienia: " + error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  const isPast = (dateString) => {
    const now = new Date();
    const orderDate = new Date(dateString);

    orderDate.setHours(8, 30, 0, 0);

    return now > orderDate;
  };

  if (!user) {
    return <div>Nie zalogowano</div>;
  }

  return (
    <div className="user-profile-container">
      <h1>Mój Profil</h1>
      {balance !== null && <p>Saldo: {balance} zł</p>}
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="upcoming">Nadchodzące obiady</option>
        <option value="past">Minione obiady</option>
      </select>
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>Poprzednia</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} disabled={i + 1 === page}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>Następna</button>
        </div>
      )}
      {Array.isArray(orders) && orders.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Anulowanie</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{formatDate(order.date)}</td>
                <td>
                  {isPast(order.date) ? 
                    <span style={{color: 'gray'}}>Nie można anulować obiadu</span> :
                    <button className="cancel-button" onClick={() => handleCancelOrder(order.id)}>
                      Anuluj zamówienie
                    </button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Brak zamówień do wyświetlenia</p>
      )}
    </div>
  );
}

export default UserProfile;
