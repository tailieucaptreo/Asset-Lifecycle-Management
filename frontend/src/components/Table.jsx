import axios from "axios";
import API from "../config";

export default function Table({ data, onEdit, onDelete, onSelect }) {

  const formatDate = (d) => {
    if (!d) return "-";
    const date = new Date(d);
    return isNaN(date) ? "-" : date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="overflow-auto rounded-lg shadow bg-white">

      <table className="w-full text-sm border-collapse">

        {/* ================= HEADER ================= */}
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="p-2 border">Tên</th>
            <th className="p-2 border">Tuyến</th>
            <th className="p-2 border">Nhà ga</th>
            <th className="p-2 border">Trạng thái</th>
            <th className="p-2 border">Ký hiệu</th>
            <th className="p-2 border">Khu vực</th>
            <th className="p-2 border">Mã ID</th>
            <th className="p-2 border">Ngày lắp</th>
            <th className="p-2 border">Tuổi thọ thiết bị</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        {/* ================= BODY ================= */}
        <tbody>

          {/* EMPTY */}
          {data.length === 0 && (
            <tr>
              <td colSpan="10" className="text-center p-4 text-gray-500">
                Không có dữ liệu
              </td>
            </tr>
          )}

          {data.map((d, i) => (
            <tr key={d.id || i} className="hover:bg-gray-50 transition">

              {/* TÊN */}
              <td className="p-2 border font-medium">
                {d.name || "-"}
              </td>

              {/* TUYẾN */}
              <td className="p-2 border">
                {d.line || "-"}
              </td>

              {/* NHÀ GA */}
              <td className="p-2 border">
                {d.station || "-"}
              </td>

              {/* STATUS */}
              <td className="p-2 border">
                <span
                  className={`px-2 py-1 rounded text-white text-xs
                    ${
                      d.status === "Active"
                        ? "bg-green-500"
                        : d.status === "Maintenance"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }
                  `}
                >
                  {d.status || "N/A"}
                </span>
              </td>

              {/* KÝ HIỆU */}
              <td className="p-2 border">
                {d.code || "-"}
              </td>

              {/* KHU VỰC */}
              <td className="p-2 border">
                {d.area || "-"}
              </td>

              {/* MÃ ID */}
              <td className="p-2 border">
                {d.deviceId || "-"}
              </td>

              {/* NGÀY LẮP */}
              <td className="p-2 border">
                {d.installDate
                  ? new Date(d.installDate).toLocaleDateString("vi-VN")
                  : "-"}
              </td>

              {/* TUỔI THỌ */}
              <td className="p-2 border">
                {d.lifespan || "-"}
              </td>

              {/* ACTION */}
              <td className="p-2 border">
                <button className="text-blue-500 hover:underline mr-2">
                  Edit
                </button>

                <button className="text-red-500 hover:underline">
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
