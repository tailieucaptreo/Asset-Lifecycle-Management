import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";

import { Cpu, CheckCircle, Wrench, AlertTriangle } from "lucide-react";

import Card from "../components/Card";
import Chart from "../components/Chart";
import AdvancedFilter from "../components/AdvancedFilter";
import Header from "../components/Header";

export default function Dashboard() {

  const [devices, setDevices] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState({
    id: "",
    line: [],
    station: [],
    status: ""
  });

  // =============================
  // LOAD DATA
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
  // SEARCH DELAY
  // =============================
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const now = new Date();

  // =============================
  // FILTER
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
  // STATS
  // =============================
  const total = filtered.length;

  const active = filtered.filter(d => d.status === "Active").length;

  const maintenance = filtered.filter(
    d => d.status === "Maintenance"
  ).length;

  const expired = filtered.filter(d => {
    if (!d.installDate || !d.lifespan) return false;

    const exp = new Date(d.installDate);
    exp.setFullYear(exp.getFullYear() + d.lifespan);

    return exp < now;
  }).length;

  // =============================
  // RENDER
  // =============================
  return (
    <div className="flex-1 p-4 md:p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

        <h1 className="text-2xl font-bold">📊 Dashboard</h1>

        <div className="flex gap-3">

          <Header onSearch={setSearchInput} devices={devices} />

          <button
            onClick={() =>
              window.open(`${API}/api/devices/export`)
            }
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

      {/* CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">

        <Card
          title="Tổng"
          value={total}
          color="bg-blue-500"
          icon={<Cpu />}
          to="/devices"
        />

        <Card
          title="Hoạt động"
          value={active}
          color="bg-green-500"
          icon={<CheckCircle />}
          to="/devices?status=Active"
        />

        <Card
          title="Bảo trì"
          value={maintenance}
          color="bg-yellow-500"
          icon={<Wrench />}
          to="/devices?status=Maintenance"
        />

        <Card
          title="Hết hạn"
          value={expired}
          color="bg-red-500"
          icon={<AlertTriangle />}
          to="/devices/expired"
        />

      </div>

      {/* CHART */}
      <div className="mt-6">
        <Chart data={filtered} />
      </div>

    </div>
  );
}
