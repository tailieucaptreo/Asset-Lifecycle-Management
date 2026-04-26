import { useEffect, useState } from "react";
import API from "../config";

export default function Alerts() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/devices`)
      .then(res => res.json())
      .then(d => {
        const now = new Date();

        const expired = d.filter(x => {
          if (!x.installDate || !x.lifespan) return false;

          const exp = new Date(x.installDate);
          exp.setFullYear(exp.getFullYear() + x.lifespan);

          return exp < now;
        });

        setData(expired);
      });
  }, []);

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">🚨 Thiết bị hết hạn</h1>

      {data.length === 0 ? (
        <p>Không có cảnh báo</p>
      ) : (
        <ul>
          {data.map(d => (
            <li key={d.id} className="text-red-600">
              {d.name}
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}
