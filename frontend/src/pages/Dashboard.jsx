import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";

import Header from "../components/Header.jsx";
import Card from "../components/Card.jsx";
import Chart from "../components/Chart.jsx";
import AdvancedFilter from "../components/AdvancedFilter.jsx";

import {
  Cpu,
  CheckCircle,
  Wrench,
  AlertTriangle,
  BatteryCharging
} from "lucide-react";

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

    axios
      .get(`${API}/api/devices`)
      .then((res) => setDevices(res.data))
      .catch(() => setDevices([]));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =============================
  // SEARCH DELAY
  // =============================
  useEffect(() => {

    const t = setTimeout(() => {
      setSearch(searchInput);
    }, 300);

    return () => clearTimeout(t);

  }, [searchInput]);

  const now = new Date();

  // =============================
  // FILTER
  // =============================
  const filtered = devices.filter((d) => {

    const keyword = search.toLowerCase();

    return (

      (!filter.id ||
        (d.deviceId || "").includes(filter.id)) &&

      (!filter.line.length ||
        filter.line.includes(d.line)) &&

      (!filter.station.length ||
        filter.station.includes(d.station)) &&

      (!filter.status ||
        d.status === filter.status) &&

      (
        (d.name || "")
          .toLowerCase()
          .includes(keyword) ||

        (d.deviceId || "")
          .toLowerCase()
          .includes(keyword)
      )
    );
  });

  // =============================
  // STATS
  // =============================
  const total = filtered.length;

  const active = filtered.filter(
    (d) => d.status === "Active"
  ).length;

  const maintenance = filtered.filter(
    (d) => d.status === "Maintenance"
  ).length;

  const expired = filtered.filter((d) => {

    if (!d.installDate || !d.lifespan) {
      return false;
    }

    const exp = new Date(d.installDate);

    exp.setFullYear(
      exp.getFullYear() + d.lifespan
    );

    return exp < now;

  }).length;

  // 🔥 THIẾT BỊ DỰ PHÒNG
  // Tạm thời demo = 24
  // Sau này kết nối API riêng
  const spareDevices = 24;

  // =============================
  // RENDER
  // =============================
  return (

    <div className="flex-1 min-h-screen bg-gray-100 p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">

        <h1 className="text-3xl font-bold">
          📊 Dashboard
        </h1>

        <div className="flex gap-3">

          <Header
            onSearch={setSearchInput}
            devices={devices}
          />

          <button
            onClick={() =>
              window.open(`${API}/api/devices/export`)
            }
            className="
              bg-blue-500
              hover:bg-blue-600
              text-white
              px-5
              py-2
              rounded-xl
              shadow
              transition
            "
          >
            Export
          </button>

        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white rounded-2xl shadow p-4">

        <AdvancedFilter
          devices={devices}
          filter={filter}
          setFilter={setFilter}
        />

      </div>

      {/* CARD */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-5
          gap-5
          mt-6
        "
      >

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

        {/* 🔥 CARD DỰ PHÒNG */}
        <Card
          title="Dự phòng"
          value={spareDevices}
          color="bg-cyan-500"
          icon={<BatteryCharging />}
          to="/spare-devices"
        />

      </div>

      {/* CHART */}
      <div className="mt-6">

        <Chart data={filtered} />

      </div>

    </div>
  );
}
