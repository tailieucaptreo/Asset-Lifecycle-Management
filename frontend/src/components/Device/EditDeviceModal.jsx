export default function EditDeviceModal({

  editing,

  form,

  onChange,

  onClose,

  onSave

}) {

  if (!editing) return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white p-6 rounded-xl w-[600px] max-w-[95%] shadow-lg">

        <h2 className="font-bold mb-4 text-lg">
          ✏️ Chỉnh sửa thiết bị
        </h2>

        <div className="grid grid-cols-2 gap-3">

          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="col-span-2 p-2 border rounded"
            placeholder="Tên thiết bị"
          />

          <input
            name="line"
            value={form.line}
            onChange={onChange}
            className="p-2 border rounded"
            placeholder="Tuyến"
          />

          <input
            name="station"
            value={form.station}
            onChange={onChange}
            className="p-2 border rounded"
            placeholder="Nhà ga"
          />

          <input
            name="code"
            value={form.code}
            onChange={onChange}
            className="p-2 border rounded"
            placeholder="Ký hiệu"
          />

          <input
            name="area"
            value={form.area}
            onChange={onChange}
            className="p-2 border rounded"
            placeholder="Khu vực"
          />

          <input
            name="deviceId"
            value={form.deviceId}
            onChange={onChange}
            className="col-span-2 p-2 border rounded"
            placeholder="Mã ID"
          />

          <select
            name="status"
            value={form.status}
            onChange={onChange}
            className="p-2 border rounded"
          >
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Inactive">Inactive</option>
          </select>

          <input
            type="number"
            name="lifespan"
            value={form.lifespan}
            onChange={onChange}
            className="p-2 border rounded"
            placeholder="Tuổi thọ"
          />

          <input
            type="date"
            name="installDate"
            value={form.installDate}
            onChange={onChange}
            className="col-span-2 p-2 border rounded"
          />

        </div>

        <div className="flex justify-end gap-2 mt-5">

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Hủy
          </button>

          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Lưu
          </button>

        </div>

      </div>

    </div>

  );

}
