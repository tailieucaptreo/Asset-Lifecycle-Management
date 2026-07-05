import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";
import { useLocation } from "react-router-dom";
import DeviceTable from "../components/Device/DeviceTable";
import DeviceToolbar from "../components/Device/DeviceToolbar";

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

    let result =
      Array.isArray(
        res.data
      )
        ? res.data
        : [];

    if (status) {

      result =
        result.filter(
          d =>
            d.status === status
        );

    }

    setData(result);

  }

  catch (err) {

    console.log(
      "LOAD DEVICE ERROR",
      err.response?.data
    );

    alert(
      err.response?.data?.message
      ||
      "Không tải được thiết bị"
    );

    setData([]);

  }

  finally {

    setLoading(false);

  }

};

  useEffect(() => {

    fetchDevices();

  }, [status]);

  return (

    <div className="p-3 md:p-6 w-full">

      <DeviceToolbar

          title="📋 Danh sách thiết bị"
      
          role={localStorage.getItem("role")}
      
          onReload={fetchDevices}
      
          onExport={handleExport}
      
          onAdd={() => navigate("/add")}
      
      />

      {/* LOADING */}
      {loading ? (

        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">

          Đang tải dữ liệu...

        </div>

      ) : (

        <DeviceTable

            data={data}
            setData={setData}
    
        />

      )}

    </div>
  );
}
