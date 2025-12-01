// src/pages/Home.jsx
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Welcome to Jeevam</h1>
          <p className="hero-subtitle">
            TKMCE Blood Donor Registry. A fast, secure, and centralized platform for emergency blood donation.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary">
              Register as Donor
            </Link>
            <Link to="/admin" className="btn btn-outline">
              Admin Login
            </Link>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="features-grid">
          <div className="feature-card">
            <h3>Save Lives</h3>
            <p>Your donation can save up to three lives. Join our community of heroes today.</p>
          </div>
          <div className="feature-card">
            <h3>Quick Search</h3>
            <p>Admins can quickly find donors based on blood group and location in emergencies.</p>
          </div>
          <div className="feature-card">
            <h3>Secure Data</h3>
            <p>Your personal information is kept secure and only used for blood donation purposes.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;