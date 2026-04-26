import axios from "axios";
import API from "../config";

export default function Table({ data = [] }) {

  const [filters, setFilters] = useState({
    name: "",
    line: "",
    station: "",
    status: "",
    deviceId: ""
  });

  // ================= FILTER LOGIC =================
  const filteredData = useMemo(() => {
    return data.filter(d => {

      return (
        (!filters.name ||
          d.name?.toLowerCase().includes(filters.name.toLowerCase())) &&

        (!filters.line ||
          String(d.line).includes(filters.line)) &&

        (!filters.station ||
          d.station?.toLowerCase().includes(filters.station.toLowerCase())) &&

        (!filters.status ||
          d.status?.toLowerCase().includes(filters.status.toLowerCase())) &&

        (!filters.deviceId ||
          String(d.deviceId).includes(filters.deviceId))
      );

    });
  }, [data, filters]);

  // ================= UI =================
  return (
    <div className="bg-white rounded-lg shadow overflow-auto">

      <table className="w-full text-sm border-collapse">

        {/* ================= HEADER ================= */}
        <thead className="bg-gray-100 sticky top-0 z-10">

          {/* FILTER ROW */}
          <tr>
            <th className="p-1 border">
              <input
                placeholder="Tên..."
                className="w-full p-1 border rounded"
                onChange={e =>
                  setFilters({ ...filters, name: e.target.value })
                }
              />
            </th>

            <th className="p-1 border">
              <input
                placeholder="Tuyến"
                className="w-full p-1 border rounded"
                onChange={e =>
                  setFilters({ ...filters, line: e.target.value })
                }
              />
            </th>

            <th className="p-1 border">
              <input
                placeholder="Nhà ga"
                className="w-full p-1 border rounded"
                onChange={e =>
                  setFilters({ ...filters, station: e.target.value })
                }
              />
            </th>

            <th className="p-1 border">
              <select
                className="w-full p-1 border rounded"
                onChange={e =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
            </th>

            <th className="p-1 border"></th>
            <th className="p-1 border"></th>

            <th className="p-1 border">
              <input
                placeholder="Mã ID"
                className="w-full p-1 border rounded"
                onChange={e =>
                  setFilters({ ...filters, deviceId: e.target.value })
                }
              />
            </th>

            <th className="p-1 border"></th>
            <th className="p-1 border"></th>
            <th className="p-1 border"></th>
          </tr>

          {/* HEADER LABEL */}
          <tr>
            <th className="p-2 border">Tên</th>
            <th className="p-2 border">Tuyến</th>
            <th className="p-2 border">Nhà ga</th>
            <th className="p-2 border">Trạng thái</th>
            <th className="p-2 border">Ký hiệu</th>
            <th className="p-2 border">Khu vực</th>
            <th className="p-2 border">Mã ID</th>
            <th className="p-2 border">Ngày lắp</th>
            <th className="p-2 border">Tuổi thọ</th>
            <th className="p-2 border">Action</th>
          </tr>

        </thead>

        {/* ================= BODY ================= */}
        <tbody>

          {filteredData.length === 0 && (
            <tr>
              <td colSpan="10" className="text-center p-4 text-gray-500">
                Không có dữ liệu
              </td>
            </tr>
          )}

          {filteredData.map((d, i) => (
            <tr key={i} className="hover:bg-gray-50">

              <td className="p-2 border">{d.name}</td>
              <td className="p-2 border">{d.line}</td>
              <td className="p-2 border">{d.station}</td>

              {/* STATUS */}
              <td className="p-2 border">
                <span className={`px-2 py-1 rounded text-white text-xs
                  ${d.status === "Active"
                    ? "bg-green-500"
                    : d.status === "Maintenance"
                    ? "bg-yellow-500"
                    : "bg-gray-400"}
                `}>
                  {d.status || "N/A"}
                </span>
              </td>

              <td className="p-2 border">{d.code || "-"}</td>
              <td className="p-2 border">{d.area || "-"}</td>
              <td className="p-2 border">{d.deviceId || "-"}</td>

              <td className="p-2 border">
                {d.installDate
                  ? new Date(d.installDate).toLocaleDateString("vi-VN")
                  : "-"}
              </td>

              <td className="p-2 border">{d.lifespan || "-"}</td>

              <td className="p-2 border">
                <button className="text-blue-500 mr-2">Edit</button>
                <button className="text-red-500">Delete</button>
              </td>

            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );
}
