import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetSpecificMovieQuery,
  useAddMovieReviewMutation,
  useGetMoviesByGenreQuery,
} from "../../redux/api/movies";
import {
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
  useGetWatchlistQuery,
} from "../../redux/api/users";
import MovieTabs from "./MovieTabs";
import MovieCard from "./MovieCard";
import StarRating from "../../component/StarRating";

const MovieDetails = () => {
  const { id: movieId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);

  const { data: movie, refetch } = useGetSpecificMovieQuery(movieId);
  const { userInfo } = useSelector((state) => state.auth);

  const { data: similarMovies } = useGetMoviesByGenreQuery(movie?.genre, {
    skip: !movie?.genre,
  });

  const { data: watchlist } = useGetWatchlistQuery(undefined, {
    skip: !userInfo,
  });

  const [addToWatchlist] = useAddToWatchlistMutation();
  const [removeFromWatchlist] = useRemoveFromWatchlistMutation();
  const [createReview, { isLoading: loadingMovieReview }] = useAddMovieReviewMutation();

  const isInWatchlist = watchlist?.some((m) => m._id === movieId);

  const handleWatchlist = async () => {
    if (!userInfo) {
      toast.error("Please login to use watchlist");
      return;
    }
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(movieId).unwrap();
        toast.success("Removed from watchlist");
      } else {
        await addToWatchlist(movieId).unwrap();
        toast.success("Added to watchlist!");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ id: movieId, rating, comment }).unwrap();
      refetch();
      setComment("");
      setRating(0);
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error.data || error.message);
    }
  };

  const filteredSimilar = similarMovies?.filter((m) => m._id !== movieId)?.slice(0, 5);

  return (
    <div className="min-h-screen">
      {/* Back button */}
      <div className="px-[10rem] pt-6">
        <Link to="/" className="text-gray-400 hover:text-white text-sm flex items-center gap-1 w-fit">
          ← Go Back
        </Link>
      </div>

      <div className="mt-6 px-[5rem]">
        {/* Hero banner */}
        <div className="relative w-full h-[26rem] rounded-2xl overflow-hidden mb-10">
          <img
            src={movie?.image?.replace(/\\/g, "/")}
            alt={movie?.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1200&h=600&fit=crop&auto=format";
            }}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent flex items-end p-10">
            <div>
              <h1 className="text-5xl font-extrabold text-white mb-2">{movie?.name}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-gray-300 text-sm">{movie?.year}</span>
                {movie?.runtime > 0 && (
                  <span className="text-gray-300 text-sm">
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </span>
                )}
                {movie?.numReviews > 0 && (
                  <div className="flex items-center gap-1">
                    <StarRating rating={movie.rating} size={16} />
                    <span className="text-gray-400 text-sm">({movie.numReviews} reviews)</span>
                  </div>
                )}
              </div>
              {/* Action buttons */}
              <div className="flex gap-3 mt-5 flex-wrap">
                {movie?.trailerUrl && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                  >
                    ▶ Watch Trailer
                  </button>
                )}
                <button
                  onClick={handleWatchlist}
                  className={`px-6 py-2 rounded-lg font-semibold border transition flex items-center gap-2 ${
                    isInWatchlist
                      ? "bg-teal-600 border-teal-600 text-white hover:bg-teal-700"
                      : "bg-transparent border-white text-white hover:bg-white/10"
                  }`}
                >
                  {isInWatchlist ? "✓ In Watchlist" : "+ Watchlist"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trailer modal */}
        {showTrailer && movie?.trailerUrl && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
            onClick={() => setShowTrailer(false)}
          >
            <div
              className="relative w-full max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
              >
                ✕ Close
              </button>
              <iframe
                src={`${movie.trailerUrl}?autoplay=1`}
                className="w-full h-full rounded-xl"
                allowFullScreen
                allow="autoplay"
                title="Trailer"
              />
            </div>
          </div>
        )}

        {/* Info grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
          {/* Description */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-2">Synopsis</h3>
            <p className="text-gray-400 leading-relaxed">{movie?.detail}</p>
          </div>

          {/* Cast */}
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Cast</h3>
            <ul className="space-y-1">
              {movie?.cast.map((actor, i) => (
                <li key={i} className="text-gray-400 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
                  {actor}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-14">
          <MovieTabs
            loadingMovieReview={loadingMovieReview}
            userInfo={userInfo}
            submitHandler={submitHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            movie={movie}
          />
        </div>

        {/* Similar Movies */}
        {filteredSimilar && filteredSimilar.length > 0 && (
          <div className="mb-14">
            <h2 className="text-2xl font-bold text-white mb-4">Similar Movies</h2>
            <div className="flex flex-wrap">
              {filteredSimilar.map((m) => (
                <MovieCard key={m._id} movie={m} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
