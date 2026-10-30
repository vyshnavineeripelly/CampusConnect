import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Profile = () => {
  const { user } = useAuth();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
    name: "",
    college: "",
    department: "",
    year: "",
    bio: "",
    skills: "",
    interests: "",
    });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile");

        setProfile(response.data.data);
        const data = response.data.data;

        setProfile(data);

        setFormData({
        name: data.name || "",
        college: data.college || "",
        department: data.department || "",
        year: data.year || "",
        bio: data.bio || "",
        skills: data.skills?.join(", ") || "",
        interests: data.interests?.join(", ") || "",
        });
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

     const handleChange = (e) => {
     setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        };

        const handleUpdate = async (e) => {
  e.preventDefault();

  try {
    const response = await api.put("/profile", {
      name: formData.name,
      college: formData.college,
      department: formData.department,
      year: Number(formData.year),
      bio: formData.bio,
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== ""),
      interests: formData.interests
        .split(",")
        .map((interest) => interest.trim())
        .filter((interest) => interest !== ""),
    });

    setProfile(response.data.data);
    setEditing(false);

    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Profile update error:", error);

    alert(
      error.response?.data?.message ||
        "Failed to update profile."
    );
  }
};

  if (loading) {
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
              {profile?.name?.charAt(0)}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {profile?.name}
              </h1>

              <p className="text-gray-500">
                {profile?.email}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">College</p>
              <p className="font-semibold">
                {profile?.college}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-semibold">
                {profile?.department}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Year</p>
              <p className="font-semibold">
                {profile?.year}
              </p>
            </div>
          </div>
          
            <div className="mt-6">
                <button
                    onClick={() => setEditing(!editing)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                    {editing ? "Cancel Edit" : "Edit Profile"}
                </button>
            </div>

            {editing && (
                <form
                    onSubmit={handleUpdate}
                    className="mt-6 space-y-4 border-t pt-6"
                >
                    <h2 className="text-xl font-bold">
                    Edit Profile
                    </h2>

                    <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full border p-3 rounded-lg"
                    />

                    <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="College"
                    className="w-full border p-3 rounded-lg"
                    />

                    <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Department"
                    className="w-full border p-3 rounded-lg"
                    />

                    <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    min="1"
                    max="6"
                    placeholder="Year"
                    className="w-full border p-3 rounded-lg"
                    />

                    <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    rows="4"
                    className="w-full border p-3 rounded-lg"
                    />

                    <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Skills (e.g. JavaScript, React, Python)"
                    className="w-full border p-3 rounded-lg"
                    />

                    <input
                    type="text"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    placeholder="Interests (e.g. Coding, Music, Sports)"
                    className="w-full border p-3 rounded-lg"
                    />

                    <button
                    type="submit"
                    className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700"
                    >
                    Save Changes
                    </button>
                </form>
                )}

          <div className="mt-8">
            <h2 className="text-xl font-bold">
              About
            </h2>

            <p className="text-gray-600 mt-2">
              {profile?.bio || "No bio added yet."}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold">
              Skills
            </h2>

            <div className="flex flex-wrap gap-2 mt-3">
              {profile?.skills?.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">
                  No skills added yet.
                </p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold">
              Interests
            </h2>

            <div className="flex flex-wrap gap-2 mt-3">
              {profile?.interests?.length > 0 ? (
                profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">
                  No interests added yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;