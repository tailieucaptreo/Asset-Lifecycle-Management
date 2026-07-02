import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../config";
import EditDeviceModal from "./device/EditDeviceModal";
import EditDeviceModal from "./device/DeviceRow";

export default function Table({ data = [], setData }) {

  const nav = useNavigate();

  const [filters, setFilters] = useState({});
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const role =
  localStorage.getItem("role");

  // ================= FILTER =================
  const filteredData = useMemo(() => {

    return data.filter((d) => {

      return (
        (!filters.name ||
          d.name?.toLowerCase().includes(filters.name.toLowerCase())) &&

        (!filters.station ||
          d.station?.toLowerCase().includes(filters.station.toLowerCase())) &&

        (!filters.status ||
          d.status === filters.status)
      );
    });

  }, [data, filters]);

  // ================= DELETE =================
  const handleDelete = async (id) => {

  if (
    !window.confirm(
      "Xóa thiết bị này?"
    )
  ) return;

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    const res =
      await fetch(

        `${API}/api/devices/${id}`,

        {

          method:
            "DELETE",

          headers:{

            Authorization:
              `Bearer ${token}`

          }

        }

      );

    if (!res.ok) {

      const err =
        await res.json();

      throw new Error(
        err.message ||
        "Delete lỗi"
      );

    }

    setData(
      prev =>
      prev.filter(
        d =>
        d.id !== id
      )
    );

    alert(
      "Xóa thành công"
    );

  }

  catch(err){

    console.log(
      err
    );

    alert(
      err.message
    );

  }

};

  // ================= OPEN EDIT =================
  const openEdit = (d) => {

    setEditing(d);

    setForm({
      name: d.name || "",
      line: d.line || "",
      station: d.station || "",
      code: d.code || "",
      area: d.area || "",
      deviceId: d.deviceId || "",
      status: d.status || "Inactive",
      lifespan: d.lifespan || "",

      installDate: d.installDate
        ? new Date(d.installDate)
            .toISOString()
            .split("T")[0]
        : ""
    });
  };

  // ================= CHANGE =================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {

    try {

      const payload = {
        ...form,

        lifespan: form.lifespan
          ? Number(form.lifespan)
          : null,

        installDate: form.installDate || null
      };

      const res = await fetch(
        `${API}/api/devices/${editing.id}`,
        {
          method: "PUT",
          headers:{

          Authorization:
          `Bearer ${localStorage.getItem("token")}`,
          
          "Content-Type":
          "application/json"
          
          },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {

        const err = await res.text();

        throw new Error(err);
      }

      const updated = await res.json();

      // realtime update
      setData((prev) =>
        prev.map((d) =>
          d.id === updated.id
            ? updated
            : d
        )
      );

      setEditing(null);

    } catch (err) {

      console.log("UPDATE ERROR:", err);

      alert("Update lỗi: " + err.message);
    }
  };

  return (

    <div className="bg-white rounded-xl shadow w-full overflow-hidden">

      {/* TABLE */}
      <div className="w-full overflow-auto">

        <table className="w-full table-auto text-sm border border-gray-200">

          {/* FILTER */}
          <thead className="bg-gray-100 sticky top-0 z-10">

            <tr>

              <th className="p-2">
                <input
                  placeholder="Tên"
                  className="border p-1 w-full"
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      name: e.target.value
                    })
                  }
                />
              </th>

              <th></th>

              <th className="p-2">
                <input
                  placeholder="Nhà ga"
                  className="border p-1 w-full"
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      station: e.target.value
                    })
                  }
                />
              </th>

              <th className="p-2">

                <select
                  className="border p-1 w-full"
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      status: e.target.value
                    })
                  }
                >
                  <option value="">All</option>
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inactive">Inactive</option>
                </select>

              </th>

              <th colSpan="6"></th>

            </tr>

            {/* HEADER */}
            <tr className="text-left text-gray-700">

              <th className="p-3 w-[220px]">
                Tên
              </th>

              <th className="p-3 w-[60px] text-center">
                Tuyến
              </th>

              <th className="p-3 w-[120px]">
                Nhà ga
              </th>

              <th className="p-3 w-[120px]">
                Trạng thái
              </th>

              <th className="p-3 w-[90px]">
                Ký hiệu
              </th>

              <th className="p-3 w-[120px]">
                Khu vực
              </th>

              <th className="p-3 w-[130px]">
                Mã ID
              </th>

              <th className="p-3 w-[110px]">
                Ngày lắp
              </th>

              <th className="p-3 w-[80px] text-center">
                Tuổi thọ
              </th>

              <th className="p-3 w-[120px] text-center">
                Action
              </th>

            </tr>

          </thead>

          {/* BODY */}
          <tbody className="divide-y">
          
            {filteredData.map((device) => (
          
              <DeviceRow
          
                key={device.id}
          
                device={device}
          
                role={role}
          
                onEdit={openEdit}
          
                onDelete={handleDelete}
          
              />
          
            ))}
          
          </tbody>

        </table>

      </div>
      <EditDeviceModal

          editing={editing}
        
          form={form}
        
          onChange={handleChange}
        
          onClose={() => setEditing(null)}
        
          onSave={handleUpdate}
        
        />
    </div>
  );
}
