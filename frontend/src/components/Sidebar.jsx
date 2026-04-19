import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  BarChart3,
  Settings,
  ChevronDown,
  Plus,
  List
} from "lucide-react";

export default function Sidebar() {
  const [openDevice, setOpenDevice] = useState(true);

  const linkClass =
    "flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-gray-700";

  const activeClass = "bg-blue-600";

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen flex flex-col p-4 shadow-xl">

      {/* LOGO */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-500 p-2 rounded-lg">🚇</div>
        <h1 className="text-lg font-bold">Asset Manager</h1>
      </div>

      {/* MENU */}
      <nav className="flex-1 space-y-2">

        {/* DASHBOARD */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        {/* THIẾT BỊ */}
        <div>
          <div
            onClick={() => setOpenDevice(!openDevice)}
            className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-700"
          >
            <span className="flex items-center gap-3">
              <Database size={18} />
              Thiết bị
            </span>

            <ChevronDown
              size={16}
              className={`transition ${openDevice ? "rotate-180" : ""}`}
            />
          </div>

          {/* SUBMENU */}
          <div
            className={`ml-6 mt-2 space-y-1 overflow-hidden transition-all duration-300 ${
              openDevice ? "max-h-40" : "max-h-0"
            }`}
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${linkClass} text-sm ${isActive ? activeClass : ""}`
              }
            >
              <List size={16} />
              Danh sách
            </NavLink>

            <NavLink
              to="/add"
              className={({ isActive }) =>
                `${linkClass} text-sm ${isActive ? activeClass : ""}`
              }
            >
              <Plus size={16} />
              Nhập thiết bị
            </NavLink>
          </div>
        </div>

        {/* BÁO CÁO */}
        <div className={`${linkClass}`}>
          <BarChart3 size={18} />
          Báo cáo
        </div>

        {/* CÀI ĐẶT */}
        <div className={`${linkClass}`}>
          <Settings size={18} />
          Cài đặt
        </div>
      </nav>

      {/* FOOTER */}
      <div className="mt-auto pt-4 border-t border-gray-700 text-sm text-gray-400">
        © 2026 Asset System
      </div>
    </div>
  );
}