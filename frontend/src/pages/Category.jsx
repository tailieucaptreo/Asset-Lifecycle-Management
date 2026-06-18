import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";

export default function Category() {

  const [categories,
    setCategories] = useState([]);

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {

    const res =
      await axios.get(
        `${API}/api/categories`
      );

    setCategories(res.data);

  };

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Phân loại thiết bị
      </h1>

      <table className="w-full border">

        <thead>

          <tr>

            <th>Mã</th>

            <th>Tên nhóm</th>

            <th>Số thiết bị</th>

          </tr>

        </thead>

        <tbody>

          {categories.map(item => (

            <tr key={item.id}>

              <td>{item.code}</td>

              <td>{item.name}</td>

              <td>
                {item._count.devices}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}
