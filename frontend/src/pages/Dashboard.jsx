import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import Chart from "../components/Chart";

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [filter, setFilter] = useState({
    line: "",
    station: "",
    status: ""
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/devices")
      .then(res => setDevices(res.data));
  }, []);

  const now = new Date();

  const filtered = devices.filter(d =>
    (!filter.line || d.line === filter.line) &&
    (!filter.station || d.station === filter.station) &&
    (!filter.status || d.status === filter.status)
  );

  const total = filtered.length;
  const active = filtered.filter(d => d.status === "Active").length;
  const maintenance = filtered.filter(d => d.status === "Maintenance").length;
  const expired = filtered.filter(d => new Date(d.expiryDate) < now).length;

  // ⚠️ cảnh báo 7 ngày
  const warning = filtered.filter(d => {
    const diff = (new Date(d.expiryDate) - now) / (1000 * 60 * 60 * 24);
    return diff <= 7 && diff >= 0;
  });

  return (
    <div className="flex-1 p-6 overflow-auto">
      <h1 className="text-2xl font-bold">Dashboard Tổng quan</h1>

      {/* FILTER */}
      <div className="flex gap-4 mt-4">
        <select onChange={e => setFilter({ ...filter, line: e.target.value })}>
          <option value="">Tuyến</option>
          {[...new Set(devices.map(d => d.line))].map(l => (
            <option key={l}>{l}</option>
          ))}
        </select>

        <select onChange={e => setFilter({ ...filter, station: e.target.value })}>
          <option value="">Nhà ga</option>
          {[...new Set(devices.map(d => d.station))].map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select onChange={e => setFilter({ ...filter, status: e.target.value })}>
          <option value="">Trạng thái</option>
          <option>Active</option>
          <option>Maintenance</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* ALERT */}
      <div className="mt-4">
        {warning.map(d => (
          <div key={d.id} className="bg-red-100 text-red-700 p-2 rounded mb-2">
            ⚠ {d.name} sắp hết hạn ({d.expiryDate})
          </div>
        ))}
      </div>

      {/* CARD */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <Card title="Tổng thiết bị" value={total} color="bg-blue-500" />
        <Card title="Hoạt động" value={active} color="bg-green-500" />
        <Card title="Bảo trì" value={maintenance} color="bg-yellow-500" />
        <Card title="Quá hạn" value={expired} color="bg-red-500" />
      </div>

      {/* CHART */}
      <div className="mt-6">
        <Chart data={filtered} />
      </div>

      {/* TABLE */}
      <table className="w-full mt-6 bg-white rounded">
        <thead>
          <tr className="bg-gray-200">
            <th>ID</th>
            <th>Tên</th>
            <th>Tuyến</th>
            <th>Ga</th>
            <th>Hạn</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>{d.line}</td>
              <td>{d.station}</td>
              <td>{d.expiryDate}</td>
              <td>{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}