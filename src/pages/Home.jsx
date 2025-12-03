// src/pages/Home.jsx
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Jeevam Blood Donor Registry</h1>
          <p className="hero-subtitle">
            A centralized, secure, and rapid response platform for emergency blood donation at TKM College of Engineering.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary">
              Register as Donor
            </Link>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="features-grid">
          <div className="feature-card">
            <h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
              Save Lives
            </h3>
            <p>Every donation counts. Your participation directly contributes to saving lives in our community during critical emergencies.</p>
          </div>
          <div className="feature-card">
            <h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              Rapid Search
            </h3>
            <p>Advanced filtering allows administrators to instantly locate available donors based on blood group and location.</p>
          </div>
          <div className="feature-card">
            <h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              Secure & Private
            </h3>
            <p>Your personal data is encrypted and accessible only to authorized personnel for strictly medical purposes.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;