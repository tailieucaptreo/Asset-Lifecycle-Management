import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API from "../config";

export default function DeviceDetail() {

  const { id } = useParams();

  const [device, setDevice] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {

    loadDevice();

  }, []);

  const loadDevice = async () => {

    try {

      const res = await axios.get(
        `${API}/api/devices`
      );

      const found = res.data.find(
        d => d.id === Number(id)
      );

      setDevice(found);

    } catch (err) {

      console.log(err);
    }
  };

  const handleChange = (e) => {

    setDevice({
      ...device,
      [e.target.name]: e.target.value
    });
  };

  const save = async () => {

    try {

      await axios.put(
        `${API}/api/devices/${id}`,
        device
      );

      alert("Đã lưu");

      setEditing(false);

    } catch (err) {

      console.log(err);

      alert("Lỗi update");
    }
  };

  if (!device) {

    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (

    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          🔧 Hồ sơ thiết bị
        </h1>

        {!editing ? (

          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit
          </button>

        ) : (

          <button
            onClick={save}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>

        )}

      </div>

      {/* CARD */}
      <div className="bg-white shadow rounded-2xl p-6">

        <div className="grid grid-cols-2 gap-5">

          {/* IMAGE */}
          <div>

            <div className="border rounded-xl h-[300px] flex items-center justify-center bg-gray-100">

              {device.image ? (

                <img
                  src={device.image}
                  className="max-h-full rounded-xl"
                />

              ) : (

                <span className="text-gray-400">
                  Chưa có hình ảnh
                </span>

              )}

            </div>

          </div>

          {/* INFO */}
          <div className="space-y-4">

            <Field
              label="Tên thiết bị"
              name="name"
              value={device.name}
              editing={editing}
              onChange={handleChange}
            />

            <Field
              label="Ký hiệu"
              name="code"
              value={device.code}
              editing={editing}
              onChange={handleChange}
            />

            <Field
              label="Mã ID"
              name="deviceId"
              value={device.deviceId}
              editing={editing}
              onChange={handleChange}
            />

            <Field
              label="Mã vật tư"
              name="materialCode"
              value={device.materialCode || ""}
              editing={editing}
              onChange={handleChange}
            />

            <Field
              label="Tuyến"
              name="line"
              value={device.line}
              editing={editing}
              onChange={handleChange}
            />

            <Field
              label="Nhà ga"
              name="station"
              value={device.station}
              editing={editing}
              onChange={handleChange}
            />

            <Field
              label="Khu vực"
              name="area"
              value={device.area}
              editing={editing}
              onChange={handleChange}
            />

            <Field
              label="Ngày lắp đặt"
              name="installDate"
              value={
                device.installDate
                  ? device.installDate.split("T")[0]
                  : ""
              }
              editing={editing}
              onChange={handleChange}
              type="date"
            />

            <Field
              label="Ngày bảo trì"
              name="lastMaintenance"
              value={
                device.lastMaintenance
                  ? device.lastMaintenance.split("T")[0]
                  : ""
              }
              editing={editing}
              onChange={handleChange}
              type="date"
            />

            <Field
              label="Ngày thay thế"
              name="replacementDate"
              value={
                device.replacementDate || ""
              }
              editing={editing}
              onChange={handleChange}
              type="date"
            />

            <Field
              label="Datasheet"
              name="datasheet"
              value={device.datasheet || ""}
              editing={editing}
              onChange={handleChange}
            />

          </div>

        </div>

      </div>

    </div>
  );
}

// ================= FIELD =================
function Field({
  label,
  name,
  value,
  editing,
  onChange,
  type = "text"
}) {

  return (

    <div>

      <p className="text-sm text-gray-500 mb-1">
        {label}
      </p>

      {editing ? (

        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full border p-2 rounded-lg"
        />

      ) : (

        <div className="bg-gray-50 border rounded-lg p-2">

          {value || "-"}

        </div>

      )}

    </div>
  );
}
