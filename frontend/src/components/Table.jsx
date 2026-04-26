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
        (!filters.name || d.name?.toLowerCase().includes(filters.name)) &&
        (!filters.station || d.station?.toLowerCase().includes(filters.station)) &&
        (!filters.status || d.status?.includes(filters.status))
      );
    });
  }, [data, filters]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm("Xóa thiết bị?")) return;

    await fetch(`${API}/api/devices/${id}`, { method: "DELETE" });
    reload();
  };

  // ================= EDIT =================
  const openEdit = (d) => {
    setEditing(d);
    setForm(d);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    await fetch(`${API}/api/devices/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setEditing(null);
    reload();
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-auto">

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">

          {/* FILTER */}
          <tr>
            <th><input placeholder="Tên" onChange={e=>setFilters({...filters,name:e.target.value})}/></th>
            <th></th>
            <th><input placeholder="Ga" onChange={e=>setFilters({...filters,station:e.target.value})}/></th>
            <th>
              <select onChange={e=>setFilters({...filters,status:e.target.value})}>
                <option value="">All</option>
                <option>Active</option>
                <option>Maintenance</option>
                <option>Inactive</option>
              </select>
            </th>
            <th colSpan="6"></th>
          </tr>

          {/* HEADER */}
          <tr>
            <th>Tên</th>
            <th>Tuyến</th>
            <th>Nhà ga</th>
            <th>Trạng thái</th>
            <th>Ký hiệu</th>
            <th>Khu vực</th>
            <th>Mã ID</th>
            <th>Ngày lắp</th>
            <th>Tuổi thọ</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>
          {filteredData.map(d => (
            <tr key={d.id}>

              <td>{d.name}</td>
              <td>{d.line}</td>
              <td>{d.station}</td>

              <td>
                <span className={
                  d.status === "Active"
                    ? "text-green-600"
                    : d.status === "Maintenance"
                    ? "text-yellow-600"
                    : "text-gray-500"
                }>
                  {d.status}
                </span>
              </td>

              <td>{d.code}</td>
              <td>{d.area}</td>
              <td>{d.deviceId}</td>

              <td>
                {d.installDate
                  ? new Date(d.installDate).toLocaleDateString()
                  : ""}
              </td>

              <td>{d.lifespan}</td>

              <td>
                <button onClick={()=>openEdit(d)}>Edit</button>
                <button onClick={()=>handleDelete(d.id)}>Delete</button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">

            <h2>Edit</h2>

            <input name="name" value={form.name} onChange={handleChange}/>
            <input name="station" value={form.station} onChange={handleChange}/>

            <select name="status" value={form.status} onChange={handleChange}>
              <option>Active</option>
              <option>Maintenance</option>
              <option>Inactive</option>
            </select>

            <div className="mt-3">
              <button onClick={()=>setEditing(null)}>Cancel</button>
              <button onClick={handleUpdate}>Save</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
