import { useState, useMemo } from "react";
import API from "../config";

export default function Table({ data = [], reload }) {

  const [filters, setFilters] = useState({});
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  // ================= FILTER =================
  const filteredData = useMemo(() => {
    return data.filter(d => {
      return (
        (!filters.name || d.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.station || d.station?.toLowerCase().includes(filters.station.toLowerCase())) &&
        (!filters.status || d.status === filters.status)
      );
    });
  }, [data, filters]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm("Xóa thiết bị này?")) return;

    try {
      await fetch(`${API}/api/devices/${id}`, {
        method: "DELETE"
      });

      reload && reload();

    } catch {
      alert("Xóa lỗi");
    }
  };

  // ================= EDIT =================
  const openEdit = (d) => {
    setEditing(d);
    setForm(d);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    try {
      await fetch(`${API}/api/devices/update/${editing.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      setEditing(null);
      reload && reload();

    } catch {
      alert("Update lỗi");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow">

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full text-sm border border-gray-200">

          {/* FILTER */}
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>

              <th className="p-2">
                <input
                  placeholder="Tên"
                  className="border p-1 w-full"
                  onChange={(e) =>
                    setFilters({ ...filters, name: e.target.value })
                  }
                />
              </th>

              <th></th>

              <th className="p-2">
                <input
                  placeholder="Nhà ga"
                  className="border p-1 w-full"
                  onChange={(e) =>
                    setFilters({ ...filters, station: e.target.value })
                  }
                />
              </th>

              <th className="p-2">
                <select
                  className="border p-1 w-full"
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="">All</option>
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </th>

              <th colSpan="6"></th>
            </tr>

            {/* HEADER */}
            <tr className="text-left text-gray-700">

              <th className="p-3 w-[220px]">Tên</th>
              <th className="p-3 w-[60px] text-center">Tuyến</th>
              <th className="p-3 w-[120px]">Nhà ga</th>
              <th className="p-3 w-[120px]">Trạng thái</th>
              <th className="p-3 w-[90px]">Ký hiệu</th>
              <th className="p-3 w-[120px]">Khu vực</th>
              <th className="p-3 w-[130px]">Mã ID</th>
              <th className="p-3 w-[110px]">Ngày lắp</th>
              <th className="p-3 w-[80px] text-center">Tuổi thọ</th>
              <th className="p-3 w-[120px] text-center">Action</th>

            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {filteredData.map((d) => (
              <tr key={d.id} className="border-t hover:bg-gray-50">

                <td className="p-3 font-medium">{d.name}</td>

                <td className="p-3 text-center">{d.line}</td>

                <td className="p-3">{d.station}</td>

                {/* STATUS */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold
                    ${d.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : d.status === "Maintenance"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>

                <td className="p-3">{d.code || "-"}</td>

                <td className="p-3">{d.area || "-"}</td>

                <td className="p-3 font-mono">{d.deviceId}</td>

                <td className="p-3">
                  {d.installDate
                    ? new Date(d.installDate).toLocaleDateString("vi-VN")
                    : "-"}
                </td>

                <td className="p-3 text-center">{d.lifespan || "-"}</td>

                {/* ACTION */}
                <td className="p-3 text-center space-x-2">

                  <button
                    onClick={() => openEdit(d)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(d.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ================= MODAL ================= */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-xl w-[600px] shadow-lg">

            <h2 className="font-bold mb-4 text-lg">
              ✏️ Chỉnh sửa thiết bị
            </h2>

            {/* GRID */}
            <div className="grid grid-cols-2 gap-3">

              <input name="name" value={form.name || ""} onChange={handleChange}
                className="col-span-2 p-2 border rounded" placeholder="Tên thiết bị" />

              <input name="line" value={form.line || ""} onChange={handleChange}
                className="p-2 border rounded" placeholder="Tuyến" />

              <input name="station" value={form.station || ""} onChange={handleChange}
                className="p-2 border rounded" placeholder="Nhà ga" />

              <input name="code" value={form.code || ""} onChange={handleChange}
                className="p-2 border rounded" placeholder="Ký hiệu" />

              <input name="area" value={form.area || ""} onChange={handleChange}
                className="p-2 border rounded" placeholder="Khu vực" />

              <input name="deviceId" value={form.deviceId || ""} onChange={handleChange}
                className="col-span-2 p-2 border rounded" placeholder="Mã ID" />

              <select name="status" value={form.status || ""} onChange={handleChange}
                className="p-2 border rounded">
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>

              <input type="number" name="lifespan" value={form.lifespan || ""}
                onChange={handleChange}
                className="p-2 border rounded"
                placeholder="Tuổi thọ (năm)" />

              <input
                type="date"
                name="installDate"
                value={
                  form.installDate
                    ? new Date(form.installDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleChange}
                className="col-span-2 p-2 border rounded"
              />

            </div>

            {/* BUTTON */}
            <div className="flex justify-end gap-2 mt-5">

              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Hủy
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Lưu
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
