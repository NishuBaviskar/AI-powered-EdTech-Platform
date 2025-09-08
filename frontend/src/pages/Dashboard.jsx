import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

import EngagementSummary from '../components/Dashboard/EngagementSummary';
import WeeklyActivityChart from '../components/Dashboard/WeeklyActivityChart';
import RecentActivity from '../components/Dashboard/RecentActivity';
import LiveNews from '../components/Dashboard/LiveNews';
import Card from '../components/UI/Card'; // Import Card for the loader

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const Dashboard = () => {
    // We start with null to clearly represent the "no data yet" state.
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                setDashboardData(res.data);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
                // On error, dashboardData remains null, which our child components will handle.
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // --- THIS IS THE BULLETPROOF LOADING/ERROR STATE ---
    // If we are loading, show a full-page skeleton.
    // If there's no data after loading, show a clear error message.
    if (loading || !dashboardData) {
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-2xl"></div>
                    <div className="h-32 bg-gray-200 rounded-2xl"></div>
                    <div className="h-32 bg-gray-200 rounded-2xl"></div>
                </div>
                <div className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
                {!loading && !dashboardData && (
                    <Card><p className="text-center text-red-500">Failed to load dashboard statistics. Please try refreshing the page.</p></Card>
                )}
            </div>
        );
    }

    // Only render the real dashboard if data exists
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <motion.div variants={itemVariants}>
                <EngagementSummary stats={dashboardData.keyStats} />
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <WeeklyActivityChart data={dashboardData.chartData} />
                </motion.div>
                <motion.div variants={itemVariants} className="lg:col-span-1">
                    <RecentActivity activities={dashboardData.recentActivities} />
                </motion.div>
            </div>
            <motion.div variants={itemVariants}>
                <LiveNews />
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
