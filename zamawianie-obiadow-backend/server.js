require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const excel = require('exceljs');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err);
    throw err;
  }
  console.log('Połączono z bazą danych MySQL');
});

app.use((req, res, next) => {
  req.db = db;
  next();
});

const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

// AddUser.js
app.post('/api/add-user', (req, res) => {
  console.log('Received add-user request:', req.body);
  const { login, password, imie, nazwisko, klasa, role_id } = req.body;
  const saltRounds = 10;

  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error('Błąd hashowania hasła:', err);
      return res.status(500).json({ error: 'Błąd serwera przy hashowaniu hasła' });
    }

    const query = `INSERT INTO user (login, password, imie, nazwisko, role_id, class_id) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(query, [login, hashedPassword, imie, nazwisko, role_id, klasa], (err, result) => {
      if (err) {
        console.error('Błąd dodawania użytkownika:', err);
        return res.status(500).json({ error: 'Błąd serwera przy dodawaniu użytkownika' });
      }
      res.status(201).json({ message: 'Użytkownik dodany pomyślnie' });
    });
  });
});

app.post('/api/check-user', (req, res) => {
  const { login } = req.body;

  const query = 'SELECT * FROM user WHERE login = ?';
  db.query(query, [login], (err, results) => {
    if (err) {
      console.error('Błąd zapytania do bazy:', err);
      return res.status(500).json({ error: 'Błąd serwera' });
    }
    if (results.length > 0) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  });
});

// Endpoint do usuwania użytkownika
app.delete('/api/delete-user/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'DELETE FROM user WHERE id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Błąd podczas usuwania użytkownika:', err);
      return res.status(500).json({ error: 'Błąd serwera przy usuwaniu użytkownika' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
    }
    res.status(200).json({ message: 'Użytkownik usunięty pomyślnie' });
  });
});


app.post('/api/create-meals', (req, res) => {
  const { startDate, endDate } = req.body;
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const day = currentDate.getDay();
    if (day !== 0 && day !== 6) { // Pomijanie sobót i niedziel
      dates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const checkQuery = 'SELECT date FROM meal_descriptions WHERE date IN (?)';
  const values = dates.map(date => date.toISOString().split('T')[0]);

  db.query(checkQuery, [values], (err, results) => {
    if (err) {
      console.error('Błąd podczas sprawdzania istniejących obiadów:', err);
      return res.status(500).json({ success: false, message: 'Błąd serwera przy sprawdzaniu istniejących obiadów' });
    }

    if (results.length > 0) {
      return res.status(409).json({ success: false, message: 'Niektóre obiady w podanym zakresie dat już istnieją' });
    }

    const insertQuery = 'INSERT INTO meal_descriptions (date) VALUES ?';
    db.query(insertQuery, [values.map(date => [date])], (err, result) => {
      if (err) {
        console.error('Błąd podczas tworzenia obiadów:', err);
        return res.status(500).json({ success: false, message: 'Błąd serwera przy tworzeniu obiadów' });
      }
      res.status(201).json({ success: true, message: 'Obiady utworzone pomyślnie' });
    });
  });
});

app.delete('/api/delete-meal', (req, res) => {
  const { date, id } = req.body;

  if (date) {
    console.log(`Received delete request for date: ${date}`);
    const deleteOrdersQuery = 'DELETE FROM order_meals WHERE meal_id IN (SELECT id FROM meal_descriptions WHERE date = ?)';
    const deleteMealQuery = 'DELETE FROM meal_descriptions WHERE date = ?';
    
    db.query(deleteOrdersQuery, [date], (err, result) => {
      if (err) {
        console.error('Błąd podczas usuwania powiązanych zamówień:', err);
        return res.status(500).json({ success: false, message: 'Błąd serwera przy usuwaniu powiązanych zamówień' });
      }

      db.query(deleteMealQuery, [date], (err, result) => {
        if (err) {
          console.error('Błąd podczas usuwania obiadu:', err);
          return res.status(500).json({ success: false, message: 'Błąd serwera przy usuwaniu obiadu' });
        }

        if (result.affectedRows === 0) {
          console.log('Obiad nie znaleziony');
          return res.status(404).json({ success: false, message: 'Obiad nie znaleziony' });
        }

        console.log('Obiad usunięty pomyślnie');
        res.status(200).json({ success: true, message: 'Obiad usunięty pomyślnie' });
      });
    });

  } else if (id) {
    console.log(`Received delete request for id: ${id}`);
    const deleteOrdersQuery = 'DELETE FROM order_meals WHERE meal_id = ?';
    const deleteMealQuery = 'DELETE FROM meal_descriptions WHERE id = ?';

    db.query(deleteOrdersQuery, [id], (err, result) => {
      if (err) {
        console.error('Błąd podczas usuwania powiązanych zamówień:', err);
        return res.status(500).json({ success: false, message: 'Błąd serwera przy usuwaniu powiązanych zamówień' });
      }

      db.query(deleteMealQuery, [id], (err, result) => {
        if (err) {
          console.error('Błąd podczas usuwania obiadu:', err);
          return res.status(500).json({ success: false, message: 'Błąd serwera przy usuwaniu obiadu' });
        }

        if (result.affectedRows === 0) {
          console.log('Obiad nie znaleziony');
          return res.status(404).json({ success: false, message: 'Obiad nie znaleziony' });
        }

        console.log('Obiad usunięty pomyślnie');
        res.status(200).json({ success: true, message: 'Obiad usunięty pomyślnie' });
      });
    });

  } else {
    res.status(400).json({ success: false, message: 'Brak daty lub id w żądaniu' });
  }
});






// Klasy
app.get('/api/classes', (req, res) => {
  const query = 'SELECT id, name FROM class';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania klas:', err);
      return res.status(500).json({ error: 'Błąd serwera przy pobieraniu klas' });
    }
    res.json(results);
  });
});

app.post('/api/classes', (req, res) => {
  const { name } = req.body;

  // Sprawdzenie, czy klasa o tej nazwie już istnieje
  const checkQuery = 'SELECT * FROM class WHERE name = ?';
  db.query(checkQuery, [name], (err, results) => {
    if (err) {
      console.error('Błąd podczas sprawdzania klasy:', err);
      return res.status(500).json({ success: false, message: 'Błąd serwera przy sprawdzaniu klasy' });
    }
    if (results.length > 0) {
      return res.status(409).json({ success: false, message: 'Klasa o tej nazwie już istnieje' });
    }

    // Dodanie nowej klasy
    const query = 'INSERT INTO class (name) VALUES (?)';
    db.query(query, [name], (err, result) => {
      if (err) {
        console.error('Błąd podczas dodawania klasy:', err);
        return res.status(500).json({ success: false, message: 'Błąd serwera przy dodawaniu klasy' });
      }
      res.status(201).json({ success: true, message: 'Klasa dodana pomyślnie' });
    });
  });
});


app.delete('/api/classes/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM class WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Błąd podczas usuwania klasy:', err);
      return res.status(500).json({ success: false, message: 'Błąd serwera przy usuwaniu klasy' });
    }
    res.status(200).json({ success: true, message: 'Klasa usunięta pomyślnie' });
  });
});


app.post('/api/login', (req, res) => {
  console.log('Received login request:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Nazwa użytkownika i hasło są wymagane' });
  }

  const query = 'SELECT * FROM user WHERE login = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Błąd zapytania do bazy:', err);
      return res.status(500).json({ error: 'Błąd serwera' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Nieprawidłowy login lub hasło' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Błąd porównywania hasła:', err);
        return res.status(500).json({ error: 'Błąd serwera' });
      }
      if (!isMatch) {
        return res.status(401).json({ error: 'Nieprawidłowy login lub hasło' });
      }

      console.log('User data:', {
        id: user.id,
        username: user.login,
        role_id: user.role_id
      });

      try {
        const token = jwt.sign(
          { userId: user.id, username: user.login, role_id: user.role_id },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        res.json({
          token,
          username: user.login,
          role_id: user.role_id,
          id: user.id
        });
      } catch (tokenError) {
        console.error('Błąd generowania tokena JWT:', tokenError);
        return res.status(500).json({ error: 'Błąd serwera' });
      }
    });
  });
});

app.get('/api/meals', (req, res) => {
  const query = 'SELECT * FROM meal_descriptions';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Błąd zapytania do bazy:', err);
      return res.status(500).json({ error: 'Błąd serwera' });
    }
    res.json(results);
  });
});

app.post('/api/add-order', (req, res) => {
  const { userId, mealId, orderDate } = req.body;
  console.log('Received order:', { userId, mealId, orderDate });

  if (!userId || !mealId || !orderDate) {
    console.log("Brakujące dane: ", req.body);
    return res.status(400).json({ error: 'Brakujące dane' });
  }

  // Sprawdzanie, czy zamówienie już istnieje na podstawie user_id i meal_id
  const checkOrderQuery = `
    SELECT id 
    FROM order_meals 
    WHERE user_id = ? 
    AND meal_id = ?
  `;
  const values = [userId, mealId];

  console.log('Executing checkOrderQuery with values:', values);
  db.query(checkOrderQuery, values, (err, results) => {
    if (err) {
      console.error('Błąd podczas sprawdzania istniejącego zamówienia:', err);
      return res.status(500).json({ error: 'Błąd serwera' });
    }

    console.log('checkOrderQuery results:', results);
    if (results.length > 0) {
      console.log('Order already exists for userId:', userId, 'and mealId:', mealId);
      return res.status(409).json({ error: 'Zamówienie na ten obiad już istnieje' });
    }

    const insertOrderQuery = 'INSERT INTO order_meals (user_id, meal_id) VALUES (?, ?)';
    console.log('Executing insertOrderQuery with values:', [userId, mealId]);
    db.query(insertOrderQuery, [userId, mealId], (err, result) => {
      if (err) {
        console.error('Błąd podczas dodawania zamówienia:', err);
        return res.status(500).json({ error: 'Błąd serwera' });
      }

      console.log('Order added successfully for userId:', userId, 'and mealId:', mealId);
      res.json({ message: 'Zamówienie dodane pomyślnie' });
    });
  });
});


app.get('/meal-descriptions', (req, res) => {
  const query = 'SELECT * FROM meal_descriptions';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Błąd serwera');
    }
    res.json(results);
  });
});

app.get('/api/orders', (req, res) => {
  const { userId, filter, page = 1, limit = 10, start, end, class: classId, user } = req.query;
  const offset = (page - 1) * limit;
  const currentDate = new Date().toISOString().slice(0, 10);
  let whereClause = '1=1';

  if (userId) {
    whereClause += ` AND om.user_id = ${db.escape(userId)}`;
  }

  if (filter) {
    if (filter === 'upcoming') {
      whereClause += ` AND md.date >= '${currentDate}'`;
    } else if (filter === 'past') {
      whereClause += ` AND md.date < '${currentDate}'`;
    }
  }

  if (start && end) {
    whereClause += ` AND md.date BETWEEN '${start}' AND '${end}'`;
  }

  if (classId) {
    whereClause += ` AND u.class_id = ${db.escape(classId)}`;
  }

  if (user) {
    whereClause += ` AND om.user_id = ${db.escape(user)}`;
  }

  const queryOrders = `
    SELECT om.id, md.date, u.nazwisko, u.imie, c.name AS klasa
    FROM order_meals om
    JOIN meal_descriptions md ON om.meal_id = md.id
    JOIN user u ON om.user_id = u.id
    JOIN class c ON u.class_id = c.id
    WHERE ${whereClause}
    ORDER BY md.date DESC
    LIMIT ${parseInt(limit, 10)} OFFSET ${parseInt(offset, 10)}
  `;

  const queryCount = `
    SELECT COUNT(*) AS totalCount
    FROM order_meals om
    JOIN meal_descriptions md ON om.meal_id = md.id
    JOIN user u ON om.user_id = u.id
    JOIN class c ON u.class_id = c.id
    WHERE ${whereClause}
  `;

  db.query(queryOrders, (err, results) => {
    if (err) {
      console.error('Błąd zapytania do bazy:', err);
      return res.status(500).json({ error: 'Błąd serwera' });
    }

    db.query(queryCount, (errCount, resultsCount) => {
      if (errCount) {
        console.error('Błąd zapytania do bazy podczas liczenia:', errCount);
        return res.status(500).json({ error: 'Błąd serwera' });
      }

      res.json({
        orders: results,
        totalCount: resultsCount[0].totalCount
      });
    });
  });
});



app.get('/api/classes', (req, res) => {
  const query = 'SELECT id, name FROM class';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania klas:', err);
      return res.status(500).send('Błąd serwera przy pobieraniu klas');
    }
    res.json(results);
  });
});

app.get('/api/users', (req, res) => {
  const query = 'SELECT id, imie, nazwisko FROM user';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania użytkowników:', err);
      return res.status(500).send('Błąd serwera przy pobieraniu użytkowników');
    }
    res.json(results);
  });
});

app.delete('/api/cancel-order/:orderId', (req, res) => {
  const { orderId } = req.params;
  const query = `DELETE FROM order_meals WHERE id = ${orderId}`;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Błąd serwera' });
    }
    res.json({ message: 'Zamówienie anulowane pomyślnie' });
  });
});

app.post('/api/generate-report', (req, res) => {
  const { start, end } = req.body;

  const query = `
    SELECT md.date, um.nazwisko, um.imie, c.name AS klasa
    FROM meal_descriptions md
    JOIN order_meals om ON om.meal_id = md.id
    JOIN user um ON um.id = om.user_id
    JOIN class c ON um.class_id = c.id
    WHERE md.date BETWEEN ? AND ?
    ORDER BY md.date, um.nazwisko, c.name;
  `;
  db.query(query, [start, end], (err, results) => {
    if (err) {
      console.error('Błąd podczas generowania raportu:', err);
      return res.status(500).send('Błąd serwera przy generowaniu raportu');
    }

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Raport zamówień');

    worksheet.columns = [
      { header: 'Nr', key: 'nr', width: 5 },
      { header: 'Data', key: 'date', width: 15 },
      { header: 'Nazwisko', key: 'nazwisko', width: 20 },
      { header: 'Imię', key: 'imie', width: 20 },
      { header: 'Klasa', key: 'klasa', width: 10 }
    ];

    worksheet.getRow(1).font = { bold: true };

    results.forEach((row, index) => {
      const formattedDate = new Date(row.date).toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      worksheet.addRow({ nr: index + 1, date: formattedDate, nazwisko: row.nazwisko, imie: row.imie, klasa: row.klasa });
    });

    worksheet.autoFilter = {
      from: 'A1',
      to: `E${results.length + 1}`
    };

    worksheet.columns.forEach(column => {
      column.eachCell({ includeEmpty: true }, cell => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });

    const statsSheet = workbook.addWorksheet('Statystyki');

    const totalOrders = results.length;
    const ordersByClass = {};
    const ordersByUser = {};
    const ordersByDate = {};

    results.forEach(row => {
      if (!ordersByClass[row.klasa]) {
        ordersByClass[row.klasa] = 0;
      }
      ordersByClass[row.klasa]++;

      const userKey = `${row.nazwisko} ${row.imie}`;
      if (!ordersByUser[userKey]) {
        ordersByUser[userKey] = { count: 0, klasa: row.klasa };
      }
      ordersByUser[userKey].count++;

      if (!ordersByDate[row.date]) {
        ordersByDate[row.date] = 0;
      }
      ordersByDate[row.date]++;
    });

    statsSheet.addRow(['Klasa', 'Liczba obiadów']).font = { bold: true };
    Object.keys(ordersByClass).forEach((klasa, index) => {
      statsSheet.addRow([klasa, ordersByClass[klasa]]);
    });
    statsSheet.addRow([]);

    statsSheet.addRow(['Nazwisko', 'Imię', 'Klasa', 'Liczba obiadów']).font = { bold: true };
    Object.keys(ordersByUser).forEach((user, index) => {
      const [nazwisko, imie] = user.split(' ');
      statsSheet.addRow([nazwisko, imie, ordersByUser[user].klasa, ordersByUser[user].count]);
    });
    statsSheet.addRow([]);

    statsSheet.addRow(['Łączna liczba obiadów', totalOrders]).font = { bold: true };
    statsSheet.addRow([]);

    // Dodanie tabeli z podziałem zamówionych obiadów na dany dzień
    statsSheet.addRow(['Data', 'Liczba obiadów']).font = { bold: true };
    Object.keys(ordersByDate).forEach((date, index) => {
      const formattedDate = new Date(date).toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      statsSheet.addRow([formattedDate, ordersByDate[date]]);
    });

    statsSheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength + 2;
    });

    const filePath = path.join(__dirname, 'report.xlsx');

    workbook.xlsx.writeFile(filePath).then(() => {
      res.download(filePath, 'report.xlsx', (err) => {
        if (err) {
          console.error('Błąd podczas pobierania pliku XLSX:', err);
          return res.status(500).send('Błąd serwera przy pobieraniu pliku XLSX');
        }

        fs.unlinkSync(filePath);
      });
    });
  });
});


app.get('/api/user-orders/:userId', (req, res) => {
  const userId = req.params.userId;
  const query = `SELECT om.id, md.date FROM order_meals om JOIN meal_descriptions md ON om.meal_id = md.id WHERE om.user_id = ? ORDER BY md.date`;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Błąd zapytania do bazy:', err);
      return res.status(500).send('Błąd serwera przy pobieraniu zamówień');
    }
    res.json(results);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server działa na porcie ${PORT}`);
});
