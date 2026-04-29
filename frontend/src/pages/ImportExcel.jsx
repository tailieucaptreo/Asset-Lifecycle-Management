import axios from "axios";
import API from "../config";
import { useState } from "react";
import * as XLSX from "xlsx";

// 🔥 FORMAT DATE CHỈ DÙNG CHO FIELD NGÀY
const formatDate = (v) => {
  if (!v) return "";

  // Excel serial number
  if (typeof v === "number" && v > 30000) {
    const d = new Date((v - 25569) * 86400000);
    return d.toLocaleDateString("vi-VN");
  }

  // string date
  const d = new Date(v);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString("vi-VN");
  }

  return v;
};

// 🔥 CHỈ XÁC ĐỊNH CỘT NGÀY
const isDateField = (key) => {
  const k = key.toLowerCase();
  return (
    k.includes("ngày") ||
    k.includes("date") ||
    k.includes("lắp") 
  );
};

export default function ImportExcel({ onDone }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // 📥 PREVIEW FILE
  const handlePreview = (f) => {
    if (!f) return;

    setFile(f);

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);

      const workbook = XLSX.read(data, {
        type: "array",
        cellDates: true
      });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const json = XLSX.utils.sheet_to_json(sheet, {
        raw: true,      // 🔥 QUAN TRỌNG (không auto convert sai)
        defval: ""
      });

      setPreview(json.slice(0, 20));
    };

    reader.readAsArrayBuffer(f);
  };

  // 🚀 IMPORT
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
      console.error("IMPORT ERROR:", err.response?.data || err);
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

      {/* SELECT FILE */}
      <div className="border-2 border-dashed p-6 text-center rounded-lg hover:bg-gray-50 transition">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => handlePreview(e.target.files[0])}
        />
      </div>

      {/* PREVIEW */}
      {preview.length > 0 && (
        <div className="mt-4 border rounded max-h-[350px] overflow-auto">

          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {Object.keys(preview[0]).map((k) => (
                  <th key={k} className="p-2 border text-left">
                    {k}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {preview.map((row, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">

                  {Object.entries(row).map(([key, value], j) => (
                    <td key={j} className="p-2 border text-gray-700">

                      {/* 🔥 CHỈ FORMAT DATE ĐÚNG CỘT */}
                      {isDateField(key)
                        ? formatDate(value)
                        : value}

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
          <div className="bg-gray-200 h-3 rounded overflow-hidden">
            <div
              className="bg-blue-500 h-3 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm mt-1">{progress}% đang upload...</p>
        </div>
      )}

      {/* IMPORT BUTTON */}
      {file && !loading && (
        <button
          onClick={handleImport}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
        >
          🚀 Xác nhận Import
        </button>
      )}

    </div>
  );
}
