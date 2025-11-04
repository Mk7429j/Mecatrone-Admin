import React, { useEffect, useState } from "react";
import {
  addBannerAPI,
  getBannersAPI,
  editBannerAPI,
  deleteBannerAPI,
} from "../../api/api";
import {
  uploadImageAPI,
  deleteImageAPI,
} from "../../api/api";
import {
  successNotification,
  errorNotification,
} from "../../helpers/notifi_helper";

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imgUrl, setImgUrl] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    position: "",
    is_active: true,
  });

  // ✅ Fetch all banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await getBannersAPI();
      if (res?.success) setBanners(res.data);
      else errorNotification(res?.message);
    } catch {
      errorNotification("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // ✅ Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // ✅ Upload Image
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("images", file);

    try {
      setUploading(true);
      const res = await uploadImageAPI(formData);

      if (res?.success && res.files?.length) {
        const uploaded = res.files[0].url;
        setImgUrl(uploaded);
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

  // ✅ Delete uploaded image
  const handleImageDelete = async () => {
    if (!imgUrl) return;
    try {
      const res = await deleteImageAPI({ urls: [imgUrl] });
      if (res?.success) {
        successNotification("🗑️ Image deleted successfully");
        setImgUrl("");
      } else errorNotification("Failed to delete image");
    } catch (err) {
      console.error(err);
      errorNotification("Delete failed");
    }
  };

  // ✅ Submit form (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imgUrl) return errorNotification("Please upload an image first!");

    const payload = { ...form, img: imgUrl };

    try {
      let res;
      if (editMode && selectedBanner) {
        res = await editBannerAPI(selectedBanner._id, payload);
      } else {
        res = await addBannerAPI(payload);
      }

      if (res?.success) {
        successNotification(res.message);
        setModalOpen(false);
        setForm({ name: "", description: "", position: "", is_active: true });
        setImgUrl("");
        fetchBanners();
      } else errorNotification(res?.message);
    } catch (err) {
      errorNotification("Something went wrong");
    }
  };

  // ✅ Delete banner
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await deleteBannerAPI(id);
      if (res?.success) {
        successNotification("Banner deleted successfully");
        fetchBanners();
      } else errorNotification(res?.message);
    } catch {
      errorNotification("Delete failed");
    }
  };

  // ✅ Open modal for Add/Edit
  const openModal = (banner = null) => {
    if (banner) {
      setEditMode(true);
      setSelectedBanner(banner);
      setImgUrl(banner.img);
      setForm({
        name: banner.name,
        description: banner.description,
        position: banner.position,
        is_active: banner.is_active,
      });
    } else {
      setEditMode(false);
      setSelectedBanner(null);
      setForm({ name: "", description: "", position: "", is_active: true });
      setImgUrl("");
    }
    setModalOpen(true);
  };

  return (
    <div className="p-6 bg-zinc-900/50 rounded-xl shadow-xl border border-zinc-800 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">🖼️ Banners Management</h2>
        <div className="space-x-3">
          <button
            onClick={fetchBanners}
            disabled={loading}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-sm"
          >
            Add Banner
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-zinc-700 rounded-lg overflow-hidden">
          <thead className="bg-zinc-800 text-gray-300">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Position</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {banners.length > 0 ? (
              banners.map((b) => (
                <tr
                  key={b._id}
                  className="border-t border-zinc-700 hover:bg-zinc-800/50"
                >
                  <td className="p-3">
                    <img
                      src={b.img}
                      alt="banner"
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  </td>
                  <td className="p-3 font-semibold">{b.name}</td>
                  <td className="p-3 text-gray-300 truncate w-64">
                    {b.description}
                  </td>
                  <td className="p-3">{b.position}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${b.is_active
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                        }`}
                    >
                      {b.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-3">
                    <button
                      onClick={() => openModal(b)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="p-4 text-center text-gray-400"
                  colSpan={6}
                >
                  No banners found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-lg w-full max-w-lg relative">
            <h3 className="text-xl font-semibold mb-4">
              {editMode ? "Edit Banner" : "Add Banner"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Banner Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-700 focus:outline-none"
                  placeholder="Enter banner name"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Banner Image</label>
                {imgUrl ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={imgUrl}
                      alt="Uploaded"
                      className="w-24 h-24 rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleImageDelete}
                      className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-md text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer inline-block bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-sm">
                    {uploading ? "Uploading..." : "Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUpload}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  required
                  maxLength={500}
                  className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-700 focus:outline-none"
                  placeholder="Enter short description"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm mb-1">Position</label>
                <input
                  type="number"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  required
                  min={1}
                  className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />
                <label>Active</label>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md"
                >
                  {editMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;
