import DeviceStatus from "./DeviceStatus";

export default function DeviceRow({

  device,

  role,

  onView,

  onEdit,

  onDelete

}) {

  if (!device) return null;

  return (

    <tr className="border-t hover:bg-gray-50 transition">

      {/* TÊN */}
      <td
        className="
          p-3
          font-medium
          text-blue-600
          cursor-pointer
          hover:underline
        "
        onClick={onView}
      >
        {device.name}
      </td>

      {/* TUYẾN */}
      <td className="p-3 text-center">
        {device.line}
      </td>

      {/* NHÀ GA */}
      <td className="p-3">
        {device.station}
      </td>

      {/* TRẠNG THÁI */}
      <td className="p-3 test-center font-mono">

        <DeviceStatus
          status={device.status || "Inactive"}
        />

      </td>

      {/* KÝ HIỆU */}
      <td className="p-3 test-center font-mono">
        {device.code || "-"}
      </td>

      {/* KHU VỰC */}
      <td className="p-3 test-center font-mono">
        {device.area || "-"}
      </td>

      {/* MÃ ID */}
      <td
          className="
              p-3
              text-center
              font-mono
          "
      >
          {device.deviceId || "-"}
      </td>

      {/* NGÀY LẮP */}
      <td className="p-3">

        {device.installDate

          ? new Date(
            device.installDate
          ).toLocaleDateString("vi-VN")

          : "-"}

      </td>

      {/* TUỔI THỌ */}
      <td className="p-3 text-center">

        {device.lifespan || "-"}

      </td>

      {/* ACTION */}
      <td className="p-3 text-center">

        {role === "admin" && (

          <div className="flex justify-center gap-3">

            <button

              onClick={onEdit}

              className="
                text-blue-600
                hover:text-blue-800
                font-medium
              "

            >
              Edit
            </button>

            <button

              onClick={onDelete}

              className="
                text-red-600
                hover:text-red-800
                font-medium
              "

            >
              Delete
            </button>

          </div>

        )}

      </td>

    </tr>

  );

}
