import {
    Eye,
    Pencil,
    Trash2
} from "lucide-react";

import DriveCard from "../mobile/DriveCard";

export default function DriveTable({

    role,

    drives = [],

    loading,

    onView,

    onEdit,

    onDelete

}) {

    const statusColor = (status) => {

        switch (status) {

            case "Running":

                return "bg-green-100 text-green-700";

            case "Maintenance":

                return "bg-yellow-100 text-yellow-700";

            case "Fault":

                return "bg-red-100 text-red-700";

            case "Offline":

                return "bg-gray-200 text-gray-700";

            default:

                return "bg-slate-100 text-slate-700";

        }

    };

    if (loading) {

        return (

            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow
                    p-8
                    text-center
                    text-gray-500
                "
            >

                Đang tải dữ liệu...

            </div>

        );

    }

    return (

        <>

            {/* Desktop */}

            <div
                className="
                    hidden
                    md:block
                    bg-white
                    rounded-2xl
                    shadow
                    overflow-hidden
                "
            >

                <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">

                    <table className="min-w-full text-sm">

                        <thead
                            className="
                                sticky
                                top-0
                                z-10
                                bg-slate-100
                                text-slate-700
                            "
                        >

                            <tr>

                                <th className="px-4 py-4 text-left">
                                    STT
                                </th>

                                <th className="px-4 py-4 text-left">
                                    Thiết bị
                                </th>

                                <th className="px-4 py-4 text-left">
                                    Mã TB
                                </th>

                                <th className="px-4 py-4 text-left">
                                    Hãng
                                </th>

                                <th className="px-4 py-4 text-left">
                                    Model
                                </th>

                                <th className="px-4 py-4 text-left">
                                    Công suất
                                </th>

                                <th className="px-4 py-4 text-left">
                                    Tuyến
                                </th>

                                <th className="px-4 py-4 text-left">
                                    Nhà ga
                                </th>

                                <th className="px-4 py-4 text-left">
                                    IP
                                </th>

                                <th className="px-4 py-4 text-center">
                                    Trạng thái
                                </th>

                                <th className="px-4 py-4 text-center">
                                    Thao tác
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                drives.length === 0 ?

                                    (

                                        <tr>

                                            <td

                                                colSpan={11}

                                                className="
                                                    py-10
                                                    text-center
                                                    text-gray-400
                                                "

                                            >

                                                Không có dữ liệu

                                            </td>

                                        </tr>

                                    )

                                    :

                                    drives.map((drive, index) => (

                                        <tr

                                            key={drive.id}

                                            className="
                                                border-t
                                                hover:bg-slate-50
                                            "

                                        >

                                            <td className="px-4 py-3">

                                                {index + 1}

                                            </td>

                                            <td className="px-4 py-3 font-medium">

                                                {drive.name}

                                            </td>

                                            <td className="px-4 py-3">

                                                {drive.deviceId}

                                            </td>

                                            <td className="px-4 py-3">

                                                {drive.brand}

                                            </td>

                                            <td className="px-4 py-3">

                                                {drive.model}

                                            </td>

                                            <td className="px-4 py-3">

                                                {drive.power || "-"}

                                            </td>

                                            <td className="px-4 py-3">

                                                {drive.line}

                                            </td>

                                            <td className="px-4 py-3">

                                                {drive.station}

                                            </td>

                                            <td className="px-4 py-3">

                                                {drive.ipAddress || "-"}

                                            </td>

                                            <td className="px-4 py-3 text-center">

                                                <span

                                                    className={`
                                                        inline-flex
                                                        px-3
                                                        py-1
                                                        rounded-full
                                                        text-xs
                                                        font-medium
                                                        ${statusColor(drive.status)}
                                                    `}

                                                >

                                                    {drive.status}

                                                </span>

                                            </td>

                                            <td className="px-4 py-3">

                                                <div
                                                    className="
                                                        flex
                                                        justify-center
                                                        gap-2
                                                    "
                                                >

                                                    <button

                                                        onClick={() =>
                                                            onView(drive)
                                                        }

                                                        className="
                                                            p-2
                                                            rounded-lg
                                                            hover:bg-blue-100
                                                            text-blue-600
                                                        "

                                                    >

                                                        <Eye size={18} />

                                                    </button>

                                                    {

                                                        role === "admin"

                                                        &&

                                                        <>

                                                            <button

                                                                onClick={() =>
                                                                    onEdit(drive)
                                                                }

                                                                className="
                                                                    p-2
                                                                    rounded-lg
                                                                    hover:bg-amber-100
                                                                    text-amber-600
                                                                "

                                                            >

                                                                <Pencil size={18} />

                                                            </button>

                                                            <button

                                                                onClick={() =>
                                                                    onDelete(drive)
                                                                }

                                                                className="
                                                                    p-2
                                                                    rounded-lg
                                                                    hover:bg-red-100
                                                                    text-red-600
                                                                "

                                                            >

                                                                <Trash2 size={18} />

                                                            </button>

                                                        </>

                                                    }

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                            }

                        </tbody>

                    </table>

                </div>

            </div>

            {/* Mobile */}

            <div
                className="
                md:hidden
                space-y-4
            "
            >

                {

                    drives.length === 0 ?

                        (

                            <div
                                className="
                                bg-white
                                rounded-xl
                                shadow
                                p-8
                                text-center
                                text-gray-400
                            "
                            >

                                Không có dữ liệu

                            </div>

                        )

                        :

                        drives.map((drive) => (

                            <DriveCard

                                key={drive.id}

                                item={drive}

                                role={role}

                                onView={onView}

                                onEdit={onEdit}

                                onDelete={onDelete}

                            />

                        ))

                }

            </div>

        </>


    );

}
