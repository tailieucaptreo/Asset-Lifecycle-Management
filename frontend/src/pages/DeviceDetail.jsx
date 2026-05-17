import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../config";

export default function DeviceDetail() {

  const { id } = useParams();

  const [device, setDevice] = useState(null);
  const [edit, setEdit] = useState(false);
  const role =
  localStorage.getItem("role");

  useEffect(() => {
    fetch(`${API}/api/devices`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(d => d.id == id);
        setDevice(found);
      });
  }, [id]);

  const handleChange = (e) => {
    setDevice({
      ...device,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {

    try {

      const res = await fetch(
        `${API}/api/devices/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(device)
        }
      );

      const updated = await res.json();

      setDevice(updated);

      setEdit(false);

      alert("✅ Đã lưu");

    } catch (err) {

      console.log(err);

      alert("❌ Lưu lỗi");
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

    <div className="p-8 bg-gray-100 min-h-screen w-full">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            🔧 Hồ sơ thiết bị
          </h1>

          <p className="text-gray-500 mt-1">
            Quản lý thông tin chi tiết thiết bị
          </p>

        </div>

        {role === "admin" && (

            {!edit ? (
              <button
                onClick={() => setEdit(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow"
              >
                ✏️ Chỉnh sửa
              </button>
            ) : (
              <div className="flex gap-2">
    
                <button
                  onClick={() => setEdit(false)}
                  className="bg-gray-300 hover:bg-gray-400 px-5 py-2 rounded-xl"
                >
                  Hủy
                </button>
    
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow"
                >
                  💾 Lưu
                </button>
    
              </div>
            )
        )}
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-[1400px]">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* IMAGE */}
          <div>

            <div className="border-2 border-dashed rounded-2xl h-[350px] flex items-center justify-center bg-gray-50 overflow-hidden">

              {device.image ? (
                <img
                  src={device.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400">

                  <div className="text-6xl mb-3">
                    🖼️
                  </div>

                  <p>Chưa có hình ảnh</p>

                </div>
              )}

            </div>

            {edit && (
              <input
                type="text"
                name="image"
                value={device.image || ""}
                onChange={handleChange}
                placeholder="Link hình ảnh"
                className="mt-4 w-full border p-3 rounded-xl"
              />
            )}

          </div>

          {/* INFO */}
          <div className="lg:col-span-3">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <Field
                label="Tên thiết bị"
                name="name"
                value={device.name}
                edit={edit}
                onChange={handleChange}
              />

              <Field
                label="Ký hiệu"
                name="code"
                value={device.code}
                edit={edit}
                onChange={handleChange}
              />

              <Field
                label="Mã ID"
                name="deviceId"
                value={device.deviceId}
                edit={edit}
                onChange={handleChange}
              />

              <Field
                label="Mã vật tư"
                name="materialCode"
                value={device.materialCode}
                edit={edit}
                onChange={handleChange}
              />

              <Field
                label="Tuyến"
                name="line"
                value={device.line}
                edit={edit}
                onChange={handleChange}
              />

              <Field
                label="Nhà ga"
                name="station"
                value={device.station}
                edit={edit}
                onChange={handleChange}
              />

              <Field
                label="Khu vực"
                name="area"
                value={device.area}
                edit={edit}
                onChange={handleChange}
              />

              <Field
                label="Tuổi thọ"
                name="lifespan"
                value={device.lifespan}
                edit={edit}
                onChange={handleChange}
              />

              <Field
                label="Ngày lắp đặt"
                name="installDate"
                value={device.installDate?.slice(0, 10)}
                edit={edit}
                type="date"
                onChange={handleChange}
              />

              <Field
                label="Ngày bảo trì"
                name="lastMaintenance"
                value={device.lastMaintenance?.slice(0, 10)}
                edit={edit}
                type="date"
                onChange={handleChange}
              />

              <Field
                label="Ngày thay thế"
                name="replacementDate"
                value={device.replacementDate}
                edit={edit}
                type="date"
                onChange={handleChange}
              />

              {/* STATUS */}
              <div>

                <label className="text-sm text-gray-500">
                  Trạng thái
                </label>

                {edit ? (

                  <select
                    name="status"
                    value={device.status || ""}
                    onChange={handleChange}
                    className="mt-1 w-full border p-3 rounded-xl"
                  >
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Inactive">Inactive</option>
                  </select>

                ) : (

                  <div
                    className={`mt-1 px-4 py-3 rounded-xl font-semibold

                    ${
                      device.status === "Active"
                        ? "bg-green-100 text-green-700"

                        : device.status === "Maintenance"
                        ? "bg-yellow-100 text-yellow-700"

                        : "bg-gray-200 text-gray-600"
                    }
                    `}
                  >
                    {device.status}
                  </div>

                )}

              </div>

            </div>

            {/* DATASHEET */}
            <div className="mt-8">

              <label className="text-sm text-gray-500">
                Datasheet
              </label>

              {edit ? (

                <input
                  type="text"
                  name="datasheet"
                  value={device.datasheet || ""}
                  onChange={handleChange}
                  placeholder="Link datasheet PDF"
                  className="mt-1 w-full border p-3 rounded-xl"
                />

              ) : (

                <div className="mt-2">

                  {device.datasheet ? (

                    <a
                      href={device.datasheet}
                      target="_blank"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl inline-block"
                    >
                      📄 Xem Datasheet
                    </a>

                  ) : (

                    <div className="bg-gray-100 text-gray-400 px-4 py-3 rounded-xl">
                      Chưa có datasheet
                    </div>

                  )}

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

// ================= FIELD COMPONENT =================
function Field({
  label,
  name,
  value,
  edit,
  onChange,
  type = "text"
}) {

  return (

    <div>

      <label className="text-sm text-gray-500">
        {label}
      </label>

      {edit ? (

        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          className="mt-1 w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

      ) : (

        <div className="mt-1 bg-gray-50 border rounded-xl px-4 py-3 text-gray-800 font-medium min-h-[52px] flex items-center">
          {value || "-"}
        </div>

      )}

    </div>
  );
}
