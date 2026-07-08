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
import SpareToolbar from "../components/Spare/SpareToolbar";
import SpareCard from "../components/Spare/SpareCard";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

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

  const navigate = useNavigate();

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

  // =================EDIT MODAL SPARE ==========
  const location = useLocation();

  useEffect(() => {
      if (location.state?.edit) {
          setEditing(location.state.edit);
          setForm(location.state.edit);
          setShowModal(true);
      }
  }, [location.state]);

  // ================= RENDER =================
  return (

    <div className="p-6 bg-gray-100 min-h-screen">

       {/* HEADER */}
       <SpareHeader

          role={role}
      
       />

      {/* TOOLBAR */}
       <SpareToolbar

            role={role}
        
            search={search}
        
            setSearch={setSearch}
        
            filter={filter}
        
            setFilter={setFilter}
        
            onExport={handleExport}
        
            onImport={handleImportExcel}
        
            onCreate={openCreate}
        
            onHistory={loadHistory}
        
      /> 

      {/* Desktop */}
      <div className="hidden lg:block">
      
          <SpareTable
              data={filtered}
              role={role}
              onView={(item) => navigate(`/spare-devices/${item.id}`)}
              onEdit={handleEdit}
              onDelete={handleDelete}
          />
      
      </div>
      
      {/* Mobile */}
      <div
          className="
              grid
              grid-cols-1
              gap-4
              lg:hidden
          "
      >
      
          {filtered.map(item => (
      
              <SpareCard
                  key={item.id}
                  item={item}
                  role={role}
                  onView={(item) => navigate(`/spare-devices/${item.id}`)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
              />
      
          ))}
      
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
