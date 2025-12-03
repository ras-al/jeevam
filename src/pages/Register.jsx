// src/pages/Register.jsx
import { useState } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Corrected import
import { createUserWithEmailAndPassword } from 'firebase/auth';

function Register() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '', age: '', gender: 'Male', role: 'Student',
    institution: '',
    department: '', bloodGroup: 'A+', otherBloodGroup: '',
    district: 'Kollam',
    lastDonated: '',
    isMedicallyEligible: 'Yes',
    medication: 'No',
    chronicDiseases: 'No',
    majorSurgery: 'No',
    vaccinated: 'No',
    phone: '', email: ''
  });

  // Save Data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    const finalBloodGroup = formData.bloodGroup === 'Others'
      ? formData.otherBloodGroup
      : formData.bloodGroup;

    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, password);
      const user = userCredential.user;

      // 2. Save Donor Data with matching UID
      await setDoc(doc(db, "donors", user.uid), {
        ...formData,
        bloodGroup: finalBloodGroup,
        uid: user.uid,
        createdAt: serverTimestamp(),
        verified: true
      });

      alert("Registration Successful! You are now logged in.");
      navigate('/donor-dashboard');
    } catch (error) {
      alert("Error registering: " + error.message);
    }
  };

  // Get today's date for max attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '2rem', paddingBottom: '2rem' }}>
      
      {/* Blood Donation Guidelines Section */}
      <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary-color)' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>Blood Donation Guidelines</h3>
        <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <li>Donor must be aged between 18 and 50 years.</li>
          <li>Donors must have a minimum weight of 50kg.</li>
          <li>Donors should keep an interval of 3 months between successive donations.</li>
          <li>Those who are suffering from transmittable diseases, cardiac arrest, hypertension, kidney ailments, epilepsy or diabetes should not donate blood.</li>
          <li>Donor should not have been treated for malaria in the last 3 months and underwent immunization within the past 1 month.</li>
          <li>If the donor has consumed alcohol, then he/she must donate only after 12 hours of intake.</li>
          <li>Donor should not suffer from common cold, sore throat, cough for the past 5 days.</li>
          <li>Avoid donation if the donor had taken a course of antibiotics for the last 5 days.</li>
        </ol>
      </div>

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

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">Create Password</label>
            <input
              className="form-control"
              required
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <div className="form-group">
            <label className="form-label">Gender</label>
            <select
              className="form-control"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Others</option>
            </select>
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
                <option>Others</option>
              </select>
            </div>
          </div>

          {formData.bloodGroup === 'Others' && (
            <div className="form-group">
              <label className="form-label">Specify Blood Group</label>
              <input
                className="form-control"
                required
                type="text"
                placeholder="Enter your blood group"
                value={formData.otherBloodGroup}
                onChange={(e) => setFormData({ ...formData, otherBloodGroup: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-control"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option>Student</option>
              <option>Teacher</option>
              <option>Others</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Institution</label>
            <input
              className="form-control"
              required
              type="text"
              placeholder="e.g. TKM College of Engineering"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            />
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
              <option>Outside Kerala</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Last Donated Date <small style={{ fontWeight: 'normal', color: 'var(--text-secondary)' }}>(DD-MM-YYYY)</small>
            </label>
            <input
              className="form-control"
              type="date"
              max={today}
              value={formData.lastDonated}
              onChange={(e) => setFormData({ ...formData, lastDonated: e.target.value })}
            />
          </div>

          <hr style={{ margin: '2rem 0', border: 0, borderTop: '1px solid var(--border-color)' }} />
          <h3 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>Medical Eligibility</h3>

          <div className="form-group">
            <label className="form-label">Are you on a Medication?</label>
            <select
              className="form-control"
              value={formData.isMedicallyEligible}
              onChange={(e) => setFormData({ ...formData, isMedicallyEligible: e.target.value })}
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          {formData.isMedicallyEligible === 'No' && (
            <>
              <div className="form-group">
                <label className="form-label">Are you currently under any medication?</label>
                <select
                  className="form-control"
                  value={formData.medication}
                  onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Do you have any chronic diseases?</label>
                <select
                  className="form-control"
                  value={formData.chronicDiseases}
                  onChange={(e) => setFormData({ ...formData, chronicDiseases: e.target.value })}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Have you undergone any major surgery in the last one year?</label>
                <select
                  className="form-control"
                  value={formData.majorSurgery}
                  onChange={(e) => setFormData({ ...formData, majorSurgery: e.target.value })}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Are you currently vaccinated? (Within one year)</label>
                <select
                  className="form-control"
                  value={formData.vaccinated}
                  onChange={(e) => setFormData({ ...formData, vaccinated: e.target.value })}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register as Donor</button>
        </form>
      </div>
    </div>
  );
}

export default Register;