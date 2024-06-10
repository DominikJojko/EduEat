import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Witamy w EduEat!</h1>
      <p>Twoje wygodne i szybkie rozwiązanie do zamawiania obiadów w szkole.</p>

      <div className="home-features">
        <section className="feature">
          <h2>Zamów teraz</h2>
          <p>Złóż zamówienie na obiad w prosty i szybki sposób.</p>
          <Link to="/order" className="button">Zamów Obiad</Link>
        </section>

        <section className="feature">
          <h2>O aplikacji</h2>
          <p>Dowiedz się więcej!</p>
          <Link to="/about" className="button">O aplikacji</Link>
        </section>

      </div>
    </div>
  );
}

export default Home;
