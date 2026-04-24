import { useState } from "react";
import EditDeviceModal from "./EditDeviceModal";

export default function Table({ data, reload }) {
  const [editing, setEditing] = useState(null);

  return (
    <div className="bg-white mt-6 rounded-xl shadow p-4 overflow-x-auto">

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th>ID</th>
            <th>Tên</th>
            <th>Tuyến</th>
            <th>Nhà ga</th>
            <th>Ký hiệu</th>
            <th>Khu vực</th>
            <th>Mã ID</th>
            <th>Trạng thái</th>
            <th>Ngày lắp</th>
            <th>Bảo trì</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map(d => (
            <tr key={d.id} className="border-b">
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>{d.line}</td>
              <td>{d.station}</td>
              <td>{d.code}</td>
              <td>{d.area}</td>
              <td>{d.deviceId}</td>
              <td>{d.status}</td>
              <td>{d.installDate?.slice(0,10)}</td>
              <td>{d.lastMaintenance?.slice(0,10)}</td>

              <td>
                <button
                  onClick={() => setEditing(d)}
                  className="text-blue-500"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {editing && (
        <EditDeviceModal
          device={editing}
          onClose={() => setEditing(null)}
          onReload={reload}
        />
      )}
    </div>
  );
}
