import { useEffect, useState } from "react";
import axios from "axios";

import API from "../config";

export default function VaconList() {

  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [station, setStation] = useState("");
  const [tandem, setTandem] = useState("");

  const [loading, setLoading] = useState(true);

  const handleImport = async (e) => {

    const file = e.target.files[0];
  
    if (!file) return;
  
    const formData = new FormData();
  
    formData.append("file", file);
  
    try {
  
      const token =
        localStorage.getItem("token");
  
      await axios.post(
  
        `${API}/api/vacon/import`,
  
        formData,
  
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
  
      );
  
      alert("Import thành công");
  
      loadData();
  
    } catch (err) {
  
      console.error(err);
  
      alert("Import thất bại");
  
    }
  
  };

  const filteredData = data.filter(item => {
  
    return (
  
      (!search ||
        item.deviceName?.toLowerCase()
          .includes(search.toLowerCase()) ||
  
        item.serialNumber?.toLowerCase()
          .includes(search.toLowerCase())
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

    if (!window.confirm("Xóa bản ghi?"))
      return;
  
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
  
    fetchData();
  
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

    }

    catch (err) {

      console.log(err);

      alert("Không tải được dữ liệu");

    }

    finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadData();

  }, []);

  if (loading) {

    return (
      <div className="p-6">
        Đang tải...
      </div>
    );

  }

  return (

    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          ⚡ Biến tần Vacon
        </h1>
      
        <div className="flex gap-3">
      
          <input
            placeholder="Tên thiết bị..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="border px-3 py-2 rounded"
          />
      
          <input
            placeholder="Station"
            value={station}
            onChange={(e)=>setStation(e.target.value)}
            className="border px-3 py-2 rounded w-28"
          />
      
          <input
            placeholder="Tandem"
            value={tandem}
            onChange={(e)=>setTandem(e.target.value)}
            className="border px-3 py-2 rounded w-32"
          />
      
          {user?.role === "admin" && (
            <button
              onClick={handleImport}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              📥 Import Excel
            </button>
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
          "
        >

          <thead>

            <tr className="bg-yellow-400 text-black">

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
        
          {data.map((row) => (
        
            <tr
              key={row.id}
              className="hover:bg-gray-50"
            >
        
              <td className="border p-2">
                {row.recordDate
                  ? new Date(
                      row.recordDate
                    ).toLocaleDateString()
                  : ""}
              </td>
        
              <td className="border p-2">
                {row.station}
              </td>
        
              <td className="border p-2">
                {row.tandem}
              </td>
        
              <td className="border p-2">
                {row.deviceName}
              </td>
        
              <td className="border p-2">
                {row.serialNumber}
              </td>
        
              <td className="border p-2">
                {row.operationHours}
              </td>
        
              <td className="border p-2">
                {row.note}
              </td>
        
              <td>
              
                <button
                  onClick={() => openDetail(item)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                >
                  Xem
                </button>
              
                {user?.role === "admin" && (
                  <>
                    <button
                      onClick={() => editItem(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Sửa
                    </button>
              
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Xóa
                    </button>
                  </>
                )}
              
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

      </div>

    </div>

  );

}
