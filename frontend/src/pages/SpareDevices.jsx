import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";

import { Plus, Search, Download, Upload } from "lucide-react";
import SpareRow from "../components/Spare/SpareRow";
import SpareTable from "../components/Spare/SpareTable";
import EditSpareModal from "../components/Spare/EditSpareModal";
import HistoryModal from "../components/Spare/HistoryModal";
import ImportPreviewModal from "../components/Spare/ImportPreviewModal";
import SpareHeader from "../components/Spare/SpareHeader";

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
      <SpareHeader

          role={role}
      
      />

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
      <ImportPreviewModal
      
          show={showPreview}
      
          previewData={previewRows}
      
          onClose={() => setShowPreview(false)}
      
          onImport={handleConfirmImport}
      
      />

      {/* ================= HISTORY ================= */}
      <HistoryModal
      
          show={showHistory}
      
          history={historyData}
      
          onClose={() => setShowHistory(false)}
      
      />
      
      {/* ================= MODAL ================= */}
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
