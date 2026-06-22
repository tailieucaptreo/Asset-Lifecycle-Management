import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API from "../config";

export default function CategoryDetail() {

  const { id } = useParams();

  const [devices, setDevices] =
    useState([]);

  useEffect(() => {

    loadData();

  }, [id]);

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

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">

        Nhóm thiết bị:
        {" "}
        {decodeURIComponent(id)}

      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 text-left">
                Tên thiết bị
              </th>

              <th className="p-3 text-left">
                Tuyến
              </th>

              <th className="p-3 text-left">
                Nhà ga
              </th>

              <th className="p-3 text-left">
                Trạng thái
              </th>

            </tr>

          </thead>

          <tbody>

            {devices.map(device => (

              <tr
                key={device.id}
                className="border-t"
              >

                <td className="p-3">
                  {device.name}
                </td>

                <td className="p-3">
                  {device.line}
                </td>

                <td className="p-3">
                  {device.station}
                </td>

                <td className="p-3">
                  {device.status}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}
