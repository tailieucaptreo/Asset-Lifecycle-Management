import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";
import Table from "../components/Table";

export default function DeviceList() {

  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await axios.get(`${API}/api/devices`);
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">
        📋 Tổng thiết bị
      </h1>

      <Table data={data} />

    </div>
  );
}
