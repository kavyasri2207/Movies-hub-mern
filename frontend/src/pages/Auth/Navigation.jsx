import { useState } from "react";
import { AiOutlineHome, AiOutlineLogin, AiOutlineUserAdd } from "react-icons/ai";
import { MdOutlineLocalMovies } from "react-icons/md";
import { MdBookmarkBorder } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/users";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-[#0f0f0f]/95 backdrop-blur border border-gray-800 px-8 py-3 rounded-2xl shadow-xl">
      <section className="flex justify-between items-center gap-8">
        {/* Left nav links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex flex-col items-center text-gray-400 hover:text-white transition"
          >
            <AiOutlineHome size={22} />
            <span className="text-[10px] mt-0.5">Home</span>
          </Link>
          <Link
            to="/movies"
            className="flex flex-col items-center text-gray-400 hover:text-white transition"
          >
            <MdOutlineLocalMovies size={22} />
            <span className="text-[10px] mt-0.5">Movies</span>
          </Link>
          {userInfo && (
            <Link
              to="/watchlist"
              className="flex flex-col items-center text-gray-400 hover:text-white transition"
            >
              <MdBookmarkBorder size={22} />
              <span className="text-[10px] mt-0.5">Watchlist</span>
            </Link>
          )}
        </div>

        {/* Right: user / auth */}
        <div className="relative">
          {userInfo ? (
            <>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-white hover:text-teal-400 transition"
              >
                <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center text-xs font-bold">
                  {userInfo.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm">{userInfo.username}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-3 w-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <ul className="absolute bottom-12 right-0 w-44 bg-[#1a1a1a] border border-gray-700 rounded-xl overflow-hidden shadow-xl z-50">
                  {userInfo.isAdmin && (
                    <li>
                      <Link
                        to="/admin/movies/dashboard"
                        className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                        onClick={() => setDropdownOpen(false)}
                      >
                        🛡️ Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                      onClick={() => setDropdownOpen(false)}
                    >
                      👤 Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/watchlist"
                      className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                      onClick={() => setDropdownOpen(false)}
                    >
                      🔖 Watchlist
                    </Link>
                  </li>
                  <li className="border-t border-gray-700">
                    <button
                      onClick={() => { setDropdownOpen(false); logoutHandler(); }}
                      className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-800"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="flex flex-col items-center text-gray-400 hover:text-white transition"
              >
                <AiOutlineLogin size={22} />
                <span className="text-[10px] mt-0.5">Login</span>
              </Link>
              <Link
                to="/register"
                className="flex flex-col items-center text-gray-400 hover:text-white transition"
              >
                <AiOutlineUserAdd size={22} />
                <span className="text-[10px] mt-0.5">Register</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Navigation;
