import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({

        mobile = false,
        setOpen
    
}) {

  const nav = useNavigate();
  const location = useLocation();

  const [openDevice, setOpenDevice] = useState(true);
  const [openMaintenance, setOpenMaintenance] = useState(false);

  const role =
    localStorage.getItem("role");
  const go = (path) => {

      nav(path);
    
      if (mobile && setOpen) {
    
        setOpen(false);
    
      }
    
  };

  // 🔥 ACTIVE CHECK (hỗ trợ cả sub route)
  const active = (path) =>
    location.pathname.startsWith(path)
      ? "bg-blue-600 text-white"
      : "hover:bg-gray-700";

  return (
    <div className="w-72 md:w-64 bg-[#0f172a] text-white min-h-screen p-4 overflow-y-auto">

      <div className="flex justify-between items-center mb-6">
        
            <h2 className="text-lg font-bold">
                ⚙ Asset Manager
            </h2>
        
            {mobile && (
        
                <button
        
                    onClick={() => setOpen(false)}
        
                    className="text-white"
        
                >
        
                    ✕
        
                </button>
        
            )}
        
      </div>

      {/* DASHBOARD */}
      <div
        className={`p-2 rounded cursor-pointer ${active("/dashboard")}`}
        onClick={() => go("/dashboard")}
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
              onClick={() => go("/devices")}
            >
              📋 Tổng thiết bị các tuyến cáp
            </div>

            <div
              className="p-2 cursor-pointer hover:bg-gray-700 rounded"
              onClick={() => go("/category")}
            >
              📂 Phân loại
            </div>

            <div
              className="p-2 cursor-pointer hover:bg-gray-700 rounded"
              onClick={() => go("/devices/error")}
            >
              ⚠ Quản lý động cơ
            </div>

            <div
              className={`p-2 rounded cursor-pointer ${active("/drives")}`}
              onClick={() => go("/drives")}
            >
             ⚡ Quản lý biến tần
            </div>

            <div
              className={`p-2 rounded cursor-pointer ${active("/drive-faults")}`}
              onClick={() => go("/drive-faults")}
            >
              ⚠️ Lịch sử lỗi biến tần
            </div>
            
            <div
              className={`p-2 rounded cursor-pointer ${active("/spare-devices")}`}
              onClick={() => go("/spare-devices")}
            >
              🔋 Thiết bị dự phòng
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

            <div
              className={`p-2 cursor-pointer rounded ${active("/maintenance/schedule")}`}
              onClick={() => go("/maintenance/schedule")}
            >
              📅 Lịch bảo trì
            </div>

            <div
              className={`p-2 cursor-pointer rounded ${active("/maintenance/work")}`}
              onClick={() => go("/maintenance/work")}
            >
              🛠 Công việc
            </div>

            <div
              className={`p-2 cursor-pointer rounded ${active("/maintenance/alerts")}`}
              onClick={() => go("/maintenance/alerts")}
            >
              🚨 Cảnh báo
            </div>

          </div>
        )}
      </div>

      {/* REPORT */}
      <div
        className={`mt-4 p-2 rounded cursor-pointer ${active("/report")}`}
        onClick={() => go("/report")}
      >
        📊 Báo cáo
      </div>

      {/* SETTINGS */}
      <div
        className={`mt-4 p-2 rounded cursor-pointer ${active("/settings")}`}
        onClick={() => go("/settings")}
      >
        ⚙ Cài đặt
      </div>

      <button
        onClick={() => {

          localStorage.removeItem("role");

          window.location.href = "/";

        }}
        className="
          mt-10
          w-full
          bg-red-500
          hover:bg-red-600
          p-3
          rounded-xl
          font-semibold
          transition-all
        "
      >
        Đăng xuất
      </button>

    </div>
  );
}
