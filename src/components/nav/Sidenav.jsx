import React, { useState, useCallback } from "react";
import {
  LayoutDashboard,
  FileText,
  Image,
  MessageCircle,
  Star,
  Mail,
  Menu,
  X,
  LogOut,
  User,
  Shield,
  Zap,
  Cpu,
  Crown,
  Ticket,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import _ from "lodash";
import {
  errorNotification,
  successNotification,
} from "../../helpers/notifi_helper";
import { logout } from "../../api/api";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { PiNetwork } from "react-icons/pi";

const Sidenav = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeHover, setActiveHover] = useState(null);

  // 🚪 Logout handler
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      successNotification("Logged out successfully.");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      errorNotification("Logout failed. Please try again.");
    }
  }, [navigate]);

  // 🧭 Sidebar items
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/mec-admin" },
    { name: "Blogs", icon: FileText, path: "/mec-admin/blogs" },
    { name: "Banners", icon: Image, path: "/mec-admin/banners" },
    { name: "Clients", icon: User, path: "/mec-admin/clients" },
    { name: "Enquiries", icon: MessageCircle, path: "/mec-admin/enquiries" },
    { name: "Reviews", icon: Star, path: "/mec-admin/reviews" },
    { name: "Subscribers", icon: Mail, path: "/mec-admin/subscribers" },
    { name: "Voucher", icon: Ticket, path: "/mec-admin/voucher" },
    { name: "Projects", icon: HiOutlineRectangleGroup, path: "/mec-admin/project" },
    { name: "Works", icon: PiNetwork, path: "/mec-admin/work" },
    { name: "Admin", icon: Crown, path: "/mec-admin/admin" },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`h-screen flex flex-col sticky top-0 z-40 border-r border-zinc-800/60
      bg-gradient-to-b from-zinc-950/95 via-zinc-900/95 to-zinc-950/95 text-gray-300 
      backdrop-blur-2xl shadow-2xl transition-all duration-500 ease-out
      ${isSidebarOpen ? "w-72" : "w-24"}`}
    >
      <motion.div
        className="h-[3px] bg-gradient-to-r from-yellow-600 via-orange-500 to-red-400 relative overflow-hidden"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: [-100, 400] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
        />
      </motion.div>

      {/* 🔹 Enhanced Header / Logo */}
      <div className={`flex items-center ${isSidebarOpen ? "justify-between" : "justify-center"} px-6 py-6.5 border-b border-zinc-800/60 bg-gradient-to-r from-zinc-950 to-zinc-900/80 relative overflow-hidden`}>

        {/* Header Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-orange-500/3 to-yellow-400/2" />

        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex items-center gap-3 group"
            >
              <motion.div
                className="relative"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-10 h-10 bg-gradient-to-tr from-red-600 via-orange-500 to-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                {/* Animated ping effect */}
                <motion.div
                  className="absolute inset-0 border-2 border-red-500 rounded-xl"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: [0, 0.8, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              </motion.div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent select-none">
                  Mecatronix
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide">Admin Panel</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsSidebarOpen((p) => !p)}
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="relative p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-gray-400 hover:text-red-400 hover:border-red-500/50 transition-all duration-300 backdrop-blur-sm z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </motion.button>
      </div>

      {/* 🔸 Enhanced Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 no-scrollbar px-4 space-y-2">
        <ul className="space-y-2">
          {menuItems.map(({ name, icon: Icon, path }, index) => (
            <motion.li
              key={path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={path}
                end={path === "/mec-admin"}
                onMouseEnter={() => setActiveHover(path)}
                onMouseLeave={() => setActiveHover(null)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden ${isActive
                    ? "bg-gradient-to-r from-red-600/90 via-orange-500/90 to-yellow-400/90 text-white shadow-lg shadow-red-500/30 scale-[1.02]"
                    : "hover:bg-zinc-800/50 hover:text-red-400 border border-transparent hover:border-zinc-700/50"
                  }`
                }
              >
                {/* Hover Background Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-500/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeHover === path ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Animated Icon */}
                <motion.div
                  className={`relative z-10 ${isSidebarOpen ? "" : "mx-auto"
                    }`}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                {/* Text with Animation */}
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 font-semibold tracking-wide"
                  >
                    {name}
                  </motion.span>
                )}

                {/* Active Indicator */}
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.div
                      className="absolute right-3 w-2 h-2 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
              </NavLink>
            </motion.li>
          ))}
        </ul>

        {/* 🔮 System Status Card */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50 rounded-xl backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-tr from-green-600 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-200">System</span>
                  <span className="text-xs text-green-400 font-medium">Secure</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>All systems operational</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 🔻 Enhanced Logout Section */}
      <div className="px-4 py-4 border-t border-zinc-800/60 bg-gradient-to-t from-zinc-950 to-zinc-900/80 relative">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/3 to-transparent" />

        <motion.button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-3 text-sm bg-gradient-to-r from-zinc-800/80 to-zinc-900/80 text-gray-300 rounded-xl hover:from-red-600 hover:to-orange-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-red-500/20 border border-zinc-700/50 hover:border-red-500/50 relative overflow-hidden group backdrop-blur-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform"
            initial={{ x: "-100%" }}
            whileHover={{ x: "200%" }}
            transition={{ duration: 0.8 }}
          />

          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.4 }}
          >
            <LogOut size={16} className="relative z-10" />
          </motion.div>

          {isSidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 font-semibold"
            >
              Logout Session
            </motion.span>
          )}
        </motion.button>

        {/* Version Info */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-600"
            >
              <Zap className="w-3 h-3" />
              <span>v2.4.1</span>
              <div className="w-1 h-1 bg-gray-600 rounded-full" />
              <span>Live</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

export default Sidenav;