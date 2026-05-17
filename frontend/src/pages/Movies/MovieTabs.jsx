import { useState } from "react";
import { Link } from "react-router-dom";
import StarRating from "../../component/StarRating";

const StarPicker = ({ rating, setRating }) => (
  <div className="flex gap-1 mb-3">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onClick={() => setRating(star)}
        className="cursor-pointer text-3xl select-none"
        style={{ color: star <= rating ? "#f59e0b" : "#4b5563" }}
      >
        ★
      </span>
    ))}
    {rating > 0 && (
      <span className="ml-2 text-sm text-gray-400 self-center">{rating}/5</span>
    )}
  </div>
);

const MovieTabs = ({
  userInfo,
  submitHandler,
  comment,
  setComment,
  rating,
  setRating,
  loadingMovieReview,
  movie,
}) => {
  const [activeTab, setActiveTab] = useState("reviews");

  return (
    <div className="mt-8">
      {/* Tab buttons */}
      <div className="flex gap-4 border-b border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-2 px-1 text-sm font-semibold transition-colors ${
            activeTab === "reviews"
              ? "text-teal-400 border-b-2 border-teal-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Reviews ({movie?.reviews?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("write")}
          className={`pb-2 px-1 text-sm font-semibold transition-colors ${
            activeTab === "write"
              ? "text-teal-400 border-b-2 border-teal-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Write a Review
        </button>
      </div>

      {/* Write Review tab */}
      {activeTab === "write" && (
        <section>
          {userInfo ? (
            <form onSubmit={submitHandler} className="max-w-lg">
              <label className="block text-sm text-gray-400 mb-2">Your Rating</label>
              <StarPicker rating={rating} setRating={setRating} />

              <label htmlFor="comment" className="block text-sm text-gray-400 mb-2 mt-4">
                Your Review
              </label>
              <textarea
                id="comment"
                rows="4"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this movie..."
                className="p-3 border border-gray-600 rounded-lg w-full bg-[#1a1a1a] text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
              />

              <button
                type="submit"
                disabled={loadingMovieReview || rating === 0}
                className="mt-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white py-2 px-6 rounded-lg transition-colors"
              >
                {loadingMovieReview ? "Submitting..." : "Submit Review"}
              </button>
              {rating === 0 && (
                <p className="text-xs text-gray-500 mt-1">Please select a star rating</p>
              )}
            </form>
          ) : (
            <p className="text-gray-400">
              Please{" "}
              <Link to="/login" className="text-teal-400 hover:underline">
                Sign In
              </Link>{" "}
              to write a review
            </p>
          )}
        </section>
      )}

      {/* Reviews list tab */}
      {activeTab === "reviews" && (
        <section>
          {movie?.reviews?.length === 0 ? (
            <p className="text-gray-500 italic">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {movie?.reviews?.map((review) => (
                <div
                  key={review._id}
                  className="bg-[#1A1A1A] p-5 rounded-xl border border-gray-800 max-w-2xl"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <strong className="text-white">{review.name}</strong>
                      <div className="mt-1">
                        <StarRating rating={review.rating} size={16} />
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {review.createdAt?.substring(0, 10)}
                    </p>
                  </div>
                  <p className="text-gray-300 mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default MovieTabs;
