import * as XLSX from "xlsx";
import axios from "axios";
import API from "../config";
import { useState } from "react";

export default function ImportExcel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // ===============================
  // 🧠 AUTO MAP FIELD
  // ===============================
  const mapRow = (row) => {
    const get = (keys) => {
      for (let k of keys) {
        if (row[k] !== undefined) return row[k];
      }
      return null;
    };

    return {
      name: get(["Tên thiết bị", "name"]),
      line: get(["Tuyến", "Line"]),
      station: get(["Nhà ga", "Station"]),
      code: get(["Ký hiệu", "Code"]),
      area: get(["Khu vực", "Area"]),
      deviceId: get(["Mã ID", "ID"]),
      status: get(["Tình trạng", "Status"]) || "Inactive",
      installDate: get(["Ngày lắp đặt"]),
      lastMaintenance: get(["Ngày BT gần nhất"]),
      lifespan: get(["Tuổi thọ thiết bị"]),
    };
  };

  // ===============================
  // 📥 READ FILE
  // ===============================
  const handleFile = async (file) => {
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      if (!json.length) {
        alert("File rỗng");
        return;
      }

      const mapped = json.map(mapRow);
      setRows(mapped);

    } catch (err) {
      console.log(err);
      alert("File lỗi");
    }
  };

  // ===============================
  // 🚀 IMPORT WITH PROGRESS
  // ===============================
  const handleImport = async () => {
    setLoading(true);

    try {
      const chunkSize = 50;

      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize);

        await Promise.all(
          chunk.map((row) =>
            axios.post(`${API}/api/devices`, row)
          )
        );

        setProgress(Math.round(((i + chunk.length) / rows.length) * 100));
      }

      alert("Import xong 🚀");
      window.location.reload();

    } catch (err) {
      console.log(err);
      alert("Import lỗi");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">

      <h2 className="font-bold text-lg mb-3">📥 Import Excel</h2>

      {/* DROP ZONE */}
      <div
        className="border-2 border-dashed p-6 rounded-lg text-center cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        Kéo file vào hoặc chọn file
        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => handleFile(e.target.files[0])}
          className="mt-2"
        />
      </div>

      {/* PREVIEW */}
      {rows.length > 0 && (
        <div className="mt-4 max-h-60 overflow-auto border rounded">
          <table className="w-full text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th>Tên</th>
                <th>Tuyến</th>
                <th>Ga</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 20).map((r, i) => (
                <tr key={i}>
                  <td>{r.name}</td>
                  <td>{r.line}</td>
                  <td>{r.station}</td>
                  <td>{r.deviceId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PROGRESS */}
      {loading && (
        <div className="mt-4">
          <div className="bg-gray-200 h-2 rounded">
            <div
              className="bg-blue-500 h-2 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm mt-1">{progress}%</p>
        </div>
      )}

      {/* BUTTON */}
      {rows.length > 0 && (
        <button
          onClick={handleImport}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          🚀 Import
        </button>
      )}
    </div>
  );
}
