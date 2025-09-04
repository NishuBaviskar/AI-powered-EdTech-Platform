import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// --- PUBLIC PAGE IMPORTS ---
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// --- PRIVATE (AUTHENTICATED) PAGE IMPORTS ---
import Dashboard from './pages/Dashboard';
import AIChatbot from './pages/AIChatbot';
import Courses from './pages/Courses';
import StudyMaterial from './pages/StudyMaterial';
import Timetable from './pages/Timetable';
import Quiz from './pages/Quiz';
import FunZone from './pages/FunZone';

// Component Imports for the authenticated app layout
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" replace />;
};

const AuthenticatedAppLayout = () => {
    const location = useLocation();
    // Default the sidebar to be closed on mobile devices
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
    const toggleSidebar = () => setSidebarOpen(prev => !prev);
    
    // This effect ensures the sidebar closes when navigating to a new page on mobile
    useEffect(() => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    }, [location]);

    return (
        <div className="flex h-screen bg-background font-sans relative">
            <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
                    <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/chatbot" element={<AIChatbot />} />
                            <Route path="/courses" element={<Courses />} />
                            <Route path="/study-material" element={<StudyMaterial />} />
                            <Route path="/timetable" element={<Timetable />} />
                            <Route path="/quiz" element={<Quiz />} />
                            <Route path="/fun-zone" element={<FunZone />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

function App() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* --- PUBLIC ROUTES --- */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* --- PRIVATE ROUTES --- */}
                <Route path="/*" element={
                    <PrivateRoute>
                        <AuthenticatedAppLayout />
                    </PrivateRoute>
                } />
            </Routes>
        </AnimatePresence>
    );
}

export default App;