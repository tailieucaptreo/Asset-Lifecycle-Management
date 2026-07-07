import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";

import { Plus, Search, Download, Upload, Trash2, Pencil, Package } from "lucide-react";
import SpareRow from "../components/Spare/SpareRow";

export default function SpareDevices() {

  // ================= STATE =================
  const role = localStorage.getItem("role");

  const token = localStorage.getItem("token");
  
  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);

  const [showHistory, setShowHistory] = useState(false);

  const [historyData, setHistoryData] = useState([]);

  const [editing, setEditing] = useState(null);

  const [previewRows, setPreviewRows] = useState([]);

  const [showPreview, setShowPreview] = useState(false);

  const defaultForm = {

    name: "",
    deviceId: "",
    symbol: "",

    condition: "New",

    warehouse: "",
    cabinet: "",
    shelf: "",
    slot: "",

    // =========================
    // INVENTORY
    // =========================

    initialQuantity: 0,

    quantity: 0,

    importQty: 0,

    exportQty: 0,

    unit: "Cái",

    editedBy: "",

    note: "",

    image: ""
  };

  const [form, setForm] = useState(defaultForm);

  // ================= LOAD =================
  const fetchData = () => {

    axios.get(

    `${API}/api/spare-devices`,
    
    {
    headers:{
    Authorization:
    `Bearer ${token}`
    }
    }
    
    )
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

    const keyword =
      search.toLowerCase().trim();

    const fullText = `

      ${d.name || ""}
      ${d.deviceId || ""}
      ${d.condition || ""}
      ${d.warehouse || ""}
      ${d.cabinet || ""}
      ${d.shelf || ""}
      ${d.slot || ""}
      ${d.unit || ""}
      ${d.symbol || ""}
      ${d.quantity || ""}
      ${d.initialQuantity || ""}
      ${d.importQty || ""}
      ${d.exportQty || ""}

    `
      .toLowerCase();

    return (

      (filter === "All" ||
        d.condition === filter)

      &&

      fullText.includes(keyword)
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

  // ================= SAVE =================
  const handleSave = async () => {

    try {

      if (!form.name) {

        alert("Nhập tên thiết bị");

        return;
      }

      const payload = {

        ...form,

        initialQuantity:
          Number(form.initialQuantity || 0),

        importQty:
          Number(form.importQty || 0),

        exportQty:
          Number(form.exportQty || 0),
      };

      if (editing) {

        await axios.put(
        
        `${API}/api/spare-devices/${editing.id}`,
        
        payload,
        
        {
        headers:{
        Authorization:
        `Bearer ${token}`
        }
        }
        
        );

      } else {

        await axios.post(
        
        `${API}/api/spare-devices`,
        
        payload,
        
        {
        headers:{
        Authorization:
        `Bearer ${token}`
        }
        }
        
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

      initialQuantity:
        item.initialQuantity || 0,

      quantity:
        item.quantity || 0,

      // reset nhập xuất mới
      importQty: 0,

      exportQty: 0,

      unit:
        item.unit || "Cái",
      
      editedBy:
        item.editedBy || "",

      note:
        item.note || "",

      image:
        item.image || ""
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

      `${API}/api/spare-devices/${id}`,
      
      {
      headers:{
      Authorization:
      `Bearer ${token}`
      }
      }
      
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

      `${API}/api/spare-devices/export`,

      "_blank"
    );
  };

  // ================= IMPORT PREVIEW =================
  const handleImportExcel = async (file) => {

    try {

      const formData = new FormData();

      formData.append("file", file);

      const res = await axios.post(

        `${API}/api/spare-devices/preview-import`,

        formData,

        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      setPreviewRows(
        res.data.rows || []
      );

      setShowPreview(true);

    } catch (err) {

      console.log(err);

      alert("❌ Import lỗi");
    }
  };
  
  // ================= CONFIRM IMPORT =================
  const handleConfirmImport = async () => {

    try {

      await axios.post(

        `${API}/api/spare-devices/confirm-import`,

        {
          rows: previewRows
        }
      );

      alert("✅ Import thành công");

      setShowPreview(false);

      setPreviewRows([]);

      fetchData();

    } catch (err) {

      console.log(err);

      alert("❌ Import thất bại");
    }
  };

  // ================= LOAD HISTORY =================
  const loadHistory = async () => {

    try {

      const res = await axios.get(
        `${API}/api/spare-devices/history`
      );

      setHistoryData(res.data);

      setShowHistory(true);

    } catch (err) {

      console.log(err);
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
          
          <div
            className="
              mt-2
              flex
              items-center
              gap-2
            "
          >
          
            <span className="text-gray-500">
              Quyền hiện tại:
            </span>
          
            <span
              className={`
                px-3
                py-1
                rounded-full
                text-sm
                font-bold
          
                ${role === "admin"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"}
              `}
            >
          
              {role === "admin"
                ? "ADMIN"
                : "USER"}
          
            </span>
          
          </div>
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
          {role === "admin" && (

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
          
          )}

          {/* EXPORT */}
          {role === "admin" && (
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
          )}
      
          {/* CREATE */}
          {role === "admin" && (

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
          
          )}

          {/* HISTORY */}
          <button
            onClick={loadHistory}
            className="
              bg-gray-800
              hover:bg-black
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
            🕘 Lịch sử
          </button>

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

        <div className="overflow-x-auto max-h-[75vh]">

          <table className="w-full text-sm table-auto">

            <thead className="bg-gray-50 border-b sticky top-0 z-10">

              <tr className="text-gray-800 text-sm">

                <th className="px-3 py-3 text-left">
                  Hình ảnh
                </th>

                <th className="px-3 py-3 text-left">
                  Tên thiết bị
                </th>

                <th className="px-3 py-3 text-left">
                  Mã ID
                </th>

                <th className="px-3 py-3 text-center">
                  Tình trạng
                </th>

                <th className="px-2 py-3 text-center">
                  Kho
                </th>

                <th className="px-2 py-3 text-center">
                  Tủ
                </th>

                <th className="px-2 py-3 text-center">
                  Kệ
                </th>

                <th className="px-2 py-3 text-center">
                  Khay
                </th>

                <th className="px-2 py-3 text-center">
                  Ban đầu
                </th>

                <th className="px-2 py-3 text-center">
                  Nhập
                </th>

                <th className="px-2 py-3 text-center">
                  Xuất
                </th>

                <th className="px-2 py-3 text-center">
                  Tồn kho
                </th>

                <th className="px-2 py-3 text-center">
                  ĐVT
                </th>

                <th className="px-3 py-3 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filtered.length > 0 ? (

                filtered.map((d) => (

                  <SpareRow

                      key={d.id}
              
                      item={d}
              
                      role={role}
              
                      onEdit={handleEdit}
              
                      onDelete={handleDelete}
              
                  />
                ))

              ) : (

                <tr>

                  <td
                    colSpan={14}
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

      {/* ================= PREVIEW IMPORT ================= */}
      {showPreview && (

        <div
          className="
            fixed
            inset-0
            bg-black/40
            flex
            items-center
            justify-center
            z-50
            p-6
          "
        >

          <div
            className="
              bg-white
              rounded-3xl
              w-full
              max-w-4xl
              p-6
              shadow-2xl
            "
          >

            <h2
              className="
                text-3xl
                font-bold
                mb-6
              "
            >
              📄 Xem trước dữ liệu import
            </h2>

            <div
              className="
                overflow-auto
                border
                rounded-2xl
                max-h-[60vh]
              "
            >

              <table className="w-full text-sm table-auto">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="p-3 text-left">
                      Tên thiết bị
                    </th>

                    <th className="p-3 text-left">
                      Mã ID
                    </th>

                    <th className="p-3 text-center">
                      Số lượng
                    </th>

                    <th className="p-3 text-center">
                      Đơn vị
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {previewRows.map((r, index) => (

                    <tr
                      key={index}
                      className="border-t"
                    >

                      <td className="p-3">
                        {r.name}
                      </td>

                      <td className="p-3">
                        {r.deviceId}
                      </td>

                      <td
                        className="
                          p-3
                          text-center
                          font-bold
                          text-blue-600
                        "
                      >
                        {r.initialQuantity}
                      </td>

                      <td className="p-3 text-center">
                        {r.unit}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            <div
              className="
                flex
                justify-end
                gap-4
                mt-6
              "
            >

              <button
                onClick={() => {

                  setShowPreview(false);

                  setPreviewRows([]);
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
                onClick={handleConfirmImport}
                className="
                  px-6
                  py-3
                  rounded-xl
                  bg-blue-500
                  hover:bg-blue-600
                  text-white
                "
              >
                Xác nhận Import
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================= HISTORY ================= */}
      {showHistory && (

        <div
          className="
            fixed
            inset-0
            bg-black/40
            flex
            items-center
            justify-center
            z-50
            p-6
          "
        >

          <div
            className="
              bg-white
              rounded-3xl
              w-full
              max-w-5xl
              p-6
              shadow-2xl
            "
          >

            <div className="
              flex
              items-center
              justify-between
              mb-6
            ">

              <h2 className="
                text-3xl
                font-bold
              ">
                🕘 Lịch sử thay đổi
              </h2>

              <button
                onClick={() =>
                  setShowHistory(false)
                }
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-gray-200
                "
              >
                Đóng
              </button>

            </div>

            <div className="
              overflow-auto
              max-h-[70vh]
              border
              rounded-2xl
            ">

              <table className="w-full text-sm">

                <thead className="
                  bg-gray-100
                  sticky
                  top-0
                ">

                  <tr>

                    <th className="px-3 py-3 text-left">
                      Thời gian
                    </th>

                    <th className="px-3 py-3 text-left">
                      Hành động
                    </th>

                    <th className="px-3 py-3 text-left">
                      Thiết bị
                    </th>

                    <th className="px-3 py-3 text-center">
                      Người chỉnh sửa
                    </th>

                    <th className="px-3 py-3 text-center">
                      Số lượng
                    </th>

                    <th className="px-3 py-3 text-left">
                      Ghi chú
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {historyData.map((h) => (

                    <tr
                      key={h.id}
                      className="border-t"
                    >

                      <td className="px-3 py-3">
                        {
                          new Date(
                            h.createdAt
                          ).toLocaleString("vi-VN")
                        }
                      </td>

                      <td className="px-3 py-3">
                        {h.action}
                      </td>

                      <td className="px-3 py-3">
                        {h.deviceName}
                      </td>

                      <td className="px-3 py-3 text-center">
                        {h.editedBy || "-"}
                      </td>

                      <td className="
                        px-3
                        py-3
                        text-center
                        font-bold
                      ">
                        {h.quantity}
                      </td>

                      <td className="px-3 py-3">
                        {h.note || "-"}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      )}

      {/* MODAL */}
      {showModal && (

        <div
          className="
            fixed
            inset-0
            bg-black/40
            z-50
            flex
            items-center
            justify-center
            p-4
          "
        >

          <div
            className="
              bg-white
              rounded-3xl
              p-5
              w-full
              max-w-4xl
              shadow-2xl
              max-h-[90vh]
              overflow-y-auto
            "
          >

            {/* TITLE */}
            <h2
              className="
                text-2xl
                font-bold
                mb-6
              "
            >

              {editing
                ? "✏️ Chỉnh sửa thiết bị"
                : "➕ Thêm thiết bị dự phòng"}

            </h2>

            {/* FORM */}
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-3
              "
            >

              {/* NAME */}
              <input
                placeholder="Tên thiết bị"
                value={form.name}
                disabled={role === "user"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
                className="border rounded-xl p-3"
              />

              {/* ID */}
              <input
                placeholder="Mã ID"
                value={form.deviceId}
                disabled={role === "user"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    deviceId: e.target.value
                  })
                }
                className="border rounded-xl p-3"
              />

              {/* SYMBOL */}
              <input
                placeholder="Ký hiệu"
                value={form.symbol}
                disabled={role === "user"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    symbol: e.target.value
                  })
                }
                className="border rounded-xl p-3"
              />

              {/* CONDITION */}
              <select
                value={form.condition}
                disabled={role === "user"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    condition: e.target.value
                  })
                }
                className="border rounded-xl p-3"
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

              {/* WAREHOUSE */}
              <input
                placeholder="Kho"
                value={form.warehouse}
                disabled={role === "user"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    warehouse: e.target.value
                  })
                }
                className="border rounded-xl p-3"
              />

              {/* CABINET */}
              <input
                placeholder="Tủ"
                value={form.cabinet}
                disabled={role === "user"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cabinet: e.target.value
                  })
                }
                className="border rounded-xl p-3"
              />

              {/* SHELF */}
              <input
                placeholder="Kệ"
                value={form.shelf}
                disabled={role === "user"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    shelf: e.target.value
                  })
                }
                className="border rounded-xl p-3"
              />

              {/* SLOT */}
              <input
                placeholder="Khay"
                value={form.slot}
                disabled={role === "user"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    slot: e.target.value
                  })
                }
                className="border rounded-xl p-3"
              />

              {/* INITIAL */}
              <div className="space-y-1">

                <label className="text-sm font-semibold text-gray-700">
                  Số lượng ban đầu
                </label>

                <input
                  type="number"
                  value={form.initialQuantity}
                  disabled={editing}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      initialQuantity: Number(e.target.value)
                    })
                  }
                  className="
                    border
                    rounded-xl
                    p-3
                    bg-gray-50
                    w-full
                  "
                />

              </div>

              {/* IMPORT */}
              <div className="space-y-1">

                <label className="text-sm font-semibold text-blue-700">
                  Nhập thêm
                </label>

                <input
                  type="number"
                  value={form.importQty}
                  disabled={role === "user"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      importQty: Number(e.target.value)
                    })
                  }
                  className="
                    border
                    rounded-xl
                    p-3
                    w-full
                  "
                />

              </div>

              {/* EXPORT */}
              <div className="space-y-1">

                <label className="text-sm font-semibold text-red-600">
                  Xuất đi
                </label>

                <input
                  type="number"
                  value={form.exportQty}
                  disabled={!editing}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      exportQty: Number(e.target.value)
                    })
                  }
                  className="
                    border
                    rounded-xl
                    p-3
                    w-full
                  "
                />

              </div>

              {/* STOCK */}
              <div
                className="
                  border
                  rounded-xl
                  p-3
                  bg-blue-50
                  flex
                  items-center
                  font-bold
                  text-blue-700
                "
              >

                Tồn kho hiện tại:

                <span className="ml-2 text-2xl">

                  {form.quantity || 0}

                </span>

              </div>

              {/* EDITED BY */}
              <div className="space-y-1">

                <label className="text-sm font-semibold text-gray-700">
                  Người chỉnh sửa
                </label>

                <input
                  type="text"
                  placeholder="Nhập tên người chỉnh sửa"
                  value={form.editedBy || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      editedBy: e.target.value
                    })
                  }
                  className="
                    border
                    rounded-xl
                    p-3
                    w-full
                    bg-gray-50
                  "
                />

              </div>

              {/* UNIT */}
              <input
                placeholder="Đơn vị tính"
                value={form.unit}
                disabled={role === "user"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    unit: e.target.value
                  })
                }
                className="border rounded-xl p-3"
              />

              {/* NOTE */}
              <div className="md:col-span-2 space-y-1">

                <label className="text-sm font-semibold text-gray-700">
                  Ghi chú
                </label>

                <textarea
                  placeholder="Nhập ghi chú..."
                  value={form.note || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      note: e.target.value
                    })
                  }
                  rows={3}
                  className="
                    border
                    rounded-xl
                    p-3
                    text-sm
                    w-full
                    bg-gray-50
                    resize-none
                  "
                />

              </div>

            </div>

            {/* BUTTON */}
            <div
              className="
                flex
                justify-end
                gap-3
                mt-6
              "
            >

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                  setForm(defaultForm);
                }}
                className="
                  px-5
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
                  px-5
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
