import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/resources", {
          params: {
            search: search || undefined,
            category,
          },
        });
        setResources(response.data.data);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Failed to load resources."
        );
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = window.setTimeout(fetchResources, 250);
    return () => window.clearTimeout(timeoutId);
  }, [search, category]);

  const categories = [
    "All",
    "Notes",
    "Previous Papers",
    "Assignments",
    "Books",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto max-w-6xl p-4 sm:p-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Resources</h1>
            <p className="mt-2 text-gray-500">
              Find and download study materials shared by students.
            </p>
          </div>
          <Link
            to="/resources/upload"
            className="rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
          >
            + Upload Resource
          </Link>
        </div>

        <div className="mb-6 grid gap-3 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-[1fr_220px]">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, description or subject..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5"
          >
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
            Loading resources...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        ) : resources.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
            No resources found.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <article
                key={resource._id}
                className="flex flex-col rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="self-start rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                  {resource.category}
                </span>
                <h2 className="mt-4 text-xl font-bold text-gray-800">
                  {resource.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-gray-600">
                  {resource.description}
                </p>
                <div className="mt-4 space-y-1 text-sm text-gray-500">
                  <p>Subject: {resource.subject}</p>
                  <p>Uploaded by: {resource.uploadedBy?.name || "Unknown"}</p>
                  <p>
                    {new Date(resource.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <Link
                  to={`/resources/${resource._id}`}
                  className="mt-5 rounded-lg bg-blue-600 py-2 text-center text-white hover:bg-blue-700"
                >
                  View Details
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Resources;
