import axios from 'axios';

export const getNews = async(req, res) => {
    try {
        const url = `https://content.guardianapis.com/search?q=education&api-key=${process.env.GUARDIAN_API_KEY}&show-fields=thumbnail,headline,trailText`;
        const response = await axios.get(url);
        res.json(response.data.response.results);
    } catch (err) {
        console.error('Error fetching news:', err.message);
        res.status(500).send('Server error');
    }
};