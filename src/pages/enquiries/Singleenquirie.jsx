import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEnquiryByIdAPI,
  editEnquiryAPI,
} from "../../api/api";
import {
  successNotification,
  errorNotification,
} from "../../helpers/notifi_helper";

const SingleEnquiry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquiry, setEnquiry] = useState(null);

  // ✅ Fetch single enquiry
  const fetchEnquiry = async () => {
    try {
      const res = await getEnquiryByIdAPI(id);
      if (res?.success) {
        setEnquiry(res.data);

        // mark as opened if not already
        if (!res.data.is_opened) {
          await editEnquiryAPI(id, { is_opened: true, opened_at: new Date() });
        }
      } else {
        errorNotification(res?.message);
      }
    } catch (err) {
      console.error("Fetch enquiry failed:", err);
      errorNotification("Failed to load enquiry");
    }
  };

  useEffect(() => {
    fetchEnquiry();
  }, [id]);

  if (!enquiry) return <div className="p-6 text-gray-300">Loading...</div>;

  return (
    <div className="p-6 bg-zinc-900/50 rounded-xl border border-zinc-800 text-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-semibold mb-6">📨 Enquiry Details</h2>

      <div className="space-y-3 text-gray-300">
        <p><strong>Name:</strong> {enquiry.name}</p>
        <p><strong>Email:</strong> {enquiry.email}</p>
        <p><strong>Phone:</strong> {enquiry.phone}</p>
        <p><strong>Company:</strong> {enquiry.company_name || "-"}</p>
        <p><strong>Message:</strong> {enquiry.message}</p>
        <p><strong>Status:</strong> {enquiry.is_opened ? "Opened ✅" : "Not Opened ❌"}</p>
        <p><strong>Received:</strong> {new Date(enquiry.createdAt).toLocaleString()}</p>
        {enquiry.opened_at && (
          <p><strong>Opened At:</strong> {new Date(enquiry.opened_at).toLocaleString()}</p>
        )}
      </div>
    </div>
  );
};

export default SingleEnquiry;
