import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetSpecificMovieQuery,
  useUpdateMovieMutation,
  useUploadImageMutation,
  useDeleteMovieMutation,
} from "../../redux/api/movies";
import { toast } from "react-toastify";

const UpdateMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movieData, setMovieData] = useState({
    name: "", year: 0, detail: "", cast: [], rating: 0,
    image: null, genre: "", runtime: 0, trailerUrl: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const { data: initialMovieData } = useGetSpecificMovieQuery(id);

  useEffect(() => {
    if (initialMovieData) setMovieData(initialMovieData);
  }, [initialMovieData]);

  const [updateMovie, { isLoading: isUpdatingMovie }] = useUpdateMovieMutation();
  const [uploadImage, { isLoading: isUploadingImage }] = useUploadImageMutation();
  const [deleteMovie] = useDeleteMovieMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateMovie = async () => {
    try {
      if (!movieData.name || !movieData.year || !movieData.detail || !movieData.cast) {
        toast.error("Please fill in all required fields");
        return;
      }
      let uploadedImagePath = movieData.image;
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        const uploadImageResponse = await uploadImage(formData);
        if (uploadImageResponse.data) {
          uploadedImagePath = uploadImageResponse.data.image;
        } else {
          toast.error("Failed to upload image");
          return;
        }
      }
      await updateMovie({ id, updatedMovie: { ...movieData, image: uploadedImagePath } });
      toast.success("Movie updated successfully!");
      navigate("/admin/movies-list");
    } catch (error) {
      toast.error("Failed to update movie");
    }
  };

  const handleDeleteMovie = async () => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await deleteMovie(id);
      toast.success("Movie deleted successfully");
      navigate("/admin/movies-list");
    } catch (error) {
      toast.error(`Failed to delete movie: ${error?.message}`);
    }
  };

  const inputClass = "border border-gray-700 bg-[#111] px-3 py-2 w-full rounded-lg text-white focus:outline-none focus:border-teal-500";
  const labelClass = "block text-gray-400 text-sm mb-1";

  return (
    <div className="container flex justify-center items-start mt-8 pb-24">
      <div className="w-full max-w-2xl">
        <p className="text-teal-400 text-2xl font-bold mb-6">Update Movie</p>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Name *</label>
            <input type="text" name="name" value={movieData.name} onChange={handleChange} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Year *</label>
              <input type="number" name="year" value={movieData.year} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Runtime (minutes)</label>
              <input type="number" name="runtime" value={movieData.runtime || 0} onChange={handleChange} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Detail *</label>
            <textarea name="detail" value={movieData.detail} onChange={handleChange} rows={4} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Cast (comma-separated)</label>
            <input
              type="text"
              name="cast"
              value={Array.isArray(movieData.cast) ? movieData.cast.join(", ") : ""}
              onChange={(e) => setMovieData({ ...movieData, cast: e.target.value.split(", ") })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Trailer URL (YouTube embed)</label>
            <input type="text" name="trailerUrl" value={movieData.trailerUrl || ""} onChange={handleChange} className={inputClass} placeholder="https://www.youtube.com/embed/..." />
          </div>
          <div>
            <label className={labelClass}>Poster Image</label>
            <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center">
              {selectedImage ? (
                <div>
                  <img src={URL.createObjectURL(selectedImage)} alt="preview" className="h-32 object-cover rounded mx-auto mb-2" />
                  <button onClick={() => setSelectedImage(null)} className="text-xs text-red-400 hover:underline">Remove</button>
                </div>
              ) : movieData.image ? (
                <div>
                  <img src={movieData.image} alt="current" className="h-32 object-cover rounded mx-auto mb-2" />
                  <label className="cursor-pointer text-xs text-teal-400 hover:underline">
                    Change image
                    <input type="file" accept="image/*" onChange={(e) => setSelectedImage(e.target.files[0])} className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <span className="text-gray-400 text-sm">Click to upload image</span>
                  <input type="file" accept="image/*" onChange={(e) => setSelectedImage(e.target.files[0])} className="hidden" />
                </label>
              )}
            </div>
            <div className="mt-2">
              <label className={labelClass}>Or paste image URL</label>
              <input type="text" name="image" value={typeof movieData.image === "string" ? movieData.image : ""} onChange={handleChange} className={inputClass} placeholder="https://..." />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleUpdateMovie}
              className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-lg font-semibold transition disabled:opacity-50"
              disabled={isUpdatingMovie || isUploadingImage}
            >
              {isUpdatingMovie || isUploadingImage ? "Updating..." : "Update Movie"}
            </button>
            <button
              type="button"
              onClick={handleDeleteMovie}
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-lg font-semibold transition"
            >
              Delete Movie
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateMovie;
