import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Input from '../components/Input';
import { login } from '../services/api';
import { Leaf } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await login(formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="glass-panel auth-card"
            >
                {/* Logo/Icon */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4">
                        <Leaf size={32} className="text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-muted">Sign in to continue your plant journey</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <Input
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <Input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <p className="text-center mt-6 text-muted">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary hover:text-white transition-colors">
                        Create one
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
