import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";
import { useLocation } from "react-router-dom";
import Table from "../components/Table";

export default function DeviceList() {

  const [data, setData] = useState([]);
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const status = params.get("status");

  useEffect(() => {
    axios.get(`${API}/api/devices`)
      .then(res => {

        let result = res.data;

        if (status) {
          result = result.filter(d => d.status === status);
        }

        setData(result);
      });
  }, [status]);

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">
        📋 Danh sách thiết bị {status && `- ${status}`}
      </h1>

      <Table data={data} />

    </div>
  );
}
