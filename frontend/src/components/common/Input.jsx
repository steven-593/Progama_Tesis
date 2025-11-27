export default function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  icon: Icon,
  disabled = false,
  error = ''
}) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onChange) {
      e.preventDefault();
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
            size={20}
          />
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className={`w-full px-4 py-3 ${Icon ? 'pl-10' : ''} 
            border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} 
            rounded-lg focus:outline-none focus:ring-2 
            ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'} 
            focus:border-transparent
            bg-white dark:bg-gray-900 
            text-gray-800 dark:text-gray-100 
            placeholder-gray-400 dark:placeholder-gray-500
            disabled:bg-gray-100 dark:disabled:bg-gray-800 
            disabled:text-gray-400 disabled:cursor-not-allowed
            transition-colors duration-200`}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
