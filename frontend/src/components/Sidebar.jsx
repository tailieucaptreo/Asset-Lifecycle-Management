import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {

  const nav = useNavigate();
  const location = useLocation();

  const [openDevice, setOpenDevice] = useState(true);
  const [openMaintenance, setOpenMaintenance] = useState(false);

  const active = (path) =>
    location.pathname === path
      ? "bg-blue-600 text-white"
      : "hover:bg-gray-700";

  return (
    <div className="w-64 bg-[#0f172a] text-white min-h-screen p-4">

      <h2 className="text-lg font-bold mb-6">⚙ Asset Manager</h2>

      {/* DASHBOARD */}
      <div
        className={`p-2 rounded cursor-pointer ${active("/")}`}
        onClick={() => nav("/")}
      >
        📊 Dashboard
      </div>

      {/* ================= DEVICE ================= */}
      <div className="mt-4">

        <div
          className="p-2 cursor-pointer flex justify-between"
          onClick={() => setOpenDevice(!openDevice)}
        >
          <span>🗂 Thiết bị</span>
          <span>{openDevice ? "▾" : "▸"}</span>
        </div>

        {openDevice && (
          <div className="ml-4 space-y-1">

            <div
              className={`p-2 rounded cursor-pointer ${active("/devices")}`}
              onClick={() => nav("/devices")}
            >
              📋 Tổng thiết bị
            </div>

            <div
              className={`p-2 rounded cursor-pointer ${active("/add")}`}
              onClick={() => nav("/add")}
            >
              ➕ Nhập thiết bị
            </div>

            <div className="p-2 cursor-pointer hover:bg-gray-700 rounded">
              📂 Phân loại
            </div>

            <div className="p-2 cursor-pointer hover:bg-gray-700 rounded">
              ⚠ Thiết bị lỗi
            </div>

          </div>
        )}
      </div>

      {/* ================= MAINTENANCE ================= */}
      <div className="mt-4">

        <div
          className="p-2 cursor-pointer flex justify-between"
          onClick={() => setOpenMaintenance(!openMaintenance)}
        >
          <span>🔧 Bảo trì</span>
          <span>{openMaintenance ? "▾" : "▸"}</span>
        </div>

        {openMaintenance && (
          <div className="ml-4 space-y-1">

            <div className="p-2 hover:bg-gray-700 rounded">
              📅 Lịch bảo trì
            </div>

            <div className="p-2 hover:bg-gray-700 rounded">
              🛠 Công việc
            </div>

            <div className="p-2 hover:bg-gray-700 rounded">
              🚨 Cảnh báo
            </div>

          </div>
        )}
      </div>

      {/* REPORT */}
      <div className="mt-4 p-2 hover:bg-gray-700 rounded cursor-pointer">
        📊 Báo cáo
      </div>

      {/* SETTINGS */}
      <div className="mt-4 p-2 hover:bg-gray-700 rounded cursor-pointer">
        ⚙ Cài đặt
      </div>

    </div>
  );
}
