import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiLogIn, FiZap } from 'react-icons/fi';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/login', formData);
            
            // This check is still good practice to ensure the token exists before proceeding
            if (res.data && res.data.token) {
                localStorage.setItem('token', res.data.token);
                toast.success('Logged in successfully!');
                navigate('/dashboard');
            } else {
                // This will only trigger if the backend has a catastrophic failure
                throw new Error("Token was not received from server.");
            }
        } catch (err) {
            console.error("Login failed:", err);
            toast.error(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-purple-600 to-secondary p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-8 space-y-6 bg-surface/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
                <div className="text-center">
                    <div className="inline-block p-3 bg-primary-light/20 rounded-full mb-4">
                       <FiZap className="w-8 h-8 text-primary"/>
                    </div>
                    <h2 className="text-3xl font-bold text-textPrimary">Welcome Back!</h2>
                    <p className="text-textSecondary mt-2">Log in to continue your journey.</p>
                </div>
                <form onSubmit={onSubmit} className="space-y-6">
                    <Input label="Email Address" id="email" name="email" type="email" value={formData.email} onChange={onChange} placeholder="you@example.com" required />
                    <Input label="Password" id="password" name="password" type="password" value={formData.password} onChange={onChange} placeholder="••••••••" required />
                    <Button type="submit" className="w-full" disabled={loading} icon={FiLogIn}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
                <p className="text-sm text-center text-textSecondary">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-primary hover:underline">
                        Register here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
