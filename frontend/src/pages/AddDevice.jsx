import { useState } from "react";
import axios from "axios";
import API from "../config";
import { useNavigate } from "react-router-dom";

export default function AddDevice() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    line: "",
    station: "",
    code: "",
    area: "",
    status: "Active",
    installDate: "",
    deviceId: "",
    lastMaintenance: "",
    lifespan: ""
  });

  // 🔥 FORMAT DATE (AUTO FIX)
  const formatDate = (dateStr) => {
    if (!dateStr) return null;

    // dd/mm/yyyy
    if (dateStr.includes("/")) {
      const [d, m, y] = dateStr.split("/");
      return new Date(`${y}-${m}-${d}`);
    }

    // yyyy-mm-dd
    return new Date(dateStr);
  };

  // 🔥 TÍNH HẾT HẠN
  const calculateExpiry = () => {
    if (!form.installDate || !form.lifespan) return null;

    const d = formatDate(form.installDate);
    if (!d || isNaN(d)) return null;

    d.setFullYear(d.getFullYear() + Number(form.lifespan));
    return d;
  };

  // 🚀 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDATE
    if (!form.name || !form.line || !form.station) {
      alert("⚠️ Nhập đủ Tên / Tuyến / Nhà ga");
      return;
    }

    try {
      const payload = {
        ...form,

        lifespan: form.lifespan ? Number(form.lifespan) : null,

        installDate: formatDate(form.installDate),
        lastMaintenance: formatDate(form.lastMaintenance),

        expiryDate: calculateExpiry()
      };

      console.log("DATA GỬI:", payload); // 🔍 debug

      await axios.post(`${API}/api/devices`, payload);

      alert("✅ Thêm thiết bị thành công!");
      navigate("/");
    } catch (err) {
      console.log("ERROR:", err.response?.data);
      alert("❌ Lỗi khi thêm!");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full">

      <h1 className="text-2xl font-bold mb-6">➕ Nhập thiết bị</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-4"
      >

        {/* TÊN */}
        <div>
          <label className="text-sm text-gray-600">Tên thiết bị *</label>
          <input
            required
            className="border p-2 rounded w-full"
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* TUYẾN */}
        <div>
          <label className="text-sm text-gray-600">Tuyến *</label>
          <input
            required
            className="border p-2 rounded w-full"
            onChange={e => setForm({ ...form, line: e.target.value })}
          />
        </div>

        {/* GA */}
        <div>
          <label className="text-sm text-gray-600">Nhà ga *</label>
          <input
            required
            className="border p-2 rounded w-full"
            onChange={e => setForm({ ...form, station: e.target.value })}
          />
        </div>

        {/* KÝ HIỆU */}
        <div>
          <label className="text-sm text-gray-600">Ký hiệu</label>
          <input
            className="border p-2 rounded w-full"
            onChange={e => setForm({ ...form, code: e.target.value })}
          />
        </div>

        {/* KHU VỰC */}
        <div>
          <label className="text-sm text-gray-600">Khu vực</label>
          <input
            className="border p-2 rounded w-full"
            onChange={e => setForm({ ...form, area: e.target.value })}
          />
        </div>

        {/* MÃ ID */}
        <div>
          <label className="text-sm text-gray-600">Mã ID</label>
          <input
            className="border p-2 rounded w-full"
            onChange={e => setForm({ ...form, deviceId: e.target.value })}
          />
        </div>

        {/* NGÀY LẮP */}
        <div>
          <label className="text-sm text-gray-600">Ngày lắp đặt</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            onChange={e =>
              setForm({ ...form, installDate: e.target.value })
            }
          />
        </div>

        {/* BẢO TRÌ */}
        <div>
          <label className="text-sm text-gray-600">
            Ngày bảo trì gần nhất
          </label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            onChange={e =>
              setForm({ ...form, lastMaintenance: e.target.value })
            }
          />
        </div>

        {/* TUỔI THỌ */}
        <div>
          <label className="text-sm text-gray-600">
            Tuổi thọ (năm)
          </label>
          <input
            type="number"
            className="border p-2 rounded w-full"
            onChange={e =>
              setForm({ ...form, lifespan: e.target.value })
            }
          />
        </div>

        {/* STATUS */}
        <div>
          <label className="text-sm text-gray-600">Trạng thái</label>
          <select
            className="border p-2 rounded w-full"
            onChange={e =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* BUTTON */}
        <button className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg mt-2">
          💾 Lưu thiết bị
        </button>

      </form>
    </div>
  );
}