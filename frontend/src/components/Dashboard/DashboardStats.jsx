import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../api';
import Card from '../UI/Card';
import { FiActivity, FiCheckCircle, FiMessageSquare, FiTrendingUp, FiBookOpen, FiSearch } from 'react-icons/fi';

const DashboardStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const ICONS = {
        'quiz_completed': <FiCheckCircle className="text-green-500" />,
        'course_search': <FiSearch className="text-blue-500" />,
        'material_generated': <FiBookOpen className="text-purple-500" />,
    };

    if (loading) {
        return <Card><p>Loading dashboard...</p></Card>; // A simple loader
    }

    if (!stats) {
        return <Card><p>Could not load dashboard data.</p></Card>;
    }

    const keyStatCards = [
        { icon: FiCheckCircle, label: "Quizzes Taken", value: stats.keyStats.totalQuizzes, color: "text-green-500" },
        { icon: FiBookOpen, label: "Materials Generated", value: stats.keyStats.totalMaterials, color: "text-purple-500" },
        { icon: FiMessageSquare, label: "AI Chats Started", value: stats.keyStats.totalChats, color: "text-blue-500" },
        { icon: FiTrendingUp, label: "Avg. Quiz Score", value: `${stats.keyStats.averageQuizScore}%`, color: "text-amber-500" }
    ];

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-textPrimary">Weekly Activity Overview</h3>
                <FiActivity className="text-textSecondary" />
            </div>

            {/* --- THE BAR CHART --- */}
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={stats.chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                        <YAxis stroke="#888888" fontSize={12} allowDecimals={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cccccc' }} />
                        <Legend wrapperStyle={{ fontSize: '14px' }}/>
                        <Bar dataKey="quiz" fill="#14B8A6" name="Quizzes" />
                        <Bar dataKey="material" fill="#A78BFA" name="Study AI" />
                        <Bar dataKey="chatbot" fill="#60A5FA" name="AI Chats" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* --- KEY STATS & RECENT ACTIVITY --- */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-semibold text-textPrimary mb-4">Key Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {keyStatCards.map(stat => (
                            <div key={stat.label} className="bg-gray-50 p-4 rounded-lg">
                                <stat.icon className={`w-6 h-6 mb-2 ${stat.color}`} />
                                <p className="text-2xl font-bold text-textPrimary">{stat.value}</p>
                                <p className="text-sm text-textSecondary">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-textPrimary mb-4">Recent Activity</h4>
                    <div className="space-y-3">
                        {stats.recentActivities.length > 0 ? stats.recentActivities.map((item, index) => (
                            <div key={index} className="flex items-center p-2.5 bg-gray-50 rounded-md">
                                <div className="mr-3">{ICONS[item.activity_type] || <FiBookOpen />}</div>
                                <div>
                                    <p className="text-sm capitalize text-textPrimary">{item.activity_type.replace(/_/g, ' ')}</p>
                                    <p className="text-xs text-textSecondary">{new Date(item.timestamp).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )) : <p className="text-sm text-textSecondary">No recent activity.</p>}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default DashboardStats;