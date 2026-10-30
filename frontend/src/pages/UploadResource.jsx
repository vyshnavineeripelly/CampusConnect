import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const UploadResource = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subject: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setError("");

    if (selectedFile && selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      event.target.value = "";
      setFile(null);
      return;
    }

    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      setError("PDF file size must be 10 MB or less.");
      event.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value.trim());
    });
    payload.append("file", file);

    try {
      setLoading(true);
      const response = await api.post("/resources", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/resources/${response.data.data._id}`);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to upload resource."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto max-w-2xl p-4 sm:p-6">
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold text-gray-800">Upload Resource</h1>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
                {error}
              </div>
            )}
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={150}
              placeholder="Resource title"
              className="w-full rounded-lg border border-gray-300 p-3"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              maxLength={2000}
              rows="5"
              placeholder="Description"
              className="w-full rounded-lg border border-gray-300 p-3"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="Category"
                className="w-full rounded-lg border border-gray-300 p-3"
              />
              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="Subject"
                className="w-full rounded-lg border border-gray-300 p-3"
              />
            </div>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              className="w-full rounded-lg border border-gray-300 p-3"
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload PDF"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/resources")}
                className="rounded-lg bg-gray-200 px-5 py-3 font-semibold text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UploadResource;
