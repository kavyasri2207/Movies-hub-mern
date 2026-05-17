import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetNewMoviesQuery, useGetTopMoviesQuery, useGetRandomMoviesQuery } from "../redux/api/movies";
import { useFetchGenresQuery } from "../redux/api/genre";
import SliderUtil from "../component/SliderUtil";

const Home = () => {
  const { data: newMovies } = useGetNewMoviesQuery();
  const { data: topMovies } = useGetTopMoviesQuery();
  const { data: randomMovies } = useGetRandomMoviesQuery();
  const { data: genres } = useFetchGenresQuery();
  const [selectedGenre, setSelectedGenre] = useState(null);

  const featuredMovie = topMovies?.[0];

  const filteredMovies = newMovies?.filter(
    (movie) => selectedGenre === null || movie.genre === selectedGenre
  );

  return (
    <div className="min-h-screen pb-32">
      {/* ── Hero ─────────────────────────────────────────────── */}
      {featuredMovie && (
        <div className="relative w-full h-[90vh] overflow-hidden">
          <img
            src={featuredMovie.image}
            alt={featuredMovie.name}
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          <div className="absolute bottom-24 left-16 max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Featured
              </span>
              <span className="text-gray-400 text-sm">{featuredMovie.year}</span>
              {featuredMovie.runtime > 0 && (
                <span className="text-gray-400 text-sm">
                  · {Math.floor(featuredMovie.runtime / 60)}h {featuredMovie.runtime % 60}m
                </span>
              )}
            </div>

            <h1 className="text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
              {featuredMovie.name}
            </h1>

            <p className="text-gray-300 text-base leading-relaxed mb-6 line-clamp-3">
              {featuredMovie.detail}
            </p>

            <div className="flex gap-3">
              <Link
                to={`/movies/${featuredMovie._id}`}
                className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-gray-200 transition text-sm"
              >
                ▶ View Details
              </Link>
              <Link
                to="/movies"
                className="bg-white/10 backdrop-blur border border-white/30 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/20 transition text-sm"
              >
                Browse All
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Genre Pills ──────────────────────────────────────── */}
      <div className="px-10 mt-10 flex gap-3 flex-wrap">
        <button
          onClick={() => setSelectedGenre(null)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
            selectedGenre === null
              ? "bg-teal-500 text-white"
              : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-gray-700"
          }`}
        >
          All
        </button>
        {genres?.map((g) => (
          <button
            key={g._id}
            onClick={() => setSelectedGenre(selectedGenre === g._id ? null : g._id)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              selectedGenre === g._id
                ? "bg-teal-500 text-white"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-gray-700"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* ── New Movies ───────────────────────────────────────── */}
      <div className="px-10 mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">
            {selectedGenre ? "Genre Picks" : "New Arrivals"}
          </h2>
          <Link to="/movies" className="text-teal-400 text-sm hover:underline">
            See all →
          </Link>
        </div>
        <SliderUtil data={filteredMovies} />
      </div>

      {/* ── Top Rated ────────────────────────────────────────── */}
      <div className="px-10 mt-14">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Top Rated</h2>
          <Link to="/movies" className="text-teal-400 text-sm hover:underline">
            See all →
          </Link>
        </div>
        <SliderUtil data={topMovies} />
      </div>

      {/* ── Pick For You ─────────────────────────────────────── */}
      <div className="px-10 mt-14">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Pick For You</h2>
          <Link to="/movies" className="text-teal-400 text-sm hover:underline">
            See all →
          </Link>
        </div>
        <SliderUtil data={randomMovies} />
      </div>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <div className="mx-10 mt-16 bg-gradient-to-r from-teal-700 to-teal-500 rounded-2xl p-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-2xl font-extrabold text-white">Got something to say?</h3>
          <p className="text-teal-100 mt-1 text-sm">
            Sign in to write reviews, rate movies, and build your watchlist.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/register"
            className="bg-white text-teal-700 font-bold px-6 py-2.5 rounded-xl hover:bg-teal-50 transition text-sm"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-transparent border border-white text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-white/10 transition text-sm"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
