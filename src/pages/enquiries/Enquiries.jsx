import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllEnquiriesAPI,
  deleteEnquiryAPI,
} from "../../api/api";
import {
  successNotification,
  errorNotification,
} from "../../helpers/notifi_helper";

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch all enquiries
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await getAllEnquiriesAPI();
      if (res?.success) setEnquiries(res.data);
      else errorNotification(res?.message);
    } catch (err) {
      console.error("Fetch enquiries failed:", err);
      errorNotification("Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // ✅ Delete enquiry
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await deleteEnquiryAPI(id);
      if (res?.success) {
        successNotification("Enquiry deleted successfully");
        fetchEnquiries();
      } else {
        errorNotification(res?.message);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      errorNotification("Failed to delete enquiry");
    }
  };

  // ✅ Navigate to single enquiry page
  const handleView = (id) => {
    navigate(`/mec-admin/enquiries/${id}`);
  };

  // ✅ Format date/time
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <div className="p-6 bg-zinc-900/50 rounded-xl shadow-xl border border-zinc-800 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">📩 Enquiries</h2>
        <button
          onClick={fetchEnquiries}
          disabled={loading}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-zinc-700 rounded-lg overflow-hidden">
          <thead className="bg-zinc-800 text-gray-300">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Company</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length > 0 ? (
              enquiries.map((e) => (
                <tr
                  key={e._id}
                  onClick={() => handleView(e._id)}
                  className="border-t border-zinc-700 hover:bg-zinc-800/50 cursor-pointer"
                >
                  <td className="p-3 font-semibold">{e.name}</td>
                  <td className="p-3 text-gray-300">{e.email}</td>
                  <td className="p-3 text-gray-300">{e.phone}</td>
                  <td className="p-3 text-gray-300">{e.company_name || "-"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${e.is_opened
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                        }`}
                    >
                      {e.is_opened ? "Opened" : "Not Opened"}
                    </span>
                  </td>
                  <td className="p-3 text-gray-400">
                    {formatDateTime(e.createdAt)}
                  </td>
                  <td
                    className="p-3 text-right space-x-3"
                    onClick={(ev) => ev.stopPropagation()} // prevent row click
                  >
                    <button
                      onClick={() => handleDelete(e._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center text-gray-400" colSpan={7}>
                  No enquiries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Enquiries;
