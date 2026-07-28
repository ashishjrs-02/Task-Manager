import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
      bg-gray-50 px-4">
      <h1 className="text-8xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-500 mb-8 text-center">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 
        py-3 rounded-lg font-medium transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;