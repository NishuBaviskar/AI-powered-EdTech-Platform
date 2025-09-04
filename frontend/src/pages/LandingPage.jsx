import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FiZap, FiArrowRight, FiCpu, FiCopy, FiCheckSquare, 
    FiBookOpen, FiCalendar, FiAward, FiPhone, FiMail, FiLinkedin 
} from 'react-icons/fi';
import Button from '../components/UI/Button';

// A reusable, animated component for feature cards
const FeatureCard = ({ icon, title, description }) => (
    <motion.div 
        className="bg-surface p-8 rounded-2xl shadow-lg border border-gray-100 text-center h-full"
        whileHover={{ y: -8, scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 300 }}
    >
        <div className="inline-block p-4 bg-primary-light/10 text-primary rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-textPrimary">{title}</h3>
        <p className="text-textSecondary">{description}</p>
    </motion.div>
);

const LandingPage = () => {
    const features = [
        { icon: <FiCpu size={24} />, title: "AI Tutor Chatbot", description: "Get instant, helpful answers to your study questions 24/7 with our Gemini-powered AI tutor." },
        { icon: <FiCheckSquare size={24} />, title: "AI Quiz Generator", description: "Create custom quizzes on any topic imaginable to test your knowledge and prepare for exams." },
        { icon: <FiCopy size={24} />, title: "AI Study Materials", description: "Generate personalized PDF notes, summaries, and interactive flashcards from a single topic." },
        { icon: <FiBookOpen size={24} />, title: "Course Aggregator", description: "Discover the best online courses from platforms like Udemy for any subject you want to master." },
        { icon: <FiCalendar size={24} />, title: "Personalized Timetable", description: "Organize your study schedule with our easy-to-use timetable builder to stay on track." },
        { icon: <FiAward size={24} />, title: "Fun & Relaxation Zone", description: "Take a break with mindful breathing exercises, focus music, and quick games to recharge." },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-background text-textPrimary font-sans overflow-x-hidden">
            <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl shadow-sm">
                <nav className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center text-xl sm:text-2xl font-bold text-primary">
                        <FiZap className="mr-2" />
                        <span>EdTech AI</span>
                    </Link>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Link to="/login"><Button className="bg-gray-200 text-textPrimary hover:bg-gray-300 px-3 sm:px-4 text-sm">Login</Button></Link>
                        <Link to="/register"><Button className="px-3 sm:px-4 text-sm">Register</Button></Link>
                    </div>
                </nav>
            </header>

            <main className="pt-20">
                <section className="text-center py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50">
                    <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-70"></div>
                    <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-secondary/10 rounded-full filter blur-3xl opacity-70"></div>
                    
                    <motion.h1 initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, type: 'spring' }}
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-textPrimary leading-tight relative">
                        Unlock Your Learning <br className="hidden sm:block" /> Potential with <span className="text-primary">AI</span>
                    </motion.h1>
                    <motion.p initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, type: 'spring', delay: 0.2 }}
                        className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-textSecondary relative">
                        Our all-in-one platform uses AI to create personalized study materials, generate quizzes, and answer your questions instantly.
                    </motion.p>
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, type: 'spring', delay: 0.4 }} 
                        className="mt-8 relative flex justify-center">
                        <Link to="/register">
                            <Button className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4" icon={FiArrowRight}>Get Started for Free</Button>
                        </Link>
                    </motion.div>
                </section>

                <section className="py-16 sm:py-20 bg-surface px-4 sm:px-6">
                    <div className="container mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16">An Entire Study Toolkit, Powered by AI</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <motion.div key={feature.title} initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                                    <FeatureCard {...feature} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-800 text-white">
                    <div className="container mx-auto text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get in Touch</h2>
                        <p className="max-w-2xl mx-auto text-gray-300 mb-12">Have questions or want to connect? Feel free to reach out.</p>
                        <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                            className="bg-gray-900/50 p-6 sm:p-8 rounded-2xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 border border-gray-700">
                            <a href="tel:7709189119" className="flex flex-col items-center p-4 rounded-lg hover:bg-primary/20 transition-colors"><FiPhone size={32} className="text-primary mb-3" /><h4 className="font-semibold text-lg">Phone</h4><p className="text-gray-400">7709189119</p></a>
                            <a href="mailto:nishubaviskar23@gmail.com" className="flex flex-col items-center p-4 rounded-lg hover:bg-primary/20 transition-colors"><FiMail size={32} className="text-primary mb-3" /><h4 className="font-semibold text-lg">Email</h4><p className="text-gray-400">nishubaviskar23@gmail.com</p></a>
                            <a href="https://linkedin.com/in/nishu-baviskar-21a0b428b" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-4 rounded-lg hover:bg-primary/20 transition-colors"><FiLinkedin size={32} className="text-primary mb-3" /><h4 className="font-semibold text-lg">LinkedIn</h4><p className="text-gray-400">Nishu Baviskar</p></a>
                        </motion.div>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-900 text-gray-400 py-8">
                 <div className="container mx-auto text-center px-4"><p>&copy; {new Date().getFullYear()} EdTech AI. All Rights Reserved.</p></div>
            </footer>
        </motion.div>
    );
};

export default LandingPage;