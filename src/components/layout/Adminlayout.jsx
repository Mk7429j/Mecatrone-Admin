import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Topnav from "../nav/Topnav";
import Sidenav from "../nav/Sidenav";
import Foot from "../foot/Foot";
import { motion, AnimatePresence } from "framer-motion";

const Adminlayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔁 Toggle Sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-gray-100 overflow-hidden relative">
      
      {/* ✨ Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -left-32 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* ✅ Fixed Sidebar Structure */}
      <div className="hidden md:block fixed top-0 left-0 h-full z-40">
        <Sidenav />
      </div>

      {/* ✅ Enhanced Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-lg z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 40
              }}
              className="fixed top-0 left-0 h-full w-72 border-r border-zinc-800/60 bg-gradient-to-b from-zinc-950/95 via-zinc-900/95 to-zinc-950/95 backdrop-blur-2xl z-50 shadow-2xl md:hidden"
            >
              <Sidenav />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ✅ Main Content Area */}
      <div className={`flex flex-col min-h-screen w-full transition-all duration-300 ${
        sidebarOpen ? "md:ml-72" : "md:ml-72"
      }`}>
        
        {/* 🔝 Enhanced Top Navbar */}
        <motion.header 
          className="sticky top-0 z-30 bg-gradient-to-r from-zinc-950/95 via-zinc-900/95 to-zinc-950/95 backdrop-blur-2xl border-b border-zinc-800/60 shadow-2xl shadow-black/30"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Topnav onToggleSidebar={toggleSidebar} />
        </motion.header>

        {/* 🧩 Enhanced Main Content */}
        <motion.main 
          className="flex-1 pt-8 overflow-y-auto no-scrollbar scroll-smooth px-6 md:px-8 lg:px-10 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Content Container with Glass Effect */}
          <div className="max-w-7xl mx-auto space-y-8 relative">
            {/* Subtle content background */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-red-600/5 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-orange-500/3 to-transparent" />
            </div>
            
            {/* Main Content Area */}
            <div className="relative">
              <Outlet />
            </div>
          </div>
        </motion.main>

        {/* 🦶 Enhanced Footer */}
        <motion.footer 
          className="bg-gradient-to-t from-zinc-950/95 to-zinc-900/95 border-t border-zinc-800/60 backdrop-blur-2xl relative z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Footer accent line */}
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
          <Foot />
        </motion.footer>
      </div>

      {/* 🎯 Floating Action Button for Mobile Sidebar Toggle */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed bottom-8 left-6 z-50 md:hidden w-14 h-14 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl shadow-2xl shadow-red-500/40 flex items-center justify-center text-white backdrop-blur-sm border border-red-400/50"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl"
            >
              ⚡
            </motion.div>
            
            {/* Ping animation */}
            <motion.div
              className="absolute inset-0 border-2 border-red-400 rounded-2xl"
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: [0, 0.8, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-3 px-3 py-1.5 bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg text-xs font-medium text-gray-300 whitespace-nowrap"
            >
              Open Menu
              <div className="absolute top-1/2 right-0 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-zinc-900 border-r border-b border-zinc-700 rotate-45" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ✨ Performance Optimizations */}
      <style>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Adminlayout;