import { useEffect, useState } from "react";
import axios from "axios";

import API from "../config";

export default function VaconList() {

  const [data, setData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const loadData = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res =
        await axios.get(
          `${API}/api/vacon`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      setData(res.data);

    }

    catch (err) {

      console.log(err);

      alert("Không tải được dữ liệu");

    }

    finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadData();

  }, []);

  if (loading) {

    return (
      <div className="p-6">
        Đang tải...
      </div>
    );

  }

  return (

    <div className="p-6">

      <div className="flex justify-between items-center mb-4">

        <h1 className="text-3xl font-bold">

          ⚡ Biến tần Vacon

        </h1>

      </div>

      <div
        className="
        bg-white
        rounded-xl
        shadow
        overflow-auto
        "
      >

        <table
          className="
          min-w-[2500px]
          border-collapse
          w-full
          "
        >

          <thead>

            <tr className="bg-yellow-400 text-black">

              <th className="border p-2">
                Record Date
              </th>

              <th className="border p-2">
                Station
              </th>

              <th className="border p-2">
                Tandem
              </th>

              <th className="border p-2">
                Device Name
              </th>

              <th className="border p-2">
                Serial Number
              </th>

              <th className="border p-2">
                Application
              </th>

              <th className="border p-2">
                Power Unit Date
              </th>

              <th className="border p-2">
                Fault History
              </th>

              <th className="border p-2">
                Operation Hours
              </th>

              <th className="border p-2">
                Description
              </th>

              <th className="border p-2">
                Possible Cause
              </th>

              <th className="border p-2">
                Corrective Actions
              </th>

              <th className="border p-2">
                Note
              </th>

            </tr>

          </thead>

          <tbody>

            {data.map((row) => (

              <tr
                key={row.id}
                className="
                hover:bg-gray-50
                "
              >

                <td className="border p-2">
                  {row.recordDate
                    ? new Date(
                        row.recordDate
                      ).toLocaleDateString()
                    : ""}
                </td>

                <td className="border p-2">
                  {row.station}
                </td>

                <td className="border p-2">
                  {row.tandem}
                </td>

                <td className="border p-2">
                  {row.deviceName}
                </td>

                <td className="border p-2">
                  {row.serialNumber}
                </td>

                <td className="border p-2">
                  {row.application}
                </td>

                <td className="border p-2">
                  {row.powerUnitDate}
                </td>

                <td className="border p-2 whitespace-pre-wrap">
                  {row.faultHistory}
                </td>

                <td className="border p-2">
                  {row.operationHours}
                </td>

                <td className="border p-2 whitespace-pre-wrap">
                  {row.description}
                </td>

                <td className="border p-2 whitespace-pre-wrap">
                  {row.possibleCause}
                </td>

                <td className="border p-2 whitespace-pre-wrap">
                  {row.correctiveActions}
                </td>

                <td className="border p-2 whitespace-pre-wrap">
                  {row.note}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}
