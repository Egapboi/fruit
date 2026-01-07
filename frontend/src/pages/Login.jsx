import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Input from '../components/Input';
import { login } from '../services/api';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
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
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 w-full max-w-md mx-4 text-center"
            >
                <h2 className="text-3xl font-bold mb-6 text-white">Welcome Back</h2>
                <p className="text-gray-300 mb-8">Login to continue your plant journey</p>

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div className="relative">
                        {/* Icon placeholder if needed, styling handled by input-field usually */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                            <Input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                            <Input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>

                <p className="mt-6 text-gray-400">
                    Don't have an account? <Link to="/signup" className="text-primary hover:text-white transition-colors">Sign up</Link>
                </p>
            </motion.div>
        </div>
    );
};

// Add some specific styles for this page if needed via inline or css module, 
// but here we rely on utility classes. 
// Since we don't have Tailwind fully configured with 'flex', 'items-center' etc, 
// I will need to ensure these utilities exist in index.css OR use standard CSS.
// I will add the missing utilities to index.css in a subsequent step or fix here.
// For now, I'll use inline styles or standard class names if I defined them.
// I did NOT define 'flex', 'items-center' in index.css.
// I should probably stick to standard CSS classes for layout in the component or update index.css.
// I'll update the classNames to be more BEM-like or add a style block.

export default Login;
