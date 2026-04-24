import axios from "axios";
import API from "../config";
import { useState } from "react";

export default function ImportExcel({ onDone }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

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
          onUploadProgress: (p) => {
            const percent = Math.round((p.loaded * 100) / p.total);
            setProgress(percent);
          }
        }
      );

      console.log("IMPORT RESULT:", res.data);

      alert(`✅ Thành công: ${res.data.success}
❌ Lỗi: ${res.data.failed.length}`);

      if (onDone) onDone();

    } catch (err) {
      console.error("IMPORT ERROR:", err.response?.data || err);
      alert("❌ Import lỗi - xem console");
    }

    setLoading(false);
    setProgress(0);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-4">

      <h2 className="font-bold text-lg mb-2">📥 Import Excel</h2>

      <div className="border-2 border-dashed p-6 text-center rounded-lg">

        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {loading && (
          <div className="mt-3">
            <div className="bg-gray-200 h-2 rounded">
              <div
                className="bg-blue-500 h-2 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p>{progress}%</p>
          </div>
        )}

      </div>
    </div>
  );
}
