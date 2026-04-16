import { LayoutDashboard, Database, BarChart3, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar() {
  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Thiết bị", icon: <Database size={18} /> },
    { name: "Báo cáo", icon: <BarChart3 size={18} /> },
    { name: "Cài đặt", icon: <Settings size={18} /> },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen p-5">
      <h2 className="text-xl font-bold mb-8">🚆 Asset Manager</h2>

      <div className="space-y-3">
        {menu.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition"
          >
            {item.icon}
            {item.name}
          </motion.div>
        ))}
      </div>
    </div>
  );
}