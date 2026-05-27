import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";

import Header from "../components/Header.jsx";
import Card from "../components/Card.jsx";
import Chart from "../components/Chart.jsx";
import AdvancedFilter from "../components/AdvancedFilter.jsx";
import Table from "../components/Table.jsx";

import {
  Cpu,
  CheckCircle,
  Wrench,
  AlertTriangle,
  BatteryCharging
} from "lucide-react";

export default function Dashboard() {

  // =============================
  // STATE
  // =============================
  const [devices, setDevices] = useState([]);
  const [spareDevices, setSpareDevices] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState({
    id: "",
    line: [],
    station: [],
    status: ""
  });

  // =============================
  // LOAD DATA
  // =============================
  const fetchData = async () => {

  try {

    const token =
      localStorage.getItem("token");

    const headers = {
      Authorization:
        `Bearer ${token}`
    };

    // LOAD DEVICE
    const deviceRes =
      await axios.get(
        `${API}/api/devices`,
        {
          headers
        }
      );

    console.log(
      "DEVICE",
      deviceRes.data
    );

    setDevices(

      Array.isArray(
        deviceRes.data
      )

      ? deviceRes.data

      : deviceRes.data.devices || []

    );

    // LOAD SPARE
    const spareRes =
      await axios.get(
        `${API}/api/spare-devices`,
        {
          headers
        }
      );

    setSpareDevices(

      Array.isArray(
        spareRes.data
      )

      ? spareRes.data

      : spareRes.data.data || []

    );

  }

  catch (err) {

    console.log(
      "FETCH ERROR",
      err.response?.data ||
      err.message
    );

    setDevices([]);
    setSpareDevices([]);

  }

};
  useEffect(() => {
    fetchData();
  }, []);

  // =============================
  // SEARCH DELAY
  // =============================
  useEffect(() => {

    const t = setTimeout(() => {
      setSearch(searchInput);
    }, 300);

    return () => clearTimeout(t);

  }, [searchInput]);

  const now = new Date();

  // =============================
  // FILTER
  // =============================
  const filtered = devices.filter((d) => {

    const keyword = search.toLowerCase();

    return (

      (!filter.id ||
        (d.deviceId || "")
          .toLowerCase()
          .includes(filter.id.toLowerCase())) &&

      (!filter.line.length ||
        filter.line.includes(d.line)) &&

      (!filter.station.length ||
        filter.station.includes(d.station)) &&

      (!filter.status ||
        calcStatus(d) === filter.status) &&

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

  // =============================
// TÍNH TRẠNG THÁI THEO TUỔI THỌ
// =============================

const calcStatus = (d) => {

    if (
      !d.installDate
      ||
      !d.lifespan
      ){
    
    return "Active";
  
  }
  
  const now = new Date();
  
  const install = new Date(d.installDate);
  
  // số năm đã dùng
  const usedYear =
  
    (
    now-install
    )
    
    /
    
    (
    1000*
    60*
    60*
    24*
    365
  );
  
  // % tuổi thọ
  const percent =
  
    usedYear
    /
    Number(
    d.lifespan
  );
  
  // quá tuổi thọ
  if(
   percent>=1
  ){
  
  return "Expired";
  
  }
  
  // tới ngưỡng bảo trì
  if(
   percent>=0.7
  ){
  
  return "Maintenance";
  
  }
  
  return "Active";

};


  // =============================
  // STATS
  // =============================
  
  const total =
  filtered.length;
  
  const active =
  filtered.filter(
  d=>
  calcStatus(d)
  ===
  "Active"
  ).length;
  
  const maintenance =
  filtered.filter(
  d=>
  calcStatus(d)
  ===
  "Maintenance"
  ).length;
  
  const expired =
  filtered.filter(
  d=>
  calcStatus(d)
  ===
  "Expired"
  ).length;

  // =============================
  // SPARE DEVICE COUNT
  // =============================
  const spareTotal = spareDevices.reduce(
    (sum, item) => {
      return sum + (item.quantity || 0);
    },
    0
  );

  // =============================
  // EXPORT EXCEL
  // =============================
  const handleExport = async () => {
  
  try{
  
  const token =
  localStorage.getItem(
  "token"
  );
  
  const res =
  await fetch(
  
  `${API}/api/devices/export`,
  
  {
  
  headers:{
  
  Authorization:
  `Bearer ${token}`
  
  }
  
  }
  
  );
  
  if(!res.ok){
  
  throw new Error(
  "Export thất bại"
  );
  
  }
  
  const blob =
  await res.blob();
  
  const url =
  window.URL.createObjectURL(
  blob
  );
  
  const a =
  document.createElement(
  "a"
  );
  
  a.href =
  url;
  
  a.download =
  "devices.xlsx";
  
  document.body.appendChild(
  a
  );
  
  a.click();
  
  a.remove();
  
  window.URL
  .revokeObjectURL(
  url
  );
  
  }
  
  catch(err){
  
  console.log(err);
  
  alert(
  err.message
  );
  
  }
  
  };

  // =============================
  // RENDER
  // =============================
  return (

    <div className="flex-1 min-h-screen bg-gray-100 p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">

        <h1 className="text-3xl font-bold">
          📊 Dashboard
        </h1>

        <div className="flex gap-3">

          <Header
            onSearch={setSearchInput}
            devices={devices}
          />

          <button
              onClick={handleExport}
              className="
              bg-blue-500
              hover:bg-blue-600
              text-white
              px-5
              py-2
              rounded-xl
              shadow
              transition
              "

          >
            Export
          </button>

        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white rounded-2xl shadow p-4">

        <AdvancedFilter
          devices={devices}
          filter={filter}
          setFilter={setFilter}
        />

      </div>

      {/* CARD */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-5
          gap-5
          mt-6
        "
      >

        {/* TOTAL */}
        <Card
          title="Tổng Thiết bị đang lắp đặt sử dụng"
          value={total}
          color="bg-blue-500"
          icon={<Cpu />}
          to="/devices"
        />

        {/* ACTIVE */}
        <Card
          title="Thiết bị đang sử dụng còn tuổi thọ"
          value={active}
          color="bg-green-500"
          icon={<CheckCircle />}
          to="/devices?status=Active"
        />

        {/* MAINTENANCE */}
        <Card
          title="Thiết bị đang sử dụng cần bảo trì"
          value={maintenance}
          color="bg-yellow-500"
          icon={<Wrench />}
          to="/devices?status=Maintenance"
        />

        {/* EXPIRED */}
        <Card
          title="Thiết bị đang dử dụng quá tuổi thọ"
          value={expired}
          color="bg-red-500"
          icon={<AlertTriangle />}
          to="/devices/expired"
        />

        {/* SPARE DEVICE */}
        <Card
          title="Tổng số lượng thiết bị Dự phòng"
          value={spareTotal}
          color="bg-cyan-500"
          icon={<BatteryCharging />}
          to="/spare-devices"
        />

      </div>

      {/* CHART */}
      <div className="mt-6">

        <Chart data={filtered} />

      </div>

    </div>
  );
}
