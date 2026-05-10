import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";

import {
  Plus,
  Search,
  Download,
  Trash2,
  Pencil,
  Package
} from "lucide-react";

export default function SpareDevices() {

  // ================= STATE =================
  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    deviceId: "",
    symbol: "",

    condition: "New",

    warehouse: "",
    cabinet: "",
    shelf: "",
    slot: "",

    quantity: 1,

    image: ""
  });

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
      (filter === "All" || d.condition === filter) &&
      (
        (d.name || "")
          .toLowerCase()
          .includes(keyword) ||

        (d.deviceId || "")
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

  // ================= CREATE =================
  const handleCreate = async () => {

    try {

      await axios.post(
        `${API}/api/spare-devices`,
        form
      );

      setShowModal(false);

      setForm({
        name: "",
        deviceId: "",
        symbol: "",

        condition: "New",

        warehouse: "",
        cabinet: "",
        shelf: "",
        slot: "",

        quantity: 1,

        image: ""
      });

      fetchData();

    } catch (err) {

      console.log(err);

      alert("❌ Thêm thiết bị lỗi");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {

    if (!window.confirm("Xóa thiết bị này?")) {
      return;
    }

    try {

      await axios.delete(
        `${API}/api/spare-devices/${id}`
      );

      fetchData();

    } catch (err) {

      console.log(err);

      alert("❌ Xóa lỗi");
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

      {/* ================= HEADER ================= */}
      <div className="
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-4
        mb-6
      ">

        <div>

          <h1 className="
            text-4xl
            font-bold
            flex
            items-center
            gap-3
          ">
            🔋 Thiết bị dự phòng
          </h1>

          <p className="text-gray-500 mt-2">
            Quản lý kho thiết bị dự phòng
          </p>

        </div>

        {/* SEARCH */}
        <div className="
          flex
          flex-col
          md:flex-row
          gap-3
        ">

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
                py-3
                rounded-xl
                border
                w-[250px]
                bg-white
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
              py-3
              rounded-xl
              border
              bg-white
            "
          >

            <option value="All">
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
              bg-green-500
              hover:bg-green-600
              text-white
              px-5
              py-3
              rounded-xl
              flex
              items-center
              gap-2
              shadow
            "
          >
            <Download size={18} />
            Export
          </button>

          {/* CREATE */}
          <button
            onClick={() => setShowModal(true)}
            className="
              bg-blue-500
              hover:bg-blue-600
              text-white
              px-5
              py-3
              rounded-xl
              flex
              items-center
              gap-2
              shadow
            "
          >
            <Plus size={18} />
            Thêm mới
          </button>

        </div>

      </div>

      {/* ================= CARD ================= */}
      <div className="
        grid
        grid-cols-2
        lg:grid-cols-4
        gap-5
        mb-8
      ">

        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
        ">

          <p className="text-gray-500">
            Tổng thiết bị
          </p>

          <h2 className="
            text-5xl
            font-bold
            mt-3
          ">
            {total}
          </h2>

        </div>

        <div className="
          bg-green-500
          text-white
          rounded-2xl
          shadow
          p-6
        ">

          <p>Thiết bị mới</p>

          <h2 className="
            text-5xl
            font-bold
            mt-3
          ">
            {newCount}
          </h2>

        </div>

        <div className="
          bg-yellow-500
          text-white
          rounded-2xl
          shadow
          p-6
        ">

          <p>Đã sử dụng</p>

          <h2 className="
            text-5xl
            font-bold
            mt-3
          ">
            {usedCount}
          </h2>

        </div>

        <div className="
          bg-blue-500
          text-white
          rounded-2xl
          shadow
          p-6
        ">

          <p>Kho lưu trữ</p>

          <h2 className="
            text-3xl
            font-bold
            mt-3
          ">
            {warehouse}
          </h2>

        </div>

      </div>

      {/* ================= TABLE ================= */}
      <div className="
        bg-white
        rounded-2xl
        shadow
        overflow-auto
      ">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr className="text-left">

              <th className="p-4">Hình ảnh</th>
              <th className="p-4">Tên thiết bị</th>
              <th className="p-4">Mã ID</th>
              <th className="p-4">Tình trạng</th>

              <th className="p-4">Kho</th>
              <th className="p-4">Tủ</th>
              <th className="p-4">Kệ</th>
              <th className="p-4">Ô</th>

              <th className="p-4">Số lượng</th>

              <th className="p-4 text-center">
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
                        rounded-xl
                        object-cover
                        border
                      "
                    />

                  ) : (

                    <div className="
                      w-14
                      h-14
                      rounded-xl
                      bg-gray-100
                      flex
                      items-center
                      justify-center
                    ">
                      <Package />
                    </div>

                  )}

                </td>

                {/* NAME */}
                <td className="p-4 font-semibold">
                  {d.name}
                </td>

                {/* ID */}
                <td className="p-4">
                  {d.deviceId}
                </td>

                {/* CONDITION */}
                <td className="p-4">

                  <span className={`
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
                  `}>

                    {d.condition === "New" &&
                      "Mới"}

                    {d.condition === "Used" &&
                      "Đã sử dụng"}

                    {d.condition === "Broken" &&
                      "Hỏng"}

                  </span>

                </td>

                {/* LOCATION */}
                <td className="p-4">
                  {d.warehouse}
                </td>

                <td className="p-4">
                  {d.cabinet}
                </td>

                <td className="p-4">
                  {d.shelf}
                </td>

                <td className="p-4">
                  {d.slot}
                </td>

                {/* QTY */}
                <td className="p-4 font-bold">
                  {d.quantity}
                </td>

                {/* ACTION */}
                <td className="
                  p-4
                  flex
                  justify-center
                  gap-3
                ">

                  <button
                    className="
                      text-blue-500
                      hover:text-blue-700
                    "
                  >
                    <Pencil size={18} />
                  </button>

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

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* ================= MODAL ================= */}
      {showModal && (

        <div className="
          fixed
          inset-0
          bg-black/40
          flex
          items-center
          justify-center
          z-50
        ">

          <div className="
            bg-white
            rounded-3xl
            p-8
            w-full
            max-w-3xl
            shadow-2xl
          ">

            <h2 className="
              text-3xl
              font-bold
              mb-8
            ">
              ➕ Thêm thiết bị dự phòng
            </h2>

            <div className="
              grid
              grid-cols-2
              gap-5
            ">

              <input
                placeholder="Tên thiết bị"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
                className="
                  border
                  rounded-xl
                  p-4
                "
              />

              <input
                placeholder="Mã ID"
                value={form.deviceId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    deviceId: e.target.value
                  })
                }
                className="
                  border
                  rounded-xl
                  p-4
                "
              />

              <input
                placeholder="Ký hiệu"
                value={form.symbol}
                onChange={(e) =>
                  setForm({
                    ...form,
                    symbol: e.target.value
                  })
                }
                className="
                  border
                  rounded-xl
                  p-4
                "
              />

              <select
                value={form.condition}
                onChange={(e) =>
                  setForm({
                    ...form,
                    condition: e.target.value
                  })
                }
                className="
                  border
                  rounded-xl
                  p-4
                "
              >

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

              <input
                placeholder="Kho"
                value={form.warehouse}
                onChange={(e) =>
                  setForm({
                    ...form,
                    warehouse: e.target.value
                  })
                }
                className="
                  border
                  rounded-xl
                  p-4
                "
              />

              <input
                placeholder="Tủ"
                value={form.cabinet}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cabinet: e.target.value
                  })
                }
                className="
                  border
                  rounded-xl
                  p-4
                "
              />

              <input
                placeholder="Kệ"
                value={form.shelf}
                onChange={(e) =>
                  setForm({
                    ...form,
                    shelf: e.target.value
                  })
                }
                className="
                  border
                  rounded-xl
                  p-4
                "
              />

              <input
                placeholder="Ô"
                value={form.slot}
                onChange={(e) =>
                  setForm({
                    ...form,
                    slot: e.target.value
                  })
                }
                className="
                  border
                  rounded-xl
                  p-4
                "
              />

              <input
                type="number"
                placeholder="Số lượng"
                value={form.quantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantity: e.target.value
                  })
                }
                className="
                  border
                  rounded-xl
                  p-4
                "
              />

            </div>

            {/* BUTTON */}
            <div className="
              flex
              justify-end
              gap-4
              mt-8
            ">

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="
                  px-6
                  py-3
                  rounded-xl
                  bg-gray-200
                "
              >
                Hủy
              </button>

              <button
                onClick={handleCreate}
                className="
                  px-6
                  py-3
                  rounded-xl
                  bg-blue-500
                  hover:bg-blue-600
                  text-white
                "
              >
                Lưu thiết bị
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
