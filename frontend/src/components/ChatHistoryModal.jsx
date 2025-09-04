import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import toast from 'react-hot-toast';
import { FiX, FiCpu, FiTrash2 } from 'react-icons/fi';
import Button from './UI/Button';

const ChatHistoryModal = ({ isOpen, onClose }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            const fetchHistory = async () => {
                setLoading(true);
                try {
                    const res = await api.get('/history/chat');
                    setHistory(res.data);
                } catch (error) {
                    console.error("Failed to fetch chat history", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchHistory();
        }
    }, [isOpen]);

    const handleDeleteHistory = async () => {
        // Use the browser's native confirm dialog for a simple, effective confirmation
        if (window.confirm("Are you sure you want to permanently delete your entire chat history? This action cannot be undone.")) {
            try {
                await api.delete('/history/chat'); // Call the new DELETE endpoint
                setHistory([]); // Immediately clear the history from the view
                toast.success("Chat history cleared!");
            } catch (error) {
                toast.error("Failed to clear history. Please try again.");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}>
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                    className="bg-surface rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col"
                    onClick={(e) => e.stopPropagation()}>
                    
                    <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
                        <h3 className="text-xl font-bold text-textPrimary">Chat History</h3>
                        <Button onClick={onClose} className="p-2 bg-transparent hover:bg-gray-100 text-textSecondary"><FiX /></Button>
                    </div>

                    <div className="p-4 space-y-4 flex-grow max-h-[60vh] overflow-y-auto">
                        {loading ? <p className="text-center text-textSecondary">Loading history...</p>
                        : history.length === 0 ? <p className="text-center text-textSecondary">No chat history found.</p>
                        : history.map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-end gap-2 justify-end">
                                    <div className="max-w-lg p-3 rounded-2xl bg-primary text-white rounded-br-none">
                                        <p className="text-sm">{item.user_message}</p>
                                    </div>
                                </div>
                                <div className="flex items-end gap-2 justify-start">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-textPrimary"><FiCpu size={18}/></div>
                                    <div className="max-w-lg p-3 rounded-2xl bg-gray-200 text-textPrimary rounded-bl-none">
                                        <p className="text-sm">{item.ai_response}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t flex justify-end flex-shrink-0">
                        <Button onClick={handleDeleteHistory} disabled={history.length === 0} icon={FiTrash2} className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed">
                            Delete All History
                        </Button>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ChatHistoryModal;