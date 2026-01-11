const Error = ({ message }) => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-400">{message || 'Please try again later.'}</p>
      </div>
    </div>
  );
};

export default Error;