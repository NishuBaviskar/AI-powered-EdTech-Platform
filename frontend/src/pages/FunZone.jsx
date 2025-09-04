import { motion } from 'framer-motion';
import BreathingTimer from '../components/FunZone/BreathingTimer';
import MusicPlayer from '../components/FunZone/MusicPlayer';
import Game from '../components/FunZone/Game';

const FunZone = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h2 className="text-3xl font-bold text-textPrimary">Fun Zone & Relaxation</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Game />
                <BreathingTimer />
            </div>
            <MusicPlayer />
        </motion.div>
    );
};

export default FunZone;