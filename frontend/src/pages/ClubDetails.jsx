import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const ClubDetails = () => {
  const { id } = useParams();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

const { user } = useAuth();
const navigate = useNavigate();

const isMember = club?.members?.some((member) => {
  const memberId =
    typeof member === "object" ? member._id : member;
  const userId = (user?.id ?? user?._id)?.toString();

  return Boolean(memberId && userId && memberId.toString() === userId);
});

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await api.get(`/clubs/${id}`);
        setClub(response.data.data);
      } catch (error) {
        console.error("Fetch club error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [id]);

const handleJoin = async () => {
  try {
    setActionLoading(true);

    await api.post(`/clubs/${id}/join`);

    const response = await api.get(`/clubs/${id}`);
    setClub(response.data.data);

    alert("Successfully joined the club!");
  } catch (error) {
    console.error("Join club error:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Failed to join club");
  } finally {
    setActionLoading(false);
  }
};

const handleLeave = async () => {
  try {
    setActionLoading(true);

    await api.delete(`/clubs/${id}/leave`);

    const response = await api.get(`/clubs/${id}`);
    setClub(response.data.data);

    alert("Successfully left the club!");
  } catch (error) {
    console.error("Leave club error:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Failed to leave club");
  } finally {
    setActionLoading(false);
  }
};

<div className="mt-8">
  {isMember ? (
    <button
      onClick={handleLeave}
      disabled={actionLoading}
      className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50"
    >
      {actionLoading ? "Processing..." : "Leave Club"}
    </button>
  ) : (
    <button
      onClick={handleJoin}
      disabled={actionLoading}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
    >
      {actionLoading ? "Processing..." : "Join Club"}
    </button>
  )}
</div>


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!club) {
    return <div>Club not found.</div>;
  }

  const creatorId = club?.createdBy?._id?.toString();
  const userId = (user?.id ?? user?._id)?.toString();
  const isCreator = Boolean(creatorId && userId && creatorId === userId);

  const handleDelete = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this club?"
  );

  if (!confirmDelete) return;

  try {
    await api.delete(`/clubs/${id}`);

    alert("Club deleted successfully!");
    navigate("/clubs");
  } catch (error) {
    console.error("Delete club error:", error);
    alert(
      error.response?.data?.message || "Failed to delete club"
    );
  }
};

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm p-8">

          <p className="text-blue-600 font-semibold">
            {club.category}
          </p>

          <h1 className="text-3xl font-bold text-gray-800 mt-2">
            {club.name}
          </h1>

          <p className="text-gray-600 mt-4">
            {club.description}
          </p>

          <div className="mt-6 space-y-3">
            <p className="text-gray-700">
              🏫 <strong>College:</strong> {club.college}
            </p>

            <p className="text-gray-700">
              👥 <strong>Members:</strong>{" "}
              {club.members?.length || 0}
            </p>

            <p className="text-gray-700">
              👤 <strong>Created by:</strong>{" "}
              {club.createdBy?.name}
            </p>
          </div>

          {!isCreator && (
            <div className="mt-6">
              {isMember ? (
                <button
                  onClick={handleLeave}
                  disabled={actionLoading}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? "Please wait..." : "Leave Club"}
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={actionLoading}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {actionLoading ? "Please wait..." : "Join Club"}
                </button>
              )}
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Club Members
            </h2>

            {club.members?.length === 0 ? (
              <p className="text-gray-500">
                No members yet.
              </p>
            ) : (
              <div className="space-y-2">
                {club.members.map((member) => (
                  <div
                    key={member._id}
                    className="bg-gray-100 rounded-lg p-3"
                  >
                    👤 {member.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {isCreator && (
  <div className="mt-6 flex gap-3">
    <button
      onClick={() => navigate(`/clubs/${id}/edit`)}
      className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
    >
      ✏️ Edit Club
    </button>

    <button
      onClick={handleDelete}
      className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
    >
      🗑️ Delete Club
    </button>
  </div>
)}

        </div>
      </main>
    </div>
  );
};

export default ClubDetails;