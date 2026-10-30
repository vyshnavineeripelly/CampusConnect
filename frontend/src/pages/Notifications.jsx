import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setError("");
      const response = await api.get("/notifications");
      setNotifications(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNotifications(); }, []);

  const markRead = async (notification) => {
    try {
      if (!notification.isRead) {
        await api.patch(`/notifications/${notification._id}/read`);
        setNotifications((items) => items.map((item) => item._id === notification._id ? { ...item, isRead: true } : item));
      }
      navigate(notification.relatedType === "club" ? `/clubs/${notification.relatedId}` : `/events/${notification.relatedId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to open notification");
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark notifications as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((items) => items.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete notification");
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Loading notifications...</div>;

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {notifications.some((item) => !item.isRead) && (
            <button onClick={markAllRead} className="rounded-lg border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">
              Mark all as read
            </button>
          )}
        </div>
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}
        {notifications.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">You have no notifications.</div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <article key={notification._id} className={`rounded-xl border bg-white p-4 shadow-sm ${notification.isRead ? "border-gray-100" : "border-blue-200"}`}>
                <button onClick={() => markRead(notification)} className="w-full text-left">
                  <p className={`text-gray-800 ${notification.isRead ? "" : "font-semibold"}`}>{notification.message}</p>
                  <p className="mt-1 text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
                </button>
                <div className="mt-3 flex gap-3">
                  {!notification.isRead && (
                    <button onClick={() => markRead(notification)} className="text-sm text-blue-600 hover:text-blue-800">Open</button>
                  )}
                  <button onClick={() => deleteNotification(notification._id)} className="text-sm text-red-600 hover:text-red-800">Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Notifications;
