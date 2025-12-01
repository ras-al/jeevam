// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Footer from './components/Footer';
import './App.css';
import logo from './assets/logo.png';
import nssLogo from './assets/nss_logo.png';
import tkmceLogo from './assets/tkmce_logo.png';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <div className="container nav-content">
          <Link to="/" className="logo-container">
            <img src={tkmceLogo} alt="TKMCE Logo" className="logo-img" />
            <img src={nssLogo} alt="NSS Logo" className="logo-img" />
            <img src={logo} alt="Jeevam Logo" className="logo-img" />
            <span style={{ marginLeft: '0.5rem' }}>Jeevam</span>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/register" className="nav-link">Register</Link>
            <Link to="/admin" className="nav-link">Admin</Link>
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;