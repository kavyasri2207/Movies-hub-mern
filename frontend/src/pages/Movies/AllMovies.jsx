import { useGetAllMoviesQuery, useGetNewMoviesQuery, useGetTopMoviesQuery, useGetRandomMoviesQuery } from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import MovieCard from "./MovieCard";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import banner from "../../assets/banner.jpg";
import { setMoviesFilter, setFilteredMovies, setMovieYears, setUniqueYears } from "../../redux/features/movies/moviesSlice";

const AllMovies = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetAllMoviesQuery();
  const { data: genres } = useFetchGenresQuery();
  const { data: newMovies } = useGetNewMoviesQuery();
  const { data: topMovies } = useGetTopMoviesQuery();
  const { data: randomMovies } = useGetRandomMoviesQuery();
  const { moviesFilter, filteredMovies } = useSelector((state) => state.movies);
  const [activeGenre, setActiveGenre] = useState("");

  const movieYears = data?.map((movie) => movie.year);
  const uniqueYears = Array.from(new Set(movieYears)).sort((a, b) => b - a);

  useEffect(() => {
    dispatch(setFilteredMovies(data || []));
    dispatch(setMovieYears(movieYears));
    dispatch(setUniqueYears(uniqueYears));
  }, [data]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    dispatch(setMoviesFilter({ searchTerm: term }));
    
    dispatch(setFilteredMovies(data.filter((m) => {
      const matchName = m.name.toLowerCase().includes(term.toLowerCase());
      const genreObj = genres?.find((g) => g._id === m.genre);
      const matchGenre = genreObj ? genreObj.name.toLowerCase().includes(term.toLowerCase()) : false;
      return matchName || matchGenre;
    })));
    setActiveGenre("");
  };

  const handleGenreClick = (genreId) => {
    setActiveGenre(genreId);
    dispatch(setMoviesFilter({ selectedGenre: genreId }));
    dispatch(setFilteredMovies(genreId ? data.filter((m) => m.genre === genreId) : data));
  };

  const handleYearChange = (year) => {
    dispatch(setMoviesFilter({ selectedYear: year }));
    dispatch(setFilteredMovies(year ? data.filter((m) => m.year === +year) : data));
    setActiveGenre("");
  };

  const handleSortChange = (sortOption) => {
    dispatch(setMoviesFilter({ selectedSort: sortOption }));
    setActiveGenre("");
    if (sortOption === "new") dispatch(setFilteredMovies(newMovies));
    else if (sortOption === "top") dispatch(setFilteredMovies(topMovies));
    else if (sortOption === "random") dispatch(setFilteredMovies(randomMovies));
    else dispatch(setFilteredMovies(data));
  };

  const handleClearFilters = () => {
    dispatch(setMoviesFilter({ searchTerm: "", selectedGenre: "", selectedYear: "", selectedSort: "" }));
    dispatch(setFilteredMovies(data || []));
    setActiveGenre("");
  };

  const hasActiveFilter =
    moviesFilter.searchTerm || moviesFilter.selectedYear || moviesFilter.selectedSort || activeGenre;

  return (
    <div className="-translate-y-[5rem]">
      {/* Hero banner */}
      <section>
        <div
          className="relative h-[50rem] w-screen mb-10 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${banner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black" />

          <div className="relative z-10 text-center text-white mt-[10rem] px-4">
            <h1 className="text-7xl font-extrabold mb-4 tracking-tight">The Movies Hub</h1>
            <p className="text-xl text-gray-300">
              Cinematic Odyssey: Unveiling the Magic of Movies
            </p>
          </div>

          {/* Search + Filters */}
          <div className="absolute -bottom-[6rem] w-full max-w-4xl px-4 z-20">
            <input
              type="text"
              className="w-full h-[4.5rem] border border-gray-600 bg-[#111]/90 backdrop-blur px-6 text-white text-lg outline-none rounded-2xl placeholder-gray-500 focus:border-teal-500 transition"
              placeholder="🔍  Search for a movie..."
              value={moviesFilter.searchTerm}
              onChange={handleSearchChange}
            />

            <div className="flex flex-wrap gap-3 mt-4 items-center">
              {/* Genre pills */}
              <button
                onClick={() => handleGenreClick("")}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                  activeGenre === ""
                    ? "bg-teal-500 text-white"
                    : "bg-[#1a1a1a] border border-gray-600 text-gray-400 hover:text-white"
                }`}
              >
                All Genres
              </button>
              {genres?.map((g) => (
                <button
                  key={g._id}
                  onClick={() => handleGenreClick(g._id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                    activeGenre === g._id
                      ? "bg-teal-500 text-white"
                      : "bg-[#1a1a1a] border border-gray-600 text-gray-400 hover:text-white"
                  }`}
                >
                  {g.name}
                </button>
              ))}

              {/* Year select */}
              <select
                className="bg-[#1a1a1a] border border-gray-600 text-gray-400 text-sm rounded-full px-4 py-1.5 outline-none focus:border-teal-500"
                value={moviesFilter.selectedYear}
                onChange={(e) => handleYearChange(e.target.value)}
              >
                <option className="bg-[#1a1a1a] text-white" value="">Year</option>
                {uniqueYears.map((year) => (
                  <option className="bg-[#1a1a1a] text-white" key={year} value={year}>{year}</option>
                ))}
              </select>

              {/* Sort select */}
              <select
                className="bg-[#1a1a1a] border border-gray-600 text-gray-400 text-sm rounded-full px-4 py-1.5 outline-none focus:border-teal-500"
                value={moviesFilter.selectedSort}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option className="bg-[#1a1a1a] text-white" value="">Sort By</option>
                <option className="bg-[#1a1a1a] text-white" value="new">New Movies</option>
                <option className="bg-[#1a1a1a] text-white" value="top">Top Rated</option>
                <option className="bg-[#1a1a1a] text-white" value="random">Random</option>
              </select>

              {hasActiveFilter && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-red-400 hover:text-red-300 ml-2 underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <section className="mt-[14rem] w-screen px-6">
          <p className="text-gray-500 text-sm mb-4 text-center">
            {isLoading ? "Loading movies..." : `${filteredMovies?.length ?? 0} movie${filteredMovies?.length !== 1 ? "s" : ""} found`}
          </p>

          {isLoading ? (
            <div className="flex flex-wrap justify-center">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="m-[2rem] w-[14rem] h-[20rem] bg-gray-800/60 rounded-lg animate-pulse overflow-hidden relative border border-gray-800">
                  <div className="absolute bottom-0 w-full p-4 flex flex-col gap-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMovies?.length === 0 ? (
            <div className="flex flex-col items-center mt-16 text-center">
              <span className="text-5xl mb-4">🎬</span>
              <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters</p>
              <button onClick={handleClearFilters} className="text-teal-400 hover:underline text-sm">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center">
              {filteredMovies?.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  );
};

export default AllMovies;
