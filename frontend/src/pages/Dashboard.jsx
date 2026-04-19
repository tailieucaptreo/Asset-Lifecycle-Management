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
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState({
    id: "",
    line: [],
    station: [],
    status: ""
  });

  // 🚀 LOAD DATA
  const fetchData = () => {
    axios.get(`${API}/api/devices`)
      .then(res => setDevices(res.data))
      .catch(() => setDevices([]));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const now = new Date();

  // 🔍 FILTER LOGIC
  const filtered = devices.filter(d => {
    return (
      (!filter.id || d.deviceId?.toString().includes(filter.id)) &&
      (!filter.line.length || filter.line.includes(d.line)) &&
      (!filter.station.length || filter.station.includes(d.station)) &&
      (!filter.status || d.status === filter.status) &&
      (
        d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.deviceId?.toLowerCase().includes(search.toLowerCase()) ||
        d.line?.toLowerCase().includes(search.toLowerCase()) ||
        d.station?.toLowerCase().includes(search.toLowerCase())
      )
    );
  });

  // 📊 STATS
  const total = filtered.length;
  const active = filtered.filter(d => d.status === "Active").length;
  const maintenance = filtered.filter(d => d.status === "Maintenance").length;
  const expired = filtered.filter(d => new Date(d.expiryDate) < now).length;

  // 🔔 TOAST CẢNH BÁO
  useEffect(() => {
    filtered.forEach(d => {
      if (!d.expiryDate) return;

      const diff =
        (new Date(d.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);

      if (diff <= 7 && diff >= 0) {
        toast.error(`⚠ ${d.name} sắp hết hạn`);
      }
    });
  }, [filtered]);

  return (
    <div className="flex-1 p-4 md:p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <Header onSearch={setSearch} />

      {/* ACTION */}
      <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">📊 Dashboard</h1>

        <button
          onClick={() => window.open(`${API}/api/devices/export`)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow"
        >
          📤 Export Excel
        </button>
      </div>

      {/* FILTER */}
      <AdvancedFilter
        devices={devices}
        filter={filter}
        setFilter={setFilter}
      />

      {/* IMPORT EXCEL */}
      <ImportExcel />

      {/* CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        <Card title="Tổng thiết bị" value={total} color="bg-blue-500" icon={<Cpu />} />
        <Card title="Hoạt động" value={active} color="bg-green-500" icon={<CheckCircle />} />
        <Card title="Bảo trì" value={maintenance} color="bg-yellow-500" icon={<Wrench />} />
        <Card title="Hết hạn" value={expired} color="bg-red-500" icon={<AlertTriangle />} />
      </div>

      {/* CHART */}
      <div className="mt-8">
        <Chart data={filtered} />
      </div>

      {/* TABLE */}
      <Table data={filtered} />

    </div>
  );
}