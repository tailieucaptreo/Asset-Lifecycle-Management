import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";

import Header from "../components/Header";
import Card from "../components/Card";
import Chart from "../components/Chart";
import Table from "../components/Table";
import AdvancedFilter from "../components/AdvancedFilter";
import ImportExcel from "../components/ImportExcel";

import { Cpu, CheckCircle, Wrench, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard() {

  const [devices, setDevices] = useState([]);
  const [editing, setEditing] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState({
    id: "",
    line: [],
    station: [],
    status: ""
  });

  // =============================
  // 🚀 LOAD DATA
  // =============================
  const fetchData = () => {
    axios.get(`${API}/api/devices`)
      .then(res => setDevices(res.data))
      .catch(() => setDevices([]));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =============================
  // 🔍 SEARCH DEBOUNCE
  // =============================
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const now = new Date();

  // =============================
  // 🔍 FILTER
  // =============================
  const filtered = devices.filter(d => {
    const keyword = search.toLowerCase();

    return (
      (!filter.id || (d.deviceId || "").includes(filter.id)) &&
      (!filter.line.length || filter.line.includes(d.line)) &&
      (!filter.station.length || filter.station.includes(d.station)) &&
      (!filter.status || d.status === filter.status) &&
      (
        (d.name || "").toLowerCase().includes(keyword) ||
        (d.deviceId || "").toLowerCase().includes(keyword)
      )
    );
  });

  // =============================
  // 📊 STATS
  // =============================
  const total = filtered.length;

  const active = filtered.filter(d => d.status === "Active").length;
  const maintenance = filtered.filter(d => d.status === "Maintenance").length;

  // 🔥 FIX: tính expiry không cần backend
  const expired = filtered.filter(d => {
    if (!d.installDate || !d.lifespan) return false;

    const exp = new Date(d.installDate);
    exp.setFullYear(exp.getFullYear() + Number(d.lifespan));

    return exp < now;
  }).length;

  // =============================
  // 🔔 WARNING
  // =============================
  useEffect(() => {
    filtered.forEach(d => {
      if (!d.installDate || !d.lifespan) return;

      const exp = new Date(d.installDate);
      exp.setFullYear(exp.getFullYear() + Number(d.lifespan));

      const diff = (exp - new Date()) / (1000 * 60 * 60 * 24);

      if (diff <= 7 && diff >= 0) {
        toast.error(`⚠ ${d.name} sắp hết hạn`);
      }
    });
  }, [filtered]);

  // =============================
  // 🗑 DELETE
  // =============================
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa thiết bị?")) return;

    try {
      await axios.delete(`${API}/api/devices/${id}`);
      toast.success("Đã xóa");
      fetchData();
    } catch (err) {
      toast.error("❌ Xóa lỗi");
    }
  };

  // =============================
  // 💾 SAVE EDIT (🔥 FIX)
  // =============================
  const handleSave = async () => {
    try {
      await axios.put(`${API}/api/devices/${editing.id}`, editing);

      toast.success("✅ Lưu thành công");

      setEditing(null);
      fetchData();

    } catch (err) {
      console.error(err);
      toast.error("❌ Lưu lỗi");
    }
  };

  // =============================
  // 📅 FORMAT DATE INPUT
  // =============================
  const formatInputDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  return (
    <div className="flex-1 p-4 md:p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

        <h1 className="text-2xl font-bold">📊 Dashboard</h1>

        <div className="flex gap-3">

          <Header onSearch={setSearchInput} devices={devices} />

          <button
            onClick={() => window.open(`${API}/api/devices/export`)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Export
          </button>
        </div>
      </div>

      {/* FILTER */}
      <AdvancedFilter
        devices={devices}
        filter={filter}
        setFilter={setFilter}
      />

      {/* IMPORT */}
      <ImportExcel onDone={fetchData} />

      {/* CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        <Card title="Tổng" value={total} color="bg-blue-500" icon={<Cpu />} />
        <Card title="Hoạt động" value={active} color="bg-green-500" icon={<CheckCircle />} />
        <Card title="Bảo trì" value={maintenance} color="bg-yellow-500" icon={<Wrench />} />
        <Card title="Hết hạn" value={expired} color="bg-red-500" icon={<AlertTriangle />} />
      </div>

      {/* CHART */}
      <div className="mt-6">
        <Chart data={filtered} />
      </div>

      {/* TABLE */}
      <Table
        data={filtered}
        setEditing={setEditing}
        onDelete={handleDelete}
      />

      {/* =============================
          ✏️ EDIT MODAL
      ============================= */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-xl w-[400px] space-y-2">

            <h2 className="font-bold mb-2">Edit thiết bị</h2>

            <input
              value={editing.name || ""}
              onChange={(e)=>setEditing({...editing, name:e.target.value})}
              className="input"
              placeholder="Tên"
            />

            <input
              value={editing.line || ""}
              onChange={(e)=>setEditing({...editing, line:e.target.value})}
              className="input"
              placeholder="Tuyến"
            />

            <input
              value={editing.station || ""}
              onChange={(e)=>setEditing({...editing, station:e.target.value})}
              className="input"
              placeholder="Nhà ga"
            />

            <input
              value={editing.code || ""}
              onChange={(e)=>setEditing({...editing, code:e.target.value})}
              className="input"
              placeholder="Ký hiệu"
            />

            <input
              value={editing.area || ""}
              onChange={(e)=>setEditing({...editing, area:e.target.value})}
              className="input"
              placeholder="Khu vực"
            />

            <input
              value={editing.deviceId || ""}
              onChange={(e)=>setEditing({...editing, deviceId:e.target.value})}
              className="input"
              placeholder="Mã ID"
            />

            <select
              value={editing.status || "Inactive"}
              onChange={(e)=>setEditing({...editing, status:e.target.value})}
              className="input"
            >
              <option>Active</option>
              <option>Maintenance</option>
              <option>Inactive</option>
            </select>

            <input
              type="date"
              value={formatInputDate(editing.installDate)}
              onChange={(e)=>setEditing({...editing, installDate:e.target.value})}
              className="input"
            />

            <input
              type="date"
              value={formatInputDate(editing.lastMaintenance)}
              onChange={(e)=>setEditing({...editing, lastMaintenance:e.target.value})}
              className="input"
            />

            {/* BUTTON */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Lưu
              </button>

              <button
                onClick={()=>setEditing(null)}
                className="px-4 py-2 border rounded"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
