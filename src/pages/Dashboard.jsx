// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const navigate = useNavigate();

  // Filters & Sort State
  const [bloodFilter, setBloodFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [eligibilityFilter, setEligibilityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

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

  // 4. Filter & Sort Logic
  const filteredDonors = donors
    .filter(d => {
      const matchesBlood = bloodFilter === 'All' || d.bloodGroup === bloodFilter;
      const matchesDistrict = districtFilter === 'All' || d.district === districtFilter;

      let matchesEligibility = true;
      if (eligibilityFilter !== 'All') {
        const status = checkEligibility(d.lastDonated).status;
        if (eligibilityFilter === 'Eligible') matchesEligibility = status === 'Eligible';
        if (eligibilityFilter === 'Not Eligible') matchesEligibility = status !== 'Eligible';
      }

      return matchesBlood && matchesDistrict && matchesEligibility;
    })
    .sort((a, b) => {
      if (sortBy === 'Newest') {
        // Sort by createdAt if available, else fallback to simple index or name
        // Assuming createdAt is a timestamp, but we might not have converted it yet.
        // Let's use lastDonated for now as a proxy if createdAt isn't easy, or just name.
        // Actually, let's sort by Name for A-Z and Z-A
        return 0; // Default no sort for now if timestamp logic is complex without conversion
      }
      if (sortBy === 'Name A-Z') return a.fullName.localeCompare(b.fullName);
      if (sortBy === 'Name Z-A') return b.fullName.localeCompare(a.fullName);
      if (sortBy === 'Last Donated') {
        const dateA = new Date(a.lastDonated || '1900-01-01');
        const dateB = new Date(b.lastDonated || '1900-01-01');
        return dateB - dateA; // Newest first
      }
      return 0;
    });

  // 5. Export to CSV
  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Name,Phone,Group,District,Status\n"; // Header
    filteredDonors.forEach(row => {
      const status = checkEligibility(row.lastDonated).status;
      csvContent += `${row.fullName},${row.phone},${row.bloodGroup},${row.district},${status}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  };

  // 6. Delete Donor
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this donor? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "donors", id));
        setDonors(donors.filter(d => d.id !== id));
      } catch (error) {
        alert("Error deleting donor: " + error.message);
      }
    }
  };

  // 7. Update Donor
  const handleUpdate = async () => {
    if (!selectedDonor) return;
    try {
      const donorRef = doc(db, "donors", selectedDonor.id);
      await updateDoc(donorRef, {
        lastDonated: selectedDonor.lastDonated
      });

      // Update local state
      setDonors(donors.map(d => d.id === selectedDonor.id ? { ...d, lastDonated: selectedDonor.lastDonated } : d));
      alert("Donor updated successfully!");
      setSelectedDonor(null);
    } catch (error) {
      alert("Error updating donor: " + error.message);
    }
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--primary-color)' }}>NSS Admin Dashboard</h2>
          <button className="btn btn-primary" onClick={exportCSV}>Export CSV</button>
        </div>

        {/* Filters Toolbar */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', padding: '1rem', background: 'var(--background-color)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Blood Group</label>
            <select className="form-control" value={bloodFilter} onChange={(e) => setBloodFilter(e.target.value)}>
              <option>All</option>
              <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
              <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>District</label>
            <select className="form-control" value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)}>
              <option>All</option>
              <option>Kollam</option><option>Thiruvananthapuram</option><option>Pathanamthitta</option>
              <option>Alappuzha</option><option>Kottayam</option><option>Idukki</option>
              <option>Ernakulam</option><option>Thrissur</option><option>Palakkad</option>
              <option>Malappuram</option><option>Kozhikode</option><option>Wayanad</option>
              <option>Kannur</option><option>Kasaragod</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Eligibility</label>
            <select className="form-control" value={eligibilityFilter} onChange={(e) => setEligibilityFilter(e.target.value)}>
              <option>All</option>
              <option>Eligible</option>
              <option>Not Eligible</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Sort By</label>
            <select className="form-control" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option>Name A-Z</option>
              <option>Name Z-A</option>
              <option>Last Donated</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ background: 'var(--gray-100)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Name</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Group</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>District</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Phone</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Eligibility</th>
                <th style={{ padding: '1rem', borderBottom: '2px solid var(--gray-200)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonors.map(donor => {
                const eligibility = checkEligibility(donor.lastDonated);
                return (
                  <tr key={donor.id} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                    <td style={{ padding: '1rem' }}>{donor.fullName}</td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{donor.bloodGroup}</td>
                    <td style={{ padding: '1rem' }}>{donor.district}</td>
                    <td style={{ padding: '1rem' }}>{donor.phone}</td>
                    <td style={{ padding: '1rem', color: eligibility.color, fontWeight: 'bold' }}>
                      {eligibility.status}
                    </td>
                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                        onClick={() => setSelectedDonor(donor)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.5rem', fontSize: '0.8rem', backgroundColor: '#ef4444' }}
                        onClick={() => handleDelete(donor.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredDonors.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No donors found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDonor && (
        <div className="modal-overlay" onClick={() => setSelectedDonor(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Donor Details</h3>
              <button className="modal-close" onClick={() => setSelectedDonor(null)}>&times;</button>
            </div>

            <div className="detail-row">
              <span className="detail-label">Full Name:</span>
              <span className="detail-value">{selectedDonor.fullName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Blood Group:</span>
              <span className="detail-value" style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{selectedDonor.bloodGroup}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Age:</span>
              <span className="detail-value">{selectedDonor.age}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Gender:</span>
              <span className="detail-value">{selectedDonor.gender}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Role:</span>
              <span className="detail-value">{selectedDonor.role}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Department:</span>
              <span className="detail-value">{selectedDonor.department}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">District:</span>
              <span className="detail-value">{selectedDonor.district}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{selectedDonor.phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{selectedDonor.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Last Donated:</span>
              <input
                type="date"
                className="form-control"
                style={{ padding: '0.25rem' }}
                value={selectedDonor.lastDonated || ''}
                onChange={(e) => setSelectedDonor({ ...selectedDonor, lastDonated: e.target.value })}
              />
            </div>

            <hr style={{ margin: '1rem 0', border: 0, borderTop: '1px solid var(--gray-200)' }} />

            <h4 style={{ marginBottom: '1rem', color: 'var(--secondary-color)' }}>Medical Info</h4>
            <div className="detail-row">
              <span className="detail-label">Major Diseases:</span>
              <span className="detail-value">{selectedDonor.diseases}</span>
            </div>
            {selectedDonor.diseases === 'Yes' && (
              <div className="detail-row">
                <span className="detail-label">Details:</span>
                <span className="detail-value">{selectedDonor.diseaseDetails}</span>
              </div>
            )}

            <div style={{ marginTop: '2rem', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedDonor(null)}>Close</button>
              <button className="btn btn-primary" onClick={handleUpdate}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;