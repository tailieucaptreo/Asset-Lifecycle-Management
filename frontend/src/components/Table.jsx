import axios from "axios";
import API from "../config";

export default function Table({ data = [], setEditing, reload }) {

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa thiết bị này?")) return;

    try {
      await axios.delete(`${API}/api/devices/${id}`);
      reload();
    } catch (err) {
      alert("❌ Xóa lỗi");
    }
  };

  return (
    <div className="bg-white mt-6 rounded-xl shadow">

      {/* SCROLL CONTAINER */}
      <div className="max-h-[400px] overflow-y-auto overflow-x-auto">

        <table className="w-full text-sm border-collapse">

          {/* STICKY HEADER */}
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Tên</th>
              <th className="p-2">Tuyến</th>
              <th className="p-2">Nhà ga</th>
              <th className="p-2">Ký hiệu</th>
              <th className="p-2">Khu vực</th>
              <th className="p-2">Mã ID</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2">Ngày lắp</th>
              <th className="p-2">Bảo trì</th>
              <th className="p-2">Hết hạn</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr key={d.id} className="border-b hover:bg-gray-50">

                <td className="p-2">{d.id}</td>
                <td className="p-2">{d.name}</td>
                <td className="p-2">{d.line}</td>
                <td className="p-2">{d.station}</td>
                <td className="p-2">{d.code}</td>
                <td className="p-2">{d.area}</td>
                <td className="p-2">{d.deviceId}</td>
                <td className="p-2">{d.status}</td>

                <td className="p-2">
                  {d.installDate
                    ? new Date(d.installDate).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-2">
                  {d.lastMaintenance
                    ? new Date(d.lastMaintenance).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-2">
                  {d.expiryDate
                    ? new Date(d.expiryDate).toLocaleDateString()
                    : "-"}
                </td>

                {/* ACTION */}
                <td className="p-2 flex gap-2">

                  <button
                    onClick={() => setEditing(d)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(d.id)}
                    className="text-red-500 hover:underline"
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
