import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetWatchlistQuery, useRemoveFromWatchlistMutation } from "../../redux/api/users";
import StarRating from "../../component/StarRating";

const Watchlist = () => {
  const { data: watchlist, isLoading } = useGetWatchlistQuery();
  const [removeFromWatchlist] = useRemoveFromWatchlistMutation();

  const handleRemove = async (movieId, movieName) => {
    try {
      await removeFromWatchlist(movieId).unwrap();
      toast.success(`"${movieName}" removed from watchlist`);
    } catch {
      toast.error("Failed to remove");
    }
  };

  return (
    <div className="min-h-screen px-10 pt-10 pb-32">
      <h1 className="text-3xl font-extrabold text-white mb-2">My Watchlist</h1>
      <p className="text-gray-500 text-sm mb-8">Movies you want to watch</p>

      {isLoading && <p className="text-gray-400">Loading...</p>}

      {!isLoading && watchlist?.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-24 text-center">
          <span className="text-6xl mb-4">🎬</span>
          <h2 className="text-xl font-semibold text-white mb-2">Your watchlist is empty</h2>
          <p className="text-gray-500 mb-6">Browse movies and add them to your watchlist</p>
          <Link
            to="/movies"
            className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2 rounded-lg transition"
          >
            Browse Movies
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {watchlist?.map((movie) => (
          <div
            key={movie._id}
            className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition group"
          >
            <Link to={`/movies/${movie._id}`}>
              <img
                src={movie.image}
                alt={movie.name}
                className="w-full h-56 object-cover group-hover:opacity-80 transition"
              />
            </Link>
            <div className="p-4">
              <Link to={`/movies/${movie._id}`}>
                <h3 className="text-white font-semibold hover:text-teal-400 transition">
                  {movie.name}
                </h3>
              </Link>
              <div className="flex items-center justify-between mt-1">
                <span className="text-gray-500 text-sm">{movie.year}</span>
                {movie.numReviews > 0 && <StarRating rating={movie.rating} size={13} />}
              </div>
              {movie.runtime > 0 && (
                <p className="text-gray-600 text-xs mt-1">
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </p>
              )}
              <button
                onClick={() => handleRemove(movie._id, movie.name)}
                className="mt-3 text-xs text-red-400 hover:text-red-300 transition"
              >
                Remove from watchlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
