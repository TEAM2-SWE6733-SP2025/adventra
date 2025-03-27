const Button = ({ children, variant = "default", onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 ${
      variant === "outline"
        ? "border border-yellow-500 text-yellow-500 hover:bg-yellow-900"
        : "bg-yellow-500 text-black hover:bg-yellow-600"
    }`}
  >
    {children}
  </button>
);

export default Button;
