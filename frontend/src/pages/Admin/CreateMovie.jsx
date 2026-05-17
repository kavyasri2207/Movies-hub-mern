import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateMovieMutation, useUploadImageMutation } from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import { toast } from "react-toastify";

const CreateMovie = () => {
  const navigate = useNavigate();
  const [movieData, setMovieData] = useState({
    name: "", year: 0, detail: "", cast: [], rating: 0,
    image: null, genre: "", runtime: 0, trailerUrl: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [createMovie, { isLoading: isCreatingMovie }] = useCreateMovieMutation();
  const [uploadImage, { isLoading: isUploadingImage, error: uploadImageErrorDetails }] = useUploadImageMutation();
  const { data: genres, isLoading: isLoadingGenres } = useFetchGenresQuery();

  useEffect(() => {
    if (genres) setMovieData((prev) => ({ ...prev, genre: genres[0]?._id || "" }));
  }, [genres]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "genre") {
      const selectedGenre = genres.find((g) => g.name === value);
      setMovieData((prev) => ({ ...prev, genre: selectedGenre ? selectedGenre._id : "" }));
    } else {
      setMovieData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateMovie = async () => {
    try {
      if (!movieData.name || !movieData.year || !movieData.detail || !movieData.cast) {
        toast.error("Please fill all required fields");
        return;
      }
      let uploadedImagePath = null;
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
      } else if (movieData.image) {
        uploadedImagePath = movieData.image;
      } else {
        toast.error("Please upload an image or provide an image URL");
        return;
      }
      await createMovie({ ...movieData, image: uploadedImagePath });
      navigate("/admin/movies-list");
      toast.success("Movie Added Successfully!");
    } catch (error) {
      toast.error(`Failed to create movie`);
    }
  };

  const inputClass = "border border-gray-700 bg-[#111] px-3 py-2 w-full rounded-lg text-white focus:outline-none focus:border-teal-500";
  const labelClass = "block text-gray-400 text-sm mb-1";

  return (
    <div className="container flex justify-center items-start mt-8 pb-24">
      <div className="w-full max-w-2xl">
        <p className="text-teal-400 text-2xl font-bold mb-6">Create Movie</p>
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
              <input type="number" name="runtime" value={movieData.runtime} onChange={handleChange} className={inputClass} />
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
              value={movieData.cast.join(", ")}
              onChange={(e) => setMovieData({ ...movieData, cast: e.target.value.split(", ") })}
              className={inputClass}
              placeholder="Actor 1, Actor 2, Actor 3"
            />
          </div>
          <div>
            <label className={labelClass}>Trailer URL (YouTube embed, optional)</label>
            <input type="text" name="trailerUrl" value={movieData.trailerUrl} onChange={handleChange} className={inputClass} placeholder="https://www.youtube.com/embed/..." />
          </div>
          <div>
            <label className={labelClass}>Genre</label>
            <select name="genre" value={movieData.genre} onChange={handleChange} className={inputClass}>
              {isLoadingGenres ? (
                <option>Loading genres...</option>
              ) : (
                genres?.map((genre) => (
                  <option key={genre._id} value={genre._id}>{genre.name}</option>
                ))
              )}
            </select>
          </div>
          <div>
            <label className={labelClass}>Poster Image</label>
            <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center">
              {selectedImage ? (
                <div>
                  <img src={URL.createObjectURL(selectedImage)} alt="preview" className="h-32 object-cover rounded mx-auto mb-2" />
                  <button onClick={() => setSelectedImage(null)} className="text-xs text-red-400 hover:underline">Remove</button>
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
          <button
            type="button"
            onClick={handleCreateMovie}
            className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-lg font-semibold transition disabled:opacity-50"
            disabled={isCreatingMovie || isUploadingImage}
          >
            {isCreatingMovie || isUploadingImage ? "Creating..." : "Create Movie"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMovie;
