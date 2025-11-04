import React, { useEffect, useState } from "react";
import {
  getAllClientsAPI,
  addClientAPI,
  editClientAPI,
  deleteClientAPI,
} from "../../api/api";
import {
  successNotification,
  errorNotification,
} from "../../helpers/notifi_helper";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    client_name: "",
    companies: [""],
    client_emails: [""],
    client_phones: [""],
  });

  // 🟢 Fetch Clients
  const fetchClients = async () => {
    setLoading(true);
    const res = await getAllClientsAPI();
    if (res?.success) setClients(res.data);
    else errorNotification(res?.message || "Failed to fetch clients");
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // 🟢 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🟢 Handle array field (companies, emails, phones)
  const handleArrayChange = (index, field, value) => {
    const updated = [...form[field]];
    updated[index] = value;
    setForm({ ...form, [field]: updated });
  };

  // ➕ Add field dynamically
  const addField = (field) => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };

  // ❌ Remove field
  const removeField = (field, index) => {
    const updated = form[field].filter((_, i) => i !== index);
    setForm({ ...form, [field]: updated });
  };

  // 🟢 Submit form (Add/Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      client_name: form.client_name,
      companies: form.companies.map((c) => ({ name: c })),
      client_emails: form.client_emails.filter((x) => x.trim() !== ""),
      client_phones: form.client_phones.filter((x) => x.trim() !== ""),
    };

    setLoading(true);
    let res;
    if (editingId) res = await editClientAPI(editingId, payload);
    else res = await addClientAPI(payload);

    if (res?.success) {
      successNotification(
        editingId ? "Client updated successfully!" : "Client added successfully!"
      );
      closeModal();
      fetchClients();
    } else {
      errorNotification(res?.message || "Operation failed");
    }
    setLoading(false);
  };

  // 🗑️ Delete client
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    setLoading(true);
    const res = await deleteClientAPI(id);
    if (res?.success) {
      successNotification("Client deleted successfully");
      fetchClients();
    } else errorNotification(res?.message || "Failed to delete client");
    setLoading(false);
  };

  // ✏️ Open modal for editing
  const handleEdit = (client) => {
    setForm({
      client_name: client.client_name,
      companies: client.companies.map((c) => c.name),
      client_emails: client.client_emails,
      client_phones: client.client_phones,
    });
    setEditingId(client._id);
    setModalOpen(true);
  };

  // ➕ Open modal for adding
  const handleAddNew = () => {
    setEditingId(null);
    setForm({
      client_name: "",
      companies: [""],
      client_emails: [""],
      client_phones: [""],
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm({
      client_name: "",
      companies: [""],
      client_emails: [""],
      client_phones: [""],
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Clients Management</h2>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          + Add Client
        </button>
      </div>

      {/* 📋 Clients Table */}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : clients.length === 0 ? (
        <p className="text-gray-400">No clients found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 text-white border border-gray-700 rounded-xl">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="p-3">Client Name</th>
                <th className="p-3">Companies</th>
                <th className="p-3">Emails</th>
                <th className="p-3">Phones</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client._id}
                  className="border-t border-gray-700 hover:bg-gray-700/50"
                >
                  <td className="p-3">{client.client_name}</td>
                  <td className="p-3 text-gray-300">
                    {client.companies.map((c) => c.name).join(", ")}
                  </td>
                  <td className="p-3 text-gray-400">
                    {client.client_emails.join(", ")}
                  </td>
                  <td className="p-3 text-gray-400">
                    {client.client_phones.join(", ")}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleEdit(client)}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(client._id)}
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

      {/* 🧾 Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-xl w-full max-w-2xl relative border border-gray-700 shadow-xl">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Client" : "Add Client"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-gray-300 mb-1">Client Name</label>
                  <input
                    type="text"
                    name="client_name"
                    value={form.client_name}
                    onChange={handleChange}
                    className="w-full bg-gray-700 p-2 rounded"
                    required
                  />
                </div>

                {/* Companies */}
                <div>
                  <label className="block text-gray-300 mb-1">Companies</label>
                  {form.companies.map((company, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={company}
                        onChange={(e) =>
                          handleArrayChange(index, "companies", e.target.value)
                        }
                        className="flex-1 bg-gray-700 p-2 rounded"
                        required
                      />
                      {form.companies.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField("companies", index)}
                          className="px-2 bg-red-600 rounded"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addField("companies")}
                    className="text-blue-400 text-sm mt-1"
                  >
                    + Add Company
                  </button>
                </div>

                {/* Emails */}
                <div>
                  <label className="block text-gray-300 mb-1">Emails</label>
                  {form.client_emails.map((email, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                          handleArrayChange(index, "client_emails", e.target.value)
                        }
                        className="flex-1 bg-gray-700 p-2 rounded"
                      />
                      {form.client_emails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField("client_emails", index)}
                          className="px-2 bg-red-600 rounded"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addField("client_emails")}
                    className="text-blue-400 text-sm mt-1"
                  >
                    + Add Email
                  </button>
                </div>

                {/* Phones */}
                <div>
                  <label className="block text-gray-300 mb-1">Phones</label>
                  {form.client_phones.map((phone, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) =>
                          handleArrayChange(index, "client_phones", e.target.value)
                        }
                        className="flex-1 bg-gray-700 p-2 rounded"
                      />
                      {form.client_phones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeField("client_phones", index)}
                          className="px-2 bg-red-600 rounded"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addField("client_phones")}
                    className="text-blue-400 text-sm mt-1"
                  >
                    + Add Phone
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
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

export default Clients;
