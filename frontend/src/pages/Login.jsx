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

        // DEBUG STEP 1: Log the data being sent.
        console.log("--- FRONTEND: Attempting to log in with data: ---", formData);
        
        try {
            // DEBUG STEP 2: Log that the request is being sent.
            console.log("--- FRONTEND: Sending request to /api/auth/login ---");
            const res = await axios.post('/api/auth/login', formData);

            // DEBUG STEP 3: Log the entire raw response from the backend for inspection.
            console.log("--- FRONTEND: Received response from backend. Full response object: ---");
            console.dir(res);
            console.log("--- FRONTEND: The data from the backend is: ---", res.data);

            // Check if a valid token was received before trying to use it.
            if (res.data && res.data.token) {
                console.log("--- FRONTEND: Token found in response. Saving to localStorage. ---");
                localStorage.setItem('token', res.data.token);
                toast.success('Logged in successfully!');
                navigate('/dashboard');
            } else {
                // This will catch the "token undefined" error before it happens.
                console.error("--- FRONTEND CRITICAL ERROR: Backend response is OK, but token is missing! ---", res.data);
                toast.error('Login succeeded but a token was not provided by the server.');
            }
        } catch (err) {
            // DEBUG STEP 4: Log the exact error if the API call fails.
            console.error("--- FRONTEND: Caught an ERROR during login API call ---");
            if (err.response) {
                console.error("Error Data:", err.response.data);
                console.error("Error Status:", err.response.status);
                toast.error(err.response.data.message || 'Login failed. Please check credentials.');
            } else if (err.request) {
                console.error("Error Request:", err.request);
                toast.error('No response from server. Is the backend running?');
            } else {
                console.error('Error Message:', err.message);
                toast.error('An unexpected error occurred.');
            }
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
