import { FiCheckCircle, FiTrendingUp, FiBookOpen } from 'react-icons/fi';
import Card from '../UI/Card';

const EngagementSummary = ({ stats }) => {
    const displayData = [
        { icon: FiCheckCircle, label: 'Quizzes Taken', value: stats?.totalQuizzes ?? 0 },
        { icon: FiBookOpen, label: 'Materials Generated', value: stats?.totalMaterials ?? 0 },
        { icon: FiTrendingUp, label: 'Avg. Quiz Score', value: `${stats?.averageQuizScore ?? 0}%` },
    ];
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {displayData.map((item) => (
                <Card key={item.label} className="transform hover:-translate-y-2 transition-transform duration-300">
                    <div className={`p-3 inline-block rounded-full text-white shadow-lg mb-3 bg-gradient-to-br from-primary to-secondary`}>
                        <item.icon size={24} />
                    </div>
                    <p className="text-3xl font-bold text-textPrimary">{item.value}</p>
                    <p className="text-sm text-textSecondary">{item.label}</p>
                </Card>
            ))}
        </div>
    );
};

export default EngagementSummary;
