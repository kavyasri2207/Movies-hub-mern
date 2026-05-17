import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/admin/movies/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/admin/movies/create",    label: "Create Movie", icon: "➕" },
  { to: "/admin/movies/genre",     label: "Genres",       icon: "🏷️" },
  { to: "/admin/movies-list",      label: "All Movies",   icon: "🎬" },
  { to: "/admin/movies/comments",  label: "Reviews",      icon: "💬" },
];

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <div className="fixed top-0 left-0 h-screen w-56 bg-[#0a0a0a] border-r border-gray-800 flex flex-col pt-8 z-40">
      <div className="px-5 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎬</span>
          <span className="text-white font-extrabold text-lg">Admin</span>
        </div>
        <p className="text-gray-600 text-xs mt-0.5">Movies App</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map((link) => {
          const active = pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                active
                  ? "bg-teal-600 text-white"
                  : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 pb-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-600 hover:text-white text-xs transition"
        >
          ← Back to site
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
