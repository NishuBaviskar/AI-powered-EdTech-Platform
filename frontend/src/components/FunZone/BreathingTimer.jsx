import { useState, useEffect } from 'react';
import Card from '../UI/Card';

const BreathingTimer = () => {
    const [isBreathing, setIsBreathing] = useState(false);
    const [text, setText] = useState('Start');

    useEffect(() => {
        if (!isBreathing) {
            setText('Start');
            return;
        }

        const cycle = () => {
            setText('Breathe In...');
            setTimeout(() => setText('Hold...'), 4000);
            setTimeout(() => setText('Breathe Out...'), 11000);
        };
        
        cycle(); // Initial cycle
        const interval = setInterval(cycle, 19000); // Repeat every 19 seconds

        return () => clearInterval(interval);
    }, [isBreathing]);

    return (
        <Card title="Mindful Breathing">
            <div className="flex flex-col items-center justify-center p-4 min-h-[250px]">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <div className={`absolute w-full h-full bg-blue-200 rounded-full ${isBreathing ? 'animate-[breath_19s_ease-in-out_infinite]' : 'scale-50'}`}></div>
                    <div className="relative z-10 text-2xl font-semibold">{text}</div>
                </div>
                <button
                    onClick={() => setIsBreathing(!isBreathing)}
                    className="mt-8 px-6 py-2 bg-secondary text-white rounded-full font-semibold"
                >
                    {isBreathing ? 'Stop' : 'Begin Exercise'}
                </button>
            </div>
            
        </Card>
    );
};

export default BreathingTimer;