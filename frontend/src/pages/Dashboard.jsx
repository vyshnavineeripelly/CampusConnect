import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.name}! 👋
          </h1>

          <p className="text-gray-500 mt-2">
            Here's what's happening around your campus.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/events"
            className="cursor-pointer bg-white p-6 rounded-xl shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              🎉 Events
            </h2>

            <p className="text-gray-500 mt-2">
              Discover upcoming campus events.
            </p>
          </Link>

          <Link
            to="/clubs"
            className="cursor-pointer bg-white p-6 rounded-xl shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              👥 Clubs
            </h2>

            <p className="text-gray-500 mt-2">
              Explore clubs and student communities.
            </p>
          </Link>

          <Link
            to="/resources"
            className="cursor-pointer bg-white p-6 rounded-xl shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              📚 Resources
            </h2>

            <p className="text-gray-500 mt-2">
              Find useful study materials.
            </p>
            <span className="mt-4 inline-block text-blue-600 hover:text-blue-800">
              Open Resources
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;