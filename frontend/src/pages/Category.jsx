import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../config";
import CategoryHeader from "../components/Category/CategoryHeader";
import CategoryToolbar from "../components/Category/CategoryToolbar";
import CategoryGrid from "../components/Category/CategoryGrid";
import CategoryCard from "../components/Category/CategoryCard";

export default function Category() {

  const navigate = useNavigate();
  const [categories, setCategories] =
    useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const [keyword, setKeyword] = useState("");

  const loadData = async () => {

    const token =
      localStorage.getItem("token");

    const res = await axios.get(
      `${API}/api/devices/categories`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setCategories(res.data);
  };

  const getIcon = (name) => {

    switch (name) {

      case "Động cơ":
        return "⚙️";

      case "Biến tần":
        return "⚡";

      case "PLC":
        return "🖥️";

      case "Cảm biến":
        return "📡";

      case "An toàn":
        return "🛡️";

      case "Điện điều khiển":
        return "🔌";

      default:
        return "📁";
    }

  };

  const filteredCategories = categories.filter((item) =>
    item.name.toLowerCase().includes(keyword.toLowerCase())
  );

  return (

    <div className="p-4 md:p-6">

      <CategoryHeader />

      <CategoryToolbar
        keyword={keyword}
        setKeyword={setKeyword}
      />

      <CategoryGrid>

        {filteredCategories.map((item) => (

          <CategoryCard

            key={item.id}

            title={item.name}

            total={item.count}

            icon={getIcon(item.name)}

            color="bg-blue-600"

            onClick={() =>
              navigate(
                `/category/${encodeURIComponent(item.name)}`
              )
            }

          />

        ))}

      </CategoryGrid>

    </div>

  );
}
