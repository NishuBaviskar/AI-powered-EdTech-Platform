import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

import EngagementSummary from '../components/Dashboard/EngagementSummary';
import WeeklyActivityChart from '../components/Dashboard/WeeklyActivityChart';
import RecentActivity from '../components/Dashboard/RecentActivity';
import LiveNews from '../components/Dashboard/LiveNews';
import Card from '../components/UI/Card';

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
                // Only set data if the response has the expected structure
                if (res.data && res.data.keyStats && res.data.chartData && res.data.recentActivities) {
                    setDashboardData(res.data);
                } else {
                    // If the server sends malformed data, we treat it as an error
                    throw new Error("Received malformed data from server");
                }
            } catch (error) {
                console.error("Failed to load dashboard data", error);
                // On any error, dashboardData will remain null
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // --- THIS IS THE "GATEKEEPER" THAT PREVENTS THE CRASH ---
    // If we are loading, it shows a full-page skeleton loader.
    // If loading is finished but dashboardData is still null (due to an error),
    // it shows a clear error message.
    if (loading || !dashboardData) {
        return (
            <div className="space-y-8">
                {/* Skeleton Loader UI */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-2xl"></div>
                    <div className="h-32 bg-gray-200 rounded-2xl"></div>
                    <div className="h-32 bg-gray-200 rounded-2xl"></div>
                </div>
                <div className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>

                {/* Error Message UI */}
                {!loading && !dashboardData && (
                    <Card>
                        <p className="text-center text-red-500 font-semibold">
                            Failed to load dashboard statistics. Please try refreshing the page.
                        </p>
                    </Card>
                )}
            </div>
        );
    }

    // --- THIS CODE ONLY RUNS IF THE DATA IS VALID AND LOADED ---
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
