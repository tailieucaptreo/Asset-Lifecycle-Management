import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";

import { Plus, Search, Download, Upload, Trash2, Pencil, Package } from "lucide-react";
import SpareRow from "../components/Spare/SpareRow";
import SpareTable from "../components/Spare/SpareTable";
import EditSpareModal from "../components/Spare/EditSpareModal";

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
      <div>
        <SpareTable
        
            data={filtered}
        
            role={role}
        
            onEdit={handleEdit}
        
            onDelete={handleDelete}
        
        />
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

      <EditSpareModal

          show={showModal}
      
          editing={editing}
      
          form={form}
      
          setForm={setForm}
      
          role={role}
      
          defaultForm={defaultForm}
      
          onClose={() => {
      
              setShowModal(false);
      
              setEditing(null);
      
              setForm(defaultForm);
      
          }}
      
          onSave={handleSave}
      
      />

    </div>
  );
}
