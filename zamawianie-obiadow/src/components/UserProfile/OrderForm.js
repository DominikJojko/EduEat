import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import './OrderForm.css';

function OrderForm() {
  const { user, role_id } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mealDescriptions, setMealDescriptions] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    console.log("Zalogowany użytkownik:", user);
  }, [user]);

  useEffect(() => {
    const fetchMealDescriptions = async () => {
      const today = new Date();
      const now = new Date();
      const maxDate = new Date();
      maxDate.setDate(today.getDate() + 14); // obiady na 14 dni do przodu

      try {
        const response = await fetch('http://localhost:5000/meal-descriptions');
        if (!response.ok) {
          throw new Error('Nie udało się pobrać opisów obiadów');
        }
        const meals = await response.json();
        const filteredMeals = meals.filter(meal => {
          const mealDate = new Date(meal.date);

          // Ustawienie godziny 8:30 rano na dzień posiłku
          mealDate.setHours(8, 30, 0, 0);

          // Sprawdzenie, czy data posiłku jest dzisiejsza i obecny czas jest przed 8:30
          return mealDate >= now && mealDate <= maxDate;
        }).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sortowanie rosnące po dacie

        setMealDescriptions(filteredMeals);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchMealDescriptions();
  }, []);

  const fetchUserOrders = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/user-orders/${user.id}?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Nie udało się pobrać zamówień użytkownika');
      }
      const orders = await response.json();
      setUserOrders(orders);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [user, page, limit]);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pl-PL', options);
  };

  const handleOrderSubmit = async (meal) => {
    const now = new Date();
    const mealDate = new Date(meal.date);
  
    // Ustawienie godziny 8:30 rano na dzień zamówienia
    const cutoffTime = new Date(mealDate);
    cutoffTime.setHours(8, 30, 0, 0);  // Ustawienie godziny 8:30 rano
  
    // Sprawdzenie, czy obecny czas jest przed 8:30 rano danego dnia
    if (now > cutoffTime) {
      alert(`Możliwość zamówienia obiadu na dzień ${formatDate(meal.date)} już minęła.`);
      return;
    }
  
    const orderDateLocal = mealDate.toISOString().split('T')[0]; // Pobranie daty w formacie YYYY-MM-DD
  
    // Sprawdzanie, czy zamówienie już istnieje
    if (userOrders.some(order => order.date === orderDateLocal)) {
      alert(`Zamówienie na dzień ${formatDate(orderDateLocal)} już istnieje.`);
      return;
    }
  
    console.log("Próba wysyłania zamówienia dla dania o ID:", meal.id, "dla użytkownika o ID:", user.id, "na dzień:", orderDateLocal);
    try {
      const response = await fetch('http://localhost:5000/api/add-order', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ userId: user.id, mealId: meal.id, orderDate: orderDateLocal })
      });
      console.log('Response status:', response.status);
      if (response.ok) {
        alert(`Zamówiłeś obiad na dzień ${new Date(meal.date).toLocaleDateString()}`);
        fetchUserOrders(); // Pobranie zamówień użytkownika po dodaniu nowego zamówienia
      } else if (response.status === 409) {
        const data = await response.json();
        console.log('Conflict error message:', data.error);
        alert(data.error);
      } else {
        throw new Error('Błąd podczas wysyłania zamówienia');
      }
    } catch (error) {
      alert("Błąd podczas wysyłania zamówienia: " + error.message);
      console.error("Błąd podczas wysyłania zamówienia:", error);
    }
  };

  const handleMonthOrderSubmit = async () => {
    if (!selectedMonth) {
      setError('Wybierz miesiąc, aby złożyć zamówienie.');
      return;
    }
    const confirmation = window.confirm(`Czy na pewno chcesz zamówić obiady na cały ${selectedMonth} ${selectedYear}?`);
    if (!confirmation) return;

    const month = new Date(`${selectedYear}-${selectedMonth}-01`);
    const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const daysArray = [];
    for (let day = new Date(month); day <= nextMonth; day.setDate(day.getDate() + 1)) {
      if (day.getDay() !== 0 && day.getDay() !== 6) { // pomijanie sobót i niedziel
        daysArray.push(day.toISOString().split('T')[0]);
      }
    }

    try {
      for (let date of daysArray) {
        // Sprawdzanie, czy zamówienie już istnieje
        const meal = mealDescriptions.find(meal => new Date(meal.date).toISOString().split('T')[0] === date);
        if (!meal || userOrders.some(order => order.date === date)) {
          console.log(`Zamówienie na dzień ${formatDate(date)} już istnieje lub brak obiadu.`);
          continue;
        }

        const response = await fetch('http://localhost:5000/api/add-order', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ userId: user.id, mealId: meal.id, orderDate: date })
        });
        if (!response.ok && response.status !== 409) {
          throw new Error('Błąd podczas wysyłania zamówienia');
        }
      }
      alert(`Zamówiłeś obiady na cały ${selectedMonth} ${selectedYear}`);
      fetchUserOrders(); // Pobranie zamówień użytkownika po dodaniu nowych zamówień
    } catch (error) {
      alert("Błąd podczas wysyłania zamówienia: " + error.message);
      console.error("Błąd podczas wysyłania zamówienia:", error);
    }
  };

  const handleYearOrderSubmit = async () => {
    const confirmation = window.confirm('Czy na pewno chcesz zamówić obiady na cały rok szkolny?');
    if (!confirmation) return;

    const start = new Date(`${selectedYear}-09-01`);
    const end = new Date(`${selectedYear + 1}-06-30`);

    const daysArray = [];
    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
      if (day.getDay() !== 0 && day.getDay() !== 6) { // pomijanie sobót i niedziel
        daysArray.push(day.toISOString().split('T')[0]);
      }
    }

    try {
      for (let date of daysArray) {
        // Sprawdzanie, czy zamówienie już istnieje
        const meal = mealDescriptions.find(meal => new Date(meal.date).toISOString().split('T')[0] === date);
        if (!meal || userOrders.some(order => order.date === date)) {
          console.log(`Zamówienie na dzień ${formatDate(date)} już istnieje lub brak obiadu.`);
          continue;
        }

        const response = await fetch('http://localhost:5000/api/add-order', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ userId: user.id, mealId: meal.id, orderDate: date })
        });
        if (!response.ok && response.status !== 409) {
          throw new Error('Błąd podczas wysyłania zamówienia');
        }
      }
      alert('Zamówiłeś obiady na cały rok szkolny');
      fetchUserOrders(); // Pobranie zamówień użytkownika po dodaniu nowych zamówień
    } catch (error) {
      alert("Błąd podczas wysyłania zamówienia: " + error.message);
      console.error("Błąd podczas wysyłania zamówienia:", error);
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role_id === 3) {
    return <Navigate to="/" />;
  }

  return (
    <div className="order-form-container">
      <h1><center>Zamówienie Obiadu</center></h1>
      <table className="meals-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Zamów</th>
          </tr>
        </thead>
        <tbody>
          {mealDescriptions.map((meal) => (
            <tr key={meal.id}>
              <td>{formatDate(meal.date)}</td>
              <td>
                <button onClick={() => handleOrderSubmit(meal)}>Zamów ten obiad</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <a href="" target="_blank" rel="noopener noreferrer">
        <button style={{ padding: '10px 20px', fontSize: '18px', cursor: 'pointer' }}>Menu - zmienic link OrderForm.js</button>
      </a>
    </div>

      {error && <p className="error-message">{error}</p>}

      <div className="long-term-order">
        <h2>Zamówienia długoterminowe</h2>
        <div className="month-order">
          <label>
            Wybierz miesiąc:
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              <option value="">Wybierz miesiąc</option>
              {Array.from({ length: 10 }, (_, i) => {
                const month = new Date(0, i + 8).toLocaleString('pl-PL', { month: 'long' });
                const monthValue = (i + 9).toString().padStart(2, '0');
                return <option key={monthValue} value={monthValue}>{month}</option>;
              })}
            </select>
          </label>
          <label>
            Wybierz rok:
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
              <option value={new Date().getFullYear() + 1}>{new Date().getFullYear() + 1}</option>
            </select>
          </label>
          <button onClick={handleMonthOrderSubmit}>Zamów obiady na {selectedMonth ? new Date(0, parseInt(selectedMonth) - 1).toLocaleString('pl-PL', { month: 'long' }) : 'wybrany miesiąc'}</button>
        </div>
        <div className="year-order">
          <button onClick={handleYearOrderSubmit}>Zamów obiady na cały rok szkolny</button>
        </div>
      </div>
    </div>
  );
}

export default OrderForm;
