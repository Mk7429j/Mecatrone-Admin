import React, { useEffect, useState } from "react";
import {
  getAllReviewsAPI,
  deleteReviewAPI,
  editReviewAPI,
} from "../../api/api";
import {
  successNotification,
  errorNotification,
} from "../../helpers/notifi_helper";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🧩 Fetch all reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await getAllReviewsAPI();
      if (res?.success) {
        setReviews(res.data);
      } else {
        errorNotification(res?.message || "Failed to load reviews");
      }
    } catch (err) {
      console.error("Fetch Reviews Error:", err);
      errorNotification("Server error while loading reviews");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete a review
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    setLoading(true);
    try {
      const res = await deleteReviewAPI(id);
      if (res?.success) {
        successNotification("Review deleted successfully");
        fetchReviews();
      } else {
        errorNotification(res?.message);
      }
    } catch (err) {
      errorNotification("Failed to delete review");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Toggle verify/unverify
  const handleVerifyToggle = async (review) => {
    setLoading(true);
    try {
      const res = await editReviewAPI(review._id, {
        is_verified: !review.is_verified,
      });
      if (res?.success) {
        successNotification(
          review.is_verified ? "Marked as Unverified" : "Marked as Verified"
        );
        fetchReviews();
      } else {
        errorNotification(res?.message);
      }
    } catch (err) {
      errorNotification("Failed to update review status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="p-6 bg-zinc-900/50 rounded-xl border border-zinc-800 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Customer Reviews</h2>
        <button
          onClick={fetchReviews}
          disabled={loading}
          className={`px-4 py-2 rounded-md text-sm transition ${
            loading
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center h-40 text-gray-400">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mb-3"></div>
            <p>Loading reviews...</p>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {!loading && (
        <>
          {reviews.length === 0 ? (
            <p className="text-gray-400 text-center">No reviews found.</p>
          ) : (
            <div className="grid gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="p-4 bg-zinc-800 text-white rounded-xl shadow-md border border-zinc-700 hover:border-blue-400 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold capitalize">
                        {rev.user_name}
                      </h3>
                      <p className="text-sm text-gray-400">{rev.user_email}</p>
                      {rev.company_name && (
                        <p className="text-sm text-gray-400">
                          Company: {rev.company_name}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        rev.is_verified
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {rev.is_verified ? "Verified" : "Unverified"}
                    </span>
                  </div>

                  <p className="mt-3 text-gray-300">
                    {rev.comment || "No comment"}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <div className="text-sm text-gray-400">
                      ⭐ {rev.rating}/5 |{" "}
                      {new Date(rev.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleVerifyToggle(rev)}
                        disabled={loading}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        {rev.is_verified ? "Unverify" : "Verify"}
                      </button>
                      <button
                        onClick={() => handleDelete(rev._id)}
                        disabled={loading}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reviews;
