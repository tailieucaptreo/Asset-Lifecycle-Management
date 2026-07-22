import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import API from "../config";

import DeviceToolbar from "../components/Device/DeviceToolbar";
import DeviceFilter from "../components/Device/DeviceFilter";
import DeviceTable from "../components/Device/DeviceTable";
import DeviceModal from "../components/Device/DeviceModal";
import DeviceImportModal from "../components/Device/DeviceImportModal";

export default function DeviceList() {

  // =========================
  // TABLE DATA
  // =========================

  const [devices, setDevices] = useState([]);

  const [filteredData, setFilteredData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // MODAL
  // =========================

  const [open, setOpen] =
    useState(false);

  const [editingDevice, setEditingDevice] =
    useState(null);

  // =========================
  // IMPORT
  // =========================

  const [importOpen, setImportOpen] =
    useState(false);

  const [previewRows, setPreviewRows] =
    useState([]);

  const [summary, setSummary] =
    useState(null);

  const [sessionId, setSessionId] =
    useState("");

  const [importLoading, setImportLoading] =
    useState(false);

  const fileInputRef =
    useRef(null);

  // =========================
  // ROLE
  // =========================

  const role =
    localStorage.getItem("role");

  // =========================
  // URL STATUS
  // =========================

  const location =
    useLocation();

  const params =
    new URLSearchParams(
      location.search
    );

  const status =
    params.get("status");


  const [filters, setFilters] = useState({

    name: "",

    station: "",

    status: ""

  });

  const calcStatus = (d) => {

    if (!d.installDate || !d.lifespan) {
      return "Active";
    }
  
    const install = new Date(d.installDate);
  
    const usedYear =
      (new Date() - install) /
      (1000 * 60 * 60 * 24 * 365);
  
    const percent =
      usedYear / Number(d.lifespan);
  
    if (percent >= 1) {
      return "Expired";
    }
  
    if (percent >= 0.7) {
      return "Maintenance";
    }
  
    return "Active";
  };

  // =========================
  // LOAD DEVICES
  // =========================

  const loadDevices =
    async () => {

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await axios.get(

            `${API}/api/devices`,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`

              }

            }

          );

        let rows =
          Array.isArray(
            res.data
          )
            ? res.data
            : [];

        if (status) {

          rows = rows.filter(
        
            item =>
        
              calcStatus(item) === status
        
          );
        
        }

        setDevices(rows);

        setFilteredData(rows);

      }

      catch (err) {

        console.log(err);

        alert(

          err.response?.data?.message ||

          "Không tải được danh sách thiết bị"

        );

        setDevices([]);

        setFilteredData([]);

      }

      finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    handleFilter(filters);

  }, [filters, devices]);

  // =========================
  // LOAD FIRST
  // =========================

  useEffect(() => {

    loadDevices();

  }, [status]);

  // =========================
  // SEARCH
  // =========================

  const handleSearch = (keyword) => {

    if (!keyword) {

      setFilteredData(devices);

      return;

    }

    const q =
      keyword.toLowerCase();

    const result =
      devices.filter(device =>

        Object.values(device)

          .join(" ")

          .toLowerCase()

          .includes(q)

      );

    setFilteredData(result);

  };

  // =========================
  // FILTER
  // =========================
  const handleFilter = (filters) => {

    let rows = [...devices];

    if (filters.name) {

      const keyword = filters.name.toLowerCase();

      rows = rows.filter(item =>

        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(keyword)

      );

    }

    if (filters.station) {

      rows = rows.filter(

        item => item.station === filters.station

      );

    }

    if (filters.status) {
    
      rows = rows.filter(
    
        item =>
    
          calcStatus(item) === filters.status
    
      );
    
    }

    setFilteredData(rows);

  };

  // =========================
  // EXPORT
  // =========================

  const handleExport = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res =
        await axios.get(

          `${API}/api/devices/export`,

          {

            responseType: "blob",

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }

        );

      const url =
        window.URL.createObjectURL(

          new Blob([res.data])

        );

      const a =
        document.createElement("a");

      a.href = url;

      a.download =

        "devices.xlsx";

      a.click();

      window.URL.revokeObjectURL(url);

    }

    catch (err) {

      console.log(err);

      alert(

        "Không thể xuất Excel"

      );

    }

  };

  // =========================
  // IMPORT PREVIEW
  // =========================

  const handlePreview = async (file) => {

    if (!file) return;

    try {

      setImportLoading(true);

      const token =
        localStorage.getItem("token");

      const formData =
        new FormData();

      formData.append(

        "file",

        file

      );

      const res =
        await axios.post(

          `${API}/api/devices/import/preview`,

          formData,

          {

            headers: {

              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "multipart/form-data"

            }

          }

        );
      console.log("PREVIEW =", res.data);

      setSummary(

        res.data.summary

      );

      setPreviewRows(

        res.data.rows

      );

      setSessionId(

        res.data.sessionId

      );

      setImportOpen(true);

    }

    catch (err) {

      console.log(err);

      alert(

        err.response?.data?.message ||

        "Không thể đọc file Excel"

      );

    }

    finally {

      setImportLoading(false);

      if (

        fileInputRef.current

      ) {

        fileInputRef.current.value = "";

      }

    }

  };

  // =========================
  // CONFIRM IMPORT
  // =========================

  const confirmImport = async () => {

    if (!sessionId) return;

    try {

      setImportLoading(true);

      const token =
        localStorage.getItem("token");

      await axios.post(

        `${API}/api/devices/import`,

        {

          sessionId

        },

        {

          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }

      );

      alert("Import thành công.");

      setImportOpen(false);

      setPreviewRows([]);

      setSummary(null);

      setSessionId("");

      await loadDevices();

    }

    catch (err) {

      console.log(err);

      alert(

        err.response?.data?.message ||

        "Import thất bại"

      );

    }

    finally {

      setImportLoading(false);

    }

  };

  // =========================
  // ADD
  // =========================

  const handleAdd = () => {

    setEditingDevice(null);

    setOpen(true);

  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (device) => {

    setEditingDevice(device);

    setOpen(true);

  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (device) => {

    const ok =
      window.confirm(

        `Xóa thiết bị "${device.name}" ?`

      );

    if (!ok) return;

    try {

      const token =
        localStorage.getItem("token");

      await axios.delete(

        `${API}/api/devices/${device.id}`,

        {

          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }

      );

      await loadDevices();

    }

    catch (err) {

      console.log(err);

      alert(

        err.response?.data?.message ||

        "Không thể xóa thiết bị"

      );

    }

  };

  // =========================
  // SAVE SUCCESS
  // =========================

  const handleSuccess = async () => {

    setOpen(false);

    setEditingDevice(null);

    await loadDevices();

  };

  return (

    <div className="p-3 md:p-6 space-y-5">

      {/* ================= TOOLBAR ================= */}

      <DeviceToolbar

        title="Danh sách thiết bị"

        role={role}

        onReload={loadDevices}

        onAdd={handleAdd}

        onExport={handleExport}

        onImport={() =>

          fileInputRef.current?.click()

        }

        onSearch={handleSearch}

      />

      {/* ================= FILTER ================= */}

      <DeviceFilter

        filters={filters}

        setFilters={setFilters}

        data={devices}

      />

      {/* ================= TABLE ================= */}

      {

        loading

          ?

          (

            <div
              className="
                bg-white
                rounded-xl
                shadow
                p-10
                text-center
                text-slate-500
              "
            >

              Đang tải dữ liệu...

            </div>

          )

          :

          (

            <DeviceTable

              data={filteredData}

              loading={loading}

              onEdit={handleEdit}

              onDelete={handleDelete}

            />

          )

      }

      {/* ================= IMPORT INPUT ================= */}

      <input

        ref={fileInputRef}

        type="file"

        hidden

        accept=".xlsx,.xls"

        onChange={(e) =>

          handlePreview(

            e.target.files?.[0]

          )

        }

      />

      {/* ================= ADD / EDIT ================= */}

      <DeviceModal

        open={open}

        device={editingDevice}

        onClose={() => {

          setOpen(false);

          setEditingDevice(null);

        }}

        onSuccess={handleSuccess}

      />

      {/* ================= IMPORT MODAL ================= */}

      <DeviceImportModal

        open={importOpen}

        summary={summary}

        rows={previewRows}

        loading={importLoading}

        onClose={() => {

          if (importLoading) return;

          setImportOpen(false);

          setPreviewRows([]);

          setSummary(null);

          setSessionId("");

        }}

        onConfirm={confirmImport}

      />

    </div>

  );

}
