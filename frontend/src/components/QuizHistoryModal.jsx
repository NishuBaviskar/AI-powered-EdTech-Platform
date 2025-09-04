import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import { FiX, FiAward } from 'react-icons/fi';
import Button from './UI/Button';

const QuizHistoryModal = ({ isOpen, onClose }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            const fetchHistory = async () => {
                setLoading(true);
                try {
                    const res = await api.get('/history/quiz');
                    setHistory(res.data);
                } catch (error) {
                    console.error("Failed to fetch quiz history", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchHistory();
        }
    }, [isOpen]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}>
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                    className="bg-surface rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col"
                    onClick={(e) => e.stopPropagation()}>
                    
                    <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
                        <h3 className="text-xl font-bold text-textPrimary">Quiz History</h3>
                        <Button onClick={onClose} className="p-2 bg-transparent hover:bg-gray-100 text-textSecondary"><FiX /></Button>
                    </div>

                    <div className="p-4 space-y-3 flex-grow max-h-[60vh] overflow-y-auto">
                        {loading ? <p className="text-center text-textSecondary">Loading history...</p>
                        : history.length === 0 ? <p className="text-center text-textSecondary">You haven't completed any quizzes yet.</p>
                        : history.map((item, index) => (
                            <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                                className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                                <div className="flex items-center">
                                    <FiAward className="w-6 h-6 text-amber-500 mr-4" />
                                    <div>
                                        <p className="font-bold text-textPrimary capitalize">{item.topic}</p>
                                        <p className="text-sm text-textSecondary">{formatDate(item.timestamp)}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-primary">{item.score} / {item.total_questions}</p>
                                    <p className="text-sm text-right text-textSecondary">{Math.round((item.score / item.total_questions) * 100)}%</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default QuizHistoryModal;