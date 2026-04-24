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

  // =========================
  // 🚀 LOAD DATA
  // =========================
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

  // =========================
  // 🔥 DEBOUNCE SEARCH
  // =========================
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const now = new Date();

  // =========================
  // 🔍 FILTER
  // =========================
  const filtered = devices.filter(d => {
    const keyword = search.toLowerCase();

    return (
      (!filter.id || (d.deviceId || "").toString().includes(filter.id)) &&
      (!filter.line.length || filter.line.includes(d.line)) &&
      (!filter.station.length || filter.station.includes(d.station)) &&
      (!filter.status || d.status === filter.status) &&
      (
        (d.name || "").toLowerCase().includes(keyword) ||
        (d.deviceId || "").toString().toLowerCase().includes(keyword) ||
        (d.line || "").toLowerCase().includes(keyword) ||
        (d.station || "").toLowerCase().includes(keyword)
      )
    );
  });

  // =========================
  // 📊 STATS
  // =========================
  const total = filtered.length;
  const active = filtered.filter(d => d.status === "Active").length;
  const maintenance = filtered.filter(d => d.status === "Maintenance").length;
  const expired = filtered.filter(
    d => d.expiryDate && new Date(d.expiryDate) < now
  ).length;

  // =========================
  // 🔔 CẢNH BÁO
  // =========================
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
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">📊 Dashboard</h1>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-full md:w-[420px]">
            <Header onSearch={setSearchInput} devices={devices} />
          </div>

          <button
            onClick={() => window.open(`${API}/api/devices/export`)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            📤 Export
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

      {/* CARDS */}
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
      <div className="mt-6">
        <Table
          data={filtered}
          setEditing={setEditing}
          reload={fetchData}
        />
      </div>

    </div>
  );
}
