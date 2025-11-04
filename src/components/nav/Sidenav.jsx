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
  // const [isCheckingSession, setIsCheckingSession] = useState(true);

  // 🔒 Verify session
  // useEffect(() => {
  //   let active = true;

  //   const verifyLogin = async () => {
  //     try {
  //       const res = await checkLoginStatus();
  //       const valid = _.get(res, "success", false);

  //       if (active && !valid) throw new Error("Invalid session");
  //     } catch (err) {
  //       console.error("Session check failed:", err);
  //       if (active) {
  //         errorNotification("Session expired. Please log in again.");
  //         navigate("/", { replace: true });
  //       }
  //     } finally {
  //       if (active) setIsCheckingSession(false);
  //     }
  //   };

  //   verifyLogin();
  //   return () => {
  //     active = false;
  //   };
  // }, [navigate]);

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
    { name: "project", icon: HiOutlineRectangleGroup, path: "/mec-admin/project" },
    { name: "work", icon: PiNetwork, path: "/mec-admin/work" },
  ];

  // if (isCheckingSession) {
  //   return (
  //     <div className="h-screen flex items-center justify-center bg-zinc-950 text-gray-400">
  //       Verifying session...
  //     </div>
  //   );
  // }

  // 🎨 Sidebar
  return (
    <aside
      className={`h-screen flex flex-col sticky top-0 z-40 border-r border-zinc-800 
      bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-gray-300 
      backdrop-blur-xl transition-all duration-500 
      ${isSidebarOpen ? "w-60" : "w-20"}`}
    >
      {/* 🔹 Header / Logo */}
      <div className={`flex items-center  ${isSidebarOpen ? "justify-between" : "justify-center"}  px-4 py-4 border-b border-zinc-800 bg-zinc-950/60`}>
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.h1
              key="logo"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-bold bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent select-none"
            >
              Mecatrone
            </motion.h1>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsSidebarOpen((p) => !p)}
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="text-gray-400 hover:text-red-500 transition transform hover:scale-110"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 🔸 Navigation */}
      <nav
        className="flex-1 overflow-y-auto py-4 no-scrollbar px-3"
      >
        <ul className="space-y-1">
          {menuItems.map(({ name, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/mec-admin"}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive
                  ? "bg-gradient-to-r from-red-600/90 via-orange-500/90 to-yellow-400/90 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-[1.02]"
                  : "hover:bg-zinc-900 hover:text-red-400"
                }`
              }
            >
              <Icon
                className={`w-5 h-5 transition-all duration-200 ${isSidebarOpen ? "" : "mx-auto"
                  } group-hover:text-red-400`}
              />
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {name}
                </motion.span>
              )}
            </NavLink>
          ))}
        </ul>
      </nav>

      {/* 🔻 Logout */}
      <div className="px-4 py-3 border-t border-zinc-800 bg-zinc-950/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm bg-gradient-to-r from-zinc-800 to-zinc-900 text-gray-300 rounded-lg hover:from-red-600 hover:to-orange-500 hover:text-white transition-all duration-200 shadow-inner hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
        >
          <LogOut size={16} />
          {isSidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              Logout
            </motion.span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidenav;
