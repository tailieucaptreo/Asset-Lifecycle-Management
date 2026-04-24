import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";

import Table from "../components/Table";

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchData = async () => {
    const res = await axios.get(`${API}/api/devices`);
    setDevices(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">

      <Table
        data={devices}
        setEditing={setEditing}
        reload={fetchData}
      />

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-96">

            <h2 className="font-bold mb-2">Edit</h2>

            <input
              value={editing.name || ""}
              onChange={(e) =>
                setEditing({ ...editing, name: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />

            <input
              value={editing.line || ""}
              onChange={(e) =>
                setEditing({ ...editing, line: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />

            <button
              onClick={async () => {
                await axios.post(`${API}/api/devices`, editing);
                setEditing(null);
                fetchData();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Lưu
            </button>

            <button
              onClick={() => setEditing(null)}
              className="ml-2"
            >
              Đóng
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
