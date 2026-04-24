import axios from "axios";
import API from "../config";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function ImportExcel({ onDone }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // 📥 Đọc file để preview
  const handlePreview = (f) => {
    if (!f) return;

    setFile(f);

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      setPreview(json.slice(0, 20)); // 🔥 chỉ preview 20 dòng
    };

    reader.readAsArrayBuffer(f);
  };

  // 🚀 Import thật
  const handleImport = async () => {
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
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (p) => {
            if (!p.total) return;
            const percent = Math.round((p.loaded * 100) / p.total);
            setProgress(percent);
          }
        }
      );

      alert(`
✅ Thành công: ${res.data.success}
❌ Lỗi: ${res.data.failed}
📊 Tổng: ${res.data.total}
      `);

      setFile(null);
      setPreview([]);

      if (onDone) onDone();

    } catch (err) {
      console.error(err);
      alert("❌ Import lỗi - xem console");
    }

    setLoading(false);
    setProgress(0);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-4">

      <h2 className="font-bold text-lg mb-3">
        📥 Import Excel (Preview trước)
      </h2>

      {/* CHỌN FILE */}
      <div className="border-2 border-dashed p-6 text-center rounded-lg">

        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => handlePreview(e.target.files[0])}
        />

      </div>

      {/* PREVIEW TABLE */}
      {preview.length > 0 && (
        <div className="mt-4 overflow-auto max-h-[300px] border rounded">

          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(preview[0]).map((k) => (
                  <th key={k} className="p-2 text-left">
                    {k}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {preview.map((row, i) => (
                <tr key={i} className="border-b">
                  {Object.values(row).map((v, j) => (
                    <td key={j} className="p-2">
                      {v?.toString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}

      {/* PROGRESS */}
      {loading && (
        <div className="mt-3">
          <div className="bg-gray-200 h-3 rounded">
            <div
              className="bg-blue-500 h-3"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p>{progress}%</p>
        </div>
      )}

      {/* BUTTON IMPORT */}
      {file && !loading && (
        <button
          onClick={handleImport}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          🚀 Xác nhận Import
        </button>
      )}

    </div>
  );
}
