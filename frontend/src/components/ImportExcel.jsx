import * as XLSX from "xlsx";
import axios from "axios";
import API from "../config";
import { useState } from "react";

export default function ImportExcel() {
  const [loading, setLoading] = useState(false);

  // 🔥 tính ngày hết hạn = ngày lắp + tuổi thọ
  const calculateExpiry = (installDate, lifespan) => {
    if (!installDate || !lifespan) return null;

    const date = new Date(installDate);
    date.setFullYear(date.getFullYear() + Number(lifespan));

    return date.toISOString();
  };

  const handleFile = async (file) => {
    if (!file) return;

    setLoading(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      // 🔥 validate basic
      if (!json.length) {
        alert("File rỗng!");
        return;
      }

      // 🔥 import từng dòng
      for (let row of json) {
        await axios.post(`${API}/api/devices`, {
          name: row["Tên thiết bị"],
          line: row["Tuyến cáp"],
          station: row["Nhà ga"],
          code: row["Ký hiệu"],
          area: row["Khu vực"],
          status: row["Tình trạng"],
          installDate: row["Ngày lắp đặt"]
            ? new Date(row["Ngày lắp đặt"])
            : null,
          deviceId: row["Mã ID"],
          lastMaintenance: row["Ngày BT gần nhất"]
            ? new Date(row["Ngày BT gần nhất"])
            : null,
          lifespan: row["Tuổi thọ thiết bị"]
            ? Number(row["Tuổi thọ thiết bị"])
            : null,
          expiryDate: calculateExpiry(
            row["Ngày lắp đặt"],
            row["Tuổi thọ thiết bị"]
          ),
        });
      }

      alert("✅ Import thành công!");
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

      <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
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
          <p className="mt-2 text-blue-500">Đang import...</p>
        )}
      </div>
    </div>
  );
}