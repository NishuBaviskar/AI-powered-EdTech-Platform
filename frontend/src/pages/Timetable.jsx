import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlusCircle, FiTrash2 } from 'react-icons/fi';
import Card from '../components/UI/Card';

const Timetable = () => {
    const [schedule, setSchedule] = useState(() => JSON.parse(localStorage.getItem('studySchedule')) || {
        Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
    });
    const [day, setDay] = useState('Monday');
    const [time, setTime] = useState('');
    const [subject, setSubject] = useState('');

    useEffect(() => {
        localStorage.setItem('studySchedule', JSON.stringify(schedule));
    }, [schedule]);

    const addEntry = (e) => {
        e.preventDefault();
        if (!time || !subject.trim()) return;

        const newEntry = { id: Date.now(), time, subject };
        const updatedDay = [...schedule[day], newEntry].sort((a, b) => a.time.localeCompare(b.time));
        setSchedule({ ...schedule, [day]: updatedDay });
    };

    const removeEntry = (day, id) => {
        const updatedDay = schedule[day].filter(entry => entry.id !== id);
        setSchedule({ ...schedule, [day]: updatedDay });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card title="Build Your Study Timetable">
                <form onSubmit={addEntry} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm">Day</label>
                        <select value={day} onChange={e => setDay(e.target.value)} className="w-full mt-1 p-2 border rounded">
                            {Object.keys(schedule).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm">Time</label>
                        <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full mt-1 p-2 border rounded" required />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm">Subject / Task</label>
                        <div className="flex items-center space-x-2">
                            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g., Math Homework" className="flex-1 w-full mt-1 p-2 border rounded" required />
                             <button type="submit" className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark">
                                <FiPlusCircle />
                            </button>
                        </div>
                    </div>
                </form>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {Object.keys(schedule).map(d => (
                    <motion.div key={d} className="bg-surface p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-center mb-4 text-primary">{d}</h3>
                        <div className="space-y-2">
                            {schedule[d].map((entry) => (
                                <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between items-center p-2.5 bg-gray-100 rounded-md">
                                    <div>
                                        <p className="font-semibold">{entry.time}</p>
                                        <p className="text-sm">{entry.subject}</p>
                                    </div>
                                    <button onClick={() => removeEntry(d, entry.id)} className="text-red-500 hover:text-red-700">
                                        <FiTrash2 />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Timetable;