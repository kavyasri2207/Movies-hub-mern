import { Link } from "react-router-dom";
import { useGetAllMoviesQuery } from "../../redux/api/movies";

const AdminMoviesList = () => {
  const { data: movies } = useGetAllMoviesQuery();

  return (
    <div className="container mx-auto px-8 pb-32">
      <h1 className="text-2xl font-bold text-white mb-6">
        All Movies <span className="text-gray-500 font-normal text-base">({movies?.length})</span>
      </h1>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#1a1a1a] text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Poster</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Reviews</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {movies?.map((movie) => (
              <tr key={movie._id} className="bg-[#111] hover:bg-[#1a1a1a] transition">
                <td className="px-4 py-3">
                  <img
                    src={movie.image}
                    alt={movie.name}
                    className="w-10 h-14 object-cover rounded-lg"
                  />
                </td>
                <td className="px-4 py-3 text-white font-medium">{movie.name}</td>
                <td className="px-4 py-3 text-gray-400">{movie.year}</td>
                <td className="px-4 py-3 text-gray-400">{movie.numReviews}</td>
                <td className="px-4 py-3 text-yellow-400">
                  {movie.rating > 0 ? `⭐ ${movie.rating.toFixed(1)}` : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/admin/movies/update/${movie._id}`}
                    className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMoviesList;
