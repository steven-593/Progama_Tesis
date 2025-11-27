export default function Button({
  children,
  onClick,
  variant = "primary",
  fullWidth = false,
  disabled = false,
  className = "",
}) {
  const baseStyles = `
    px-5 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-60 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-500 to-indigo-600 
      text-white hover:scale-[1.03]
      hover:from-blue-600 hover:to-indigo-700 
      focus:ring-blue-400 dark:focus:ring-blue-500
      shadow-md hover:shadow-lg
    `,
    secondary: `
      bg-gray-200 dark:bg-gray-800
      text-gray-800 dark:text-gray-200
      hover:bg-gray-300 dark:hover:bg-gray-700
      focus:ring-gray-400 dark:focus:ring-gray-600
      border border-gray-300 dark:border-gray-700
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-pink-600 
      text-white hover:scale-[1.03]
      hover:from-red-600 hover:to-pink-700
      focus:ring-red-400 dark:focus:ring-red-500
      shadow-md hover:shadow-lg
    `,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
