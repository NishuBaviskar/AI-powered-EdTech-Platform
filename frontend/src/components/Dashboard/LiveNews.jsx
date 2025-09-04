import { useState, useEffect } from 'react';
// THIS IS THE CRITICAL IMPORT
import api from '../../api';
import Card from '../UI/Card';

const LiveNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // THIS MUST USE 'api.get', NOT 'axios.get'
                const res = await api.get('/news');
                setNews(res.data.slice(0, 4));
            } catch (err) {
                console.error('Error fetching news:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    const SkeletonLoader = () => (
        <div className="animate-pulse flex space-x-4">
            <div className="rounded-md bg-gray-200 h-20 w-20"></div>
            <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2"><div className="h-4 bg-gray-200 rounded"></div></div>
            </div>
        </div>
    );

    return (
        <Card title="Live Education News">
            <div className="space-y-4">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => <SkeletonLoader key={i} />)
                ) : (
                    news.map((article) => (
                        <a href={article.webUrl} key={article.id} target="_blank" rel="noopener noreferrer" className="block p-3 hover:bg-gray-100 rounded-lg">
                           <div className="flex items-start space-x-4">
                               {article.fields?.thumbnail && <img src={article.fields.thumbnail} alt="" className="w-20 h-20 object-cover rounded-md" />}
                               <div>
                                    <h4 className="font-semibold line-clamp-2">{article.webTitle}</h4>
                                    <p className="text-sm mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: article.fields?.trailText }} />
                               </div>
                           </div>
                        </a>
                    ))
                )}
            </div>
        </Card>
    );
};

export default LiveNews;