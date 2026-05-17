import { useState } from "react";
import { useGetNewMoviesQuery, useGetTopMoviesQuery, useGetRandomMoviesQuery } from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import SliderUtil from "../../component/SliderUtil";

const MoviesContainerPage = () => {
  const { data: newMovies } = useGetNewMoviesQuery();
  const { data: topMovies } = useGetTopMoviesQuery();
  const { data: genres } = useFetchGenresQuery();
  const { data: randomMovies } = useGetRandomMoviesQuery();
  const [selectedGenre, setSelectedGenre] = useState(null);

  const filteredMovies = newMovies?.filter(
    (movie) => selectedGenre === null || movie.genre === selectedGenre
  );

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between items-start px-4 pb-32">
      {/* Genre sidebar */}
      <nav className="lg:w-44 lg:sticky lg:top-10 ml-4 mt-6 flex flex-row lg:flex-col flex-wrap gap-2 mb-8 lg:mb-0">
        <p className="text-gray-600 text-xs uppercase tracking-widest mb-2 hidden lg:block">Genres</p>
        <button
          onClick={() => setSelectedGenre(null)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition text-left ${
            selectedGenre === null
              ? "bg-teal-600 text-white"
              : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-gray-700"
          }`}
        >
          All
        </button>
        {genres?.map((g) => (
          <button
            key={g._id}
            onClick={() => setSelectedGenre(selectedGenre === g._id ? null : g._id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition text-left ${
              selectedGenre === g._id
                ? "bg-teal-600 text-white"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-gray-700"
            }`}
          >
            {g.name}
          </button>
        ))}
      </nav>

      {/* Sliders */}
      <section className="flex flex-col w-full lg:w-[calc(100%-12rem)]">
        <div className="w-full mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              {selectedGenre ? "Genre Picks" : "Choose For You"}
            </h2>
            <span className="text-gray-600 text-sm">{filteredMovies?.length ?? 0} movies</span>
          </div>
          <SliderUtil data={randomMovies} />
        </div>

        <div className="w-full mb-10">
          <h2 className="text-xl font-bold text-white mb-4">⭐ Top Rated</h2>
          <SliderUtil data={topMovies} />
        </div>

        <div className="w-full mb-10">
          <h2 className="text-xl font-bold text-white mb-4">
            {selectedGenre ? "Genre Movies" : "🎬 New Movies"}
          </h2>
          <SliderUtil data={filteredMovies} />
        </div>
      </section>
    </div>
  );
};

export default MoviesContainerPage;
