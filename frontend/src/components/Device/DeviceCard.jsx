import DeviceStatus from "./DeviceStatus";

import {
    Eye,
    Pencil,
    Trash2,
    MapPin,
    Hash
} from "lucide-react";

export default function DeviceCard({

    device,

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
                p-4
                border
                border-slate-200
            "
        >

            <h2
                className="
                    font-bold
                    text-lg
                    mb-3
                "
            >
                {device.name}
            </h2>

            <div className="space-y-2 text-sm">

                <div className="flex items-center gap-2">

                    <Hash size={16} />

                    {device.deviceId}

                </div>

                <div className="flex items-center gap-2">

                    🚡 Tuyến

                    {device.line}

                </div>

                <div className="flex items-center gap-2">

                    <MapPin size={16} />

                    {device.station}

                </div>

                <DeviceStatus
                    status={device.status}
                />

            </div>

            <div
                className="
                    mt-4
                    flex
                    justify-between
                "
            >

                <button onClick={() => onView(device)}>
                    <Eye size={18} />
                </button>

                <button onClick={() => onEdit(device)}>
                    <Pencil size={18} />
                </button>

                <button onClick={() => onDelete(device)}>
                    <Trash2 size={18} />
                </button>

            </div>

        </div>

    );

}