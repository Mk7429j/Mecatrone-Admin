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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // 🔹 Fetch all subscribers
  const fetchSubscribers = async () => {
    setLoading(true);
    try {
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
    } catch (error) {
      errorNotification("Failed to fetch subscribers");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle checkbox selection
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 🔹 Select all/none
  const toggleSelectAll = () => {
    setSelected(selected.length === filteredSubscribers.length ? [] : filteredSubscribers.map(s => s._id));
  };

  // 🔹 Delete selected subscribers
  const handleDelete = async () => {
    if (selected.length === 0) {
      errorNotification("Please select at least one subscriber to delete.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selected.length} subscriber(s)?`))
      return;

    setLoading(true);
    try {
      const res = await deleteSubscribersAPI(selected);
      if (res?.success) {
        successNotification(`${selected.length} subscriber(s) deleted successfully`);
        setSelected([]);
        fetchSubscribers();
      } else {
        errorNotification(res?.message || "Failed to delete subscribers");
      }
    } catch (error) {
      errorNotification("Failed to delete subscribers");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Filter and sort subscribers
  const filteredSubscribers = subscribers
    .filter(sub => 
      sub.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.subscribedAt) - new Date(a.subscribedAt);
        case "oldest":
          return new Date(a.subscribedAt) - new Date(b.subscribedAt);
        case "email":
          return a.email?.localeCompare(b.email);
        default:
          return 0;
      }
    });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // 🔹 Custom checkbox component
  const Checkbox = ({ checked, onChange, id }) => (
    <div className="relative">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="absolute opacity-0 w-0 h-0"
      />
      <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
        checked 
          ? 'bg-blue-500 border-blue-500' 
          : 'border-gray-500 hover:border-gray-400'
      }`}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-zinc-700/50 text-white shadow-2xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Newsletter Subscribers
          </h2>
          <p className="text-gray-400 mt-1">Manage your email subscription list</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {selected.length > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-xl text-sm">
              {selected.length} selected
            </div>
          )}
          <button
            onClick={handleDelete}
            disabled={selected.length === 0 || loading}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-red-500/25"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete Selected</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{subscribers.length}</div>
          <div className="text-gray-400 text-sm">Total Subscribers</div>
        </div>
        <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{filteredSubscribers.length}</div>
          <div className="text-gray-400 text-sm">Filtered</div>
        </div>
        <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {subscribers.filter(s => new Date(s.subscribedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
          </div>
          <div className="text-gray-400 text-sm">Last 30 Days</div>
        </div>
        <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{selected.length}</div>
          <div className="text-gray-400 text-sm">Selected</div>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search subscribers by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="email">Sort by Email</option>
        </select>
        <button
          onClick={fetchSubscribers}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64 text-gray-400">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="text-lg">Loading subscribers...</p>
          </div>
        </div>
      )}

      {/* Subscribers Table */}
      {!loading && (
        <>
          {filteredSubscribers.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 text-gray-600">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                {searchTerm ? "No subscribers found" : "No subscribers yet"}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? "Try adjusting your search terms" : "Subscribers will appear here once they sign up"}
              </p>
            </div>
          ) : (
            <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-700/50 border-b border-zinc-600/50">
                      <th className="p-4 text-left">
                        <Checkbox
                          checked={selected.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                          onChange={toggleSelectAll}
                          id="select-all"
                        />
                      </th>
                      <th className="p-4 text-left font-semibold text-gray-300">Email Address</th>
                      <th className="p-4 text-left font-semibold text-gray-300">Subscription Date</th>
                      <th className="p-4 text-left font-semibold text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((sub, index) => (
                      <tr
                        key={sub._id}
                        className={`border-b border-zinc-600/30 transition-all duration-200 hover:bg-zinc-700/30 ${
                          index % 2 === 0 ? 'bg-zinc-800/20' : 'bg-zinc-800/10'
                        }`}
                      >
                        <td className="p-4">
                          <Checkbox
                            checked={selected.includes(sub._id)}
                            onChange={() => toggleSelect(sub._id)}
                            id={`sub-${sub._id}`}
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                              {sub.email?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-white">{sub.email}</div>
                              <div className="text-sm text-gray-400">Subscriber</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-white font-medium">
                            {new Date(sub.subscribedAt).toLocaleDateString("en-IN", {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-sm text-gray-400">
                            {new Date(sub.subscribedAt).toLocaleTimeString("en-IN", {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Subscribers;