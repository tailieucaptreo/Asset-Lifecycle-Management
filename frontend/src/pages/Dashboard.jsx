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
  const [selected, setSelected] = useState(null);

  // =============================
  // LOAD DATA
  // =============================
  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}/api/devices`);
      setDevices(res.data);
    } catch {
      setDevices([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =============================
  // DELETE
  // =============================
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa thiết bị?")) return;

    try {
      await axios.delete(`${API}/api/devices/${id}`);
      toast.success("Đã xóa");
      fetchData();
    } catch {
      toast.error("Xóa lỗi");
    }
  };

  // =============================
  // SAVE EDIT
  // =============================
  const handleSave = async () => {
    try {
      await axios.put(`${API}/api/devices/${editing.id}`, editing);

      toast.success("Lưu thành công");
      setEditing(null);
      fetchData();

    } catch (err) {
      console.error(err);
      toast.error("Lưu lỗi");
    }
  };

  // =============================
  // FORMAT DATE
  // =============================
  const formatDate = (d) => {
    if (!d) return "-";
    const date = new Date(d);
    return isNaN(date) ? "-" : date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

      {/* IMPORT */}
      <ImportExcel onDone={fetchData} />

      {/* TABLE */}
      <Table
        data={devices}
        onEdit={setEditing}
        onDelete={handleDelete}
        onSelect={setSelected}
      />

      {/* =============================
          🔍 DETAIL MODAL
      ============================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-xl w-[700px] grid grid-cols-2 gap-6">

            {/* LEFT */}
            <div>

              <h2 className="font-bold text-lg mb-3">
                {selected.name}
              </h2>

              <p><b>Tuyến:</b> {selected.line}</p>
              <p><b>Nhà ga:</b> {selected.station}</p>
              <p><b>Ký hiệu:</b> {selected.code}</p>
              <p><b>Khu vực:</b> {selected.area}</p>
              <p><b>Mã ID:</b> {selected.deviceId}</p>
              <p><b>Trạng thái:</b> {selected.status}</p>

              <p><b>Ngày lắp:</b> {formatDate(selected.installDate)}</p>
              <p><b>Bảo trì:</b> {formatDate(selected.lastMaintenance)}</p>
              <p><b>Tuổi thọ:</b> {selected.lifespan || "-"} năm</p>

            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-center">
              <img
                src={selected.image || "https://via.placeholder.com/200"}
                className="w-60 h-40 object-contain border"
              />
            </div>

            <div className="col-span-2 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 border rounded"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =============================
          ✏️ EDIT MODAL
      ============================= */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded w-[400px] space-y-2">

            <h2 className="font-bold">Edit thiết bị</h2>

            <input
              className="input"
              value={editing.name || ""}
              onChange={(e)=>setEditing({...editing, name:e.target.value})}
              placeholder="Tên"
            />

            <input
              className="input"
              value={editing.line || ""}
              onChange={(e)=>setEditing({...editing, line:e.target.value})}
              placeholder="Tuyến"
            />

            <input
              className="input"
              value={editing.station || ""}
              onChange={(e)=>setEditing({...editing, station:e.target.value})}
              placeholder="Nhà ga"
            />

            <input
              className="input"
              value={editing.deviceId || ""}
              onChange={(e)=>setEditing({...editing, deviceId:e.target.value})}
              placeholder="Mã ID"
            />

            <input
              type="date"
              className="input"
              value={
                editing.installDate
                  ? new Date(editing.installDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e)=>setEditing({...editing, installDate:e.target.value})}
            />

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Lưu
              </button>

              <button onClick={()=>setEditing(null)}>
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
