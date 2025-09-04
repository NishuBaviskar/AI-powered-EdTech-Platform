import Card from '../UI/Card';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiSearch, FiBookOpen, FiLogIn } from 'react-icons/fi';

const RecentActivity = ({ activities, loading }) => {

    const getIconInfo = (type) => {
        switch (type) {
            case 'quiz_completed':
                return { Icon: FiCheckCircle, color: 'bg-green-100 text-green-600' };
            case 'course_search':
                return { Icon: FiSearch, color: 'bg-blue-100 text-blue-600' };
            case 'material_generated':
                return { Icon: FiBookOpen, color: 'bg-purple-100 text-purple-600' };
            case 'login':
                return { Icon: FiLogIn, color: 'bg-indigo-100 text-indigo-600' };
            default:
                return { Icon: FiBookOpen, color: 'bg-gray-100 text-gray-600' };
        }
    };

    return (
        <Card title="Recent Activity">
             <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {loading ? <p>Loading activity...</p> : (
                    activities?.length > 0 ? activities.map((item, index) => {
                        const { Icon, color } = getIconInfo(item.activity_type);
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center p-3 hover:bg-gray-50 rounded-md"
                            >
                                <div className={`p-2 rounded-full mr-4 ${color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm capitalize font-medium text-textPrimary">
                                        {item.activity_type.replace(/_/g, ' ')}
                                        {item.details?.topic && `: "${item.details.topic}"`}
                                    </p>
                                </div>
                                <p className="text-xs text-textSecondary">{new Date(item.timestamp).toLocaleDateString()}</p>
                            </motion.div>
                        )
                    }) : <p className="text-sm text-textSecondary text-center py-4">No recent activity yet.</p>
                )}
             </div>
        </Card>
    );
};

export default RecentActivity;