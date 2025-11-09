import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Lock,
  UserCog,
  Upload,
  X,
  Mail,
  Phone,
  Shield,
  Key,
  Save,
  Crown,
  Users,
  UserCheck,
  Camera,
  Image as ImageIcon,
  MoreVertical,
  Smartphone,
  Monitor
} from "lucide-react";
import {
  addAdminAPI,
  deleteAdminAPI,
  getAdminAPI,
  getAllAdminsAPI,
  updateAdminAPI,
  uploadImageAPI,
  deleteImageAPI,
} from "../../api/api";
import {
  successNotification,
  errorNotification,
} from "../../helpers/notifi_helper";
import { useSelector } from "react-redux";
import Swal from 'sweetalert2';

const Admin = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    img: "",
  });

  const [imgUrl, setImgUrl] = useState("");
  const [passwords, setPasswords] = useState({ newPass: "", confirmPass: "" });

  // Check if current user is superadmin
  const isSuperAdmin = user?.role === "superadmin";

  // Password Strength Component
  const PasswordStrength = ({ password }) => {
    const getPasswordStrength = (pass) => {
      let strength = 0;
      if (pass.length >= 8) strength++;
      if (/[A-Z]/.test(pass)) strength++;
      if (/[a-z]/.test(pass)) strength++;
      if (/\d/.test(pass)) strength++;
      if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) strength++;

      return strength;
    };

    const strength = getPasswordStrength(password);

    const getStrengthColor = () => {
      if (strength <= 2) return 'bg-red-500';
      if (strength <= 3) return 'bg-yellow-500';
      return 'bg-green-500';
    };

    const getStrengthText = () => {
      if (strength <= 2) return 'Weak';
      if (strength <= 3) return 'Medium';
      return 'Strong';
    };

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Password strength:</span>
          <span className={`font-medium ${strength <= 2 ? 'text-red-400' :
            strength <= 3 ? 'text-yellow-400' :
              'text-green-400'
            }`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="w-full bg-zinc-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Password Validation Function
  const isPasswordValid = () => {
    const { newPass, confirmPass } = passwords;

    // Check if passwords match
    if (newPass !== confirmPass) return false;

    // Check password strength requirements
    const hasMinLength = newPass.length >= 8;
    const hasUpperCase = /[A-Z]/.test(newPass);
    const hasLowerCase = /[a-z]/.test(newPass);
    const hasNumbers = /\d/.test(newPass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPass);

    return hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  // ==========================================================
  // 🟢 FETCH ADMINS
  const fetchAdmins = async () => {
    try {
      setLoading(true);

      if (isSuperAdmin) {
        const res = await getAllAdminsAPI();
        if (res?.success && Array.isArray(res.data)) {
          setAdmins(res.data);
        } else {
          setAdmins([]);
        }
      } else if (user?._id) {
        const res = await getAdminAPI(user._id);
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          setAdmins([res.data[0]]);
        } else {
          setAdmins([]);
        }
      } else {
        setAdmins([]);
      }
    } catch (error) {
      console.error("❌ Fetch Admins Error:", error);
      errorNotification("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // ==========================================================
  // 🟡 INPUT HANDLERS
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "", password: "", role: "admin", img: "" });
    setImgUrl("");
  };

  // ==========================================================
  // 🟢 IMAGE UPLOAD HANDLERS
  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return errorNotification("Please select a valid image file");
    }

    if (file.size > 5 * 1024 * 1024) {
      return errorNotification("Image size should be less than 5MB");
    }

    const formData = new FormData();
    formData.append("images", file);

    try {
      setUploading(true);
      const res = await uploadImageAPI(formData);
      if (res?.success && res.files?.length) {
        const uploaded = res.files[0].url;
        setForm((prev) => ({ ...prev, img: uploaded }));
        setImgUrl(uploaded);
        successNotification("🎉 Profile image uploaded successfully!");
      } else {
        errorNotification("❌ Upload failed!");
      }
    } catch (err) {
      console.error(err);
      errorNotification("❌ Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!imgUrl) return;
    try {
      setUploading(true);
      const res = await deleteImageAPI({ urls: [imgUrl] });
      if (res?.success) {
        successNotification("🗑️ Profile image deleted successfully");
        setImgUrl("");
        setForm((prev) => ({ ...prev, img: "" }));
      } else {
        errorNotification("❌ Failed to delete image");
      }
    } catch (error) {
      console.error(error);
      errorNotification("❌ Error deleting image");
    } finally {
      setUploading(false);
    }
  };

  // ==========================================================
  // 🟢 SAVE ADMIN (Add or Edit)
  const handleSave = async () => {
    if (!form.name || !form.email || !form.phone || (!selectedAdmin && !form.password)) {
      return errorNotification("⚠️ All fields are required");
    }

    try {
      setSaveLoading(true);

      const payload = { ...form };
      // Remove password field if editing and password is empty
      if (selectedAdmin && !form.password) {
        delete payload.password;
      }

      const res = selectedAdmin
        ? await updateAdminAPI(selectedAdmin.id || selectedAdmin._id, payload)
        : await addAdminAPI(payload);

      if (res?.success) {
        successNotification(selectedAdmin ? "✅ Admin updated successfully" : "✅ Admin added successfully");
        fetchAdmins();
        setIsModalOpen(false);
        resetForm();
      } else {
        errorNotification(res?.message || "❌ Action failed");
      }
    } catch (err) {
      console.error(err);
      errorNotification("❌ Action failed");
    } finally {
      setSaveLoading(false);
    }
  };

  // ==========================================================
  // 🔴 DELETE ADMIN
  const handleDelete = async (id) => {
    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: '⚠️ Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      setDeleteLoading(id);
      const res = await deleteAdminAPI(id);
      if (res?.success) {
        successNotification("🗑️ Admin deleted successfully");
        fetchAdmins();
        setAdmins((prev) => prev.filter((a) => a._id !== id));
      } else {
        errorNotification(res?.message || "❌ Delete failed");
      }
    } catch {
      errorNotification("❌ Delete failed");
    } finally {
      setDeleteLoading(null);
    }
  };

  // ==========================================================
  // 🟡 CHANGE PASSWORD
  const handlePasswordChange = async () => {
    if (!passwords.newPass) return errorNotification("⚠️ New password is required");

    try {
      setPasswordLoading(true);
      const res = await updateAdminAPI(selectedAdmin.id || selectedAdmin._id, {
        password: passwords.newPass,
      });
      if (res?.success) {
        successNotification("🔐 Password updated successfully");
        setIsPasswordModalOpen(false);
        setPasswords({ newPass: "", confirmPass: "" });
      } else {
        errorNotification(res?.message || "❌ Failed to change password");
      }
    } catch {
      errorNotification("❌ Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Check if user can perform actions
  const canEdit = (admin) => isSuperAdmin || user?._id === admin._id;
  const canDelete = (admin) => isSuperAdmin && user?._id !== admin._id;

  // Mobile Action Menu Component
  const MobileActionMenu = ({ admin }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
      <div className="relative lg:hidden">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 text-gray-400 hover:text-gray-200 hover:bg-zinc-700/50 rounded-lg transition-colors"
          disabled={deleteLoading === admin._id}
        >
          {deleteLoading === admin._id ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <MoreVertical className="w-4 h-4" />
          )}
        </motion.button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className="absolute right-0 top-10 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl z-10 min-w-[140px] p-2 backdrop-blur-sm"
            >
              <div className="space-y-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setSelectedAdmin(admin);
                    setIsViewModalOpen(true);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </motion.button>

                {canEdit(admin) && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedAdmin(admin);
                      setForm(admin);
                      setImgUrl(admin.img || "");
                      setIsModalOpen(true);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </motion.button>
                )}

                {canEdit(admin) && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedAdmin(admin);
                      setIsPasswordModalOpen(true);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    Password
                  </motion.button>
                )}

                {canDelete(admin) && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      handleDelete(admin.id);
                      setMenuOpen(false);
                    }}
                    disabled={deleteLoading === admin._id}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteLoading === admin._id ? (
                      <>
                        <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // If user is not superadmin, show only their profile
  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-gray-100 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header for Regular Admin */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text"
              >
                My Profile
              </motion.h1>
              <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
                Manage your admin profile and settings
              </p>
            </div>
          </div>

          {/* Current Logged-in Admin Info */}
          {isAuthenticated && user && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 border border-zinc-700/50 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl backdrop-blur-sm"
            >
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 md:gap-8">
                {/* Profile Image Section */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-zinc-600 shadow-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                      <img
                        src={
                          user.img ||
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
                        }
                        alt="Admin Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full border-2 border-zinc-800 flex items-center justify-center bg-green-500">
                      <UserCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedAdmin(user);
                        setIsPasswordModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-zinc-700/50 hover:bg-zinc-600/50 border border-zinc-600 rounded-xl text-gray-300 transition-all text-sm sm:text-base"
                    >
                      <Key className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Change Password</span>
                      <span className="xs:hidden">Password</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedAdmin(user);
                        setForm(user);
                        setImgUrl(user.img || "");
                        setIsModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600/50 hover:bg-blue-500/50 border border-blue-600 rounded-xl text-blue-300 transition-all text-sm sm:text-base"
                    >
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Edit Profile</span>
                      <span className="xs:hidden">Edit</span>
                    </motion.button>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center sm:text-left">
                      {user.name || "Unknown Admin"}
                    </h2>
                    <span className="px-3 py-1 text-sm rounded-full border border-green-500/40 text-green-300 bg-green-500/10 shadow-lg shadow-green-500/20 font-semibold text-center sm:text-left">
                      ADMIN
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-3 p-3 sm:p-4 bg-zinc-800/50 rounded-xl">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm text-gray-400">Email Address</div>
                          <div className="text-white font-medium text-sm sm:text-base truncate">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 sm:p-4 bg-zinc-800/50 rounded-xl">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                        <div>
                          <div className="text-xs sm:text-sm text-gray-400">Phone Number</div>
                          <div className="text-white font-medium text-sm sm:text-base">{user.phone || "Not provided"}</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-3 p-3 sm:p-4 bg-zinc-800/50 rounded-xl">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                        <div>
                          <div className="text-xs sm:text-sm text-gray-400">Role</div>
                          <div className="text-white font-medium text-sm sm:text-base capitalize">{user.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 sm:p-4 bg-zinc-800/50 rounded-xl">
                        <UserCog className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm text-gray-400">Admin ID</div>
                          <div className="text-white font-mono text-xs sm:text-sm truncate">{user._id}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Edit Profile Modal for Regular Admin */}
        <AnimatePresence>
          {isModalOpen && (
            <Modal
              title="Edit My Profile"
              onClose={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              <div className="space-y-4 sm:space-y-6">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-3 sm:mb-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-zinc-600 bg-zinc-800">
                      {imgUrl || form.img ? (
                        <img
                          src={imgUrl || form.img}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                          <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {(imgUrl || form.img) && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleDeleteImage}
                        disabled={uploading}
                        className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg disabled:opacity-50"
                      >
                        <X className="w-2 h-2 sm:w-3 sm:h-3" />
                      </motion.button>
                    )}
                  </div>

                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfileUpload}
                      disabled={uploading}
                    />
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border-2 border-dashed transition-all text-sm sm:text-base ${uploading
                        ? 'border-blue-400 bg-blue-500/10 text-blue-400 cursor-not-allowed'
                        : 'border-zinc-600 hover:border-blue-500 hover:bg-blue-500/10 text-gray-400 hover:text-blue-400 cursor-pointer'
                        }`}
                    >
                      {uploading ? (
                        <>
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Upload Profile Image</span>
                        </>
                      )}
                    </motion.div>
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                    <input
                      name="name"
                      placeholder="Enter full name"
                      value={form.name}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800/50 border border-zinc-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="Enter email address"
                      value={form.email}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800/50 border border-zinc-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                    <input
                      name="phone"
                      placeholder="Enter phone number"
                      value={form.phone}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800/50 border border-zinc-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-zinc-700/50">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  disabled={saveLoading}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-zinc-700/50 hover:bg-zinc-600/50 border border-zinc-600 rounded-xl text-gray-300 transition-all text-sm sm:text-base order-2 sm:order-1 disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={saveLoading}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-green-500/25 text-sm sm:text-base order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {selectedAdmin ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                      {selectedAdmin ? "Update Profile" : "Create Profile"}
                    </>
                  )}
                </motion.button>
              </div>
            </Modal>
          )}
        </AnimatePresence>

        {/* Change Password Modal */}
        <AnimatePresence>
          {isPasswordModalOpen && (
            <Modal
              title="Change Password"
              onClose={() => {
                setIsPasswordModalOpen(false);
                setPasswords({ newPass: "", confirmPass: "" });
              }}
            >
              <div className="space-y-4">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password *
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={passwords.newPass}
                    onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                    className="w-full bg-zinc-800/50 border border-zinc-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-sm sm:text-base"
                    required
                  />

                  {/* Password Strength Indicator */}
                  {passwords.newPass && (
                    <div className="mt-2">
                      <PasswordStrength password={passwords.newPass} />
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwords.confirmPass}
                    onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                    className={`w-full bg-zinc-800/50 border px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm sm:text-base ${passwords.confirmPass && passwords.newPass !== passwords.confirmPass
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-zinc-700 focus:ring-yellow-500'
                      }`}
                    required
                  />

                  {/* Password Match Indicator */}
                  {passwords.confirmPass && (
                    <div className="mt-2">
                      {passwords.newPass === passwords.confirmPass ? (
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Passwords match
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400 text-sm">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Passwords do not match
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-zinc-800/30 border border-zinc-700 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Password Requirements:</h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${passwords.newPass?.length >= 8 ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                      At least 8 characters
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(passwords.newPass) ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                      One uppercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(passwords.newPass) ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                      One lowercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${/\d/.test(passwords.newPass) ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                      One number
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(passwords.newPass) ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                      One special character
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-zinc-700/50">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswords({ newPass: "", confirmPass: "" });
                  }}
                  disabled={passwordLoading}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-zinc-700/50 hover:bg-zinc-600/50 border border-zinc-600 rounded-xl text-gray-300 transition-all text-sm sm:text-base order-2 sm:order-1 disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePasswordChange}
                  disabled={!isPasswordValid() || passwordLoading}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base order-1 sm:order-2"
                >
                  {passwordLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Key className="w-3 h-3 sm:w-4 sm:h-4" />
                      Update Password
                    </>
                  )}
                </motion.button>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ==========================================================
  // 🧩 SUPER ADMIN VIEW
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">

        {/* 🧠 Current Logged-in Admin Info */}
        {isAuthenticated && user && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 border border-zinc-700/50 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-sm"
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-zinc-600 shadow-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20">
                    <img
                      src={
                        user.img ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
                      }
                      alt="Admin Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-zinc-800 flex items-center justify-center bg-yellow-500">
                    <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {user.name || "Unknown Admin"}
                    </h2>
                    <span
                      className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full border border-yellow-500/40 text-yellow-300 bg-yellow-500/10 shadow-lg shadow-yellow-500/20 font-semibold"
                    >
                      SUPER ADMIN
                    </span>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-gray-300 flex items-center justify-center sm:justify-start gap-2 text-sm">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                      {user.email}
                    </p>
                    <p className="text-gray-400 flex items-center justify-center sm:justify-start gap-2 text-sm">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                      {user.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedAdmin(user);
                    setIsPasswordModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-zinc-700/50 hover:bg-zinc-600/50 border border-zinc-600 rounded-xl text-gray-300 transition-all text-sm"
                >
                  <Key className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Change Password</span>
                  <span className="xs:hidden">Password</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedAdmin(user);
                    setForm(user);
                    setImgUrl(user.img || "");
                    setIsModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600/50 hover:bg-blue-500/50 border border-blue-600 rounded-xl text-blue-300 transition-all text-sm"
                >
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Update Profile</span>
                  <span className="xs:hidden">Profile</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 text-transparent bg-clip-text"
            >
              Admin Management
            </motion.h1>
            <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
              Manage all system administrators and permissions
            </p>
          </div>

          <motion.button
            onClick={() => {
              setIsModalOpen(true);
              setSelectedAdmin(null);
              resetForm();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-semibold shadow-lg shadow-red-500/25 transition-all w-full sm:w-auto text-sm sm:text-base justify-center"
          >
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Add New Admin</span>
          </motion.button>
        </div>

        {/* Stats Cards - Only for Super Admin */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {[
            { icon: Users, color: "blue", value: admins.length, label: "Total Admins" },
            { icon: Crown, color: "yellow", value: admins.filter(a => a.role === 'superadmin').length, label: "Super Admins" },
            { icon: UserCheck, color: "green", value: admins.filter(a => a.role === 'admin').length, label: "Regular Admins" },
            { icon: Camera, color: "purple", value: admins.filter(a => a.img).length, label: "With Photos" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 text-center backdrop-blur-sm hover:border-zinc-600 transition-all"
            >
              <div className={`text-xl sm:text-2xl md:text-3xl font-bold text-${stat.color}-400 flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-${stat.color}-400`} />
                {stat.value}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Device Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Smartphone className="w-3 h-3 md:hidden" />
          <Monitor className="w-3 h-3 hidden md:block" />
          <span className="md:hidden">Mobile View</span>
          <span className="hidden md:block">Desktop View</span>
        </div>

        {/* Admins Table/Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 border border-zinc-700/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm"
        >
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-800/60 border-b border-zinc-700/50">
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700/50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : admins.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      <UserCog className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No admins found</p>
                    </td>
                  </tr>
                ) : (
                  admins.map((admin, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-zinc-800/30 transition-colors group"
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-zinc-600 bg-gradient-to-br from-zinc-700 to-zinc-800">
                            <img
                              src={admin.img || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
                              alt={admin.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm sm:text-base">{admin.name}</div>
                            <div className="text-gray-400 text-xs">ID: {admin._id?.slice(-8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="space-y-1">
                          <div className="text-gray-300 flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                            {admin.email}
                          </div>
                          <div className="text-gray-400 text-xs flex items-center gap-2">
                            <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                            {admin.phone || "No phone"}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span
                          className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs font-medium border ${admin.role === "superadmin"
                            ? "border-yellow-500/30 text-yellow-300 bg-yellow-500/10"
                            : "border-green-500/30 text-green-300 bg-green-500/10"
                            }`}
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          {/* View Details */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setIsViewModalOpen(true);
                            }}
                            className="p-1 sm:p-2 text-gray-400 hover:text-gray-200 hover:bg-zinc-700/50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          </motion.button>

                          {/* Edit */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setForm(admin);
                              setImgUrl(admin.img || "");
                              setIsModalOpen(true);
                            }}
                            className="p-1 sm:p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Edit Admin"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </motion.button>

                          {/* Change Password */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setIsPasswordModalOpen(true);
                            }}
                            className="p-1 sm:p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors"
                            title="Change Password"
                          >
                            <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                          </motion.button>

                          {/* Delete - Only for superadmin and not own profile */}
                          {user?._id !== admin._id && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(admin.id)}
                              disabled={deleteLoading === admin._id}
                              className="p-1 sm:p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete Admin"
                            >
                              {deleteLoading === admin._id ? (
                                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              )}
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              </div>
            ) : admins.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                <UserCog className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No admins found</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {admins.map((admin, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4 hover:border-zinc-600 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-600 bg-gradient-to-br from-zinc-700 to-zinc-800">
                          <img
                            src={admin.img || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
                            alt={admin.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{admin.name}</div>
                          <div className="text-gray-400 text-xs">ID: {admin._id?.slice(-8)}</div>
                        </div>
                      </div>
                      <MobileActionMenu admin={admin} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300 truncate">{admin.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-400">{admin.phone || "No phone"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${admin.role === "superadmin"
                            ? "border-yellow-500/30 text-yellow-300 bg-yellow-500/10"
                            : "border-green-500/30 text-green-300 bg-green-500/10"
                            }`}
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          {admin.role}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* 🔹 Add/Edit Admin Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal
            title={selectedAdmin ? "Edit Admin" : "Add New Admin"}
            onClose={() => {
              setIsModalOpen(false);
              resetForm();
            }}
          >
            <div className="space-y-4 sm:space-y-6">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center">
                <div className="relative mb-3 sm:mb-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-zinc-600 bg-zinc-800">
                    {imgUrl || form.img ? (
                      <img
                        src={imgUrl || form.img}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                        <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  {(imgUrl || form.img) && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleDeleteImage}
                      disabled={uploading}
                      className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg disabled:opacity-50"
                    >
                      <X className="w-2 h-2 sm:w-3 sm:h-3" />
                    </motion.button>
                  )}
                </div>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileUpload}
                    disabled={uploading}
                  />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border-2 border-dashed transition-all text-sm sm:text-base ${uploading
                      ? 'border-blue-400 bg-blue-500/10 text-blue-400 cursor-not-allowed'
                      : 'border-zinc-600 hover:border-blue-500 hover:bg-blue-500/10 text-gray-400 hover:text-blue-400 cursor-pointer'
                      }`}
                  >
                    {uploading ? (
                      <>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Upload Profile Image</span>
                      </>
                    )}
                  </motion.div>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                  <input
                    name="name"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800/50 border border-zinc-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800/50 border border-zinc-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                  <input
                    name="phone"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800/50 border border-zinc-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm sm:text-base"
                    required
                  />
                </div>

                {!selectedAdmin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={form.password}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-800/50 border border-zinc-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm sm:text-base"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800/50 border border-zinc-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm sm:text-base"
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-zinc-700/50">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                disabled={saveLoading}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-zinc-700/50 hover:bg-zinc-600/50 border border-zinc-600 rounded-xl text-gray-300 transition-all text-sm sm:text-base order-2 sm:order-1 disabled:opacity-50"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={saveLoading}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-500/25 text-sm sm:text-base order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {selectedAdmin ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                    {selectedAdmin ? "Update Admin" : "Create Admin"}
                  </>
                )}
              </motion.button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* 🔹 Change Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <Modal
            title="Change Password"
            onClose={() => {
              setIsPasswordModalOpen(false);
              setPasswords({ newPass: "", confirmPass: "" });
            }}
          >
            <div className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password *
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={passwords.newPass}
                  onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                  className="w-full bg-zinc-800/50 border border-zinc-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                />

                {/* Password Strength Indicator */}
                {passwords.newPass && (
                  <div className="mt-2">
                    <PasswordStrength password={passwords.newPass} />
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwords.confirmPass}
                  onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                  className={`w-full bg-zinc-800/50 border px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm sm:text-base ${passwords.confirmPass && passwords.newPass !== passwords.confirmPass
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-zinc-700 focus:ring-yellow-500'
                    }`}
                  required
                />

                {/* Password Match Indicator */}
                {passwords.confirmPass && (
                  <div className="mt-2">
                    {passwords.newPass === passwords.confirmPass ? (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Passwords match
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-400 text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Passwords do not match
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-zinc-800/30 border border-zinc-700 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Password Requirements:</h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${passwords.newPass?.length >= 8 ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(passwords.newPass) ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                    One uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(passwords.newPass) ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                    One lowercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${/\d/.test(passwords.newPass) ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                    One number
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(passwords.newPass) ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                    One special character
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-zinc-700/50">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswords({ newPass: "", confirmPass: "" });
                }}
                disabled={passwordLoading}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-zinc-700/50 hover:bg-zinc-600/50 border border-zinc-600 rounded-xl text-gray-300 transition-all text-sm sm:text-base order-2 sm:order-1 disabled:opacity-50"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePasswordChange}
                disabled={!isPasswordValid() || passwordLoading}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base order-1 sm:order-2"
              >
                {passwordLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Key className="w-3 h-3 sm:w-4 sm:h-4" />
                    Update Password
                  </>
                )}
              </motion.button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* 🔹 View Details Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedAdmin && (
          <Modal
            title="Admin Details"
            onClose={() => setIsViewModalOpen(false)}
          >
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-zinc-600 bg-zinc-800 mb-3 sm:mb-4">
                  <img
                    src={selectedAdmin.img || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
                    alt={selectedAdmin.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white text-center">{selectedAdmin.name}</h3>
                <span
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full border mt-2 ${selectedAdmin.role === "superadmin"
                    ? "border-yellow-500/30 text-yellow-300 bg-yellow-500/10"
                    : "border-green-500/30 text-green-300 bg-green-500/10"
                    }`}
                >
                  {selectedAdmin.role}
                </span>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm text-gray-400">Email</div>
                    <div className="text-white text-sm sm:text-base truncate">{selectedAdmin.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs sm:text-sm text-gray-400">Phone</div>
                    <div className="text-white text-sm sm:text-base">{selectedAdmin.phone || "Not provided"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm text-gray-400">Admin ID</div>
                    <div className="text-white font-mono text-xs sm:text-sm truncate">{selectedAdmin._id}</div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

// 🔸 Reusable Modal Component
const Modal = ({ title, children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3 sm:p-4 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-md border border-zinc-700/50 backdrop-blur-sm max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <UserCog className="w-4 h-4 sm:w-5 sm:h-5" />
          {title}
        </h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-1 sm:p-2 text-gray-400 hover:text-gray-200 hover:bg-zinc-700 rounded-xl transition-colors"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      </div>
      {children}
    </motion.div>
  </motion.div>
);

export default Admin;