import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";

import {
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Image as ImageIcon
} from "lucide-react";

export default function SpareDevices() {

  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("");

  // ================= LOAD =================
  const fetchData = () => {

    axios
      .get(`${API}/api/spare-devices`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= FILTER =================
  const filtered = data.filter((d) => {

    const keyword = search.toLowerCase();

    return (

      (!filter || d.condition === filter) &&

      (
        (d.name || "")
          .toLowerCase()
          .includes(keyword) ||

        (d.deviceId || "")
          .toLowerCase()
          .includes(keyword) ||

        (d.symbol || "")
          .toLowerCase()
          .includes(keyword)
      )
    );
  });

  // ================= CARD =================
  const total = data.length;

  const newCount = data.filter(
    d => d.condition === "New"
  ).length;

  const usedCount = data.filter(
    d => d.condition === "Used"
  ).length;

  const warehouse =
    data[0]?.warehouse || "Chưa có";

  // ================= DELETE =================
  const handleDelete = async (id) => {

    if (!window.confirm("Xóa thiết bị?")) {
      return;
    }

    try {

      await axios.delete(
        `${API}/api/spare-devices/${id}`
      );

      fetchData();

    } catch (err) {

      console.log(err);

      alert("Xóa lỗi");
    }
  };

  // ================= EXPORT =================
  const handleExport = () => {

    window.open(
      `${API}/api/spare-devices/export`
    );
  };

  // ================= RENDER =================
  return (

    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            🔋 Thiết bị dự phòng
          </h1>

          <p className="text-gray-500 mt-1">
            Quản lý kho thiết bị dự phòng
          </p>

        </div>

        <div className="flex gap-3">

          {/* SEARCH */}
          <div className="relative">

            <Search
              className="
                absolute
                left-3
                top-3
                text-gray-400
              "
              size={18}
            />

            <input
              type="text"
              placeholder="Tìm thiết bị..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                pl-10
                pr-4
                py-2
                rounded-xl
                border
                bg-white
                shadow-sm
                w-64
              "
            />

          </div>

          {/* FILTER */}
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="
              px-4
              py-2
              rounded-xl
              border
              bg-white
            "
          >

            <option value="">
              Tất cả
            </option>

            <option value="New">
              Thiết bị mới
            </option>

            <option value="Used">
              Đã sử dụng
            </option>

            <option value="Broken">
              Hỏng
            </option>

          </select>

          {/* EXPORT */}
          <button
            onClick={handleExport}
            className="
              flex
              items-center
              gap-2
              bg-green-500
              hover:bg-green-600
              text-white
              px-4
              py-2
              rounded-xl
              shadow
            "
          >

            <Download size={18} />

            Export

          </button>

          {/* ADD */}
          <button
            className="
              flex
              items-center
              gap-2
              bg-blue-500
              hover:bg-blue-600
              text-white
              px-4
              py-2
              rounded-xl
              shadow
            "
          >

            <Plus size={18} />

            Thêm mới

          </button>

        </div>

      </div>

      {/* CARD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

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

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <div className="overflow-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr className="text-left">

                <th className="p-4">
                  Hình ảnh
                </th>

                <th className="p-4">
                  Tên thiết bị
                </th>

                <th className="p-4">
                  Ký hiệu
                </th>

                <th className="p-4">
                  Mã ID
                </th>

                <th className="p-4">
                  Tình trạng
                </th>

                <th className="p-4">
                  Kho
                </th>

                <th className="p-4">
                  Tủ
                </th>

                <th className="p-4">
                  Kệ
                </th>

                <th className="p-4">
                  Khay
                </th>

                <th className="p-4">
                  Số lượng
                </th>

                <th className="p-4">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filtered.map((d) => (

                <tr
                  key={d.id}
                  className="
                    border-t
                    hover:bg-gray-50
                    transition
                  "
                >

                  {/* IMAGE */}
                  <td className="p-4">

                    {d.image ? (

                      <img
                        src={d.image}
                        alt=""
                        className="
                          w-14
                          h-14
                          object-cover
                          rounded-lg
                          border
                        "
                      />

                    ) : (

                      <div
                        className="
                          w-14
                          h-14
                          bg-gray-100
                          rounded-lg
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <ImageIcon
                          size={20}
                          className="text-gray-400"
                        />

                      </div>

                    )}

                  </td>

                  {/* NAME */}
                  <td className="p-4 font-semibold">
                    {d.name}
                  </td>

                  {/* SYMBOL */}
                  <td className="p-4">
                    {d.symbol || "-"}
                  </td>

                  {/* DEVICE ID */}
                  <td className="p-4">
                    {d.deviceId || "-"}
                  </td>

                  {/* CONDITION */}
                  <td className="p-4">

                    <span
                      className={`
                        px-3 py-1 rounded-lg text-sm font-medium

                        ${d.condition === "New"
                          ? "bg-green-100 text-green-700"
                          : ""}

                        ${d.condition === "Used"
                          ? "bg-yellow-100 text-yellow-700"
                          : ""}

                        ${d.condition === "Broken"
                          ? "bg-red-100 text-red-700"
                          : ""}
                      `}
                    >

                      {d.condition}

                    </span>

                  </td>

                  {/* LOCATION */}
                  <td className="p-4">
                    {d.warehouse || "-"}
                  </td>

                  <td className="p-4">
                    {d.cabinet || "-"}
                  </td>

                  <td className="p-4">
                    {d.shelf || "-"}
                  </td>

                  <td className="p-4">
                    {d.slot || "-"}
                  </td>

                  {/* QUANTITY */}
                  <td className="p-4 font-bold">
                    {d.quantity || 1}
                  </td>

                  {/* ACTION */}
                  <td className="p-4">

                    <div className="flex gap-3">

                      {/* EDIT */}
                      <button
                        className="
                          text-blue-500
                          hover:text-blue-700
                        "
                      >

                        <Edit size={18} />

                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() =>
                          handleDelete(d.id)
                        }
                        className="
                          text-red-500
                          hover:text-red-700
                        "
                      >

                        <Trash2 size={18} />

                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
