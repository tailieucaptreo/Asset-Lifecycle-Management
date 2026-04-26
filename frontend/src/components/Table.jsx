import axios from "axios";
import API from "../config";

export default function Table({ data, onEdit, onDelete, onSelect }) {

  const formatDate = (d) => {
    if (!d) return "-";
    const date = new Date(d);
    return isNaN(date) ? "-" : date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="mt-6 bg-white rounded shadow overflow-auto max-h-[500px]">

      <table className="w-full text-sm border">

        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Tên</th>
            <th className="p-2 border">Tuyến</th>
            <th className="p-2 border">Nhà ga</th>
            <th className="p-2 border">Mã ID</th>
            <th className="p-2 border">Ngày lắp</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((d) => (
            <tr
              key={d.id}
              className="border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelect(d)}
            >

              <td className="p-2">{d.id}</td>
              <td className="p-2">{d.name}</td>
              <td className="p-2">{d.line}</td>
              <td className="p-2">{d.station}</td>
              <td className="p-2">{d.deviceId}</td>
              <td className="p-2">{formatDate(d.installDate)}</td>

              <td
                className="p-2 space-x-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onEdit(d)}
                  className="text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(d.id)}
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
  );
}
