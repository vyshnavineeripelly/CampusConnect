import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await api.get("/clubs");
        setClubs(response.data.data);
      } catch (error) {
        console.error("Fetch clubs error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Campus Clubs 🏫
            </h1>

            <p className="text-gray-500 mt-2">
              Discover clubs and connect with students who share your interests.
            </p>
          </div>

          <Link
            to="/clubs/create"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            + Create Club
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading clubs...</p>
        ) : clubs.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <p className="text-gray-500">
              No clubs have been created yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <Link
                key={club._id}
                to={`/clubs/${club._id}`}
                className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition"
                >
                <p className="text-sm text-blue-600 font-semibold">
                  {club.category}
                </p>

                <h2 className="text-xl font-bold text-gray-800 mt-2">
                  {club.name}
                </h2>

                <p className="text-gray-600 mt-2">
                  {club.description}
                </p>

                <p className="text-gray-500 mt-4">
                  🏫 {club.college}
                </p>

                <p className="text-gray-500 mt-1">
                  👥 {club.members?.length || 0} members
                </p>

                <p className="text-sm text-gray-400 mt-3">
                  Created by {club.createdBy?.name}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Clubs;