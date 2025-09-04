import { FiCheckCircle, FiTrendingUp, FiBookOpen } from 'react-icons/fi';
import Card from '../UI/Card';

// This is now a simple display component that receives data as props
const EngagementSummary = ({ stats, loading }) => {
    const displayData = [
        { icon: FiCheckCircle, label: 'Quizzes Taken', value: stats?.totalQuizzes, color: 'bg-gradient-to-br from-accent-lime to-accent-teal' },
        { icon: FiBookOpen, label: 'Materials Generated', value: stats?.totalMaterials, color: 'bg-gradient-to-br from-primary to-secondary' },
        { icon: FiTrendingUp, label: 'Avg. Quiz Score', value: `${stats?.averageQuizScore}%`, color: 'bg-gradient-to-br from-amber-400 to-accent-amber' },
    ];
    
    const SkeletonCard = () => (
        <div className="p-5 bg-gray-100 rounded-xl animate-pulse">
            <div className="h-8 w-8 rounded-full bg-gray-200 mb-2"></div>
            <div className="h-8 w-12 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {loading ? (
                <>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </>
            ) : (
                displayData.map((item) => (
                    <Card key={item.label} className="transform hover:-translate-y-2 transition-transform duration-300">
                        <div className={`p-3 inline-block rounded-full text-white shadow-lg mb-3 ${item.color}`}>
                            <item.icon size={24} />
                        </div>
                        <p className="text-3xl font-bold text-textPrimary">{item.value !== null ? item.value : '0'}</p>
                        <p className="text-sm text-textSecondary">{item.label}</p>
                    </Card>
                ))
            )}
        </div>
    );
};

export default EngagementSummary;