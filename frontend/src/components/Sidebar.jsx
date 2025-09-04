import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiMessageSquare, FiBookOpen, FiCalendar, FiCheckSquare, FiAward, FiLogOut, FiZap, FiPenTool, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, toggle }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success("You've been logged out.");
        navigate('/');
    };

    const navLinks = [
        { icon: FiHome, name: 'Dashboard', path: '/dashboard' },
        { icon: FiMessageSquare, name: 'AI Chatbot', path: '/chatbot' },
        { icon: FiBookOpen, name: 'Courses', path: '/courses' },
        { icon: FiPenTool, name: 'Study AI', path: '/study-material' },
        { icon: FiCalendar, name: 'Timetable', path: '/timetable' },
        { icon: FiCheckSquare, name: 'Quiz', path: '/quiz' },
        { icon: FiAward, name: 'Fun Zone', path: '/fun-zone' },
    ];

    const desktopSidebarVariants = {
        open: { width: '16rem' },
        closed: { width: '5rem' },
    };

    const mobileSidebarVariants = {
        closed: { x: '-100%' },
        open: { x: 0 },
    };

    const textVariants = {
        open: { opacity: 1, x: 0, transition: { delay: 0.2 } },
        closed: { opacity: 0, x: -10 },
    };

    const SidebarContent = () => (
        <>
            <div className="p-5 h-[65px] border-b border-primary-light/30 flex items-center overflow-hidden">
                <FiZap className="w-8 h-8 mr-2 text-amber-300 flex-shrink-0"/>
                <motion.span variants={textVariants} className="text-2xl font-bold whitespace-nowrap">EdTech AI</motion.span>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navLinks.map((link) => (
                    <NavLink key={link.name} to={link.path} title={isOpen ? '' : link.name}
                        className={({ isActive }) => `flex items-center p-4 rounded-lg transition-colors duration-200 text-indigo-100 ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                        <link.icon className="w-6 h-6 flex-shrink-0" />
                        <motion.span variants={textVariants} className="ml-4 font-medium whitespace-nowrap">{link.name}</motion.span>
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-primary-light/30">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleLogout}
                    className="flex items-center w-full p-4 rounded-lg text-indigo-100 hover:bg-white/5 overflow-hidden">
                    <FiLogOut className="w-6 h-6 flex-shrink-0" />
                    <motion.span variants={textVariants} className="ml-4 font-medium whitespace-nowrap">Logout</motion.span>
                </motion.button>
            </div>
        </>
    );

    return (
        <>
            {/* --- STATIC DESKTOP SIDEBAR --- */}
            <motion.div
                variants={desktopSidebarVariants}
                initial={false}
                animate={isOpen ? 'open' : 'closed'}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-gradient-to-b from-primary to-primary-dark text-white flex-col hidden lg:flex shadow-2xl relative"
            >
                <SidebarContent />
                <motion.button onClick={toggle} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className="absolute -right-4 top-16 bg-surface text-primary p-2 rounded-full shadow-lg border border-gray-200 z-10">
                    {isOpen ? <FiChevronsLeft /> : <FiChevronsRight />}
                </motion.button>
            </motion.div>

            {/* --- OVERLAY SIDEBAR FOR MOBILE --- */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={mobileSidebarVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                        className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-primary to-primary-dark text-white flex flex-col z-50 lg:hidden shadow-2xl"
                    >
                        <SidebarContent />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;