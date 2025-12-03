// src/components/Footer.jsx
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            {/* Added Contact Section */}
            <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Contact: </span>
                <a 
                    href="mailto:nsstkmce25@gmail.com" 
                    style={{ 
                        color: 'var(--primary-color)', 
                        fontWeight: '600',
                        marginLeft: '0.25rem'
                    }}
                >
                    nsstkmce25@gmail.com
                </a>
            </div>
            <p>&copy; 2025-2026 TKM College of Engineering - NSS Unit 174 & 262</p>
        </footer>
    );
}

export default Footer;