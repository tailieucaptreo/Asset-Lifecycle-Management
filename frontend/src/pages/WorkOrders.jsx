import { useEffect, useState } from "react";
import API from "../config";

export default function WorkOrders() {

  const [devices, setDevices] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [form, setForm] = useState({
    deviceId: "",
    title: ""
  });

  // LOAD DATA
  const load = () => {
    fetch(`${API}/api/work-orders`)
      .then(res => res.json())
      .then(setJobs);
  };

  useEffect(() => {
    fetch(`${API}/api/devices`)
      .then(res => res.json())
      .then(setDevices);

    load();
  }, []);

  // ADD
  const handleAdd = async () => {
    if (!form.title) return alert("Nhập tên");

    await fetch(`${API}/api/work-orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm({ deviceId: "", title: "" });
    load();
  };

  // UPDATE
  const updateStatus = async (id, status) => {
    await fetch(`${API}/api/work-orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    load();
  };

  // DELETE
  const remove = async (id) => {
    if (!confirm("Xóa?")) return;

    await fetch(`${API}/api/work-orders/${id}`, {
      method: "DELETE"
    });

    load();
  };

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">🛠 Công việc bảo trì</h1>

      {/* FORM */}
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

      {/* TABLE */}
      <div className="bg-white rounded shadow">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Thiết bị</th>
              <th className="p-2 border">Công việc</th>
              <th className="p-2 border">Trạng thái</th>
              <th className="p-2 border">Ngày tạo</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map(j => (
              <tr key={j.id}>
                <td className="p-2 border">{j.device?.name}</td>

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

                <td className="p-2 border text-center">
                  <button
                    onClick={() => remove(j.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}
