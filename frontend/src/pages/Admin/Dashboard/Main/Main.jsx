import { useGetTopMoviesQuery, useGetAllMoviesQuery } from "../../../../redux/api/movies";
import { useGetUsersQuery } from "../../../../redux/api/users";
import { useFetchGenresQuery } from "../../../../redux/api/genre";
import { Link } from "react-router-dom";
import StarRating from "../../../../component/StarRating";

const StatCard = ({ label, value, icon, color }) => (
  <div className={`bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 flex items-center gap-4`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-xs uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-extrabold text-white">{value ?? "—"}</p>
    </div>
  </div>
);

const Main = () => {
  const { data: topMovies } = useGetTopMoviesQuery();
  const { data: users } = useGetUsersQuery();
  const { data: allMovies } = useGetAllMoviesQuery();
  const { data: genres } = useFetchGenresQuery();

  const totalReviews = allMovies?.reduce((acc, m) => acc + (m.numReviews || 0), 0);
  const avgRating = allMovies?.filter(m => m.rating > 0);
  const avgRatingVal = avgRating?.length
    ? (avgRating.reduce((acc, m) => acc + m.rating, 0) / avgRating.length).toFixed(1)
    : "—";

  return (
    <div className="ml-[14rem] px-10 pt-10 pb-32">
      <h1 className="text-2xl font-extrabold text-white mb-2">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Your movies app at a glance</p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Movies" value={allMovies?.length} icon="🎬" color="bg-teal-900/50" />
        <StatCard label="Total Users" value={users?.length} icon="👤" color="bg-blue-900/50" />
        <StatCard label="Total Reviews" value={totalReviews} icon="💬" color="bg-yellow-900/50" />
        <StatCard label="Avg Rating" value={avgRatingVal} icon="⭐" color="bg-purple-900/50" />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {[
          { label: "Create Movie", to: "/admin/movies/create", icon: "➕" },
          { label: "All Movies", to: "/admin/movies-list", icon: "🎥" },
          { label: "Genres", to: "/admin/movies/genre", icon: "🏷️" },
          { label: "Reviews", to: "/admin/movies/comments", icon: "💬" },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="bg-[#1a1a1a] border border-gray-800 hover:border-teal-600 rounded-xl p-4 flex items-center gap-3 transition group"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-gray-400 group-hover:text-white text-sm font-semibold transition">
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Top content table */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-white font-bold">Top Rated Movies</h2>
          <Link to="/admin/movies-list" className="text-teal-400 text-xs hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-gray-800">
          {topMovies?.slice(0, 8).map((movie, i) => (
            <div key={movie._id} className="flex items-center gap-4 px-6 py-3 hover:bg-[#222] transition">
              <span className="text-gray-600 text-sm w-5">{i + 1}</span>
              <img src={movie.image} alt={movie.name} className="w-8 h-10 object-cover rounded" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{movie.name}</p>
                <p className="text-gray-600 text-xs">{movie.year}</p>
              </div>
              <StarRating rating={movie.rating} size={12} />
              <span className="text-gray-500 text-xs">{movie.numReviews} reviews</span>
              <Link
                to={`/admin/movies/update/${movie._id}`}
                className="text-teal-500 hover:text-teal-400 text-xs"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;
