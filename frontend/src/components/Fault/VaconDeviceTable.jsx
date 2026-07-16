import {
    Eye,
    Pencil,
    Trash2
} from "lucide-react";

import VaconCard from "./VaconCard";

export default function VaconDeviceTable({

    role,

    devices = [],

    loading,

    onViewHistory,

    onEdit,

    onDelete

}) {

    if (loading) {

        return (

            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow
                    p-8
                    text-center
                "
            >

                Đang tải dữ liệu...

            </div>

        );

    }

    return (

        <>

            {/* ================= Desktop ================= */}

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

                <div
                    className="
                        overflow-auto
                        max-h-[70vh]
                    "
                >

                    <table
                        className="
                            w-full
                            text-sm
                        "
                    >

                        <thead
                            className="
                                sticky
                                top-0
                                bg-yellow-300
                                z-10
                            "
                        >

                            <tr>

                                <th className="px-3 py-3 text-center">
                                    STT
                                </th>

                                <th className="px-3 py-3 text-left">
                                    Device Name
                                </th>

                                <th className="px-3 py-3 text-left">
                                    Serial Number
                                </th>

                                <th className="px-3 py-3 text-center">
                                    Station
                                </th>

                                <th className="px-3 py-3 text-center">
                                    Tandem
                                </th>

                                <th className="px-3 py-3 text-center">
                                    Application
                                </th>

                                <th className="px-3 py-3 text-center">
                                    Lần kiểm tra gần nhất
                                </th>

                                <th className="px-3 py-3 text-center">
                                    Thao tác
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                devices.map((item, index) => (

                                    <tr

                                        key={item.id}

                                        className="
                                            border-t
                                            hover:bg-slate-50
                                        "

                                    >

                                        <td className="px-3 py-3 text-center">

                                            {index + 1}

                                        </td>

                                        <td className="px-3 py-3 font-medium">

                                            {item.deviceName}

                                        </td>

                                        <td className="px-3 py-3">

                                            {item.serialNumber}

                                        </td>

                                        <td className="px-3 py-3 text-center">

                                            {item.station || "-"}

                                        </td>

                                        <td className="px-3 py-3 text-center">

                                            {item.tandem || "-"}

                                        </td>

                                        <td className="px-3 py-3 text-center">

                                            {item.application || "-"}

                                        </td>

                                        <td className="px-3 py-3 text-center">

                                            {
                                                item.recordDate
                                                    ? new Date(item.recordDate).toLocaleDateString("vi-VN")
                                                    : "-"
                                            }

                                        </td>

                                        <td className="px-3 py-3">

                                            <div
                                                className="
                                                    flex
                                                    justify-center
                                                    gap-2
                                                "
                                            >

                                                <button
                                                    onClick={() => onViewHistory(item)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <Eye size={18} />
                                                </button>

                                                {

                                                    role === "admin" &&

                                                    <>

                                                        <button
                                                            onClick={() => onEdit(item)}
                                                            className="text-amber-600 hover:text-amber-800"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>

                                                        <button
                                                            onClick={() => onDelete(item)}
                                                            className="text-red-600 hover:text-red-800"
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

                            {

                                devices.length === 0 &&

                                <tr>

                                    <td
                                        colSpan={8}
                                        className="
                                            py-10
                                            text-center
                                            text-gray-500
                                        "
                                    >

                                        Không có dữ liệu.

                                    </td>

                                </tr>

                            }

                        </tbody>

                    </table>

                </div>

            </div>

            {/* ================= Mobile ================= */}

            <div
                className="
                    md:hidden
                    space-y-4
                "
            >

                {

                    devices.length === 0 ?

                        (

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

                                Không có dữ liệu.

                            </div>

                        )

                        :

                        devices.map(item => (

                            <VaconCard

                                key={item.id}

                                item={item}

                                onView={onViewHistory}

                            />

                        ))

                }

            </div>

        </>

    );

}