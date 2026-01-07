import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Camera, BookOpen, MessageCircle, LogOut, HelpCircle } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="glass-panel" style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '2rem',
            padding: '1rem 2rem',
            zIndex: 100,
            borderRadius: '2rem'
        }}>
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} title="Plants">
                <Home size={24} />
            </Link>
            <Link to="/camera" className={`nav-link ${isActive('/camera') ? 'active' : ''}`} title="Camera">
                <Camera size={24} />
            </Link>
            <Link to="/quiz" className={`nav-link ${isActive('/quiz') ? 'active' : ''}`} title="Quiz">
                <BookOpen size={24} />
            </Link>
            <Link to="/chat" className={`nav-link ${isActive('/chat') ? 'active' : ''}`} title="Chat">
                <MessageCircle size={24} />
            </Link>
            <Link to="/care" className={`nav-link ${isActive('/care') ? 'active' : ''}`} title="Care Guide">
                <HelpCircle size={24} />
            </Link>
            <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="Logout">
                <LogOut size={24} />
            </button>
        </nav>
    );
};

export default Navbar;
