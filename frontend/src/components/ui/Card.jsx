const Card = ({ title, children, className = '' }) => {
    return (
        <div className={`bg-surface p-6 rounded-2xl shadow-lg ${className}`}>
            {title && <h3 className="text-xl font-semibold mb-4 text-textPrimary">{title}</h3>}
            {children}
        </div>
    );
};

export default Card;