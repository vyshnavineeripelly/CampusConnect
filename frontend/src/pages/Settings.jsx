import { useEffect, useState } from "react";
import api from "../services/api";

const Settings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [profileForm, setProfileForm] = useState({
    name: "", college: "", department: "", year: "", bio: "", skills: "", interests: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });
  const [inApp, setInApp] = useState(true);

  const loadProfile = async () => {
    try {
      setError("");
      const response = await api.get("/profile");
      const data = response.data.data;
      setProfile(data);
      setProfileForm({
        name: data.name || "",
        college: data.college || "",
        department: data.department || "",
        year: data.year ?? "",
        bio: data.bio || "",
        skills: (data.skills || []).join(", "),
        interests: (data.interests || []).join(", "),
      });
      setInApp(data.notificationPreferences?.inApp ?? true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, []);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await api.put("/profile", {
        name: profileForm.name.trim(),
        college: profileForm.college.trim(),
        department: profileForm.department.trim(),
        year: Number(profileForm.year),
        bio: profileForm.bio,
        skills: profileForm.skills.split(",").map((item) => item.trim()).filter(Boolean),
        interests: profileForm.interests.split(",").map((item) => item.trim()).filter(Boolean),
      });
      setProfile(response.data.data);
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    setSaving(true);
    try {
      await api.put("/profile/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("Password changed successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const savePreference = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await api.put("/profile/notifications", { inApp });
      setMessage("Notification preference saved");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save preference");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Loading settings...</div>;

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        {message && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">{message}</div>}
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

        <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-semibold">Profile information</h2>
          <p className="mb-4 text-sm text-gray-500">Account email: {profile?.email}</p>
          <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
            {[
              ["name", "Name", "text"], ["college", "College", "text"],
              ["department", "Department", "text"], ["year", "Year", "number"],
            ].map(([key, label, type]) => (
              <label key={key} className="text-sm font-medium text-gray-700">
                {label}
                <input type={type} min={type === "number" ? 1 : undefined} max={type === "number" ? 6 : undefined}
                  value={profileForm[key]} onChange={(e) => setProfileForm({ ...profileForm, [key]: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" required={key === "name"} />
              </label>
            ))}
            <label className="text-sm font-medium text-gray-700 sm:col-span-2">
              Bio
              <textarea value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                rows="3" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Skills (comma separated)
              <input value={profileForm.skills} onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Interests (comma separated)
              <input value={profileForm.interests} onChange={(e) => setProfileForm({ ...profileForm, interests: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
            </label>
            <button disabled={saving} className="w-fit rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60 sm:col-span-2">Save profile</button>
          </form>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-semibold">Change password</h2>
          <form onSubmit={changePassword} className="grid gap-4 sm:grid-cols-3">
            {[
              ["currentPassword", "Current password"], ["newPassword", "New password"], ["confirmPassword", "Confirm new password"],
            ].map(([key, label]) => (
              <label key={key} className="text-sm font-medium text-gray-700">
                {label}
                <input type="password" value={passwordForm[key]} onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                  minLength={6} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
              </label>
            ))}
            <button disabled={saving} className="w-fit rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60">Change password</button>
          </form>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-2 text-lg font-semibold">Notifications</h2>
          <label className="flex items-center gap-3 text-gray-700">
            <input type="checkbox" checked={inApp} onChange={(e) => setInApp(e.target.checked)} className="h-4 w-4" />
            Enable in-app notifications
          </label>
          <button onClick={savePreference} disabled={saving} className="mt-4 rounded-lg border border-blue-600 px-4 py-2 font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-60">Save preference</button>
        </section>
      </div>
    </main>
  );
};

export default Settings;
