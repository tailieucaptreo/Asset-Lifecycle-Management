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

  // ================= IMPORT PREVIEW =================
  const [previewRows, setPreviewRows] = useState([]);

  const [showPreview, setShowPreview] = useState(false);

  // ================= FORM =================
  const defaultForm = {

    name: "",
    deviceId: "",
    symbol: "",

    condition: "New",

    warehouse: "",
    cabinet: "",
    shelf: "",
    slot: "",

    initialQuantity: 0,

    quantity: 0,

    importQty: 0,

    exportQty: 0,

    unit: "Cái",

    image: ""
  };

  const [form, setForm] = useState(defaultForm);

  // ================= LOAD DATA =================
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
          payload
        );

      } else {

        await axios.post(
          `${API}/api/spare-devices`,
          payload
        );
      }

      setShowModal(false);

      setEditing(null);

      setForm(defaultForm);

      fetchData();

    } catch (err) {

      console.log(err);

      alert("❌ Lưu lỗi");
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

      importQty: 0,

      exportQty: 0,

      unit:
        item.unit || "Cái",

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
        `${API}/api/spare-devices/${id}`
      );

      fetchData();

    } catch (err) {

      console.log(err);

      alert("❌ Xóa lỗi");
    }
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

  // ================= EXPORT =================
  const handleExport = () => {

    window.open(
      `${API}/api/spare-devices/export`
    );
  };

  // ================= OPEN CREATE =================
  const openCreate = () => {

    setEditing(null);

    setForm(defaultForm);

    setShowModal(true);
  };

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
            Quản lý kho vật tư thiết bị
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

      {/* TABLE */}
      <div className="
        bg-white
        rounded-3xl
        shadow-lg
        overflow-hidden
      ">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  Thiết bị
                </th>

                <th className="p-4 text-left">
                  Mã ID
                </th>

                <th className="p-4 text-center">
                  Tình trạng
                </th>

                <th className="p-4 text-center">
                  Tồn kho
                </th>

                <th className="p-4 text-center">
                  ĐVT
                </th>

                <th className="p-4 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filtered.map((d) => (

                <tr
                  key={d.id}
                  className="border-t"
                >

                  <td className="p-4 font-semibold">
                    {d.name}
                  </td>

                  <td className="p-4">
                    {d.deviceId}
                  </td>

                  <td className="p-4 text-center">
                    {d.condition}
                  </td>

                  <td className="
                    p-4
                    text-center
                    font-bold
                    text-green-700
                  ">
                    {d.quantity}
                  </td>

                  <td className="p-4 text-center">
                    {d.unit}
                  </td>

                  <td className="p-4">

                    <div className="
                      flex
                      justify-center
                      gap-3
                    ">

                      <button
                        onClick={() => handleEdit(d)}
                        className="
                          p-2
                          rounded-xl
                          bg-blue-100
                          text-blue-600
                        "
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(d.id)
                        }
                        className="
                          p-2
                          rounded-xl
                          bg-red-100
                          text-red-600
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

      {/* ================= PREVIEW IMPORT ================= */}
      {showPreview && (

        <div className="
          fixed
          inset-0
          bg-black/40
          flex
          items-center
          justify-center
          z-50
          p-6
        ">

          <div className="
            bg-white
            rounded-3xl
            w-full
            max-w-6xl
            p-8
            shadow-2xl
          ">

            <h2 className="
              text-3xl
              font-bold
              mb-6
            ">
              📄 Xem trước dữ liệu import
            </h2>

            <div className="
              overflow-auto
              border
              rounded-2xl
            ">

              <table className="w-full">

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

                      <td className="
                        p-3
                        text-center
                        font-bold
                        text-blue-600
                      ">
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

            <div className="
              flex
              justify-end
              gap-4
              mt-6
            ">

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

    </div>
  );
}
