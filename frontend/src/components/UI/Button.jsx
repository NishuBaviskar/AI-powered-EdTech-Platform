import { motion } from 'framer-motion';

const Button = ({ children, onClick, type = 'button', className = '', disabled = false, icon: Icon }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center justify-center px-5 py-2.5 font-semibold text-white bg-primary rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
        >
            {Icon && <Icon className="w-5 h-5 mr-2" />}
            {children}
        </motion.button>
    );
};

export default Button;