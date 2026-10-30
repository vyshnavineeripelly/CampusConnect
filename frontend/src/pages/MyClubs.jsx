
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function MyClubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyClubs = async () => {
      try {
        const response = await api.get("/clubs/my-clubs");
        setClubs(response.data.data);
      } catch (error) {
        console.error("Error fetching my clubs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyClubs();
  }, []);

  if (loading) {
    return <p className="p-6">Loading your clubs...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold">
          My Clubs
        </h1>

        <p className="mb-6 text-gray-600">
          Clubs you have joined or created.
        </p>

        {clubs.length === 0 ? (
          <div className="rounded-lg bg-white p-6 text-center shadow">
            <p>You haven't joined any clubs yet.</p>

            <Link
              to="/clubs"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              Explore Clubs
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {clubs.map((club) => (
              <Link
                to={`/clubs/${club._id}`}
                key={club._id}
                className="rounded-xl bg-white p-5 shadow transition hover:shadow-lg"
              >
                <p className="mb-2 text-sm text-blue-600">
                  {club.category}
                </p>

                <h2 className="mb-2 text-xl font-bold">
                  {club.name}
                </h2>

                <p className="mb-3 text-gray-600">
                  {club.description}
                </p>

                <p className="text-sm text-gray-500">
                  College: {club.college}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Members: {club.members?.length || 0}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyClubs;
