import { useEffect, useState } from "react";
import axios from "axios";

import API from "../config";

export default function VaconList() {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const isAdmin =
    user.role === "admin";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);

  const [editing, setEditing] = useState(null);

  const [search, setSearch] = useState("");
  const [station, setStation] = useState("");
  const [tandem, setTandem] = useState("");

  const handleImport = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    try {

      const token =
        localStorage.getItem("token");

      await axios.post(

        `${API}/api/vacon/import`,

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

      alert("Import thành công");

      loadData();

    }

    catch (err) {

      console.log(err);

      alert("Import thất bại");

    }

  };

  const filteredData =
    data.filter((item) => {

      return (

        (!search ||

          item.deviceName
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )

          ||

          item.serialNumber
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )

        )

        &&

        (!station ||
          item.station === station)

        &&

        (!tandem ||
          item.tandem === tandem)

      );

    });

  const deleteItem = async (id) => {

    if (
      !window.confirm(
        "Xóa bản ghi?"
      )
    ) return;

    try {

      const token =
        localStorage.getItem("token");

      await axios.delete(

        `${API}/api/vacon/${id}`,

        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }

      );

      loadData();

    }

    catch (err) {

      console.log(err);

      alert("Không thể xóa");

    }

  };

  const saveEdit = async () => {

    try {

      const token =
        localStorage.getItem("token");

      await axios.put(
        `${API}/api/vacon/${editing.id}`,
        {
          application: editing.application,
          powerUnitDate: editing.powerUnitDate,
          serialNumber: editing.serialNumber,
          operationHours: editing.operationHours,
          faultHistory: editing.faultHistory,
          description: editing.description,
          possibleCause: editing.possibleCause,
          correctiveActions: editing.correctiveActions,
          note: editing.note
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Đã cập nhật");

      setEditing(null);

      loadData();

    }

    catch (err) {

      console.log(err);

      alert("Cập nhật thất bại");

    }

  };

  const loadData = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res =
        await axios.get(
          `${API}/api/vacon`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      setData(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadData();

  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Đang tải dữ liệu...
      </div>
    );

  }

  return (

    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          ⚡ Biến tần Vacon
        </h1>

        <div className="flex gap-3 flex-wrap mb-5">

          <input
            placeholder="Tìm thiết bị..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="border px-3 py-2 rounded"
          />

          <input
            placeholder="Station"
            value={station}
            onChange={(e) =>
              setStation(
                e.target.value
              )
            }
            className="border px-3 py-2 rounded"
          />

          <input
            placeholder="Tandem"
            value={tandem}
            onChange={(e) =>
              setTandem(
                e.target.value
              )
            }
            className="border px-3 py-2 rounded"
          />

          {isAdmin && (

            <label
              className="
              bg-green-600
              text-white
              px-4
              py-2
              rounded
              cursor-pointer
              "
            >

              📥 Import Excel

              <input
                type="file"
                hidden
                accept=".xlsx,.xls"
                onChange={handleImport}
              />

            </label>

          )}

        </div>

      </div>

      <div
        className="
        bg-white
        rounded-xl
        shadow
        overflow-auto
        "
      >

        <table
          className="
          w-full
          border-collapse
          table-auto
          text-center
          "
        >

          <thead>

            <tr className="bg-yellow-400 text-black text-center">

              <th className="border p-2">
                Record Date
              </th>

              <th className="border p-2">
                Station
              </th>

              <th className="border p-2">
                Tandem
              </th>

              <th className="border p-2">
                Device Name
              </th>

              <th className="border p-2">
                Serial Number
              </th>

              <th className="border p-2">
                Operation Hours
              </th>

              <th className="border p-2">
                Note
              </th>

              <th className="border p-2">Chi tiết</th>

            </tr>

          </thead>
          <tbody>

            {filteredData.map((row) => (

              <tr key={row.id}>

                <td className="border p-3 text-center align-middle">
                  {row.recordDate
                    ? new Date(
                      row.recordDate
                    ).toLocaleDateString()
                    : ""}
                </td>

                <td className="border p-3 text-center align-middle">
                  {row.station}
                </td>
              
                <td className="border p-3 text-center align-middle">
                  {row.tandem}
                </td>
              
                <td className="border p-3 text-center align-middle">
                  {row.deviceName}
                </td>
              
                <td className="border p-3 text-center align-middle">
                  {row.serialNumber}
                </td>
              
                <td className="border p-3 text-center align-middle">
                  {row.operationHours}
                </td>
              
                <td className="border p-3 text-center align-middle">
                  {row.note}
                </td>
              
                <td className="border p-3 text-center align-middle">

                  <div className="flex justify-center items-center gap-4">

                    <button
                      onClick={() =>
                        setSelected(row)
                      }
                        className="
                        text-blue-600
                        hover:underline
                        font-medium
                        "
                    >
                      Xem
                    </button>

                    {isAdmin && (
                      <>
                        <button
                          onClick={() =>
                            setEditing(row)
                          }
                          className="
                          text-amber-600
                          hover:underline
                          font-medium
                          "
                        >
                          Sửa
                        </button>

                        <button
                          onClick={() =>
                            deleteItem(row.id)
                          }
                          className="
                          text-red-600
                          hover:underline
                          font-medium
                          "
                        >
                          Xóa
                        </button>
                      </>
                    )}

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {selected && (

          <div
            className="
            fixed inset-0
            bg-black/50
            flex
            items-center
            justify-center
            z-50
            "
          >

            <div
              className="
              bg-white
              rounded-xl
              p-6
              w-[900px]
              max-h-[90vh]
              overflow-auto
              "
            >

              <div className="flex justify-between mb-4">

                <h2 className="text-2xl font-bold">
                  Chi tiết biến tần Vacon
                </h2>

                <button
                  onClick={() =>
                    setSelected(null)
                  }
                  className="text-red-500"
                >
                  ✕
                </button>

              </div>

              <div className="space-y-4">

                <p>
                  <b>Ngày:</b>{" "}
                  {selected.recordDate
                    ? new Date(
                      selected.recordDate
                    ).toLocaleDateString()
                    : ""}
                </p>

                <p>
                  <b>Station:</b>{" "}
                  {selected.station}
                </p>

                <p>
                  <b>Tandem:</b>{" "}
                  {selected.tandem}
                </p>

                <p>
                  <b>Thiết bị:</b>{" "}
                  {selected.deviceName}
                </p>

                <p>
                  <b>Serial:</b>{" "}
                  {selected.serialNumber}
                </p>

                <p>
                  <b>Application:</b>{" "}
                  {selected.application}
                </p>

                <p>
                  <b>Power Unit Date:</b>{" "}
                  {selected.powerUnitDate}
                </p>

                <div>

                  <h3 className="font-bold">
                    Fault History
                  </h3>

                  <pre
                    className="
                    whitespace-pre-wrap
                    bg-gray-100
                    p-3
                    rounded
                    "
                  >
                    {selected.faultHistory}
                  </pre>

                </div>

                <div>

                  <h3 className="font-bold">
                    Description
                  </h3>

                  <pre
                    className="
                    whitespace-pre-wrap
                    bg-gray-100
                    p-3
                    rounded
                    "
                  >
                    {selected.description}
                  </pre>

                </div>

                <div>

                  <h3 className="font-bold">
                    Possible Cause
                  </h3>

                  <pre
                    className="
                    whitespace-pre-wrap
                    bg-gray-100
                    p-3
                    rounded
                    "
                  >
                    {selected.possibleCause}
                  </pre>

                </div>

                <div>

                  <h3 className="font-bold">
                    Corrective Actions
                  </h3>

                  <pre
                    className="
                    whitespace-pre-wrap
                    bg-gray-100
                    p-3
                    rounded
                    "
                  >
                    {selected.correctiveActions}
                  </pre>

                </div>

                <div>

                  <h3 className="font-bold">
                    Note
                  </h3>

                  <pre
                    className="
                    whitespace-pre-wrap
                    bg-gray-100
                    p-3
                    rounded
                    "
                  >
                    {selected.note}
                  </pre>

                </div>

              </div>

            </div>

          </div>

        )}

        {editing && (

          <div
            className="
            fixed inset-0
            bg-black/50
            flex items-center
            justify-center
            z-50
            "
          >

            <div
              className="
              bg-white
              rounded-xl
              p-6
              w-[1100px]
              max-h-[90vh]
              overflow-y-auto
              "
            >

              <h2 className="text-xl font-bold mb-4">
                Chỉnh sửa biến tần
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="font-semibold">
                    Record Date
                  </label>

                  <input
                    type="date"
                    value={
                      editing.recordDate
                        ? new Date(editing.recordDate)
                          .toISOString()
                          .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        recordDate: e.target.value
                      })
                    }
                    className="
                    border
                    p-2
                    rounded
                    w-full
                    "
                  />
                </div>

                {/* Application */}
                <div>
                  <label className="font-semibold">
                    Application
                  </label>

                  <textarea
                    value={editing.application || ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        application: e.target.value
                      })
                    }
                    className="border p-2 rounded w-full h-24"
                  />
                </div>

                {/* Power Unit Date */}
                <div>
                  <label className="font-semibold">
                    Power Unit Date
                  </label>

                  <input
                    type="text"
                    value={editing.powerUnitDate || ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        powerUnitDate: e.target.value
                      })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Serial Number */}
                <div>
                  <label className="font-semibold">
                    Serial Number
                  </label>

                  <input
                    type="text"
                    value={editing.serialNumber || ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        serialNumber: e.target.value
                      })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Operation Hours */}
                <div>
                  <label className="font-semibold">
                    Operation Hours
                  </label>

                  <input
                    type="text"
                    value={editing.operationHours || ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        operationHours: e.target.value
                      })
                    }
                    className="border p-2 rounded w-full"
                  />
                </div>

                {/* Fault History */}
                <div>
                  <label className="font-semibold">
                    Fault History
                  </label>

                  <textarea
                    value={editing.faultHistory || ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        faultHistory: e.target.value
                      })
                    }
                    className="border p-2 rounded w-full h-32"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="font-semibold">
                    Description
                  </label>

                  <textarea
                    value={editing.description || ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        description: e.target.value
                      })
                    }
                    className="border p-2 rounded w-full h-32"
                  />
                </div>

                {/* Possible Cause */}
                <div>
                  <label className="font-semibold">
                    Possible Cause
                  </label>

                  <textarea
                    value={editing.possibleCause || ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        possibleCause: e.target.value
                      })
                    }
                    className="border p-2 rounded w-full h-32"
                  />
                </div>

                {/* Corrective Actions */}
                <div>
                  <label className="font-semibold">
                    Corrective Actions
                  </label>

                  <textarea
                    value={editing.correctiveActions || ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        correctiveActions: e.target.value
                      })
                    }
                    className="border p-2 rounded w-full h-32"
                  />
                </div>

                {/* Note */}
                <div>
                  <label className="font-semibold">
                    Note
                  </label>

                  <textarea
                    value={editing.note || ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        note: e.target.value
                      })
                    }
                    className="border p-2 rounded w-full h-24"
                  />
                </div>

              </div>

              <div className="mt-4 flex gap-3">

                <button
                  onClick={saveEdit}
                  className="
                  bg-green-600
                  text-white
                  px-4
                  py-2
                  rounded
                  "
                >
                  Lưu
                </button>

                <button
                  onClick={() =>
                    setEditing(null)
                  }
                  className="
                  bg-gray-500
                  text-white
                  px-4
                  py-2
                  rounded
                  "
                >
                  Hủy
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}
