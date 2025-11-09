import React from "react";
import { motion } from "framer-motion";
import { 
  Server, 
  Database, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Network,
  Activity,
  Lock
} from "lucide-react";

const Foot = () => {
  const currentYear = new Date().getFullYear();

  const statusItems = [
    {
      icon: Server,
      label: "Server",
      status: "Active",
      color: "text-green-400",
      iconColor: "text-green-500",
      ping: true
    },
    {
      icon: Database,
      label: "Database",
      status: "Connected",
      color: "text-blue-400",
      iconColor: "text-blue-500",
      ping: true
    },
    {
      icon: Network,
      label: "Network",
      status: "Stable",
      color: "text-emerald-400",
      iconColor: "text-emerald-500",
      ping: false
    },
    {
      icon: Cpu,
      label: "API",
      status: "Live",
      color: "text-purple-400",
      iconColor: "text-purple-500",
      ping: true
    }
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full bg-gradient-to-t from-zinc-950 via-zinc-900/95 to-zinc-900/90 border-t border-zinc-800/60 text-gray-400 py-6 px-6 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.6)] relative overflow-hidden"
      role="contentinfo"
    >
      
      {/* 🔥 Animated Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-600/5 via-orange-500/3 to-yellow-400/2 pointer-events-none" />
      
      {/* ✨ Top Border Glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

      {/* 🔰 Enhanced Branding */}
      <motion.div 
        className="flex items-center gap-3 group relative z-10"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-red-600 via-orange-500 to-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:shadow-red-500/40 transition-all duration-300">
            <ShieldCheck className="w-5 h-5 text-white" aria-hidden="true" />
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
          <span className="font-bold text-gray-200 text-lg bg-gradient-to-r from-gray-200 to-gray-300 bg-clip-text text-transparent">
            Mecatronix
          </span>
          <span className="text-xs text-gray-500 font-medium tracking-wide">
            Admin Control System
          </span>
        </div>
      </motion.div>

      {/* 🧠 Enhanced System Status */}
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 relative z-10">
        {statusItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2 group relative"
          >
            {/* Status ping animation */}
            {item.ping && (
              <motion.div
                className="absolute -left-1 -top-1"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </motion.div>
            )}
            
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`p-2 rounded-lg bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 group-hover:border-zinc-600/50 transition-all duration-300 ${item.iconColor}`}
            >
              <item.icon className="w-4 h-4" aria-hidden="true" />
            </motion.div>
            
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                {item.label}
              </span>
              <span className={`text-sm font-bold ${item.color}`}>
                {item.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 🕓 Enhanced Copyright */}
      <motion.div 
        className="flex flex-col items-center gap-2 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xs text-gray-500 text-center font-medium tracking-wide">
          © {currentYear}{" "}
          <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent font-bold">
            Mecatronix
          </span>{" "}
          — Advanced Automation Systems
        </p>
        <div className="flex items-center gap-3 text-[10px] text-gray-600">
          <motion.div 
            className="flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
          >
            <Lock className="w-3 h-3" />
            <span>Secure</span>
          </motion.div>
          <div className="w-1 h-1 bg-gray-600 rounded-full" />
          <motion.div 
            className="flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
          >
            <Activity className="w-3 h-3" />
            <span>Live</span>
          </motion.div>
          <div className="w-1 h-1 bg-gray-600 rounded-full" />
          <motion.div 
            className="flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="w-3 h-3" />
            <span>v2.4.1</span>
          </motion.div>
        </div>
      </motion.div>

      {/* ✨ Bottom decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
      
      {/* 🔮 Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500/20 rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%',
              y: '100%'
            }}
            animate={{ 
              y: ['100%', '-100%'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </motion.footer>
  );
};

export default Foot;