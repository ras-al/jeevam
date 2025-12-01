// src/pages/Register.jsx
import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '', age: '', gender: 'Male', role: 'Student',
    department: '', bloodGroup: 'A+', district: 'Kollam',
    lastDonated: '', diseases: 'No', diseaseDetails: '', phone: '', email: ''
  });

  // Save Data
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "donors"), {
        ...formData,
        createdAt: serverTimestamp(),
        verified: true // Auto-verified
      });
      alert("Registration Successful!");
      navigate('/');
    } catch (error) {
      alert("Error saving data: " + error.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '2rem' }}>
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--primary-color)' }}>Donor Registration</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-control"
              required
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-control"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              className="form-control"
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Age</label>
              <input
                className="form-control"
                required
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Blood Group</label>
              <select
                className="form-control"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              >
                <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-control"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option>Student</option><option>Teacher</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Department / Branch</label>
            <input
              className="form-control"
              required
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">District</label>
            <select
              className="form-control"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            >
              <option>Kollam</option>
              <option>Thiruvananthapuram</option>
              <option>Pathanamthitta</option>
              <option>Alappuzha</option>
              <option>Kottayam</option>
              <option>Idukki</option>
              <option>Ernakulam</option>
              <option>Thrissur</option>
              <option>Palakkad</option>
              <option>Malappuram</option>
              <option>Kozhikode</option>
              <option>Wayanad</option>
              <option>Kannur</option>
              <option>Kasaragod</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Last Donated Date (Leave empty if never)</label>
            <input
              className="form-control"
              type="date"
              value={formData.lastDonated}
              onChange={(e) => setFormData({ ...formData, lastDonated: e.target.value })}
            />
          </div>

          <hr style={{ margin: '2rem 0', border: 0, borderTop: '1px solid var(--border-color)' }} />
          <h3 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>Medical Eligibility</h3>

          <div className="form-group">
            <label className="form-label">Do you have any major diseases?</label>
            <select
              className="form-control"
              value={formData.diseases}
              onChange={(e) => setFormData({ ...formData, diseases: e.target.value })}
            >
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>

          {formData.diseases === 'Yes' && (
            <div className="form-group">
              <label className="form-label">Please specify details</label>
              <textarea
                className="form-control"
                rows="3"
                value={formData.diseaseDetails}
                onChange={(e) => setFormData({ ...formData, diseaseDetails: e.target.value })}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register as Donor</button>
        </form>
      </div>
    </div>
  );
}

export default Register;