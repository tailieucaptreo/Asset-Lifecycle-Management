import axios from "axios";
import API from "../config";

export default function Table({ data, setEditing, reload }) {

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa thiết bị?")) return;

    try {
      await axios.delete(`${API}/api/devices/${id}`);
      alert("✅ Đã xoá");
      reload();
    } catch {
      alert("❌ Xoá lỗi");
    }
  };

  return (
    <div className="bg-white mt-6 rounded-xl shadow p-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Tên</th>
            <th>Tuyến</th>
            <th>Nhà ga</th>
            <th>Mã ID</th>
            <th>Trạng thái</th>
            <th>Ngày lắp</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>{d.line}</td>
              <td>{d.station}</td>
              <td>{d.deviceId}</td>
              <td>{d.status}</td>

              <td>
                {d.installDate
                  ? new Date(d.installDate).toLocaleDateString()
                  : "-"}
              </td>

              <td>
                <button onClick={() => setEditing(d)}>Edit</button>
                <button
                  onClick={() => handleDelete(d.id)}
                  className="text-red-500 ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
