import axios from "axios";
import API from "../config";
import { useState } from "react";

export default function ImportExcel({ onDone }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");

  const handleFile = async (file) => {
    if (!file) return;

    // 🛡 validate file
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      alert("❌ Chỉ hỗ trợ file Excel (.xlsx, .xls)");
      return;
    }

    setFileName(file.name);
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
          timeout: 1000 * 60 * 5, // 🧠 chống timeout (file lớn)
          onUploadProgress: (p) => {
            if (!p.total) return;
            const percent = Math.round((p.loaded * 100) / p.total);
            setProgress(percent);
          }
        }
      );

      console.log("IMPORT RESULT:", res.data);

      const { success = 0, failed = 0, total = 0 } = res.data;

      alert(`
✅ Thành công: ${success}
❌ Lỗi: ${failed}
📊 Tổng: ${total}
      `);

      // 🔄 reload data
      if (onDone) onDone();

    } catch (err) {
      console.error("IMPORT ERROR FULL:", err);

      if (err.response) {
        console.error("SERVER ERROR:", err.response.data);
        alert(`❌ Server lỗi: ${err.response.data?.error || "Unknown"}`);
      } else {
        alert("❌ Không kết nối được server");
      }
    }

    setLoading(false);
    setProgress(0);
    setFileName("");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-4">

      <h2 className="font-bold text-lg mb-3">
        📥 Import Excel
      </h2>

      {/* DROP ZONE */}
      <label className="border-2 border-dashed p-6 text-center rounded-lg block cursor-pointer hover:bg-gray-50 transition">

        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => handleFile(e.target.files[0])}
          className="hidden"
        />

        <p className="text-gray-600">
          📂 Click để chọn file hoặc kéo thả vào đây
        </p>

        {fileName && (
          <p className="mt-2 text-blue-500 text-sm">
            📄 {fileName}
          </p>
        )}

      </label>

      {/* PROGRESS */}
      {loading && (
        <div className="mt-4">

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
  );
}
