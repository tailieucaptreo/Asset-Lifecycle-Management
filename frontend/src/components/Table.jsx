export default function Table({ data }) {
  return (
    <div className="bg-white mt-6 rounded-xl shadow p-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Tên thiết bị</th>
            <th className="p-2">Tuyến</th>
            <th className="p-2">Nhà ga</th>
            <th className="p-2">Ký hiệu</th>
            <th className="p-2">Khu vực</th>
            <th className="p-2">Mã ID</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2">Ngày lắp</th>
            <th className="p-2">Bảo trì</th>
            <th className="p-2">Hết hạn</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}