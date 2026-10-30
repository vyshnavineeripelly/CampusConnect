import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    eventDate: "",
    hour: "",
    minute: "",
    ampm: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        const event = response.data.data;

        const eventDate = new Date(event.date);

        let hour = eventDate.getHours();
        const minute = String(eventDate.getMinutes()).padStart(2, "0");

        const ampm = hour >= 12 ? "PM" : "AM";

        hour = hour % 12 || 12;

        setFormData({
          title: event.title,
          description: event.description,
          category: event.category,
          eventDate: eventDate.toISOString().split("T")[0],
          hour: String(hour),
          minute,
          ampm,
          location: event.location,
        });
      } catch (error) {
        console.error("Fetch event error:", error);

        alert(
          error.response?.data?.message ||
            "Failed to load event."
        );

        navigate("/events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      let hour = Number(formData.hour);

      if (formData.ampm === "PM" && hour !== 12) {
        hour += 12;
      }

      if (formData.ampm === "AM" && hour === 12) {
        hour = 0;
      }

      const eventDateTime = `${formData.eventDate}T${String(
        hour
      ).padStart(2, "0")}:${formData.minute}`;

      await api.put(`/events/${id}`, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date: eventDateTime,
        location: formData.location,
      });

      alert("Event updated successfully!");

      navigate(`/events/${id}`);
    } catch (error) {
      console.error("Update event error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update event."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Edit Event ✏️
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <input
              type="text"
              name="title"
              placeholder="Event title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg"
            />

            <textarea
              name="description"
              placeholder="Event description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date
              </label>

              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Time
              </label>

              <div className="flex gap-3">
                <select
                  name="hour"
                  value={formData.hour}
                  onChange={handleChange}
                  required
                  className="border p-3 rounded-lg"
                >
                  <option value="">Hour</option>

                  {[...Array(12)].map((_, index) => (
                    <option
                      key={index + 1}
                      value={index + 1}
                    >
                      {index + 1}
                    </option>
                  ))}
                </select>

                <select
                  name="minute"
                  value={formData.minute}
                  onChange={handleChange}
                  required
                  className="border p-3 rounded-lg"
                >
                  <option value="">Minute</option>
                  <option value="00">00</option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                </select>

                <select
                  name="ampm"
                  value={formData.ampm}
                  onChange={handleChange}
                  required
                  className="border p-3 rounded-lg"
                >
                  <option value="">AM/PM</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg"
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditEvent;