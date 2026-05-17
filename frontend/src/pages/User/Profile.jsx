import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useProfileMutation } from "../../redux/api/users";
import { useGetWatchlistQuery } from "../../redux/api/users";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState("edit");

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading }] = useProfileMutation();
  const { data: watchlist } = useGetWatchlistQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    setUsername(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await updateProfile({ _id: userInfo._id, username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen px-4 pt-10 pb-32 flex justify-center">
      <div className="w-full max-w-2xl">
        {/* Profile header */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-teal-600 flex items-center justify-center text-4xl font-extrabold text-white shadow-lg">
            {userInfo.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">{userInfo.username}</h1>
            <p className="text-gray-500 text-sm">{userInfo.email}</p>
            <div className="flex gap-4 mt-2">
              <span className="text-xs text-gray-400 bg-[#1a1a1a] border border-gray-700 px-3 py-1 rounded-full">
                {userInfo.isAdmin ? "👑 Admin" : "👤 Member"}
              </span>
              <Link
                to="/watchlist"
                className="text-xs text-teal-400 bg-[#1a1a1a] border border-gray-700 px-3 py-1 rounded-full hover:border-teal-500 transition"
              >
                🔖 {watchlist?.length ?? 0} in watchlist
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-800 mb-6">
          <button
            onClick={() => setActiveTab("edit")}
            className={`pb-2 px-1 text-sm font-semibold transition ${
              activeTab === "edit"
                ? "text-teal-400 border-b-2 border-teal-400"
                : "text-gray-500 hover:text-white"
            }`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab("watchlist")}
            className={`pb-2 px-1 text-sm font-semibold transition ${
              activeTab === "watchlist"
                ? "text-teal-400 border-b-2 border-teal-400"
                : "text-gray-500 hover:text-white"
            }`}
          >
            Watchlist Preview
          </button>
        </div>

        {/* Edit tab */}
        {activeTab === "edit" && (
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-8">
            <form onSubmit={submitHandler} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Name</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-xl px-4 py-3 outline-none focus:border-teal-500 transition text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-xl px-4 py-3 outline-none focus:border-teal-500 transition text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">New Password <span className="text-gray-600">(leave blank to keep current)</span></label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-xl px-4 py-3 outline-none focus:border-teal-500 transition text-sm placeholder-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-xl px-4 py-3 outline-none focus:border-teal-500 transition text-sm placeholder-gray-600"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition text-sm"
              >
                {isLoading ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>
        )}

        {/* Watchlist preview tab */}
        {activeTab === "watchlist" && (
          <div>
            {!watchlist || watchlist.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">🎬</p>
                <p className="text-gray-500 mb-4">Your watchlist is empty</p>
                <Link to="/movies" className="text-teal-400 hover:underline text-sm">Browse movies</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {watchlist.slice(0, 6).map((movie) => (
                  <Link key={movie._id} to={`/movies/${movie._id}`} className="group">
                    <div className="rounded-xl overflow-hidden border border-gray-800 group-hover:border-gray-600 transition">
                      <img src={movie.image} alt={movie.name} className="w-full h-40 object-cover group-hover:opacity-80 transition" />
                      <div className="p-2 bg-[#111]">
                        <p className="text-white text-xs font-semibold truncate">{movie.name}</p>
                        <p className="text-gray-500 text-xs">{movie.year}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {watchlist && watchlist.length > 6 && (
              <Link to="/watchlist" className="block text-center text-teal-400 hover:underline text-sm mt-4">
                View all {watchlist.length} movies →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
