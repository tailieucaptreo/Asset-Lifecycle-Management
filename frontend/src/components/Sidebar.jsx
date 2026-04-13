export default function Sidebar() {
  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Quản lý thiết bị</h2>

      <ul className="space-y-3">
        <li className="bg-blue-600 p-2 rounded">Dashboard</li>
        <li className="hover:bg-blue-700 p-2 rounded">Tất cả thiết bị</li>
        <li className="hover:bg-blue-700 p-2 rounded">Import Excel</li>
        <li className="hover:bg-blue-700 p-2 rounded">Quá hạn</li>
      </ul>
    </div>
  );
}