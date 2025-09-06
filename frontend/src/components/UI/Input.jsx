const Input = ({ label, id, name, type = 'text', value, onChange, placeholder, required = false }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-textSecondary">
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full px-3 py-2 mt-1 border-2 border-gray-200 bg-gray-50 rounded-md shadow-sm focus:ring-primary focus:border-primary transition"
            />
        </div>
    );
};

export default Input;