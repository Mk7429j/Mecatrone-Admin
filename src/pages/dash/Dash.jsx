import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  FileText,
  Users,
  Star,
  Bell,
  Mail,
  Package,
  UserCog,
  Briefcase,
} from "lucide-react";
import { DashboardStats } from "../../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

const Dash = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  const HandleFetch = async () => {
    try {
      const result = await DashboardStats();
      if (result?.success) {
        const s = result.data;
        setStats(s);

        // 🧮 Chart data using current counts
        setChartData([
          {
            name: "Overview",
            Subscribers: s.subscribers || 0,
            Clients: s.clients || 0,
            Projects: s.projects || 0,
            Reviews: s.reviews?.total || 0,
          },
        ]);
      }
    } catch (error) {
      console.error("Dashboard fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    HandleFetch();
  }, []);

  const cards = stats
    ? [
      {
        icon: FileText,
        label: "Blogs",
        value: stats.blogs,
        color: "from-blue-500 to-cyan-400",
        location: "/mec-admin/blogs"
      },
      {
        icon: Package,
        label: "Banners",
        value: stats.banners,
        color: "from-violet-500 to-purple-400",
        location: "/mec-admin/banners"
      },
      {
        icon: Users,
        label: "Clients",
        value: stats.clients,
        color: "from-green-500 to-emerald-400",
        location: "/mec-admin/clients"
      },
      {
        icon: Bell,
        label: "Unopened Enquiries",
        value: stats.enquiries.unopened,
        color: "from-rose-500 to-orange-400",
        location: "/mec-admin/enquiries"
      },
      {
        icon: Star,
        label: "Reviews",
        value: stats.reviews.total,
        color: "from-yellow-400 to-orange-300",
        location: "/mec-admin/reviews"
      },
      {
        icon: Mail,
        label: "Subscribers",
        value: stats.subscribers,
        color: "from-red-500 to-pink-400",
        location: "/mec-admin/subscribers"
      },
      {
        icon: UserCog,
        label: "Admins",
        value: stats.admins.total,
        color: "from-indigo-500 to-sky-400",
        location: "/mec-admin"
      },
      {
        icon: Briefcase,
        label: "Projects",
        value: stats.projects,
        color: "from-fuchsia-500 to-pink-400",
        location: "/mec-admin/project"
      },
      {
        icon: BarChart3,
        label: "Works",
        value: stats.works,
        color: "from-teal-500 to-lime-400",
        location: "/mec-admin/work"
      },
    ]
    : [];

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-sm text-gray-400">
          Welcome back,{" "}
          <span className="text-red-500 font-semibold">Admin</span> 👋
        </p>
      </motion.div>

      {/* Stats Cards */}
      {loading ? (
        <p className="text-gray-400 text-center mt-10">
          Loading dashboard...
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate(card.location)}
              className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl p-5 rounded-xl shadow-lg hover:shadow-[0_0_25px_rgba(239,68,68,0.15)] transition-all"
            >
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-tr ${card.color} flex items-center justify-center mb-3`}
              >
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-400 text-sm">{card.label}</h3>
              <p className="text-2xl font-semibold text-white mt-1">
                {card.value}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* 📊 Monthly Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-red-500 to-pink-400 bg-clip-text text-transparent">
                Monthly Performance
              </span>
            </h2>
            <BarChart3 className="text-red-400 w-5 h-5" />
          </div>

          <div className="text-sm text-gray-500 mb-3">
            Comparing performance between{" "}
            <span className="text-white font-medium">
              {new Date().toLocaleString("default", { month: "long" })}
            </span>{" "}
            and{" "}
            <span className="text-white font-medium">
              {new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString(
                "default",
                { month: "long" }
              )}
            </span>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    name: "Subscribers",
                    "This Month": stats?.subscribers || 0,
                    "Last Month": Math.max(0, (stats?.subscribers || 0) - 5),
                  },
                  {
                    name: "Clients",
                    "This Month": stats?.clients || 0,
                    "Last Month": Math.max(0, (stats?.clients || 0) - 2),
                  },
                  {
                    name: "Projects",
                    "This Month": stats?.projects || 0,
                    "Last Month": Math.max(0, (stats?.projects || 0) - 1),
                  },
                  {
                    name: "Reviews",
                    "This Month": stats?.reviews?.total || 0,
                    "Last Month": Math.max(0, (stats?.reviews?.total || 0) - 3),
                  },
                ]}
                margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="This Month"
                  fill="url(#thisMonthGradient)"
                  radius={[6, 6, 0, 0]}
                  barSize={30}
                />
                <Bar
                  dataKey="Last Month"
                  fill="url(#lastMonthGradient)"
                  radius={[6, 6, 0, 0]}
                  barSize={30}
                />

                {/* Gradients */}
                <defs>
                  <linearGradient id="thisMonthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="lastMonthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>


        {/* 🕓 Recent Activity (Upgraded) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl rounded-xl p-6 shadow-lg relative overflow-hidden"
        >
          {/* Subtle gradient glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-fuchsia-500/5 to-purple-500/5 pointer-events-none" />

          <div className="flex items-center justify-between mb-5 relative z-10">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-red-500 to-pink-400 bg-clip-text text-transparent">
                Recent Activity
              </span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Bell className="text-orange-400 w-4 h-4" />
              <span>Last 24 hours</span>
            </div>
          </div>

          <ul className="space-y-4 text-sm relative z-10">
            {/* Blog Activity */}
            <motion.li
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 bg-zinc-800/40 p-3 rounded-lg border border-zinc-700/60 hover:border-pink-500/40 transition-all"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white text-xs font-bold">
                📝
              </div>
              <div className="flex-1">
                <p className="text-gray-300">
                  <span className="font-semibold text-white">
                    {stats?.blogs || 0}
                  </span>{" "}
                  new blog{stats?.blogs === 1 ? "" : "s"} posted
                </p>
                <span className="text-gray-500 text-xs">Just now</span>
              </div>
            </motion.li>

            {/* Subscribers Activity */}
            <motion.li
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 bg-zinc-800/40 p-3 rounded-lg border border-zinc-700/60 hover:border-red-500/40 transition-all"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-tr from-red-500 to-orange-400 text-white text-xs font-bold">
                📬
              </div>
              <div className="flex-1">
                <p className="text-gray-300">
                  <span className="font-semibold text-white">
                    {stats?.subscribers || 0}
                  </span>{" "}
                  active subscriber{stats?.subscribers === 1 ? "" : "s"}
                </p>
                <span className="text-gray-500 text-xs">5 mins ago</span>
              </div>
            </motion.li>

            {/* Reviews */}
            <motion.li
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 bg-zinc-800/40 p-3 rounded-lg border border-zinc-700/60 hover:border-yellow-400/40 transition-all"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 text-white text-xs font-bold">
                ⭐
              </div>
              <div className="flex-1">
                <p className="text-gray-300">
                  <span className="font-semibold text-white">
                    {stats?.reviews.total || 0}
                  </span>{" "}
                  new review{stats?.reviews.total === 1 ? "" : "s"} received
                </p>
                <span className="text-gray-500 text-xs">1 hour ago</span>
              </div>
            </motion.li>

            {/* Enquiries */}
            <motion.li
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 bg-zinc-800/40 p-3 rounded-lg border border-zinc-700/60 hover:border-green-400/40 transition-all"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 text-white text-xs font-bold">
                💬
              </div>
              <div className="flex-1">
                <p className="text-gray-300">
                  <span className="font-semibold text-white">
                    {stats?.enquiries.unopened || 0}
                  </span>{" "}
                  new pending enquir{stats?.enquiries.unopened === 1 ? "y" : "ies"}
                </p>
                <span className="text-gray-500 text-xs">3 hours ago</span>
              </div>
            </motion.li>

            {/* Admins */}
            <motion.li
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 bg-zinc-800/40 p-3 rounded-lg border border-zinc-700/60 hover:border-indigo-400/40 transition-all"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 text-white text-xs font-bold">
                👑
              </div>
              <div className="flex-1">
                <p className="text-gray-300">
                  <span className="font-semibold text-white">
                    {stats?.admins.superadmin || 0}
                  </span>{" "}
                  superadmin{stats?.admins.superadmin === 1 ? "" : "s"} online
                </p>
                <span className="text-gray-500 text-xs">5 hours ago</span>
              </div>
            </motion.li>
          </ul>
        </motion.div>

      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm pt-6 border-t border-zinc-800">
        © {new Date().getFullYear()} Mecatrone Admin Dashboard • Powered by{" "}
        <span className="text-red-500 font-semibold">Mecatrone</span>
      </div>
    </div>
  );
};

export default Dash;
