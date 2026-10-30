import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
// import { useParams } from "react-router-dom";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";


const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();
  const isOrganizer =
  event?.organizer?._id === user?._id ||
  event?.organizer?._id === user?.id;

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`);

      setEvent(response.data.data);
    } catch (error) {
      console.error("Fetch event error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleJoin = async () => {
    try {
      setActionLoading(true);

      const response = await api.post(`/events/${id}/join`);

      setEvent(response.data.data);

      alert("You joined the event!");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to join event."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    try {
      setActionLoading(true);

      const response = await api.delete(`/events/${id}/leave`);

      setEvent(response.data.data);

      alert("You left the event.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to leave event."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this event?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await api.delete(`/events/${event._id}`);

    alert("Event deleted successfully!");

    navigate("/events");
  } catch (error) {
    console.error("Delete event error:", error);

    alert(
      error.response?.data?.message ||
        "Failed to delete event."
    );
  }
};

  if (loading) {
    return <div className="p-8">Loading event...</div>;
  }

  if (!event) {
    return <div className="p-8">Event not found.</div>;
  }

  const isJoined = event?.attendees?.some(
  (attendee) => {
    const attendeeId =
      typeof attendee === "object"
        ? attendee._id
        : attendee;

    return attendeeId === user?._id || attendeeId === user?.id;
  }
);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {event.category}
          </span>

          <h1 className="text-4xl font-bold text-gray-800 mt-4">
            {event.title}
          </h1>

          <p className="text-gray-600 mt-4">
            {event.description}
          </p>

          <div className="mt-6 space-y-3 text-gray-700">
            {/* <p>
              📅{" "}
              {new Date(event.date).toLocaleString()}
            </p> */}
            {new Date(event.date).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            })}

            <p>📍 {event.location}</p>

            <p>
              👤 Organized by{" "}
              {event.organizer?.name}
            </p>

            <p>
              👥 {event.attendees?.length || 0} attendee(s)
            </p>
          </div>
         
        <div className="mt-8 flex flex-row items-center gap-3">
                {isJoined ? (
                    <button
                    onClick={handleLeave}
                    disabled={actionLoading}
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                    {actionLoading ? "Processing..." : "Leave Event"}
                    </button>
                ) : (
                    <button
                    onClick={handleJoin}
                    disabled={actionLoading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                    {actionLoading ? "Processing..." : "Join Event"}
                    </button>
                )}

                {isOrganizer && (
                    <button
                    onClick={() => navigate(`/events/${event._id}/edit`)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                    ✏️ Edit Event
                    </button>
                )}

                {isOrganizer && (
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
                    >
                        🗑️ Delete Event
                    </button>
                )}
            </div>

          {/* <div className="mt-8 flex gap-4">
            <button
              onClick={handleJoin}
              disabled={actionLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {actionLoading ? "Processing..." : "Join Event"}
            </button>

            <button
              onClick={handleLeave}
              disabled={actionLoading}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Leave Event
            </button>
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default EventDetails;