import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

import EngagementSummary from '../components/Dashboard/EngagementSummary';
import WeeklyActivityChart from '../components/Dashboard/WeeklyActivityChart';
import RecentActivity from '../components/Dashboard/RecentActivity';
import LiveNews from '../components/Dashboard/LiveNews';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    // This single useEffect fetches all the necessary data for the dashboard
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                setDashboardData(res.data);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            {/* --- THE RESTORED ENGAGEMENT SUMMARY CARDS --- */}
            <motion.div variants={itemVariants}>
                <EngagementSummary stats={dashboardData?.keyStats} loading={loading} />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- THE NEW, DEDICATED ACTIVITY CHART --- */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <WeeklyActivityChart data={dashboardData?.chartData} />
                </motion.div>

                {/* --- THE REDESIGNED RECENT ACTIVITY FEED --- */}
                <motion.div variants={itemVariants} className="lg:col-span-1">
                    <RecentActivity activities={dashboardData?.recentActivities} loading={loading} />
                </motion.div>
            </div>

            {/* The Live News component remains */}
            <motion.div variants={itemVariants}>
                <LiveNews />
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;