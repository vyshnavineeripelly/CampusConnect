import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myEvents, setMyEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");

        setEvents(response.data.data);
      } catch (error) {
        console.error("Fetch events error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    const fetchMyEvents = async () => {
        try {
            const response = await api.get("/events/my-events");
            setMyEvents(response.data.data);
        } catch (error) {
            console.error("Fetch my events error:", error);
        }
        };

        fetchMyEvents();
  }, []);

  if (loading) {
    return <div className="p-8">Loading events...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-6xl mx-auto p-6">

                <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
            My Events
        </h2>

        {myEvents.length === 0 ? (
            <p className="text-gray-500">
            You haven't created any events yet.
            </p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map((event) => (
                <div
                key={event._id}
                className="bg-white rounded-xl shadow-sm p-5"
                >
                <p className="text-sm text-blue-600 font-semibold">
                    {event.category}
                </p>

                <h3 className="text-xl font-bold text-gray-800 mt-2">
                    {event.title}
                </h3>

                <p className="text-gray-600 mt-2">
                    {event.description}
                </p>

                <p className="text-gray-500 mt-3">
                    📅{" "}
                    {new Date(event.date).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                    })}
                </p>

                <p className="text-gray-500 mt-1">
                    📍 {event.location}
                </p>
                </div>
            ))}
            </div>
        )}
        </section>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Campus Events 🎉
          </h1>

          <p className="text-gray-500 mt-2">
            Discover what's happening around your campus.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center">
            <p className="text-gray-500">
              No events available yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {event.category}
                </span>

                <h2 className="text-xl font-bold mt-4">
                  {event.title}
                </h2>

                <p className="text-gray-500 mt-2 line-clamp-3">
                  {event.description}
                </p>

                <div className="mt-5 space-y-2 text-sm text-gray-600">
                  {/* <p>
                    📅{" "}
                    {new Date(event.date).toLocaleString()}
                  </p> */}
                  <p className="text-gray-600">
                        {new Date(event.date).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                        })}
                    </p>

                  <p>📍 {event.location}</p>

                  <p>
                    👤 Organized by{" "}
                    {event.organizer?.name}
                  </p>
                </div>

                <Link
                  to={`/events/${event._id}`}
                  className="block text-center mt-5 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  View Details
                </Link>

                <Link
                    to="/events/create"
                    className="inline-block mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                    >
                    + Create Event
                </Link>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Events;