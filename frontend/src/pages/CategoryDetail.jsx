import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API from "../config";

import CategoryDetailHeader from "../components/category/CategoryDetailHeader";
import CategoryDetailToolbar from "../components/category/CategoryDetailToolbar";
import CategoryDeviceTable from "../components/category/CategoryDeviceTable";
import CategoryDeviceCard from "../components/category/CategoryDeviceCard";

export default function CategoryDetail() {

  const { id } = useParams();

  const [devices, setDevices] =
    useState([]);

  useEffect(() => {

    loadData();

  }, [id]);

  const [keyword, setKeyword] = useState("");

  const loadData = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res =
        await axios.get(

          `${API}/api/devices/category/${id}`,

          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }

        );

      setDevices(res.data);

    }

    catch (err) {

      console.log(err);

    }

  };

  const filteredDevices = useMemo(() => {

      return devices.filter(device =>
  
          device.name
              ?.toLowerCase()
              .includes(keyword.toLowerCase())
  
      );
  
  }, [devices, keyword]);

  return (

      <div className="p-4 md:p-6">
  
          <CategoryDetailHeader
  
              category={decodeURIComponent(id)}
  
              total={filteredDevices.length}
  
          />
  
          <CategoryDetailToolbar
  
              keyword={keyword}
  
              setKeyword={setKeyword}
  
          />
  
          {/* Desktop */}
  
          <div className="hidden lg:block">
  
              <CategoryDeviceTable
  
                  data={filteredDevices}
  
              />
  
          </div>
  
          {/* Mobile */}
  
          <div
              className="
                  grid
                  grid-cols-1
                  gap-4
                  lg:hidden
              "
          >
  
              {filteredDevices.map(device => (
  
                  <CategoryDeviceCard
  
                      key={device.id}
  
                      device={device}
  
                  />
  
              ))}
  
          </div>
  
          {filteredDevices.length === 0 && (
  
              <div
                  className="
                      bg-white
                      rounded-2xl
                      shadow
                      p-10
                      text-center
                      text-gray-400
                      mt-6
                  "
              >
  
                  Không có thiết bị
  
              </div>
  
          )}
  
      </div>
  
  );

}
