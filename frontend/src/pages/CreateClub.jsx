import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CreateClub = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    college: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/clubs", formData);

      alert("Club created successfully!");

      navigate("/clubs");
    } catch (error) {
      console.error("Create club error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create club."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Create a Club 🏫
          </h1>

          <p className="text-gray-500 mt-2">
            Create a club and bring students with similar interests together.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <input
              type="text"
              name="name"
              placeholder="Club name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg"
            />

            <textarea
              name="description"
              placeholder="Club description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="text"
              name="category"
              placeholder="Category (Technical, Sports, Cultural...)"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="text"
              name="college"
              placeholder="College"
              value={formData.college}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating Club..." : "Create Club"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateClub;