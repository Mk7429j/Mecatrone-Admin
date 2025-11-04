import React, { useEffect, useState } from "react";
import {
  getAllSubscribersAPI,
  deleteSubscribersAPI,
} from "../../api/api";
import {
  successNotification,
  errorNotification,
} from "../../helpers/notifi_helper";

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);

  // 🔹 Fetch all subscribers
  const fetchSubscribers = async () => {
    setLoading(true);
    const res = await getAllSubscribersAPI();
    console.log("🧩 Subscribers API Response:", res);

    if (res?.success) {
      // ✅ Safely handle both array or object format
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.subscribers)
        ? res.data.subscribers
        : [];
      setSubscribers(list);
    } else {
      errorNotification(res?.message || "Failed to load subscribers");
    }
    setLoading(false);
  };

  // 🔹 Handle checkbox selection
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 🔹 Delete selected subscribers
  const handleDelete = async () => {
    if (selected.length === 0) {
      errorNotification("Please select at least one subscriber to delete.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete selected subscribers?"))
      return;

    setLoading(true);
    const res = await deleteSubscribersAPI(selected);
    if (res?.success) {
      successNotification("Subscribers deleted successfully");
      setSelected([]);
      fetchSubscribers();
    } else {
      errorNotification(res?.message || "Failed to delete subscribers");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Newsletter Subscribers</h2>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50"
          disabled={selected.length === 0 || loading}
        >
          {loading ? "Deleting..." : "Delete Selected"}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10 text-gray-400">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-400 mr-3"></div>
          Loading subscribers...
        </div>
      ) : subscribers.length === 0 ? (
        <p className="text-gray-400">No subscribers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 text-white border border-gray-700 rounded-xl">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="p-3">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelected(
                        e.target.checked ? subscribers.map((s) => s._id) : []
                      )
                    }
                    checked={
                      selected.length > 0 &&
                      selected.length === subscribers.length
                    }
                  />
                </th>
                <th className="p-3">Email</th>
                <th className="p-3">Subscribed At</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr
                  key={sub._id}
                  className="border-t border-gray-700 hover:bg-gray-700/50"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(sub._id)}
                      onChange={() => toggleSelect(sub._id)}
                    />
                  </td>
                  <td className="p-3">{sub.email}</td>
                  <td className="p-3 text-gray-400">
                    {new Date(sub.subscribedAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Subscribers;
