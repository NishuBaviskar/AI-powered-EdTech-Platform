import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiUserPlus, FiZap } from 'react-icons/fi';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            toast.success('Registration successful!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-purple-600 to-secondary p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-8 space-y-6 bg-surface/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20"
            >
                <div className="text-center">
                    <div className="inline-block p-3 bg-primary-light/20 rounded-full mb-4">
                       <FiZap className="w-8 h-8 text-primary"/>
                    </div>
                    <h2 className="text-3xl font-bold text-textPrimary">Create an Account</h2>
                    <p className="text-textSecondary mt-2">Start your personalized learning experience today.</p>
                </div>
                <form onSubmit={onSubmit} className="space-y-6">
                    <Input label="Username" id="username" name="username" type="text" value={formData.username} onChange={onChange} placeholder="John Doe" required />
                    <Input label="Email Address" id="email" name="email" type="email" value={formData.email} onChange={onChange} placeholder="you@example.com" required />
                    <Input label="Password" id="password" name="password" type="password" value={formData.password} onChange={onChange} placeholder="••••••••" required />
                    <Button type="submit" className="w-full" disabled={loading} icon={FiUserPlus}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </Button>
                </form>
                <p className="text-sm text-center text-textSecondary">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-primary hover:underline">
                        Login here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;