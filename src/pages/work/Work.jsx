import React, { useEffect, useState } from "react";
import {
  getAllWorksAPI,
  addWorkAPI,
  editWorkAPI,
  deleteWorkAPI,
  uploadImageAPI,
  deleteImageAPI,
} from "../../api/api";
import {
  successNotification,
  errorNotification,
} from "../../helpers/notifi_helper";

const Work = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    info: [{ heading: "", details: "", img: "" }],
  });

  // 🟢 Fetch all works
  const fetchWorks = async () => {
    setLoading(true);
    const res = await getAllWorksAPI();
    if (res?.success) setWorks(res.data || []);
    else errorNotification("Failed to fetch works");
    setLoading(false);
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  // 🟢 Handle input change
  const handleChange = (e, index, field) => {
    if (field) {
      const updatedInfo = [...form.info];
      updatedInfo[index][field] = e.target.value;
      setForm({ ...form, info: updatedInfo });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // 🖼️ Upload image per section
  const handleUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("images", file);

    try {
      setUploading(true);
      const res = await uploadImageAPI(formData);
      if (res?.success && res.files?.length) {
        const updatedInfo = [...form.info];
        updatedInfo[index].img = res.files[0].url;
        setForm({ ...form, info: updatedInfo });
        successNotification("✅ Image uploaded successfully!");
      } else {
        errorNotification("Upload failed!");
      }
    } catch (err) {
      console.error(err);
      errorNotification("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  // 🗑️ Delete image
  const handleImageDelete = async (index) => {
    const imageUrl = form.info[index].img;
    if (!imageUrl) return;

    try {
      const res = await deleteImageAPI({ urls: [imageUrl] });
      if (res?.success) {
        const updatedInfo = [...form.info];
        updatedInfo[index].img = "";
        setForm({ ...form, info: updatedInfo });
        successNotification("🗑️ Image deleted successfully");
      } else errorNotification("Failed to delete image");
    } catch (err) {
      console.error(err);
      errorNotification("Delete failed");
    }
  };

  // ➕ Add another info block
  const addInfoBlock = () => {
    setForm({
      ...form,
      info: [...form.info, { heading: "", details: "", img: "" }],
    });
  };

  // 🗑️ Remove info block
  const removeInfoBlock = (index) => {
    const updatedInfo = form.info.filter((_, i) => i !== index);
    setForm({ ...form, info: updatedInfo });
  };

  // 🧹 Reset form
  const resetForm = () => {
    setForm({ title: "", info: [{ heading: "", details: "", img: "" }] });
    setEditingId(null);
    setShowModal(false);
  };

  // 🟢 Submit (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let res;
    if (editingId) res = await editWorkAPI(editingId, form);
    else res = await addWorkAPI(form);

    if (res?.success) {
      successNotification(
        editingId ? "Work updated successfully!" : "Work added successfully!"
      );
      resetForm();
      fetchWorks();
    } else {
      errorNotification(res?.message || "Operation failed");
    }
    setLoading(false);
  };

  // 🗑️ Delete Work
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this work?")) return;
    setLoading(true);
    const res = await deleteWorkAPI(id);
    if (res?.success) {
      successNotification("Work deleted successfully");
      fetchWorks();
    } else errorNotification(res?.message || "Failed to delete work");
    setLoading(false);
  };

  // ✏️ Edit Work
  const handleEdit = (work) => {
    setForm({ title: work.title, info: work.info });
    setEditingId(work._id);
    setShowModal(true);
  };

  return (
    <div className="p-6 text-white">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">🧰 Works Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          + Add Work
        </button>
      </div>

      {/* 📋 Works Table */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : works.length === 0 ? (
        <p className="text-gray-400">No works found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 text-white border border-gray-700 rounded-xl">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="p-3">Title</th>
                <th className="p-3">Info Count</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {works.map((work) => (
                <tr
                  key={work._id}
                  className="border-t border-gray-700 hover:bg-gray-700/50"
                >
                  <td className="p-3">{work.title}</td>
                  <td className="p-3">{work.info?.length}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleEdit(work)}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(work._id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🟢 Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/70 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-xl w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Work" : "Add Work"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block mb-1">Work Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full bg-gray-700 p-2 rounded"
                  required
                />
              </div>

              {/* Info Sections */}
              <div>
                <label className="block mb-2 font-semibold">
                  Work Info Sections
                </label>
                {form.info.map((info, index) => (
                  <div
                    key={index}
                    className="border border-gray-600 rounded-lg p-4 mb-3 bg-gray-700/50"
                  >
                    <input
                      type="text"
                      placeholder="Heading"
                      value={info.heading}
                      onChange={(e) => handleChange(e, index, "heading")}
                      className="bg-gray-700 p-2 rounded w-full mb-3"
                      required
                    />
                    <textarea
                      placeholder="Details"
                      value={info.details}
                      onChange={(e) => handleChange(e, index, "details")}
                      className="bg-gray-700 p-2 rounded w-full mb-3"
                      rows={3}
                      required
                    />

                    {/* 🖼️ Image uploader */}
                    {info.img ? (
                      <div className="flex items-center gap-4 mb-2">
                        <img
                          src={info.img}
                          alt="Work"
                          className="w-24 h-24 rounded object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageDelete(index)}
                          className="bg-red-500 hover:bg-red-400 px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer inline-block bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-sm mb-2">
                        {uploading ? "Uploading..." : "Upload Image"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleUpload(e, index)}
                        />
                      </label>
                    )}

                    {form.info.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInfoBlock(index)}
                        className="text-red-400 text-sm mt-2 hover:underline"
                      >
                        Remove Section
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addInfoBlock}
                  className="text-blue-400 hover:underline text-sm"
                >
                  + Add Another Section
                </button>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
                >
                  {editingId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Work;
