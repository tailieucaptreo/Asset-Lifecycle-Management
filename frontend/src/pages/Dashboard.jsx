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

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [editing, setEditing] = useState(null);

  const [filter, setFilter] = useState({
    id: "",
    line: [],
    station: [],
    status: ""
  });

  // =========================
  // LOAD DATA
  // =========================
  const fetchData = async () => {
    const res = await axios.get(`${API}/api/devices`);
    setDevices(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // FILTER
  // =========================
  const filtered = devices.filter(d => {
    return (
      (!filter.id || (d.deviceId || "").includes(filter.id)) &&
      (!filter.line.length || filter.line.includes(d.line)) &&
      (!filter.station.length || filter.station.includes(d.station)) &&
      (!filter.status || d.status === filter.status)
    );
  });

  const now = new Date();

  // =========================
  // STATS
  // =========================
  const total = filtered.length;
  const active = filtered.filter(d => d.status === "Active").length;
  const maintenance = filtered.filter(d => d.status === "Maintenance").length;
  const expired = filtered.filter(
    d => d.expiryDate && new Date(d.expiryDate) < now
  ).length;

  return (
    <div className="flex-1 p-4 md:p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">📊 Dashboard</h1>

        <button
          onClick={() => window.open(`${API}/api/devices/export`)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Export
        </button>
      </div>

      {/* FILTER */}
      <AdvancedFilter
        devices={devices}
        filter={filter}
        setFilter={setFilter}
      />

      {/* IMPORT */}
      <ImportExcel onDone={fetchData} />

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        <Card title="Tổng thiết bị" value={total} color="bg-blue-500" icon={<Cpu />} />
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
        reload={fetchData}
      />

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-96">

            <h2 className="font-bold mb-2">Edit thiết bị</h2>

            <input
              value={editing.name || ""}
              onChange={(e) =>
                setEditing({ ...editing, name: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />

            <input
              value={editing.line || ""}
              onChange={(e) =>
                setEditing({ ...editing, line: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />

            <button
              onClick={async () => {
                await axios.post(`${API}/api/devices`, editing);
                setEditing(null);
                fetchData();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Lưu
            </button>

            <button
              onClick={() => setEditing(null)}
              className="ml-2"
            >
              Đóng
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
