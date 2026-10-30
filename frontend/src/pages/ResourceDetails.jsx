import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ResourceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subject: "",
  });
  const [replacementFile, setReplacementFile] = useState(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/resources/${id}`);
        setResource(response.data.data);
        const { title, description, category, subject } = response.data.data;
        setFormData({ title, description, category, subject });
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Failed to load resource details."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  const ownerId = resource?.uploadedBy?._id?.toString();
  const userId = (user?.id ?? user?._id)?.toString();
  const isOwner = Boolean(ownerId && userId && ownerId === userId);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleReplacementChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (file && file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      event.target.value = "";
      setReplacementFile(null);
      return;
    }
    if (file && file.size > 10 * 1024 * 1024) {
      setError("PDF file size must be 10 MB or less.");
      event.target.value = "";
      setReplacementFile(null);
      return;
    }
    setError("");
    setReplacementFile(file);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value.trim());
      });
      if (replacementFile) payload.append("file", replacementFile);
      const response = await api.put(`/resources/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResource(response.data.data);
      setEditing(false);
      setReplacementFile(null);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to update resource."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this resource permanently?")) return;
    try {
      setDeleting(true);
      await api.delete(`/resources/${id}`);
      navigate("/resources");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to delete resource."
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <p className="p-6 text-gray-500">Loading resource...</p>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-4xl p-6">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error || "Resource not found."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto max-w-4xl p-4 sm:p-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
              {error}
            </div>
          )}
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-800">Edit Resource</h1>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={150}
                className="w-full rounded-lg border border-gray-300 p-3"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                maxLength={2000}
                rows="5"
                className="w-full rounded-lg border border-gray-300 p-3"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full rounded-lg border border-gray-300 p-3"
                />
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full rounded-lg border border-gray-300 p-3"
                />
              </div>
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleReplacementChange}
                className="w-full rounded-lg border border-gray-300 p-3"
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setReplacementFile(null);
                    setError("");
                  }}
                  className="rounded-lg bg-gray-200 px-5 py-2 text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                {resource.category}
              </span>
              <h1 className="mt-4 text-3xl font-bold text-gray-800">
                {resource.title}
              </h1>
              <p className="mt-4 whitespace-pre-wrap text-gray-600">
                {resource.description}
              </p>
              <div className="mt-6 space-y-2 text-gray-700">
                <p><strong>Subject:</strong> {resource.subject}</p>
                <p><strong>Uploaded by:</strong> {resource.uploadedBy?.name}</p>
                <p>
                  <strong>Upload date:</strong>{" "}
                  {new Date(resource.createdAt).toLocaleString("en-IN")}
                </p>
                <p><strong>File:</strong> {resource.originalName}</p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const response = await api.get(
                        `/resources/${id}/download`,
                        { responseType: "blob" }
                      );
                      const url = window.URL.createObjectURL(response.data);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = resource.originalName || "resource.pdf";
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                      window.URL.revokeObjectURL(url);
                    } catch (requestError) {
                      alert(
                        requestError.response?.data?.message ||
                          "Unable to download resource"
                      );
                    }
                  }}
                  className="rounded-lg bg-green-600 px-5 py-2 text-center text-white hover:bg-green-700"
                >
                  Download PDF
                </button>
                {isOwner && (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                    >
                      Edit Resource
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {deleting ? "Deleting..." : "Delete Resource"}
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResourceDetails;
