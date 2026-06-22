import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";

export default function Category() {

  const [categories, setCategories] =
    useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    const res = await axios.get(
      `${API}/api/devices/categories`
    );

    setCategories(res.data);
  };

  const getIcon = (name) => {

    if (name === "Động cơ") return "⚙️";
    if (name === "Biến tần") return "⚡";
    if (name === "PLC") return "🖥";
    if (name === "Cảm biến") return "📡";
    if (name === "An toàn") return "🛡";
    if (name === "Điện điều khiển") return "🔌";

    return "📁";
  };

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Phân loại thiết bị
      </h1>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-4
          gap-6
        "
      >

        {categories.map((item) => (

          <div
            key={item.id}
            className="
              bg-white
              rounded-xl
              shadow-md
              p-6
              cursor-pointer
              hover:shadow-xl
              hover:-translate-y-1
              transition
            "
            onClick={() =>
              window.location.href =
              `/category/${item.id}`
            }
          >

            <div className="text-5xl mb-3">
              {getIcon(item.name)}
            </div>

            <h2 className="font-bold text-xl">
              {item.name}
            </h2>

            <p className="text-gray-500 mt-2">
              {item._count.devices}
              {" "}thiết bị
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}
