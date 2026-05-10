import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";

export default function SpareDevices() {

  const [data, setData] = useState([]);

  // ================= LOAD =================
  useEffect(() => {

    axios
      .get(`${API}/api/spare-devices`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  // ================= CARD =================
  const total = data.length;

  const newCount = data.filter(
    d => d.condition === "New"
  ).length;

  const usedCount = data.filter(
    d => d.condition === "Used"
  ).length;

  // 🔥 LẤY KHO ĐẦU TIÊN
  const warehouse =
    data[0]?.warehouse || "Chưa có";

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-8">
        🔋 Thiết bị dự phòng
      </h1>

      {/* CARD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

        {/* TOTAL */}
        <div className="bg-white rounded-2xl shadow p-5">

          <p className="text-gray-500">
            Tổng thiết bị
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {total}
          </h2>

        </div>

        {/* NEW */}
        <div className="bg-green-500 text-white rounded-2xl shadow p-5">

          <p>Thiết bị mới</p>

          <h2 className="text-4xl font-bold mt-2">
            {newCount}
          </h2>

        </div>

        {/* USED */}
        <div className="bg-yellow-500 text-white rounded-2xl shadow p-5">

          <p>Đã sử dụng</p>

          <h2 className="text-4xl font-bold mt-2">
            {usedCount}
          </h2>

        </div>

        {/* WAREHOUSE */}
        <div className="bg-blue-500 text-white rounded-2xl shadow p-5">

          <p>Kho lưu trữ</p>

          <h2 className="text-2xl font-bold mt-2">
            {warehouse}
          </h2>

        </div>

      </div>

    </div>
  );
}
