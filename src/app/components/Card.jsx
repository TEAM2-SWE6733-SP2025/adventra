const Card = ({ children }) => (
  <div className="bg-white dark:bg-black shadow-xl rounded-3xl overflow-hidden w-full max-w-4xl p-8 text-black dark:text-white">
    {children}
  </div>
);

export default Card;
