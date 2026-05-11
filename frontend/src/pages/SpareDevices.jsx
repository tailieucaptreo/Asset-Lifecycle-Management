import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";

import {
  Plus,
  Search,
  Download,
  Upload,
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

  const [editing, setEditing] = useState(null);

  const defaultForm = {
    name: "",
    deviceId: "",
    symbol: "",

    condition: "New",

    warehouse: "",
    cabinet: "",
    shelf: "",
    slot: "",

    quantity: 1,

    unit: "Cái",

    importQty: 0,
    exportQty: 0,

    image: ""
  };

  const [form, setForm] = useState(defaultForm);

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

  // ================= CREATE / UPDATE =================
  const handleSave = async () => {

    try {

      if (!form.name) {
        alert("Nhập tên thiết bị");
        return;
      }

      if (editing) {

        await axios.put(
          `${API}/api/spare-devices/${editing.id}`,
          form
        );

      } else {

        await axios.post(
          `${API}/api/spare-devices`,
          form
        );
      }

      setShowModal(false);

      setEditing(null);

      setForm(defaultForm);

      fetchData();

    } catch (err) {

      console.log(err);

      alert("❌ Lưu thiết bị lỗi");
    }
  };

  // ================= EDIT =================
  const handleEdit = (item) => {

    setEditing(item);

    setForm({
      name: item.name || "",
      deviceId: item.deviceId || "",
      symbol: item.symbol || "",

      condition: item.condition || "New",

      warehouse: item.warehouse || "",
      cabinet: item.cabinet || "",
      shelf: item.shelf || "",
      slot: item.slot || "",

      quantity: item.quantity || 1,

      unit: item.unit || "Cái",

      importQty: item.importQty || 0,
      exportQty: item.exportQty || 0,

      image: item.image || ""
    });

    setShowModal(true);
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

  // ================= IMPORT =================
  const handleImportExcel = async (file) => {

    try {

      const formData = new FormData();

      formData.append("file", file);

      await axios.post(
        `${API}/api/spare-devices/import`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      alert("✅ Import thành công");

      fetchData();

    } catch (err) {

      console.log(err);

      alert("❌ Import lỗi");
    }
  };

  // ================= OPEN CREATE =================
  const openCreate = () => {

    setEditing(null);

    setForm(defaultForm);

    setShowModal(true);
  };

  // ================= RENDER =================
  return (

    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
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

        {/* TOOLBAR */}
        <div className="
          flex
          flex-col
          md:flex-row
          gap-3
        ">

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

          {/* IMPORT */}
          <label
            className="
              bg-purple-500
              hover:bg-purple-600
              text-white
              px-5
              py-3
              rounded-xl
              flex
              items-center
              gap-2
              shadow
              cursor-pointer
            "
          >

            <Upload size={18} />

            Import

            <input
              type="file"
              accept=".xlsx,.xls"
              hidden
              onChange={(e) => {

                const file = e.target.files[0];

                if (!file) return;

                handleImportExcel(file);
              }}
            />

          </label>

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
            onClick={openCreate}
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

      {/* CARD */}
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

      {/* TABLE */}
      <div
        className="
          bg-white
          rounded-3xl
          shadow-lg
          overflow-hidden
          border
          border-gray-200
        "
      >

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1300px]">

            <thead className="bg-gray-50 border-b">

              <tr className="text-gray-800 text-sm">

                <th className="px-6 py-5 text-left">
                  Hình ảnh
                </th>

                <th className="px-6 py-5 text-left">
                  Tên thiết bị
                </th>

                <th className="px-6 py-5 text-left">
                  Mã ID
                </th>

                <th className="px-6 py-5 text-center">
                  Tình trạng
                </th>

                <th className="px-4 py-5 text-center">
                  Kho
                </th>

                <th className="px-4 py-5 text-center">
                  Tủ
                </th>

                <th className="px-4 py-5 text-center">
                  Kệ
                </th>

                <th className="px-4 py-5 text-center">
                  Khay
                </th>

                <th className="px-4 py-5 text-center">
                  Nhập
                </th>

                <th className="px-4 py-5 text-center">
                  Xuất
                </th>

                <th className="px-4 py-5 text-center">
                  Số lượng
                </th>

                <th className="px-4 py-5 text-center">
                  ĐVT
                </th>

                <th className="px-6 py-5 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filtered.length > 0 ? (

                filtered.map((d) => (

                  <tr
                    key={d.id}
                    className="
                      border-b
                      hover:bg-gray-50
                      transition
                    "
                  >

                    {/* IMAGE */}
                    <td className="px-4 py-5">

                      {d.image ? (

                        <img
                          src={d.image}
                          alt=""
                          className="
                            w-14
                            h-14
                            rounded-2xl
                            object-cover
                            border
                          "
                        />

                      ) : (

                        <div
                          className="
                            w-14
                            h-14
                            rounded-2xl
                            bg-gray-100
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <Package size={24} />
                        </div>

                      )}

                    </td>

                    {/* NAME */}
                    <td className="
                      px-6
                      py-5
                      font-semibold
                    ">

                      {d.name || "-"}

                    </td>

                    {/* ID */}
                    <td className="px-6 py-5">
                      {d.deviceId || "-"}
                    </td>

                    {/* CONDITION */}
                    <td className="
                      px-6
                      py-5
                      text-center
                    ">

                      <span className={`
                        px-4
                        py-2
                        rounded-xl
                        text-sm
                        font-semibold

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
                    <td className="px-4 py-5 text-center">
                      {d.warehouse || "-"}
                    </td>

                    <td className="px-4 py-5 text-center">
                      {d.cabinet || "-"}
                    </td>

                    <td className="px-4 py-5 text-center">
                      {d.shelf || "-"}
                    </td>

                    <td className="px-4 py-5 text-center">
                      {d.slot || "-"}
                    </td>

                    {/* IMPORT */}
                    <td className="
                      px-4
                      py-5
                      text-center
                      font-bold
                      text-blue-600
                    ">

                      {d.importQty || 0}

                    </td>

                    {/* EXPORT */}
                    <td className="
                      px-4
                      py-5
                      text-center
                      font-bold
                      text-red-500
                    ">

                      {d.exportQty || 0}

                    </td>

                    {/* QTY */}
                    <td className="
                      px-4
                      py-5
                      text-center
                      font-bold
                    ">

                      {d.quantity || 0}

                    </td>

                    {/* UNIT */}
                    <td className="
                      px-4
                      py-5
                      text-center
                    ">

                      {d.unit || "Cái"}

                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-5">

                      <div className="
                        flex
                        items-center
                        justify-center
                        gap-4
                      ">

                        <button
                          onClick={() => handleEdit(d)}
                          className="
                            w-9
                            h-9
                            rounded-xl
                            bg-blue-50
                            text-blue-500
                            hover:bg-blue-100
                          "
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(d.id)
                          }
                          className="
                            w-9
                            h-9
                            rounded-xl
                            bg-red-50
                            text-red-500
                            hover:bg-red-100
                          "
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={13}
                    className="
                      text-center
                      py-16
                      text-gray-400
                    "
                  >

                    <div className="
                      flex
                      flex-col
                      items-center
                      gap-3
                    ">

                      <Package size={48} />

                      <p className="text-lg">
                        Chưa có thiết bị dự phòng
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}
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
            max-w-4xl
            shadow-2xl
          ">

            <h2 className="
              text-3xl
              font-bold
              mb-8
            ">

              {editing
                ? "✏️ Chỉnh sửa thiết bị"
                : "➕ Thêm thiết bị dự phòng"}

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
                className="border rounded-xl p-4"
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
                className="border rounded-xl p-4"
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
                className="border rounded-xl p-4"
              />

              <select
                value={form.condition}
                onChange={(e) =>
                  setForm({
                    ...form,
                    condition: e.target.value
                  })
                }
                className="border rounded-xl p-4"
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
                className="border rounded-xl p-4"
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
                className="border rounded-xl p-4"
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
                className="border rounded-xl p-4"
              />

              <input
                placeholder="Khay"
                value={form.slot}
                onChange={(e) =>
                  setForm({
                    ...form,
                    slot: e.target.value
                  })
                }
                className="border rounded-xl p-4"
              />

              <input
                type="number"
                placeholder="Nhập"
                value={form.importQty}
                onChange={(e) =>
                  setForm({
                    ...form,
                    importQty: Number(e.target.value)
                  })
                }
                className="border rounded-xl p-4"
              />

              <input
                type="number"
                placeholder="Xuất"
                value={form.exportQty}
                onChange={(e) =>
                  setForm({
                    ...form,
                    exportQty: Number(e.target.value)
                  })
                }
                className="border rounded-xl p-4"
              />

              <input
                type="number"
                placeholder="Số lượng"
                value={form.quantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantity: Number(e.target.value)
                  })
                }
                className="border rounded-xl p-4"
              />

              <input
                placeholder="Đơn vị tính"
                value={form.unit}
                onChange={(e) =>
                  setForm({
                    ...form,
                    unit: e.target.value
                  })
                }
                className="border rounded-xl p-4"
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
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                  setForm(defaultForm);
                }}
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
                onClick={handleSave}
                className="
                  px-6
                  py-3
                  rounded-xl
                  bg-blue-500
                  hover:bg-blue-600
                  text-white
                "
              >

                {editing
                  ? "Cập nhật"
                  : "Lưu thiết bị"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
