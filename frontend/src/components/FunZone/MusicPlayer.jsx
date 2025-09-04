import Card from '../UI/Card';

const MusicPlayer = () => {
    return (
        <Card title="Focus Music">
            <div className="aspect-w-16 aspect-h-9">
                <iframe
                    className="w-full h-full rounded-lg"
                    src="https://www.youtube-nocookie.com/embed/jfKfPfyJRdk"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </Card>
    );
};

export default MusicPlayer;