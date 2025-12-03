// src/pages/DonorDashboard.jsx
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function DonorDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    fullName: '', age: '', gender: '', role: '',
    institution: '', department: '', bloodGroup: '', 
    district: '', lastDonated: '', phone: '', email: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user data
        const docRef = doc(db, "donors", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        } else {
          alert("No donor profile found for this account.");
        }
        setLoading(false);
      } else {
        navigate('/donor-login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if(!auth.currentUser) return;
      
      const docRef = doc(db, "donors", auth.currentUser.uid);
      await updateDoc(docRef, formData);
      alert("Profile Updated Successfully!");
    } catch (error) {
      alert("Error updating profile: " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (loading) return <div className="container" style={{marginTop:'2rem'}}>Loading...</div>;

  return (
    <div className="container" style={{ maxWidth: '800px', marginTop: '2rem', paddingBottom: '2rem' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--primary-color)' }}>My Donor Profile</h2>
          <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        </div>

        <form onSubmit={handleUpdate}>
          {/* Personal Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-control"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                className="form-control"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                className="form-control"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
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
                <option>Outside Kerala</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Last Donated Date</label>
            <input
              className="form-control"
              type="date"
              value={formData.lastDonated || ''}
              onChange={(e) => setFormData({ ...formData, lastDonated: e.target.value })}
            />
            <small style={{ color: 'var(--text-secondary)' }}>Update this whenever you donate blood.</small>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default DonorDashboard;