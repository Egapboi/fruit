import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Camera, BookOpen, MessageCircle, LogOut, HelpCircle, Trophy } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Plants' },
        { path: '/camera', icon: Camera, label: 'Identify' },
        { path: '/quiz', icon: BookOpen, label: 'Quiz' },
        { path: '/leaderboard', icon: Trophy, label: 'Rankings' },
        { path: '/chat', icon: MessageCircle, label: 'Chat' },
    ];

    return (
        <div className="nav-container">
            <nav className="nav-bar">
                {navItems.map(({ path, icon: Icon, label }) => (
                    <Link
                        key={path}
                        to={path}
                        className={`nav-link ${isActive(path) ? 'active' : ''}`}
                        title={label}
                    >
                        <Icon size={22} />
                    </Link>
                ))}
                <button
                    onClick={handleLogout}
                    className="nav-link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    title="Logout"
                >
                    <LogOut size={22} />
                </button>
            </nav>
        </div>
    );
};

export default Navbar;
