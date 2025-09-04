import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiActivity } from 'react-icons/fi';
import Card from '../UI/Card';

const WeeklyActivityChart = ({ data }) => {
    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-textPrimary">Weekly Activity Breakdown</h3>
                <FiActivity className="text-textSecondary" />
            </div>
            <div className="w-full h-72">
                <ResponsiveContainer>
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                        <YAxis stroke="#888888" fontSize={12} allowDecimals={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cccccc', borderRadius: '10px' }} />
                        <Legend wrapperStyle={{ fontSize: '14px' }}/>
                        <Bar dataKey="quiz" fill="#14B8A6" name="Quizzes" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="material" fill="#A78BFA" name="Study AI" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="chatbot" fill="#60A5FA" name="AI Chats" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default WeeklyActivityChart;