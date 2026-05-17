import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <p className="text-8xl mb-6">🎬</p>
    <h1 className="text-7xl font-extrabold text-white mb-4">404</h1>
    <p className="text-2xl font-semibold text-gray-300 mb-2">Scene Not Found</p>
    <p className="text-gray-500 mb-8 max-w-sm">
      The page you're looking for got lost on the cutting room floor.
    </p>
    <Link
      to="/"
      className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-8 py-3 rounded-xl transition text-sm"
    >
      Back to Home
    </Link>
  </div>
);

export default NotFound;
