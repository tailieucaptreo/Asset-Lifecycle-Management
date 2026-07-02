import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../config";
import EditDeviceModal from "./EditDeviceModal";
import DeviceRow from "./DeviceRow";
import DeviceFilter from "./DeviceFilter";
import DeviceHeader from "./DeviceHeader";

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
          <thead className="sticky top-0 z-20">

              <DeviceFilter
          
                  filters={filters}
          
                  setFilters={setFilters}
          
              />
          
              <DeviceHeader />
          
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
