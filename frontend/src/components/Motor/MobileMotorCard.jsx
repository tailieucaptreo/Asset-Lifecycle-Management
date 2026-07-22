import {
    Eye,
    Pencil,
    Trash2,
    Cpu,
    MapPin,
    Factory,
    Zap
} from "lucide-react";

const statusColor = (status) => {

    switch (status) {

        case "Running":
            return "bg-green-100 text-green-700";

        case "Maintenance":
            return "bg-yellow-100 text-yellow-700";

        case "Replaced":
            return "bg-blue-100 text-blue-700";

        case "Original":
            return "bg-slate-100 text-slate-700";

        default:
            return "bg-slate-100 text-slate-700";

    }

};

export default function MobileMotorCard({

    item,

    role,

    onView,

    onEdit,

    onDelete

}) {

    return (

        <div
            className="
                bg-white
                rounded-2xl
                shadow
                border
                border-slate-200
                p-4
                space-y-4
            "
        >

            {/* Header */}

            <div className="flex justify-between items-start">

                <div>

                    <h3
                        className="
                            font-semibold
                            text-slate-800
                            text-base
                        "
                    >
                        {item.name}
                    </h3>

                    <p
                        className="
                            text-sm
                            text-slate-500
                        "
                    >
                        {item.deviceId || "-"}
                    </p>

                </div>

                <span

                    className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-medium
                        ${statusColor(item.status)}
                    `}

                >

                    {

                        item.status === "Running"

                            ? "Đang hoạt động"

                            : item.status === "Maintenance"

                                ? "Bảo trì"

                                : item.status === "Replaced"

                                    ? "Đã thay"

                                    : item.status === "Original"

                                        ? "Chưa thay"

                                        : item.status

                    }

                </span>

            </div>

            {/* Information */}

            <div className="grid grid-cols-2 gap-3 text-sm">

                <div className="flex items-center gap-2">

                    <Cpu
                        size={16}
                        className="text-blue-600"
                    />

                    <span>{item.type || "-"}</span>

                </div>

                <div className="flex items-center gap-2">

                    <Factory
                        size={16}
                        className="text-red-600"
                    />

                    <span>{item.brand || "-"}</span>

                </div>

                <div className="flex items-center gap-2">

                    <Zap
                        size={16}
                        className="text-yellow-600"
                    />

                    <span>{item.power || "-"}</span>

                </div>

                <div className="flex items-center gap-2">

                    <Cpu
                        size={16}
                        className="text-slate-600"
                    />

                    <span>{item.model || "-"}</span>

                </div>

                <div className="flex items-center gap-2 col-span-2">

                    <MapPin
                        size={16}
                        className="text-emerald-600"
                    />

                    <span>

                        {item.line || "-"}

                        {" • "}

                        {item.station || "-"}

                    </span>

                </div>

            </div>

            {/* Action */}

            <div
                className="
                    flex
                    justify-end
                    gap-2
                    pt-2
                    border-t
                "
            >

                <button

                    onClick={() => onView(item)}

                    className="
                        p-2
                        rounded-lg
                        text-blue-600
                        hover:bg-blue-100
                    "

                >

                    <Eye size={18} />

                </button>

                {

                    role === "admin"

                    &&

                    <>

                        <button

                            onClick={() => onEdit(item)}

                            className="
                                p-2
                                rounded-lg
                                text-amber-600
                                hover:bg-amber-100
                            "

                        >

                            <Pencil size={18} />

                        </button>

                        <button

                            onClick={() => onDelete(item)}

                            className="
                                p-2
                                rounded-lg
                                text-red-600
                                hover:bg-red-100
                            "

                        >

                            <Trash2 size={18} />

                        </button>

                    </>

                }

            </div>

        </div>

    );

}
