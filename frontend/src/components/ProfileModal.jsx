import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import toast from 'react-hot-toast';
import { FiX, FiEdit, FiSave } from 'react-icons/fi';
import Button from './UI/Button';
import Input from './UI/Input';

// --- COMPREHENSIVE DROPDOWN OPTIONS ---
const EDUCATION_LEVELS = ["High School", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Other"];
const ENGINEERING_FIELDS = ["Computer Science", "Mechanical", "Civil", "Electrical", "Electronics & Communication", "Chemical", "Aerospace", "Biotechnology"];
const ARTS_FIELDS = ["Humanities", "Fine Arts", "Journalism", "Psychology", "Social Work"];
const COMMERCE_FIELDS = ["B.Com", "BBA", "CA (Chartered Accountancy)", "CFA (Chartered Financial Analyst)"];
const SCIENCE_FIELDS = ["Physics", "Chemistry", "Mathematics", "Biology", "Environmental Science"];
const OTHER_FIELDS = ["Medicine (MBBS)", "Law (LLB)", "Design", "Hospitality"];
const ALL_FIELDS = ["Not Applicable", ...ENGINEERING_FIELDS, ...ARTS_FIELDS, ...COMMERCE_FIELDS, ...SCIENCE_FIELDS, ...OTHER_FIELDS];

const ProfileModal = ({ isOpen, onClose, user, onProfileUpdate }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState(user);
    const [loading, setLoading] = useState(false);

    // When the user prop changes (e.g., after a fresh fetch), update the form data
    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/profile', formData);
            toast.success("Profile updated successfully!");
            onProfileUpdate(formData); // Update the state in the Header component
            setIsEditMode(false);
        } catch (error) {
            toast.error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg relative"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                >
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-xl font-bold text-textPrimary">My Profile</h3>
                        <Button onClick={onClose} className="p-2 bg-transparent hover:bg-gray-100 text-textSecondary"><FiX /></Button>
                    </div>

                    {isEditMode ? (
                        // --- EDIT MODE FORM ---
                        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <Input label="Full Name" name="username" value={formData.username || ''} onChange={handleChange} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Age" name="age" type="number" value={formData.age || ''} onChange={handleChange} />
                                <Input label="City" name="city" value={formData.city || ''} onChange={handleChange} />
                            </div>
                            <Input label="School / College Name" name="school_college_name" value={formData.school_college_name || ''} onChange={handleChange} />
                            <div>
                                <label className="block text-sm font-medium text-textSecondary">Education Level</label>
                                <select name="education_level" value={formData.education_level || ''} onChange={handleChange} className="w-full mt-1 p-2 border-2 border-gray-200 bg-gray-50 rounded-md">
                                    {EDUCATION_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-textSecondary">Field of Study</label>
                                <select name="field_of_study" value={formData.field_of_study || ''} onChange={handleChange} className="w-full mt-1 p-2 border-2 border-gray-200 bg-gray-50 rounded-md">
                                    {ALL_FIELDS.map(field => <option key={field} value={field}>{field}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-textSecondary">Hobbies</label>
                                <textarea name="hobbies" value={formData.hobbies || ''} onChange={handleChange} className="w-full mt-1 p-2 border-2 border-gray-200 bg-gray-50 rounded-md" rows="3"></textarea>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button onClick={() => setIsEditMode(false)} className="bg-gray-200 text-textPrimary hover:bg-gray-300">Cancel</Button>
                                <Button type="submit" icon={FiSave} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
                            </div>
                        </form>
                    ) : (
                        // --- VIEW MODE DISPLAY ---
                        <div className="p-6 space-y-3">
                            <p><strong>Email:</strong> <span className="text-textSecondary">{user?.email}</span></p>
                            <p><strong>Age:</strong> <span className="text-textSecondary">{user?.age || 'Not set'}</span></p>
                            <p><strong>City:</strong> <span className="text-textSecondary">{user?.city || 'Not set'}</span></p>
                            <p><strong>School/College:</strong> <span className="text-textSecondary">{user?.school_college_name || 'Not set'}</span></p>
                            <p><strong>Education Level:</strong> <span className="text-textSecondary">{user?.education_level || 'Not set'}</span></p>
                            <p><strong>Field of Study:</strong> <span className="text-textSecondary">{user?.field_of_study || 'Not set'}</span></p>
                            <p><strong>Hobbies:</strong> <span className="text-textSecondary">{user?.hobbies || 'Not set'}</span></p>
                             <div className="flex justify-end pt-4">
                                <Button onClick={() => setIsEditMode(true)} icon={FiEdit}>Edit Profile</Button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProfileModal;