export default function Header({ onSearch }) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow mb-6">

      <input
        placeholder="Tìm thiết bị..."
        className="border p-2 rounded w-1/3"
        onChange={(e) => onSearch(e.target.value)}
      />

      <div className="flex items-center gap-3">
        <span>Admin</span>
        <img src="https://i.pravatar.cc/40" className="rounded-full" />
      </div>
    </div>
  );
}