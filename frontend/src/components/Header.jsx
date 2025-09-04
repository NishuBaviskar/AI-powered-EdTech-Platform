import { useState, useEffect } from 'react';
import { FiUser, FiMenu } from 'react-icons/fi';
import api from '../api';
import ProfileModal from './ProfileModal';

const Header = ({ toggleSidebar }) => {
    const [user, setUser] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/profile');
                setUser(res.data);
            } catch (error) {
                console.error("Failed to fetch user profile", error);
            }
        };
        fetchProfile();
    }, []);

    const handleProfileUpdate = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <>
            {/* --- THIS IS THE REDESIGNED, COORDINATED HEADER --- */}
            <header 
                // We use a clean white background (bg-surface) to match the cards.
                // The key is the 'border-b-2 border-primary', which adds a 2px
                // indigo bottom border that perfectly coordinates with the sidebar.
                className="flex items-center justify-between px-6 bg-surface border-b-2 border-primary shadow-sm h-20 flex-shrink-0"
            >
                <div className="flex items-center">
                    {/* Hamburger menu button for mobile */}
                    <button 
                        onClick={toggleSidebar} 
                        className="lg:hidden text-textSecondary mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Toggle Menu"
                    >
                        <FiMenu size={24} />
                    </button>
                    
                    {/* Welcome message with standard dark text for contrast */}
                    <h1 className="text-2xl font-semibold text-textPrimary hidden sm:block">
                        Welcome, {user?.username || 'Student'}!
                    </h1>
                </div>
                
                {/* Clickable user profile icon and name */}
                <div 
                    className="flex items-center space-x-4 cursor-pointer group"
                    onClick={() => setIsProfileOpen(true)}
                >
                    <span className="font-medium text-textSecondary hidden md:block group-hover:text-primary transition-colors">
                        {user?.username || 'My Profile'}
                    </span>
                    <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                        <FiUser size={22} />
                    </div>
                </div>
            </header>

            {/* The Profile Modal remains unchanged but is necessary for the header to function */}
            <ProfileModal 
                isOpen={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)} 
                user={user}
                onProfileUpdate={handleProfileUpdate}
            />
        </>
    );
};

export default Header;