import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";
import {
  PieChart, Pie, Cell, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from "recharts";

const COLORS = ["#22c55e", "#eab308", "#ef4444"];

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [line, setLine] = useState("");
  const [station, setStation] = useState("");
  const [status, setStatus] = useState("");

  // 🔄 LOAD DATA
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    const res = await axios.get(`${API}/api/devices`);
    setDevices(res.data);
    setFiltered(res.data);
  };

  // 🔍 FILTER + SEARCH REALTIME
  useEffect(() => {
    let result = devices;

    if (search) {
      result = result.filter(d =>
        d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.deviceId?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (line) result = result.filter(d => d.line === line);
    if (station) result = result.filter(d => d.station === station);
    if (status) result = result.filter(d => d.status === status);

    setFiltered(result);
  }, [search, line, station, status, devices]);

  // 📊 STATS
  const total = filtered.length;
  const active = filtered.filter(d => d.status === "Active").length;
  const maintenance = filtered.filter(d => d.status === "Maintenance").length;
  const inactive = filtered.filter(d => d.status === "Inactive").length;

  // 📊 PIE DATA
  const pieData = [
    { name: "Active", value: active },
    { name: "Maintenance", value: maintenance },
    { name: "Inactive", value: inactive }
  ];

  // 📈 LINE DATA (theo năm lắp)
  const lineData = Object.values(
    filtered.reduce((acc, d) => {
      const year = d.installDate
        ? new Date(d.installDate).getFullYear()
        : "N/A";

      if (!acc[year]) acc[year] = { year, count: 0 };
      acc[year].count++;
      return acc;
    }, {})
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full">

      {/* 🔍 SEARCH */}
      <input
        placeholder="🔍 Tìm thiết bị..."
        className="w-full p-3 mb-4 rounded-xl border shadow"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* 🎛 FILTER */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <input placeholder="Tuyến" onChange={e => setLine(e.target.value)} className="p-2 border rounded"/>
        <input placeholder="Nhà ga" onChange={e => setStation(e.target.value)} className="p-2 border rounded"/>
        <select onChange={e => setStatus(e.target.value)} className="p-2 border rounded">
          <option value="">Trạng thái</option>
          <option>Active</option>
          <option>Maintenance</option>
          <option>Inactive</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setLine("");
            setStation("");
            setStatus("");
          }}
          className="bg-gray-300 rounded"
        >
          Reset
        </button>
      </div>

      {/* 📊 CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card title="Tổng thiết bị" value={total} color="bg-blue-500"/>
        <Card title="Hoạt động" value={active} color="bg-green-500"/>
        <Card title="Bảo trì" value={maintenance} color="bg-yellow-500"/>
        <Card title="Ngừng" value={inactive} color="bg-red-500"/>
      </div>

      {/* 📊 CHART */}
      <div className="grid grid-cols-2 gap-6">

        {/* PIE */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="mb-2 font-bold">Trạng thái</h2>
          <PieChart width={300} height={250}>
            <Pie data={pieData} dataKey="value" outerRadius={80}>
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* LINE */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="mb-2 font-bold">Xu hướng</h2>
          <LineChart width={400} height={250} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" />
          </LineChart>
        </div>

      </div>

      {/* 📋 TABLE */}
      <table className="w-full mt-6 bg-white rounded-xl shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Tên</th>
            <th className="p-2">Tuyến</th>
            <th className="p-2">Nhà ga</th>
            <th className="p-2">Mã ID</th>
            <th className="p-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(d => (
            <tr key={d.id} className="border-t">
              <td className="p-2">{d.name}</td>
              <td className="p-2">{d.line}</td>
              <td className="p-2">{d.station}</td>
              <td className="p-2">{d.deviceId}</td>
              <td className="p-2">{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}


// 🎨 CARD COMPONENT
function Card({ title, value, color }) {
  return (
    <div className={`${color} text-white p-4 rounded-xl shadow`}>
      <p>{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}