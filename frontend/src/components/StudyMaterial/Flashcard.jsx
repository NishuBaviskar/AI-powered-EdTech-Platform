import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHelpCircle, FiCheckCircle } from 'react-icons/fi';

const Flashcard = ({ front, back }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const cardVariants = {
        front: { rotateY: 0 },
        back: { rotateY: 180 },
    };

    return (
        <div
            className="w-full h-56 [transform-style:preserve-3d] cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            {/* Front of the Card (The Question) */}
            <motion.div
                className="absolute w-full h-full [backface-visibility:hidden] p-4 flex flex-col items-center justify-center text-center bg-surface rounded-xl shadow-lg border-2 border-gray-200"
                variants={cardVariants}
                animate={isFlipped ? 'back' : 'front'}
                transition={{ duration: 0.6 }}
            >
                <FiHelpCircle className="w-8 h-8 text-primary mb-3" />
                <p className="text-lg font-semibold text-textPrimary">{front}</p>
                <p className="absolute bottom-2 text-xs text-gray-400 group-hover:opacity-100 opacity-0 transition-opacity">Click to flip</p>
            </motion.div>

            {/* Back of the Card (The Answer) */}
            <motion.div
                className="absolute w-full h-full [backface-visibility:hidden] p-4 flex flex-col items-center justify-center text-center bg-primary text-white rounded-xl shadow-lg"
                variants={cardVariants}
                initial="back" // Start rotated away
                animate={isFlipped ? 'front' : 'back'}
                transition={{ duration: 0.6 }}
            >
                <FiCheckCircle className="w-8 h-8 text-lime-300 mb-3" />
                <p className="text-md font-medium">{back}</p>
                 <p className="absolute bottom-2 text-xs text-indigo-200 group-hover:opacity-100 opacity-0 transition-opacity">Click to flip</p>
            </motion.div>
        </div>
    );
};

export default Flashcard;