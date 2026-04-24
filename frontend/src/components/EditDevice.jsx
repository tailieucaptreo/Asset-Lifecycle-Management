import axios from "axios";
import API from "../config";
import { useState } from "react";

export default function EditDevice({ device, onClose }) {
  const [form, setForm] = useState(device);

  const save = async () => {
    await axios.post(`${API}/api/devices`, form);
    alert("Đã cập nhật");
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

      <div className="bg-white p-6 rounded w-[400px]">

        <h2 className="font-bold mb-3">✏️ Edit thiết bị</h2>

        <input
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full mb-2"
        />

        <input
          value={form.line || ""}
          onChange={(e) => setForm({ ...form, line: e.target.value })}
          className="border p-2 w-full mb-2"
        />

        <button
          onClick={save}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Lưu
        </button>

        <button onClick={onClose} className="ml-2">
          Đóng
        </button>
      </div>
    </div>
  );
}
