import { useState, useRef, useEffect, useCallback } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiCpu, FiMic, FiMicOff, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Button from '../components/UI/Button';
import ChatHistoryModal from '../components/ChatHistoryModal';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US';
}

const AIChatbot = () => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: "Hello! I'm Sparky, your AI tutor. Ask me a question or press the mic to talk!" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessageText = input;
        const userMessage = { sender: 'user', text: userMessageText };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/auth/chatbot', { message: userMessageText });
            const aiResponseText = res.data.reply;

            setMessages(prev => [...prev, { sender: 'bot', text: aiResponseText }]);

            await api.post('/history/chat', {
                user_message: userMessageText,
                ai_response: aiResponseText
            });

        } catch (err) {
            toast.error("Failed to get a response. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleListen = useCallback(() => {
        if (!recognition) {
            toast.error("Sorry, your browser doesn't support speech recognition.");
            return;
        }
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => setInput(event.results[0][0].transcript);
        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            toast.error("Speech recognition error.");
        };
    }, [isListening]);

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col h-[calc(100vh-8rem)] bg-surface rounded-2xl shadow-xl">
                
                <div className="p-4 border-b flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <FiCpu className="w-6 h-6 text-primary"/>
                        <h2 className="text-xl font-semibold text-textPrimary">AI Tutor Chat</h2>
                    </div>
                    {/* --- THIS BUTTON'S COLOR HAS BEEN UPDATED --- */}
                    <Button onClick={() => setIsHistoryOpen(true)} className="p-2 bg-secondary hover:bg-secondary-dark text-white" title="View Chat History">
                        <FiClock />
                    </Button>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    <AnimatePresence>
                        {messages.map((msg, index) => (
                            <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'bot' && <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-textPrimary"><FiCpu size={18}/></div>}
                                <div className={`max-w-lg p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                                    <p className="text-sm break-words">{msg.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {loading && <div className="flex justify-start"><div className="p-3 rounded-lg bg-gray-200 text-sm">... thinking</div></div>}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                            placeholder={isListening ? "Listening..." : "Ask your AI tutor anything..."}
                            className="flex-1 w-full px-4 py-2 border bg-white rounded-full focus:ring-2 focus:ring-primary transition"
                            disabled={loading}
                        />
                        <motion.button type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleListen}
                            className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-secondary text-white'}`}>
                            {isListening ? <FiMicOff /> : <FiMic />}
                        </motion.button>
                        <motion.button type="submit" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            className="p-3 bg-primary text-white rounded-full transition-colors disabled:bg-gray-400">
                            <FiSend />
                        </motion.button>
                    </form>
                </div>
            </motion.div>

            <ChatHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
        </>
    );
};

export default AIChatbot;