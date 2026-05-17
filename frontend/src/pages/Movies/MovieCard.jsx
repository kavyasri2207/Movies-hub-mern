import { Link } from "react-router-dom";
import StarRating from "../../component/StarRating";

const MovieCard = ({ movie }) => {
  return (
    <div className="relative group m-[2rem] w-[14rem]">
      <Link to={`/movies/${movie._id}`}>
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={movie.image?.replace(/\\/g, "/")}
            alt={movie.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=224&h=320&fit=crop&auto=format";
            }}
            className="w-[14rem] h-[20rem] object-cover rounded-lg transition duration-300 ease-in-out transform group-hover:scale-105 group-hover:opacity-60"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-lg">
            <p className="text-white font-semibold text-sm leading-tight">{movie.name}</p>
            <p className="text-gray-300 text-xs mt-1">{movie.year}</p>
            {movie.numReviews > 0 && (
              <div className="mt-1">
                <StarRating rating={movie.rating} size={13} />
                <span className="text-gray-400 text-xs ml-1">({movie.numReviews})</span>
              </div>
            )}
            {movie.runtime > 0 && (
              <p className="text-gray-400 text-xs mt-1">
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
