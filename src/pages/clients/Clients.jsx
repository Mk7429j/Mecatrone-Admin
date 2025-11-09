import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  Users,
  Building,
  Mail,
  Phone,
  X,
  UserPlus,
  Briefcase
} from "lucide-react";
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
    try {
      const res = await getAllClientsAPI();
      if (res?.success) setClients(res.data);
      else errorNotification(res?.message || "Failed to fetch clients");
    } catch (error) {
      errorNotification("Failed to fetch clients");
    } finally {
      setLoading(false);
    }
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
    
    // Filter out empty values
    const payload = {
      client_name: form.client_name.trim(),
      companies: form.companies.filter(c => c.trim() !== "").map((c) => ({ name: c.trim() })),
      client_emails: form.client_emails.filter(email => email.trim() !== ""),
      client_phones: form.client_phones.filter(phone => phone.trim() !== ""),
    };

    // Validate at least one company exists
    if (payload.companies.length === 0) {
      return errorNotification("Please add at least one company");
    }

    setLoading(true);
    try {
      let res;
      if (editingId) {
        res = await editClientAPI(editingId, payload);
      } else {
        res = await addClientAPI(payload);
      }

      if (res?.success) {
        successNotification(
          editingId ? "Client updated successfully!" : "Client added successfully!"
        );
        closeModal();
        fetchClients();
      } else {
        errorNotification(res?.message || "Operation failed");
      }
    } catch (error) {
      errorNotification("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete client
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    setLoading(true);
    try {
      const res = await deleteClientAPI(id);
      if (res?.success) {
        successNotification("Client deleted successfully");
        fetchClients();
      } else errorNotification(res?.message || "Failed to delete client");
    } catch (error) {
      errorNotification("Delete failed");
    } finally {
      setLoading(false);
    }
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

  // Calculate statistics
  const stats = {
    total: clients.length,
    withMultipleCompanies: clients.filter(client => client.companies.length > 1).length,
    withContactInfo: clients.filter(client => 
      client.client_emails.length > 0 || client.client_phones.length > 0
    ).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Clients Management
          </h1>
          <p className="text-gray-400 mt-1">Manage your client relationships and information</p>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchClients}
            disabled={loading}
            className="flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 px-4 py-2 rounded-lg text-gray-300 transition-all backdrop-blur-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh"}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 px-4 py-2 rounded-lg text-white font-medium shadow-lg shadow-green-500/25 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Add Client
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl p-4 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <Users className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">{stats.total}</span>
          </div>
          <p className="text-gray-400 text-sm mt-2">Total Clients</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl p-4 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <Building className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">{stats.withMultipleCompanies}</span>
          </div>
          <p className="text-gray-400 text-sm mt-2">Multiple Companies</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl p-4 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <Mail className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">{stats.withContactInfo}</span>
          </div>
          <p className="text-gray-400 text-sm mt-2">With Contact Info</p>
        </motion.div>
      </div>

      {/* Clients Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"
            />
            <span className="ml-3 text-gray-400">Loading clients...</span>
          </div>
        ) : clients.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 flex flex-col items-center gap-3">
              <Users className="w-16 h-16 opacity-50" />
              <p className="text-lg">No clients found</p>
              <button
                onClick={handleAddNew}
                className="text-green-400 hover:text-green-300 text-sm font-medium"
              >
                Add your first client
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800/60 border-b border-zinc-700">
                <tr>
                  <th className="p-4 text-left text-gray-300 font-semibold">Client</th>
                  <th className="p-4 text-left text-gray-300 font-semibold">Companies</th>
                  <th className="p-4 text-left text-gray-300 font-semibold">Contact Info</th>
                  <th className="p-4 text-right text-gray-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <motion.tr
                    key={client._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-white">{client.client_name}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {client.companies.map((company, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs border border-blue-500/30"
                          >
                            {company.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {client.client_emails.map((email, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3 text-purple-400" />
                            <span className="text-gray-300">{email}</span>
                          </div>
                        ))}
                        {client.client_phones.map((phone, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-green-400" />
                            <span className="text-gray-300">{phone}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(client)}
                          className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(client._id)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900/95 border border-zinc-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    {editingId ? "Edit Client" : "Create New Client"}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Client Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Client Name
                    </label>
                    <input
                      type="text"
                      name="client_name"
                      value={form.client_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                      placeholder="Enter client name"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Companies */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        <Building className="w-4 h-4 inline mr-2" />
                        Companies
                      </label>
                      <div className="space-y-3">
                        {form.companies.map((company, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-2"
                          >
                            <input
                              type="text"
                              value={company}
                              onChange={(e) =>
                                handleArrayChange(index, "companies", e.target.value)
                              }
                              className="flex-1 px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                              placeholder="Company name"
                              required
                            />
                            {form.companies.length > 1 && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={() => removeField("companies", index)}
                                className="px-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </motion.button>
                            )}
                          </motion.div>
                        ))}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => addField("companies")}
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Add Company
                        </motion.button>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                      {/* Emails */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email Addresses
                        </label>
                        <div className="space-y-3">
                          {form.client_emails.map((email, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex gap-2"
                            >
                              <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                  handleArrayChange(index, "client_emails", e.target.value)
                                }
                                className="flex-1 px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="email@example.com"
                              />
                              {form.client_emails.length > 1 && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  onClick={() => removeField("client_emails", index)}
                                  className="px-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </motion.button>
                              )}
                            </motion.div>
                          ))}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => addField("client_emails")}
                            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium"
                          >
                            <Plus className="w-4 h-4" />
                            Add Email
                          </motion.button>
                        </div>
                      </div>

                      {/* Phones */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Phone Numbers
                        </label>
                        <div className="space-y-3">
                          {form.client_phones.map((phone, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex gap-2"
                            >
                              <input
                                type="tel"
                                value={phone}
                                onChange={(e) =>
                                  handleArrayChange(index, "client_phones", e.target.value)
                                }
                                className="flex-1 px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                                placeholder="+1 (555) 123-4567"
                              />
                              {form.client_phones.length > 1 && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  onClick={() => removeField("client_phones", index)}
                                  className="px-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </motion.button>
                              )}
                            </motion.div>
                          ))}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => addField("client_phones")}
                            className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-medium"
                          >
                            <Plus className="w-4 h-4" />
                            Add Phone
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-6">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={closeModal}
                      className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-lg transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={loading}
                      className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 disabled:from-zinc-600 disabled:to-zinc-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all shadow-lg shadow-green-500/25"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          {editingId ? "Updating..." : "Creating..."}
                        </div>
                      ) : (
                        editingId ? "Update Client" : "Create Client"
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Clients;