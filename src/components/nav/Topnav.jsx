import React, { useState, useCallback, useEffect, useRef } from "react";
import { 
  Bell, 
  User, 
  Search, 
  X, 
  LogOut, 
  Zap, 
  Cpu, 
  Shield, 
  MessageSquare,
  Settings,
  HelpCircle,
  Database,
  Activity,
  Mail,
  AlertCircle,
  CheckCircle2,
  Clock,
  Star,
  Phone,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  successNotification,
  errorNotification,
} from "../../helpers/notifi_helper";
import { logout } from "../../api/api";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../../redux/slices/authSlice";

const Topnav = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(moment().format("hh:mm:ss A"));
  const [greeting, setGreeting] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
    const dispatch = useDispatch();

  // Mock unread enquiries data
  const [unreadEnquiries, setUnreadEnquiries] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      subject: "Project Collaboration",
      message: "Interested in discussing potential collaboration opportunities for our upcoming AI project...",
      timestamp: "2 mins ago",
      priority: "high",
      unread: true,
      type: "business"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@techcorp.com",
      subject: "Product Inquiry",
      message: "Looking for pricing information for your enterprise services package...",
      timestamp: "15 mins ago",
      priority: "medium",
      unread: true,
      type: "sales"
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike@startup.io",
      subject: "Support Request",
      message: "Having issues with the integration API documentation. Need urgent assistance...",
      timestamp: "1 hour ago",
      priority: "high",
      unread: true,
      type: "support"
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "emma@designstudio.com",
      subject: "Partnership Opportunity",
      message: "Would like to explore partnership possibilities for our design platform...",
      timestamp: "3 hours ago",
      priority: "low",
      unread: true,
      type: "partnership"
    },
    {
      id: 5,
      name: "Alex Rodriguez",
      email: "alex@finance.com",
      subject: "Custom Solution",
      message: "Need a custom automation solution for our financial workflows...",
      timestamp: "5 hours ago",
      priority: "medium",
      unread: true,
      type: "custom"
    }
  ]);

  // System statistics
  const [systemStats, setSystemStats] = useState({
    cpu: 45,
    memory: 78,
    storage: 62,
    uptime: "12d 4h",
    activeUsers: 234,
    responseTime: "124ms"
  });

  // 🕒 Auto-update live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format("hh:mm:ss A"));
      // Simulate system stats updates
      setSystemStats(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 30) + 40,
        memory: Math.floor(Math.random() * 20) + 70,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 🌅 Dynamic greeting message
  useEffect(() => {
    const hour = moment().hour();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning 🌅");
    else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon ☀️");
    else if (hour >= 17 && hour < 20) setGreeting("Good Evening 🌇");
    else setGreeting("Good Night 🌙");
  }, []);

  // 🚪 Logout Handler
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      successNotification("You have logged out successfully.");
      dispatch(logoutSuccess())
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      errorNotification("Logout failed. Please try again.");
    }
  }, [navigate]);

  // 🔔 Mark enquiry as read
  const markAsRead = useCallback((enquiryId) => {
    setUnreadEnquiries(prev => 
      prev.filter(enquiry => enquiry.id !== enquiryId)
    );
    successNotification("Enquiry marked as read");
  }, []);

  // 🔔 Mark all as read
  const markAllAsRead = useCallback(() => {
    setUnreadEnquiries([]);
    successNotification("All enquiries marked as read");
    setIsNotificationsOpen(false);
  }, []);

  // 🧠 Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Get enquiry type icon
  const getEnquiryTypeIcon = (type) => {
    switch (type) {
      case 'business': return <Zap className="w-3 h-3" />;
      case 'sales': return <Star className="w-3 h-3" />;
      case 'support': return <HelpCircle className="w-3 h-3" />;
      case 'partnership': return <Activity className="w-3 h-3" />;
      case 'custom': return <Settings className="w-3 h-3" />;
      default: return <Mail className="w-3 h-3" />;
    }
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-gradient-to-r from-zinc-950/95 via-zinc-900/95 to-zinc-950/95 border-b border-zinc-800/60 shadow-2xl backdrop-blur-2xl">
      {/* 🔻 Animated Accent Line */}
      <motion.div
        className="h-[3px] bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 relative overflow-hidden"
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

      {/* 🔹 Main Bar */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* 🔸 Left: Brand & Logo */}
        <motion.div 
          className="flex items-center gap-4"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <motion.div
            className="relative"
            whileHover={{ rotate: 360 }}
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
            <motion.h1 
              className="text-xl font-bold tracking-wide bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent select-none"
              whileHover={{ scale: 1.05 }}
            >
              Mecatronix Admin
            </motion.h1>
            <motion.p 
              className="text-xs text-gray-500 font-medium tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Control System v2.4.1
            </motion.p>
          </div>
        </motion.div>

        {/* 🔸 Center: Greeting + Clock + Stats */}
        <div className="hidden lg:flex flex-col items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={greeting}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-semibold text-gray-300">{greeting}</span>
              <Zap className="w-4 h-4 text-orange-400" />
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-4">
            <motion.div 
              className="flex items-center gap-3 text-sm font-mono bg-zinc-900/80 border border-zinc-800/60 px-4 py-2 rounded-xl shadow-inner backdrop-blur-sm"
              whileHover={{ scale: 1.05, borderColor: "rgb(249 115 22)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gray-300 font-bold">{currentTime}</span>
              <div className="w-1 h-1 bg-gray-600 rounded-full" />
              <span className="text-gray-500 text-xs">{moment().format("DD MMM YYYY")}</span>
            </motion.div>

            {/* System Stats */}
            <motion.div 
              className="flex items-center gap-4 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center gap-1 text-green-400">
                <Activity className="w-3 h-3" />
                <span>CPU: {systemStats.cpu}%</span>
              </div>
              <div className="flex items-center gap-1 text-blue-400">
                <Database className="w-3 h-3" />
                <span>RAM: {systemStats.memory}%</span>
              </div>
              <div className="flex items-center gap-1 text-purple-400">
                <User className="w-3 h-3" />
                <span>Users: {systemStats.activeUsers}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 🔸 Right: Actions */}
        <div className="flex items-center gap-4 relative">
          {/* 🔍 Search Button */}
          <motion.button
            onClick={() => setIsSearchOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-gray-400 hover:text-red-400 hover:border-red-500/50 transition-all duration-300 backdrop-blur-sm"
          >
            <Search size={18} />
          </motion.button>

          {/* 🔔 Notifications */}
          <div className="relative" ref={notificationsRef}>
            <motion.button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-gray-400 hover:text-red-400 hover:border-red-500/50 transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadEnquiries.length > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-400 text-[10px] px-1.5 py-0.5 rounded-full shadow-lg font-bold min-w-[18px] text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {unreadEnquiries.length}
                </motion.span>
              )}
            </motion.button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-96 bg-zinc-900/95 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 overflow-hidden"
                >
                  {/* Notifications Header */}
                  <div className="p-4 border-b border-zinc-800/60 bg-gradient-to-r from-zinc-900 to-zinc-800/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-red-400" />
                        <h3 className="font-semibold text-gray-200">Enquiries</h3>
                        {unreadEnquiries.length > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {unreadEnquiries.length} new
                          </span>
                        )}
                      </div>
                      {unreadEnquiries.length > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {unreadEnquiries.length === 0 ? (
                      <div className="p-8 text-center">
                        <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">All caught up! No new enquiries.</p>
                      </div>
                    ) : (
                      <div className="p-2">
                        {unreadEnquiries.map((enquiry, index) => (
                          <motion.div
                            key={enquiry.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-3 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-all duration-300 mb-2 bg-zinc-800/30 hover:bg-zinc-700/30 group"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`p-1 rounded-lg ${getPriorityBadge(enquiry.priority)}`}>
                                  {getEnquiryTypeIcon(enquiry.type)}
                                </div>
                                <span className="font-semibold text-gray-200 text-sm">
                                  {enquiry.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs ${getPriorityColor(enquiry.priority)}`}>
                                  {enquiry.priority}
                                </span>
                                <button
                                  onClick={() => markAsRead(enquiry.id)}
                                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-700 rounded transition-all"
                                >
                                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                              {enquiry.message}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {enquiry.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {enquiry.timestamp}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Notifications Footer */}
                  <div className="p-3 border-t border-zinc-800/60 bg-zinc-950/50">
                    <button 
                      onClick={() => navigate('/mec-admin/enquiries')}
                      className="w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View All Enquiries →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 👤 Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-3 bg-zinc-900/70 border border-zinc-800 px-4 py-2 rounded-xl hover:border-red-500 hover:bg-zinc-800/70 transition-all duration-300 group backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="User menu"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-tr from-red-600 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
                <motion.div
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-zinc-900 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-semibold text-gray-200">Admin</span>
                <span className="text-xs text-gray-500">Super User</span>
              </div>
            </motion.button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-64 bg-zinc-900/95 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 overflow-hidden"
                >
                  {/* Dropdown Header */}
                  <div className="p-4 border-b border-zinc-800/60 bg-gradient-to-r from-zinc-900 to-zinc-800/50">
                    <p className="text-sm font-semibold text-gray-200">Administrator</p>
                    <p className="text-xs text-gray-500 mt-1">admin@Mecatronix.com</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-green-400">
                      <Shield className="w-3 h-3" />
                      <span>Premium Plan • Active</span>
                    </div>
                  </div>
                  
                  {/* Dropdown Items */}
                  <div className="p-2 space-y-1">
                    <motion.button
                      onClick={() => navigate('/mec-admin/admin')}
                      className="flex items-center w-full px-3 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-500/20 hover:text-white rounded-xl transition-all duration-300 group"
                      whileHover={{ x: 4 }}
                    >
                      <User size={16} className="mr-3 text-blue-400 group-hover:scale-110 transition-transform" /> 
                      <span>Profile Settings</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => navigate('/mec-admin/enquiries')}
                      className="flex items-center w-full px-3 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-500/20 hover:text-white rounded-xl transition-all duration-300 group"
                      whileHover={{ x: 4 }}
                    >
                      <MessageSquare size={16} className="mr-3 text-purple-400 group-hover:scale-110 transition-transform" /> 
                      <span>Manage Enquiries</span>
                      {unreadEnquiries.length > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {unreadEnquiries.length}
                        </span>
                      )}
                    </motion.button>
                    
                    <motion.button
                      onClick={() => navigate('/mec-admin')}
                      className="flex items-center w-full px-3 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-gray-600/20 hover:to-zinc-500/20 hover:text-white rounded-xl transition-all duration-300 group"
                      whileHover={{ x: 4 }}
                    >
                      <Settings size={16} className="mr-3 text-gray-400 group-hover:scale-110 transition-transform" /> 
                      <span>System Settings</span>
                    </motion.button>
                  </div>

                  {/* Dropdown Footer */}
                  <div className="p-3 border-t border-zinc-800/60 bg-zinc-950/50">
                    <motion.button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-3 text-sm text-red-400 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-orange-500/20 hover:text-white rounded-xl transition-all duration-300 group"
                      whileHover={{ x: 4 }}
                    >
                      <LogOut size={16} className="mr-3 group-hover:scale-110 transition-transform" /> 
                      <span>Logout Session</span>
                    </motion.button>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                      <Shield className="w-3 h-3 text-green-400" />
                      <span>Secure Session • {moment().format("HH:mm")}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 🔍 Enhanced Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="fixed inset-0 bg-zinc-950/98 flex items-start justify-center pt-20 z-[60] backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl px-6"
            >
              <form onSubmit={handleSearch} className="relative">
                <motion.div
                  className="flex items-center bg-zinc-900 border-2 border-zinc-700 rounded-2xl px-6 py-4 shadow-2xl"
                  whileFocus={{ borderColor: "rgb(239 68 68)" }}
                >
                  <Search className="w-5 h-5 text-gray-500 mr-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search modules, users, analytics..."
                    className="bg-transparent text-lg w-full outline-none placeholder-gray-500 text-gray-300 font-medium"
                    autoFocus
                  />
                  <motion.button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  </motion.button>
                </motion.div>
                
                {/* Search Suggestions */}
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 w-full bg-zinc-900/95 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden"
                  >
                    <div className="p-4 text-sm text-gray-500">
                      Press Enter to search for "{searchQuery}"
                    </div>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Topnav;