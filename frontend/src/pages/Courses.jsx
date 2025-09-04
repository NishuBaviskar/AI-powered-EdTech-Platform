import { useState } from 'react';
import api from '../api'; // Use the new centralized api client
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const Courses = () => {
    const [topic, setTopic] = useState('');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!topic.trim()) { toast.error("Please enter a topic."); return; }
        setLoading(true);
        setCourses([]);
        try {
            // The token is now added automatically!
            const res = await api.get(`/courses/${topic}`); // Use api.get
            setCourses(res.data);
            if (res.data.length === 0) toast.success("No courses found for this topic.");
        } catch (err) {
            toast.error("Failed to fetch courses.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
                <h2 className="text-2xl font-semibold mb-2 text-textPrimary">Find Courses</h2>
                <p className="mb-4 text-textSecondary">Discover real courses from a leading online platform.</p>
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Python, Machine Learning, History"
                        className="flex-1 w-full px-4 py-2 border-2 border-gray-200 bg-gray-50 rounded-lg focus:ring-primary focus:border-primary transition"
                    />
                    <Button type="submit" disabled={loading} icon={FiSearch}>
                        {loading ? 'Searching...' : 'Search'}
                    </Button>
                </form>
            </Card>

            <AnimatePresence>
                {courses.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {courses.map((course, index) => (
                            <motion.a key={index} href={course.url} target="_blank" rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.03, zIndex: 10 }}
                                className="block p-5 bg-surface rounded-lg shadow-lg hover:shadow-xl transition-all">
                                <div className="flex items-center mb-2">
                                    <span className="text-sm font-semibold text-textSecondary bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{course.source}</span>
                                </div>
                                <h4 className="text-lg font-bold text-primary mb-2 line-clamp-2">{course.title}</h4>
                                <p className="text-sm text-gray-600 line-clamp-3">{course.description}</p>
                            </motion.a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Courses;