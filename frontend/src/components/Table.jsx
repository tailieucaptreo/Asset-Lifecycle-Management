export default function Table({ data }) {
  const now = new Date();

  return (
    <div className="bg-white p-4 md:p-5 rounded-2xl shadow mt-6">

      <h2 className="font-bold mb-4">📋 Danh sách thiết bị</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm md:text-base">

          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Tên</th>
              <th className="p-3 text-left">Tuyến</th>
              <th className="p-3 text-left">Ga</th>
              <th className="p-3 text-left">Hạn</th>
              <th className="p-3 text-left">Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d, i) => {
              const expired = new Date(d.expiryDate) < now;

              return (
                <tr key={i} className="border-b hover:bg-gray-50">

                  <td className="p-3">{d.id}</td>

                  <td className="p-3 font-medium">{d.name}</td>

                  <td className="p-3">{d.line}</td>

                  <td className="p-3">{d.station}</td>

                  <td className="p-3">
                    {new Date(d.expiryDate).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    {expired ? (
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs md:text-sm">
                        Hết hạn
                      </span>
                    ) : d.status === "Maintenance" ? (
                      <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs md:text-sm">
                        Bảo trì
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs md:text-sm">
                        Hoạt động
                      </span>
                    )}
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
}