// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [donors, setDonors] = useState([]);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  // 1. Protect Route
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/admin');
    });
    return () => unsubscribe();
  }, [navigate]);

  // 2. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "donors"));
      const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setDonors(data);
    };
    fetchData();
  }, []);

  // 3. Eligibility Logic (Simple 90 day check)
  const checkEligibility = (lastDate) => {
    if (!lastDate) return { status: "Eligible", color: "green" };

    const today = new Date();
    const last = new Date(lastDate);
    const diffTime = Math.abs(today - last);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 90) return { status: "Eligible", color: "green" };
    return { status: `Wait ${90 - diffDays} days`, color: "red" };
  };

  // 4. Filter Logic
  const filteredDonors = donors.filter(d =>
    d.bloodGroup.includes(filter) || d.district?.toLowerCase().includes(filter.toLowerCase())
  );

  // 5. Export to CSV
  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Name,Phone,Group,Status\n"; // Header
    filteredDonors.forEach(row => {
      const status = checkEligibility(row.lastDonated).status;
      csvContent += `${row.fullName},${row.phone},${row.bloodGroup},${status}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--primary-color)' }}>NSS Admin Dashboard</h2>
          <button className="btn btn-primary" onClick={exportCSV}>Export CSV</button>
        </div>

        <div className="form-group">
          <input
            className="form-control"
            type="text"
            placeholder="Filter by Blood Group (e.g., A+) or District"
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ background: 'var(--gray-100)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Name</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Group</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Phone</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Dept</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Eligibility</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonors.map(donor => {
                const eligibility = checkEligibility(donor.lastDonated);
                return (
                  <tr key={donor.id} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                    <td style={{ padding: '1rem' }}>{donor.fullName}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{donor.bloodGroup}</td>
                    <td style={{ padding: '1rem' }}>{donor.phone}</td>
                    <td style={{ padding: '1rem' }}>{donor.department}</td>
                    <td style={{ padding: '1rem', color: eligibility.color, fontWeight: 'bold' }}>
                      {eligibility.status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;