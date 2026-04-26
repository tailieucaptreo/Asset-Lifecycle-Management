import { useEffect, useState } from "react";
import API from "../config";

export default function WorkOrders() {

  const [devices, setDevices] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [form, setForm] = useState({
    deviceId: "",
    title: "",
    status: "Pending"
  });

  // ================= LOAD DEVICES =================
  useEffect(() => {
    fetch(`${API}/api/devices`)
      .then(res => res.json())
      .then(setDevices);
  }, []);

  // ================= ADD JOB =================
  const handleAdd = () => {
    if (!form.title) return alert("Nhập tên công việc");

    const newJob = {
      id: Date.now(),
      ...form,
      createdAt: new Date()
    };

    setJobs([newJob, ...jobs]);

    setForm({
      deviceId: "",
      title: "",
      status: "Pending"
    });
  };

  // ================= UPDATE STATUS =================
  const updateStatus = (id, status) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status } : j));
  };

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">🛠 Công việc bảo trì</h1>

      {/* ================= FORM ================= */}
      <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-3 gap-3">

        <select
          className="border p-2"
          value={form.deviceId}
          onChange={(e) => setForm({ ...form, deviceId: e.target.value })}
        >
          <option value="">Chọn thiết bị</option>
          {devices.map(d => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Tên công việc"
          className="border p-2"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white rounded"
        >
          + Tạo
        </button>

      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded shadow">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Thiết bị</th>
              <th className="p-2 border">Công việc</th>
              <th className="p-2 border">Trạng thái</th>
              <th className="p-2 border">Ngày tạo</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map(j => {
              const device = devices.find(d => d.id == j.deviceId);

              return (
                <tr key={j.id}>
                  <td className="p-2 border">{device?.name || "-"}</td>

                  <td className="p-2 border">{j.title}</td>

                  <td className="p-2 border">
                    <select
                      value={j.status}
                      onChange={(e) => updateStatus(j.id, e.target.value)}
                      className="border p-1"
                    >
                      <option>Pending</option>
                      <option>Doing</option>
                      <option>Done</option>
                    </select>
                  </td>

                  <td className="p-2 border">
                    {new Date(j.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>

      </div>

    </div>
  );
}
