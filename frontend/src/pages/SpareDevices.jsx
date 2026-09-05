import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";

import SpareTable from "../components/Spare/SpareTable";
import SpareHeader from "../components/Spare/SpareHeader";
import SpareToolbar from "../components/Spare/SpareToolbar";
import SpareCard from "../components/Spare/SpareCard";

import EditSpareModal from "../components/Spare/EditSpareModal";
import HistoryModal from "../components/Spare/HistoryModal";
import ImportPreviewModal from "../components/Spare/ImportPreviewModal";

import { useNavigate, useLocation } from "react-router-dom";


export default function SpareDevices() {

  // =====================================================
  // USER / AUTH
  // =====================================================

  const role =
    localStorage.getItem("role");

  const token =
    localStorage.getItem("token");


  // =====================================================
  // ROUTER
  // =====================================================

  const navigate =
    useNavigate();

  const location =
    useLocation();


  // =====================================================
  // DATA
  // =====================================================

  const [data, setData] =
    useState([]);


  // =====================================================
  // SEARCH
  // =====================================================

  const [search, setSearch] =
    useState("");


  // =====================================================
  // FILTER
  // =====================================================

  const [filter, setFilter] =
    useState("All");


  // =====================================================
  // EDIT MODAL
  // =====================================================

  const [showModal, setShowModal] =
    useState(false);

  const [editing, setEditing] =
    useState(null);


  // =====================================================
  // HISTORY
  // =====================================================

  const [showHistory, setShowHistory] =
    useState(false);

  const [historyData, setHistoryData] =
    useState([]);


  // =====================================================
  // IMPORT PREVIEW
  // =====================================================

  const [previewRows, setPreviewRows] =
    useState([]);

  const [showPreview, setShowPreview] =
    useState(false);


  // =====================================================
  // IMPORT SUMMARY
  // =====================================================

  const [summary, setSummary] =
    useState({

      total: 0,

      newCount: 0,

      updateCount: 0,

      skipCount: 0,

      warningCount: 0

    });


  // =====================================================
  // IMPORT SESSION
  // =====================================================

  const [sessionId, setSessionId] =
    useState(null);


  // =====================================================
  // IMPORT LOADING
  // =====================================================

  const [importLoading, setImportLoading] =
    useState(false);


  // =====================================================
  // DEFAULT FORM
  // =====================================================

  const defaultForm = {

    name: "",

    deviceId: "",

    symbol: "",

    condition: "New",

    warehouse: "",

    cabinet: "",

    shelf: "",

    slot: "",


    // =================================================
    // INVENTORY
    // =================================================

    initialQuantity: 0,

    quantity: 0,

    importQty: 0,

    exportQty: 0,

    unit: "Cái",


    // =================================================
    // OTHER
    // =================================================

    editedBy: "",

    note: "",

    image: ""

  };


  const [form, setForm] =
    useState(defaultForm);



  // =====================================================
  // NORMALIZE SEARCH
  // =====================================================
  //
  // Ví dụ:
  //
  // "Công Tắc Hành Trình"
  //        ↓
  // "cong tac hanh trinh"
  //
  // "Đà Nẵng"
  //        ↓
  // "da nang"
  //
  // =====================================================

  const normalizeSearch = (value) => {

    if (
      value === null ||
      value === undefined
    ) {

      return "";

    }


    return String(value)

      .toLowerCase()

      .normalize("NFD")

      .replace(
        /[\u0300-\u036f]/g,
        ""
      )

      .replace(
        /đ/g,
        "d"
      )

      .replace(
        /\s+/g,
        " "
      )

      .trim();

  };


  // =====================================================
  // GET INITIALS
  // =====================================================
  //
  // Ví dụ:
  //
  // Công tắc hành trình
  //        ↓
  // ctht
  //
  // PLC điều khiển
  //        ↓
  // pdk
  //
  // =====================================================

  const getInitials = (value) => {

    const text =
      normalizeSearch(value);


    if (!text) {

      return "";

    }


    return text

      .split(/\s+/)

      .filter(Boolean)

      .map(
        word =>
          word.charAt(0)
      )

      .join("");

  };


  // =====================================================
  // LOAD DATA
  // =====================================================

  const fetchData = async () => {

    try {

      const res =
        await axios.get(

          `${API}/api/spare-devices`,

          {

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }

        );


      setData(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    }

    catch (err) {

      console.error(
        "LOAD SPARE DEVICES ERROR:",
        err
      );

      setData([]);

    }

  };


  // =====================================================
  // LOAD FIRST
  // =====================================================

  useEffect(() => {

    fetchData();

  }, []);



  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filtered =
    data.filter((item) => {


      // =================================================
      // KEYWORD
      // =================================================

      const keyword =
        normalizeSearch(search);


      // =================================================
      // CÁC TRƯỜNG ĐƯỢC PHÉP TÌM
      // =================================================

      const searchFields = [

        // Tên
        item.name,

        // Mã ID
        item.deviceId,

        // Ký hiệu
        item.symbol,

        // Tình trạng
        item.condition,

        // Kho
        item.warehouse,

        // Tủ
        item.cabinet,

        // Kệ
        item.shelf,

        // Khay
        item.slot,

        // ĐVT
        item.unit,

        // Số lượng
        item.quantity,

        item.initialQuantity,

        item.importQty,

        item.exportQty,

        // Người chỉnh sửa
        item.editedBy,

        // Ghi chú
        item.note

      ];


      // =================================================
      // GHÉP TEXT
      //
      // Mỗi field gồm:
      //
      // 1. Nội dung bình thường
      // 2. Chữ cái đầu
      //
      // =================================================

      const fullText =

        searchFields

          .filter(
            value =>
              value !== null &&
              value !== undefined
          )

          .map((value) => {

            const text =
              normalizeSearch(value);


            const initials =
              getInitials(value);


            return `
              ${text}
              ${initials}
            `;

          })

          .join(" ");


      // =================================================
      // SEARCH MATCH
      // =================================================

      const matchSearch =

        !keyword ||

        fullText.includes(
          keyword
        );


      // =================================================
      // CONDITION FILTER
      // =================================================

      const matchCondition =

        filter === "All" ||

        normalizeSearch(
          item.condition
        ) ===

        normalizeSearch(
          filter
        );


      // =================================================
      // RETURN
      // =================================================

      return (

        matchSearch &&

        matchCondition

      );

    });



  // =====================================================
  // STATISTICS
  // =====================================================

  const total =
    data.length;


  const newCount =
    data.filter(
      item =>
        item.condition === "New"
    ).length;


  const usedCount =
    data.filter(
      item =>
        item.condition === "Used"
    ).length;


  const brokenCount =
    data.filter(
      item =>
        item.condition === "Broken"
    ).length;


  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async () => {

    try {


      // ================================================
      // VALIDATE
      // ================================================

      if (
        !String(form.name || "").trim()
      ) {

        alert(
          "Nhập tên thiết bị"
        );

        return;

      }


      // ================================================
      // PAYLOAD
      // ================================================

      const payload = {

        ...form,

        name:
          String(form.name || "").trim(),

        deviceId:
          String(form.deviceId || "").trim(),

        symbol:
          String(form.symbol || "").trim(),

        condition:
          form.condition || "New",

        warehouse:
          String(form.warehouse || "").trim(),

        cabinet:
          String(form.cabinet || "").trim(),

        shelf:
          String(form.shelf || "").trim(),

        slot:
          String(form.slot || "").trim(),


        initialQuantity:
          Number(
            form.initialQuantity || 0
          ),


        quantity:
          Number(
            form.quantity || 0
          ),


        importQty:
          Number(
            form.importQty || 0
          ),


        exportQty:
          Number(
            form.exportQty || 0
          ),


        unit:
          form.unit || "Cái",

        editedBy:
          form.editedBy || "",

        note:
          form.note || "",

        image:
          form.image || ""

      };


      // ================================================
      // UPDATE
      // ================================================

      if (editing) {

        await axios.put(

          `${API}/api/spare-devices/${editing.id}`,

          payload,

          {

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }

        );

      }

      // ================================================
      // CREATE
      // ================================================

      else {

        await axios.post(

          `${API}/api/spare-devices`,

          payload,

          {

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }

        );

      }


      // ================================================
      // CLOSE
      // ================================================

      setShowModal(false);

      setEditing(null);

      setForm({
        ...defaultForm
      });


      // ================================================
      // RELOAD
      // ================================================

      await fetchData();

    }

    catch (err) {

      console.error(
        "SAVE SPARE DEVICE ERROR:",
        err
      );


      alert(
        err.response?.data?.message ||
        "❌ Lưu thiết bị lỗi"
      );

    }

  };



  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (item) => {

    setEditing(item);


    setForm({

      name:
        item.name || "",

      deviceId:
        item.deviceId || "",

      symbol:
        item.symbol || "",

      condition:
        item.condition || "New",

      warehouse:
        item.warehouse || "",

      cabinet:
        item.cabinet || "",

      shelf:
        item.shelf || "",

      slot:
        item.slot || "",


      initialQuantity:
        item.initialQuantity || 0,

      quantity:
        item.quantity || 0,


      // ===============================================
      // NHẬP / XUẤT MỚI
      // ===============================================

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



  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {


    if (
      !window.confirm(
        "Xóa thiết bị này?"
      )
    ) {

      return;

    }


    try {

      await axios.delete(

        `${API}/api/spare-devices/${id}`,

        {

          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }

      );


      await fetchData();

    }

    catch (err) {

      console.error(
        "DELETE SPARE DEVICE ERROR:",
        err
      );


      alert(
        err.response?.data?.message ||
        "❌ Xóa lỗi"
      );

    }

  };



  // =====================================================
  // EXPORT
  // =====================================================

  const handleExport = () => {

    window.open(

      `${API}/api/spare-devices/export`,

      "_blank"

    );

  };



  // =====================================================
  // IMPORT EXCEL
  // =====================================================

  const handleImportExcel =
    async (file) => {

      if (!file) {

        return;

      }


      try {

        setImportLoading(true);


        // ==============================================
        // FORM DATA
        // ==============================================

        const formData =
          new FormData();


        formData.append(
          "file",
          file
        );


        // ==============================================
        // PREVIEW API
        // ==============================================

        const res =
          await axios.post(

            `${API}/api/spare-devices/preview-import`,

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


        // ==============================================
        // SESSION
        // ==============================================

        setSessionId(
          res.data.sessionId ||
          null
        );


        // ==============================================
        // SUMMARY
        // ==============================================

        setSummary({

          total:
            res.data.summary?.total ||
            0,

          newCount:
            res.data.summary?.newCount ||
            0,

          updateCount:
            res.data.summary?.updateCount ||
            0,

          skipCount:
            res.data.summary?.skipCount ||
            0,

          warningCount:
            res.data.summary?.warningCount ||
            0

        });


        // ==============================================
        // ROWS
        // ==============================================

        setPreviewRows(

          Array.isArray(
            res.data.rows
          )

            ? res.data.rows

            : []

        );


        // ==============================================
        // SHOW PREVIEW
        // ==============================================

        setShowPreview(true);

      }

      catch (err) {

        console.error(
          "IMPORT PREVIEW ERROR:",
          err
        );


        alert(

          err.response?.data?.error ||

          err.response?.data?.message ||

          "❌ Preview import thất bại"

        );

      }

      finally {

        setImportLoading(false);

      }

    };



  // =====================================================
  // CONFIRM IMPORT
  // =====================================================

  const handleConfirmImport =
    async () => {


      if (!sessionId) {

        alert(
          "Không có phiên import."
        );

        return;

      }


      try {

        setImportLoading(true);


        // ==============================================
        // CONFIRM API
        // ==============================================

        await axios.post(

          `${API}/api/spare-devices/confirm-import`,

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


        // ==============================================
        // CLOSE PREVIEW
        // ==============================================

        setShowPreview(false);


        // ==============================================
        // RESET IMPORT
        // ==============================================

        setPreviewRows([]);

        setSessionId(null);

        setSummary({

          total: 0,

          newCount: 0,

          updateCount: 0,

          skipCount: 0,

          warningCount: 0

        });


        // ==============================================
        // RELOAD
        // ==============================================

        await fetchData();


        alert(
          "✅ Import thành công"
        );

      }

      catch (err) {

        console.error(
          "CONFIRM IMPORT ERROR:",
          err
        );


        alert(

          err.response?.data?.error ||

          err.response?.data?.message ||

          "❌ Import thất bại"

        );

      }

      finally {

        setImportLoading(false);

      }

    };



  // =====================================================
  // CLOSE PREVIEW
  // =====================================================

  const handleClosePreview = () => {

    if (importLoading) {

      return;

    }


    setShowPreview(false);

    setPreviewRows([]);

    setSessionId(null);

  };



  // =====================================================
  // LOAD HISTORY
  // =====================================================

  const loadHistory = async () => {

    try {

      const res =
        await axios.get(

          `${API}/api/spare-devices/history`,

          {

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }

        );


      setHistoryData(

        Array.isArray(res.data)

          ? res.data

          : []

      );


      setShowHistory(true);

    }

    catch (err) {

      console.error(
        "LOAD SPARE HISTORY ERROR:",
        err
      );


      alert(
        "❌ Không thể lấy lịch sử"
      );

    }

  };



  // =====================================================
  // OPEN CREATE
  // =====================================================

  const openCreate = () => {

    setEditing(null);

    setForm({
      ...defaultForm
    });

    setShowModal(true);

  };



  // =====================================================
  // EDIT FROM NAVIGATION STATE
  // =====================================================
  //
  // Giữ tương thích với trường hợp:
  //
  // navigate("/spare-devices", {
  //   state: {
  //     edit: item
  //   }
  // })
  //
  // =====================================================

  useEffect(() => {

    const editItem =
      location.state?.edit;


    if (!editItem) {

      return;

    }


    handleEdit(
      editItem
    );


    // ==============================================
    // XÓA STATE
    // ==============================================

    navigate(
      location.pathname,
      {
        replace: true,
        state: {}
      }
    );

  }, [
    location.state
  ]);



  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div
      className="
        p-6
        bg-gray-100
        min-h-screen
      "
    >


      {/* =================================================
          HEADER
      ================================================= */}

      <SpareHeader
        role={role}
      />



      {/* =================================================
          TOOLBAR
      ================================================= */}

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



      {/* =================================================
          STATISTICS
      ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-4
          mb-6
        "
      >

        {/* TOTAL */}

        <div
          className="
            bg-white
            rounded-xl
            shadow
            p-4
          "
        >

          <div
            className="
              text-sm
              text-gray-500
            "
          >
            Tổng thiết bị
          </div>

          <div
            className="
              text-2xl
              font-bold
              text-blue-600
            "
          >
            {total}
          </div>

        </div>



        {/* NEW */}

        <div
          className="
            bg-white
            rounded-xl
            shadow
            p-4
          "
        >

          <div
            className="
              text-sm
              text-gray-500
            "
          >
            Thiết bị mới
          </div>

          <div
            className="
              text-2xl
              font-bold
              text-green-600
            "
          >
            {newCount}
          </div>

        </div>



        {/* USED */}

        <div
          className="
            bg-white
            rounded-xl
            shadow
            p-4
          "
        >

          <div
            className="
              text-sm
              text-gray-500
            "
          >
            Đã sử dụng
          </div>

          <div
            className="
              text-2xl
              font-bold
              text-orange-500
            "
          >
            {usedCount}
          </div>

        </div>



        {/* BROKEN */}

        <div
          className="
            bg-white
            rounded-xl
            shadow
            p-4
          "
        >

          <div
            className="
              text-sm
              text-gray-500
            "
          >
            Hỏng
          </div>

          <div
            className="
              text-2xl
              font-bold
              text-red-500
            "
          >
            {brokenCount}
          </div>

        </div>

      </div>



      {/* =================================================
          DESKTOP TABLE
      ================================================= */}

      <div
        className="
          hidden
          lg:block
        "
      >

        <SpareTable

          data={filtered}

          role={role}

          onEdit={handleEdit}

          onDelete={handleDelete}

        />

      </div>



      {/* =================================================
          MOBILE CARD
      ================================================= */}

      <div
        className="
          lg:hidden
          space-y-4
        "
      >

        {filtered.map(
          (item) => (

            <SpareCard

              key={item.id}

              item={item}

              role={role}

              onView={() =>
                navigate(
                  `/spare-devices/${item.id}`
                )
              }

              onEdit={
                handleEdit
              }

              onDelete={
                handleDelete
              }

            />

          )
        )}


        {/* EMPTY */}

        {filtered.length === 0 && (

          <div
            className="
              bg-white
              rounded-xl
              shadow
              p-10
              text-center
              text-gray-400
            "
          >

            Không có thiết bị phù hợp.

          </div>

        )}

      </div>



      {/* =================================================
          IMPORT PREVIEW
      ================================================= */}

      <ImportPreviewModal

        show={
          showPreview
        }

        previewData={
          previewRows
        }

        summary={
          summary
        }

        loading={
          importLoading
        }

        onClose={
          handleClosePreview
        }

        onImport={
          handleConfirmImport
        }

      />



      {/* =================================================
          HISTORY
      ================================================= */}

      <HistoryModal

        show={
          showHistory
        }

        history={
          historyData
        }

        onClose={() =>
          setShowHistory(false)
        }

      />



      {/* =================================================
          EDIT / CREATE
      ================================================= */}

      <EditSpareModal

        show={
          showModal
        }

        editing={
          editing
        }

        form={
          form
        }

        setForm={
          setForm
        }

        role={
          role
        }

        defaultForm={
          defaultForm
        }

        onClose={() => {

          setShowModal(false);

          setEditing(null);

          setForm({
            ...defaultForm
          });

        }}

        onSave={
          handleSave
        }

      />


    </div>

  );

}