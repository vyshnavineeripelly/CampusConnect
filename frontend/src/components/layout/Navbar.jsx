import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get("/notifications");
        setUnreadCount(response.data.unreadCount || 0);
      } catch {
        setUnreadCount(0);
      }
    };

    if (user) fetchUnreadCount();
  }, [user, location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setDropdownOpen(false);
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 shadow-md sm:px-6">
      <Link
        to="/dashboard"
        className="text-2xl font-bold text-blue-600"
      >
        CampusConnect
      </Link>

      <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-5">
        <Link
          to="/events"
          className="text-gray-700 hover:text-blue-600"
        >
          Events
        </Link>

        <Link
          to="/clubs"
          className="text-gray-700 hover:text-blue-600"
        >
          Clubs
        </Link>

        <Link
          to="/my-clubs"
          className="text-gray-700 hover:text-blue-600"
        >
          My Clubs
        </Link>

        <Link
          to="/resources"
          className="text-gray-700 hover:text-blue-600"
        >
          Resources
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Open profile menu"
            aria-expanded={dropdownOpen}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="truncate font-semibold text-gray-800">
                  {user?.name || "User"}
                </p>
                <p className="mt-0.5 text-sm capitalize text-gray-500">
                  {user?.role || "student"}
                </p>
              </div>

              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              >
                My Profile
              </Link>

              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              >
                Settings
              </Link>

              <Link
                to="/notifications"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              >
                Notifications
                {unreadCount > 0 && (
                  <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;