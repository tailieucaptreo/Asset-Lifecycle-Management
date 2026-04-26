import { useEffect, useState } from "react";
import API from "../config";

export default function MaintenanceSchedule() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/devices`)
      .then(res => res.json())
      .then(d => {
        const today = new Date();

        const list = d.map(x => {
          if (!x.installDate || !x.lifespan) return null;

          const expire = new Date(x.installDate);
          expire.setFullYear(expire.getFullYear() + x.lifespan);

          return {
            ...x,
            nextMaintenance: expire
          };
        }).filter(Boolean);

        setData(list);
      });
  }, []);

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">📅 Lịch bảo trì</h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Tên</th>
            <th className="p-2 border">Ngày bảo trì</th>
          </tr>
        </thead>

        <tbody>
          {data.map(d => (
            <tr key={d.id}>
              <td className="p-2 border">{d.name}</td>
              <td className="p-2 border">
                {d.nextMaintenance.toLocaleDateString("vi-VN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
