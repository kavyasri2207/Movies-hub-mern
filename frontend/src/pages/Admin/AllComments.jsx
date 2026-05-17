import { useDeleteCommentMutation, useGetAllMoviesQuery } from "../../redux/api/movies";
import { toast } from "react-toastify";
import StarRating from "../../component/StarRating";

const AllComments = () => {
  const { data: movies, refetch } = useGetAllMoviesQuery();
  const [deleteComment] = useDeleteCommentMutation();

  const allReviews = movies?.flatMap((m) =>
    m.reviews.map((r) => ({ ...r, movieName: m.name, movieId: m._id, movieImage: m.image }))
  ) || [];

  const handleDeleteComment = async (movieId, reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteComment({ movieId, reviewId });
      toast.success("Review deleted");
      refetch();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="container mx-auto px-8 pb-32">
      <h1 className="text-2xl font-bold text-white mb-2">All Reviews</h1>
      <p className="text-gray-500 text-sm mb-6">{allReviews.length} total reviews</p>

      {allReviews.length === 0 ? (
        <p className="text-gray-500 italic">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {allReviews.map((review) => (
            <div
              key={review._id}
              className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 flex gap-4 items-start"
            >
              {/* Movie poster thumbnail */}
              <img
                src={review.movieImage}
                alt={review.movieName}
                className="w-10 h-14 object-cover rounded-lg flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <p className="text-teal-400 text-sm font-semibold">{review.movieName}</p>
                    <p className="text-white font-semibold">{review.name}</p>
                    <StarRating rating={review.rating} size={13} />
                  </div>
                  <p className="text-gray-600 text-xs">{review.createdAt?.substring(0, 10)}</p>
                </div>
                <p className="text-gray-300 text-sm mt-2">{review.comment}</p>
              </div>

              <button
                onClick={() => handleDeleteComment(review.movieId, review._id)}
                className="text-red-400 hover:text-red-300 text-xs font-semibold border border-red-900 hover:border-red-500 px-3 py-1.5 rounded-lg transition flex-shrink-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllComments;
