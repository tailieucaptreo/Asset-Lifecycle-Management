import { useState, useEffect } from "react";
import axios from "axios";
import API from "../config";

export default function EditDeviceModal({ device, onClose, onReload }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (device) setForm(device);
  }, [device]);

  const handleChange = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      await axios.post(`${API}/api/devices`, form); // 🔥 dùng upsert

      alert("✅ Đã lưu");
      onReload();
      onClose();

    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi lưu");
    }
  };

  if (!device) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-xl w-[500px] shadow-xl">

        <h2 className="font-bold text-lg mb-4">✏️ Edit thiết bị</h2>

        <div className="grid grid-cols-2 gap-3">

          <input
            value={form.name || ""}
            onChange={e => handleChange("name", e.target.value)}
            placeholder="Tên thiết bị"
            className="border p-2 rounded"
          />

          <input
            value={form.line || ""}
            onChange={e => handleChange("line", e.target.value)}
            placeholder="Tuyến"
            className="border p-2 rounded"
          />

          <input
            value={form.station || ""}
            onChange={e => handleChange("station", e.target.value)}
            placeholder="Nhà ga"
            className="border p-2 rounded"
          />

          <input
            value={form.code || ""}
            onChange={e => handleChange("code", e.target.value)}
            placeholder="Ký hiệu"
            className="border p-2 rounded"
          />

          <input
            value={form.area || ""}
            onChange={e => handleChange("area", e.target.value)}
            placeholder="Khu vực"
            className="border p-2 rounded"
          />

          <input
            value={form.deviceId || ""}
            onChange={e => handleChange("deviceId", e.target.value)}
            placeholder="Mã ID"
            className="border p-2 rounded"
          />

          <select
            value={form.status || ""}
            onChange={e => handleChange("status", e.target.value)}
            className="border p-2 rounded"
          >
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Inactive">Inactive</option>
          </select>

          <input
            type="date"
            value={form.installDate?.slice(0, 10) || ""}
            onChange={e => handleChange("installDate", e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={form.lastMaintenance?.slice(0, 10) || ""}
            onChange={e => handleChange("lastMaintenance", e.target.value)}
            className="border p-2 rounded"
          />

        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            💾 Lưu
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
