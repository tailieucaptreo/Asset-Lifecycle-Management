import axios from "axios";
import API from "../config";
import { useState } from "react";

export default function ImportExcel({ onDone }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = async (file) => {
    if (!file) return;

    setLoading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `${API}/api/devices/import`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: (p) => {
            if (!p.total) return;
            const percent = Math.round((p.loaded * 100) / p.total);
            setProgress(percent);
          }
        }
      );

      console.log("IMPORT RESULT:", res.data);

      alert(`
✅ Thành công: ${res.data.success}
❌ Lỗi: ${res.data.failed || 0}
📊 Tổng: ${res.data.total}
      `);

      if (onDone) onDone();

    } catch (err) {
      console.error("IMPORT ERROR:", err.response?.data || err);

      alert("❌ Import lỗi - mở Console (F12) xem chi tiết");
    }

    setLoading(false);
    setProgress(0);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-4">

      <h2 className="font-bold text-lg mb-3">
        📥 Import Excel
      </h2>

      <div className="border-2 border-dashed p-6 text-center rounded-lg">

        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => handleFile(e.target.files[0])}
          className="mb-3"
        />

        {/* PROGRESS */}
        {loading && (
          <div className="mt-3">

            <div className="bg-gray-200 h-3 rounded overflow-hidden">
              <div
                className="bg-blue-500 h-3 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-sm mt-1 text-gray-600">
              {progress}% đang upload...
            </p>

          </div>
        )}

      </div>
    </div>
  );
}
