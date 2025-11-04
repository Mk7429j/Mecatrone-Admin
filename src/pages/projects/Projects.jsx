import React, { useEffect, useState } from "react";
import {
  getAllProjectsAPI,
  addProjectAPI,
  editProjectAPI,
  deleteProjectAPI,
  getAllClientsAPI,
  getAllWorksAPI,
  uploadImageAPI,
  deleteImageAPI,
} from "../../api/api";
import {
  successNotification,
  errorNotification,
} from "../../helpers/notifi_helper";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [worksList, setWorksList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    project_name: "",
    short_description: "",
    project_url: "",
    client_id: "",
    work_id: "",
    project_image: "",
  });

  // ✅ Fetch Data
  useEffect(() => {
    (async () => {
      await Promise.all([fetchProjects(), fetchClients(), fetchWorks()]);
    })();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const res = await getAllProjectsAPI();
    if (res?.success) setProjects(res.data);
    else errorNotification(res?.message || "Failed to fetch projects");
    setLoading(false);
  };

  const fetchClients = async () => {
    const res = await getAllClientsAPI();
    if (res?.success) setClients(res.data);
  };

  const fetchWorks = async () => {
    const res = await getAllWorksAPI();
    if (res?.success) setWorksList(res.data);
  };

  // ✅ Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Upload Project Image
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
        setForm((prev) => ({ ...prev, project_image: uploaded }));
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
    if (!form.project_image) return;
    try {
      const res = await deleteImageAPI({ urls: [form.project_image] });
      if (res?.success) {
        successNotification("🗑️ Image deleted successfully");
        setForm((prev) => ({ ...prev, project_image: "" }));
      } else errorNotification("Failed to delete image");
    } catch (err) {
      console.error(err);
      errorNotification("Delete failed");
    }
  };

  // ✅ Add / Edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.project_name ||
      !form.short_description ||
      !form.project_url ||
      !form.client_id ||
      !form.work_id ||
      !form.project_image
    ) {
      return errorNotification("All fields are required!");
    }

    const payload = { ...form };

    setLoading(true);
    const res = editingId
      ? await editProjectAPI(editingId, payload)
      : await addProjectAPI(payload);

    if (res?.success) {
      successNotification(
        editingId
          ? "Project updated successfully!"
          : "Project added successfully!"
      );
      resetForm();
      fetchProjects();
    } else errorNotification(res?.message || "Operation failed");

    setLoading(false);
  };

  // ✅ Edit
  const handleEdit = (project) => {
    setForm({
      project_name: project.project_name,
      short_description: project.short_description,
      project_url: project.project_url,
      client_id: project.client_id?._id || project.client_id,
      work_id: project.work_id?._id || project.work_id,
      project_image: project.project_image || "",
    });
    setEditingId(project._id);
    setShowModal(true);
  };

  // ✅ Delete
  const handleDelete = async (id, imgUrl) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    setLoading(true);
    const res = await deleteProjectAPI(id);
    if (res?.success) {
      if (imgUrl) await deleteImageAPI({ urls: [imgUrl] });
      successNotification("Project deleted successfully!");
      fetchProjects();
    } else errorNotification(res?.message || "Failed to delete project");
    setLoading(false);
  };

  // ✅ Reset
  const resetForm = () => {
    setForm({
      project_name: "",
      short_description: "",
      project_url: "",
      client_id: "",
      work_id: "",
      project_image: "",
    });
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-zinc-900/50 rounded-xl border border-zinc-800 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">💼 Projects Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          + Add Project
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-zinc-700 rounded-lg overflow-hidden">
          <thead className="bg-zinc-800 text-gray-300">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Client</th>
              <th className="p-3">Work</th>
              <th className="p-3">URL</th>
              <th className="p-3">Description</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((p) => (
                <tr
                  key={p._id}
                  className="border-t border-zinc-700 hover:bg-zinc-800/50"
                >
                  <td className="p-3">
                    <img
                      src={p.project_image}
                      alt="project"
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  </td>
                  <td className="p-3 font-semibold">{p.project_name}</td>
                  <td className="p-3">{p.client_id?.client_name || "—"}</td>
                  <td className="p-3">{p.work_id?.title || "—"}</td>
                  <td className="p-3 text-blue-400">
                    <a href={p.project_url} target="_blank" rel="noreferrer">
                      Visit
                    </a>
                  </td>
                  <td className="p-3 text-gray-400">{p.short_description}</td>
                  <td className="p-3 text-right space-x-3">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(p._id, p.project_image)}
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
                  colSpan={7}
                >
                  No projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-lg w-full max-w-2xl relative">
            <h3 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Project" : "Add Project"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Project Name</label>
                <input
                  type="text"
                  name="project_name"
                  value={form.project_name}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-md"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Short Description</label>
                <textarea
                  name="short_description"
                  value={form.short_description}
                  onChange={handleChange}
                  rows={3}
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-md"
                  placeholder="Enter short description"
                ></textarea>
              </div>

              <div>
                <label className="block mb-1 text-sm">Project URL</label>
                <input
                  type="url"
                  name="project_url"
                  value={form.project_url}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-md"
                  placeholder="https://example.com"
                />
              </div>

              {/* Client */}
              <div>
                <label className="block mb-1 text-sm">Client</label>
                <select
                  name="client_id"
                  value={form.client_id}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-md"
                  required
                >
                  <option value="">Select Client</option>
                  {clients.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.client_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Work */}
              <div>
                <label className="block mb-1 text-sm">Select Work</label>
                <select
                  name="work_id"
                  value={form.work_id}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-md"
                  required
                >
                  <option value="">Select Work</option>
                  {worksList.map((w) => (
                    <option key={w._id} value={w._id}>
                      {w.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm mb-1">Project Image</label>
                {form.project_image ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={form.project_image}
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

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
