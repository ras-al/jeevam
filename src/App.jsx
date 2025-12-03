// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import DonorLogin from './pages/DonorLogin'; // New Import
import DonorDashboard from './pages/DonorDashboard'; // New Import
import Home from './pages/Home';
import Footer from './components/Footer';
import './App.css';
import logo from './assets/logo.png';
import nssLogo from './assets/nss_logo.png';
import tkmceLogo from './assets/tkmce_logo.png';
import rudhirasenaLogo from './assets/rudhirasena_logo.png';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <div className="container nav-content">
          <Link to="/" className="logo-container">
            <img src={tkmceLogo} alt="TKMCE Logo" className="logo-img" />
            <img src={nssLogo} alt="NSS Logo" className="logo-img" />
            <img src={rudhirasenaLogo} alt="Rudhirasena Logo" className="logo-img" />
            <img src={logo} alt="Jeevam Logo" className="logo-img" />
            <span style={{ marginLeft: '0.5rem' }}>Jeevam</span>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/register" className="nav-link">Register</Link>
            <Link to="/donor-login" className="nav-link">Login</Link>
            <Link to="/admin" className="nav-link">Admin</Link>
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/donor-login" element={<DonorLogin />} />
          <Route path="/donor-dashboard" element={<DonorDashboard />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;