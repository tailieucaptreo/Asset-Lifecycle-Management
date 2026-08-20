import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import API from "../config";

import DeviceToolbar from "../components/Device/DeviceToolbar";
import DeviceFilter from "../components/Device/DeviceFilter";
import DeviceTable from "../components/Device/DeviceTable";
import DeviceModal from "../components/Device/DeviceModal";
import DeviceImportModal from "../components/Device/DeviceImportModal";
import DeviceHistoryModal from "../components/Device/DeviceHistoryModal";

export default function DeviceList() {

  // =====================================================
  // TABLE DATA
  // =====================================================

  const [devices, setDevices] = useState([]);

  const [filteredData, setFilteredData] = useState([]);

  const [loading, setLoading] = useState(true);


  // =====================================================
  // MODAL
  // =====================================================

  const [open, setOpen] = useState(false);

  const [editingDevice, setEditingDevice] = useState(null);


  // =====================================================
  // IMPORT
  // =====================================================

  const [importOpen, setImportOpen] = useState(false);

  const [previewRows, setPreviewRows] = useState([]);

  const [summary, setSummary] = useState(null);

  const [sessionId, setSessionId] = useState("");

  const [importLoading, setImportLoading] = useState(false);

  const fileInputRef = useRef(null);


  // =====================================================
  // HISTORY
  // =====================================================

  const [openHistory, setOpenHistory] = useState(false);


  // =====================================================
  // ROLE
  // =====================================================

  const role = localStorage.getItem("role");


  // =====================================================
  // URL STATUS
  // =====================================================

  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const status = params.get("status");


  // =====================================================
  // FILTERS
  // =====================================================

  const [filters, setFilters] = useState({

    name: "",
    station: params.get("station") || "",
    status: status || ""

  });


  // =====================================================
  // CALCULATE STATUS
  // =====================================================

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


  // =====================================================
  // LOAD DEVICES
  // =====================================================

  const loadDevices = async () => {

    try {

      setLoading(true);


      const token =
        localStorage.getItem("token");


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
        Array.isArray(res.data)
          ? res.data
          : [];


      // -----------------------------------------------
      // FILTER STATUS TỪ URL
      // -----------------------------------------------

      if (status) {

        rows =
          rows.filter(

            item =>
              calcStatus(item) === status

          );

      }


      setDevices(rows);

      setFilteredData(rows);

    }

    catch (err) {

      console.error(
        "LOAD DEVICES ERROR:",
        err
      );


      setDevices([]);

      setFilteredData([]);

      throw err;

    }

    finally {

      setLoading(false);

    }

  };


  // =====================================================
  // APPLY FILTER
  // =====================================================

  useEffect(() => {

    handleFilter(filters);

  }, [filters, devices]);


  // =====================================================
  // LOAD FIRST
  // =====================================================

  useEffect(() => {

    loadDevices();

  }, [status]);


  // =====================================================
  // SEARCH
  // =====================================================

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


  // =====================================================
  // FILTER
  // =====================================================

  const handleFilter = (currentFilters) => {

    let rows = [...devices];


    // -----------------------------------------------
    // SEARCH NAME / ALL FIELDS
    // -----------------------------------------------

    if (currentFilters.name) {

      const keyword =
        currentFilters.name.toLowerCase();


      rows =
        rows.filter(item =>

          Object.values(item)

            .join(" ")

            .toLowerCase()

            .includes(keyword)

        );

    }


    // -----------------------------------------------
    // STATION
    // -----------------------------------------------

    if (currentFilters.station) {

      rows =
        rows.filter(

          item =>
            String(item.station || "").trim() ===
            String(currentFilters.station).trim()

        );

    }


    // -----------------------------------------------
    // STATUS
    // -----------------------------------------------

    if (currentFilters.status) {

      rows =
        rows.filter(

          item =>
            calcStatus(item) ===
            currentFilters.status

        );

    }


    setFilteredData(rows);

  };


  // =====================================================
  // EXPORT EXCEL
  // =====================================================

  const handleExport = async () => {

    try {

      const token =
        localStorage.getItem("token");


      // =================================================
      // LẤY NHÀ GA ĐANG CHỌN
      // =================================================

      const selectedStation =
        String(filters.station || "").trim();


      // =================================================
      // TẠO QUERY PARAMETER
      // =================================================

      const queryParams =
        new URLSearchParams();


      if (
        selectedStation &&
        selectedStation !== "all" &&
        selectedStation !== "Tất cả" &&
        selectedStation !== "Tất cả nhà ga"
      ) {

        queryParams.append(
          "station",
          selectedStation
        );

      }


      // =================================================
      // URL EXPORT
      // =================================================

      const queryString =
        queryParams.toString();


      const exportUrl =
        `${API}/api/devices/export${queryString
          ? `?${queryString}`
          : ""
        }`;


      console.log(
        "EXPORT URL:",
        exportUrl
      );


      console.log(
        "EXPORT STATION:",
        selectedStation || "ALL"
      );


      // =================================================
      // REQUEST
      // =================================================

      const res =
        await axios.get(

          exportUrl,

          {

            responseType: "blob",

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }

        );


      // =================================================
      // TẠO FILE
      // =================================================

      const blob =
        new Blob(

          [res.data],

          {

            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

          }

        );


      const url =
        window.URL.createObjectURL(blob);


      const a =
        document.createElement("a");


      a.href = url;


      // =================================================
      // TÊN FILE
      // =================================================

      if (
        selectedStation &&
        selectedStation !== "all" &&
        selectedStation !== "Tất cả" &&
        selectedStation !== "Tất cả nhà ga"
      ) {

        const safeStation =
          selectedStation

            .replace(
              /[\\/:*?"<>|]+/g,
              ""
            )

            .replace(
              /\s+/g,
              "_"
            )

            .trim();


        a.download =
          `devices_${safeStation}.xlsx`;

      }

      else {

        a.download =
          "devices.xlsx";

      }


      document.body.appendChild(a);

      a.click();

      a.remove();


      window.URL.revokeObjectURL(url);

    }

    catch (err) {

      console.error(
        "EXPORT ERROR:",
        err
      );


      alert(
        err.response?.data?.message ||
        "Không thể xuất Excel"
      );

    }

  };


  // =====================================================
  // IMPORT PREVIEW
  // =====================================================

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


      console.log(
        "PREVIEW =",
        res.data
      );


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

      console.error(
        "PREVIEW IMPORT ERROR:",
        err
      );


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


  // =====================================================
  // CONFIRM IMPORT
  // =====================================================

  const confirmImport = async () => {

    if (!sessionId) {

      alert(
        "Không tìm thấy phiên import."
      );

      return;

    }


    try {

      setImportLoading(true);


      const token =
        localStorage.getItem("token");


      // =================================================
      // IMPORT
      // =================================================

      const response =
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


      console.log(
        "IMPORT RESULT =",
        response.data
      );


      // =================================================
      // KIỂM TRA
      // =================================================

      if (
        response.data?.success === false
      ) {

        throw new Error(

          response.data?.message ||

          "Server báo import thất bại."

        );

      }


      // =================================================
      // KẾT QUẢ
      // =================================================

      const inserted =
        response.data?.inserted ?? 0;


      const updated =
        response.data?.updated ?? 0;


      const skipped =
        response.data?.skipped ?? 0;


      const total =
        response.data?.total ?? 0;


      console.log(
        "IMPORT SUCCESS:",
        {
          total,
          inserted,
          updated,
          skipped
        }
      );


      // =================================================
      // ĐÓNG MODAL
      // =================================================

      setImportOpen(false);

      setPreviewRows([]);

      setSummary(null);

      setSessionId("");


      // =================================================
      // THÔNG BÁO
      // =================================================

      alert(

        `Import thành công!\n\n` +

        `Tổng: ${total}\n` +

        `Thiết bị mới: ${inserted}\n` +

        `Cập nhật: ${updated}\n` +

        `Bỏ qua: ${skipped}`

      );


      // =================================================
      // RELOAD
      // =================================================

      try {

        await loadDevices();

      }

      catch (reloadError) {

        console.error(

          "IMPORT OK - RELOAD ERROR:",

          reloadError

        );


        alert(

          "Import đã thành công vào database,\n" +

          "nhưng không thể tải lại danh sách thiết bị.\n\n" +

          "Vui lòng bấm Reload để cập nhật danh sách."

        );

      }

    }

    catch (err) {

      console.error(

        "CONFIRM IMPORT ERROR:",

        err

      );


      alert(

        err.response?.data?.message ||

        err.message ||

        "Import thất bại."

      );

    }

    finally {

      setImportLoading(false);

    }

  };


  // =====================================================
  // ADD
  // =====================================================

  const handleAdd = () => {

    setEditingDevice(null);

    setOpen(true);

  };


  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (device) => {

    setEditingDevice(device);

    setOpen(true);

  };


  // =====================================================
  // DELETE
  // =====================================================

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

      console.error(
        "DELETE DEVICE ERROR:",
        err
      );


      alert(

        err.response?.data?.message ||

        "Không thể xóa thiết bị"

      );

    }

  };


  // =====================================================
  // SAVE SUCCESS
  // =====================================================

  const handleSuccess = async () => {

    setOpen(false);

    setEditingDevice(null);

    await loadDevices();

  };


  // =====================================================
  // CLOSE IMPORT
  // =====================================================

  const handleCloseImport = () => {

    if (importLoading) return;


    setImportOpen(false);

    setPreviewRows([]);

    setSummary(null);

    setSessionId("");

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="p-3 md:p-6 space-y-5">


      {/* =================================================
          TOOLBAR
      ================================================= */}

      <DeviceToolbar

        title="Danh sách thiết bị"

        role={role}

        onReload={loadDevices}

        onAdd={handleAdd}

        onExport={handleExport}

        onHistory={() =>
          setOpenHistory(true)
        }

        onImport={() =>
          fileInputRef.current?.click()
        }

        onSearch={handleSearch}

      />


      {/* =================================================
          FILTER
      ================================================= */}

      <DeviceFilter

        filters={filters}

        setFilters={setFilters}

        data={devices}

      />


      {/* =================================================
          TABLE
      ================================================= */}

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

              selectedStation={filters.station}

              selectedStatus={filters.status}

              searchKeyword={filters.name}

            />

          )

      }


      {/* =================================================
          IMPORT INPUT
      ================================================= */}

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


      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      <DeviceModal

        open={open}

        device={editingDevice}

        onClose={() => {

          setOpen(false);

          setEditingDevice(null);

        }}

        onSuccess={handleSuccess}

      />


      {/* =================================================
          IMPORT MODAL
      ================================================= */}

      <DeviceImportModal

        open={importOpen}

        summary={summary}

        rows={previewRows}

        loading={importLoading}

        onClose={handleCloseImport}

        onConfirm={confirmImport}

      />


      {/* =================================================
          HISTORY MODAL
      ================================================= */}

      <DeviceHistoryModal

        open={openHistory}

        onClose={() =>
          setOpenHistory(false)
        }

      />

    </div>

  );

}