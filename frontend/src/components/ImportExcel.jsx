import axios from "axios";
import API from "../config";
import { useState } from "react";

export default function ImportExcel() {
  const [loading, setLoading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `${API}/api/devices/import`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log(res.data);

      alert(`✅ Import OK: ${res.data.success}/${res.data.total}`);

      window.location.reload();

    } catch (err) {
      console.error(err);
      alert("❌ Import lỗi!");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-4">
      <h2 className="font-bold text-lg mb-2">📥 Import Excel</h2>

      <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center hover:border-blue-400 transition">
        <p className="mb-2 text-gray-600">
          Kéo file Excel vào hoặc chọn file
        </p>

        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => handleFile(e.target.files[0])}
          className="mx-auto"
        />

        {loading && (
          <p className="mt-2 text-blue-500">⏳ Đang import...</p>
        )}
      </div>
    </div>
  );
}