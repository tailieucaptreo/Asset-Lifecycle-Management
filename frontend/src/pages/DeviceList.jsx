import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";
import { useLocation } from "react-router-dom";
import Table from "../components/Table";

export default function DeviceList() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const status = params.get("status");

  // ================= LOAD DATA =================
  const fetchDevices = async () => {

    try {

      setLoading(true);

      const res = await axios.get(`${API}/api/devices`);

      let result = res.data;

      // FILTER STATUS URL
      if (status) {

        result = result.filter(
          (d) => d.status === status
        );
      }

      setData(result);

    } catch (err) {

      console.log("LOAD DEVICE ERROR:", err);

      alert("Không tải được dữ liệu");

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchDevices();

  }, [status]);

  return (

    <div className="p-3 md:p-6 w-full">

      {/* TITLE */}
      <div className="flex justify-between items-center mb-5">

        <h1 className="text-lg md:text-2xl font-bold">

          📋 Danh sách thiết bị

          {status && (
            <span className="ml-2 text-blue-600">
              - {status}
            </span>
          )}

        </h1>

        <button
          onClick={fetchDevices}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-sm md:px-4 rounded-lg shadow"
        >
          🔄 Reload
        </button>

      </div>

      {/* LOADING */}
      {loading ? (

        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">

          Đang tải dữ liệu...

        </div>

      ) : (

        <Table
          data={data}
          setData={setData}
        />

      )}

    </div>
  );
}