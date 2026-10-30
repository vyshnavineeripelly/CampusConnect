
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditClub() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    college: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await api.get(`/clubs/${id}`);
        const club = response.data.data;

        setFormData({
          name: club.name || "",
          description: club.description || "",
          category: club.category || "",
          college: club.college || "",
        });
      } catch (error) {
        console.error("Error fetching club:", error);
        alert("Unable to load club details");
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [id]);

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

      await api.put(`/clubs/${id}`, formData);

      alert("Club updated successfully!");
      navigate(`/clubs/${id}`);
    } catch (error) {
      console.error("Update club error:", error);
      alert(
        error.response?.data?.message || "Failed to update club"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading club details...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold">
          Edit Club
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Club Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          />

          <textarea
            name="description"
            placeholder="Club Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          />

          <input
            type="text"
            name="college"
            placeholder="College"
            value={formData.college}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate(`/clubs/${id}`)}
              className="rounded-lg bg-gray-300 px-5 py-2 text-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditClub;
