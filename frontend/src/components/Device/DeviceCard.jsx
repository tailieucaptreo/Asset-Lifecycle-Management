import {
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Cpu
} from "lucide-react";

import DeviceStatus from "./DeviceStatus";

export default function DeviceCard({

  device,

  role,

  onView,

  onEdit,

  onDelete

}) {

  if (!device) return null;

  return (

    <div
      className="
        bg-white
        rounded-2xl
        shadow
        border
        border-slate-200
        p-4
        hover:shadow-lg
        transition
      "
    >

      {/* HEADER */}

      <div className="flex justify-between items-start">

        <div>

          <h2 className="font-bold text-lg">

            {device.name}

          </h2>

          <p className="text-sm text-gray-500">

            {device.deviceId}

          </p>

        </div>

        <DeviceStatus
          status={device.status}
        />

      </div>

      {/* BODY */}

      <div className="mt-4 space-y-2 text-sm">

        <div className="flex items-center gap-2">

          <Cpu size={16} />

          <span>

            {device.category || "Chưa phân loại"}

          </span>

        </div>

        <div className="flex items-center gap-2">

          <MapPin size={16} />

          <span>

            Tuyến {device.line}

            {" - "}

            {device.station}

          </span>

        </div>

        <div>

          <span className="font-medium">

            Mã:

          </span>

          {" "}

          {device.code || "-"}

        </div>

        <div>

          <span className="font-medium">

            Khu vực:

          </span>

          {" "}

          {device.area || "-"}

        </div>

      </div>

      {/* FOOTER */}

      <div
        className="
          mt-5
          flex
          justify-end
          gap-2
        "
      >

        <button

          onClick={onView}

          className="
            p-2
            rounded-lg
            bg-blue-100
            hover:bg-blue-200
          "

        >

          <Eye size={18} />

        </button>

        {role === "admin" && (

          <>

            <button

              onClick={onEdit}

              className="
                p-2
                rounded-lg
                bg-yellow-100
                hover:bg-yellow-200
              "

            >

              <Pencil size={18} />

            </button>

            <button

              onClick={onDelete}

              className="
                p-2
                rounded-lg
                bg-red-100
                hover:bg-red-200
              "

            >

              <Trash2 size={18} />

            </button>

          </>

        )}

      </div>

    </div>

  );

}
