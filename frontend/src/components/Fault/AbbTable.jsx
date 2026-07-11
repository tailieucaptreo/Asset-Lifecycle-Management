import {
    Eye,
    Pencil,
    Trash2
} from "lucide-react";

export default function AbbTable({

    role,

    records = [],

    loading,

    onView,

    onEdit,

    onDelete

}) {

    if (loading) {

        return (

            <div className="bg-white rounded-2xl shadow p-8 text-center">

                Đang tải dữ liệu...

            </div>

        );

    }

    return (

        <div
            className="
                bg-white
                rounded-2xl
                shadow
                overflow-hidden
            "
        >

            <div className="overflow-auto max-h-[70vh]">

                <table
                    className="
                        w-full
                        min-w-[1700px]
                        text-sm
                    "
                >

                    <thead
                        className="
                            sticky
                            top-0
                            bg-slate-100
                            z-10
                        "
                    >

                        <tr>

                            <th className="px-3 py-3 text-left">
                                STT
                            </th>

                            <th className="px-3 py-3 text-left">
                                Ngày
                            </th>

                            <th className="px-3 py-3 text-left">
                                Tuyến
                            </th>

                            <th className="px-3 py-3 text-left">
                                Nhà ga
                            </th>

                            <th className="px-3 py-3 text-left">
                                Thiết bị
                            </th>

                            <th className="px-3 py-3 text-left">
                                Mã thiết bị
                            </th>

                            <th className="px-3 py-3 text-left">
                                Serial Number
                            </th>

                            <th className="px-3 py-3 text-left">
                                Model
                            </th>

                            <th className="px-3 py-3 text-left">
                                IP Address
                            </th>

                            <th className="px-3 py-3 text-left">
                                Fault Code
                            </th>

                            <th className="px-3 py-3 text-left">
                                Fault Name
                            </th>

                            <th className="px-3 py-3 text-left">
                                Description
                            </th>

                            <th className="px-3 py-3 text-left">
                                Cause
                            </th>

                            <th className="px-3 py-3 text-left">
                                Solution
                            </th>

                            <th className="px-3 py-3 text-left">
                                Repair By
                            </th>

                            <th className="px-3 py-3 text-left">
                                Ghi chú
                            </th>

                            <th className="px-3 py-3 text-center">
                                Thao tác
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            records.map((item, index) => (

                                <tr

                                    key={item.id}

                                    className="
                                        border-t
                                        hover:bg-slate-50
                                    "

                                >

                                    <td className="px-3 py-3">

                                        {index + 1}

                                    </td>

                                    <td className="px-3 py-3 whitespace-nowrap">

                                        {

                                            item.recordDate

                                                ? new Date(item.recordDate)

                                                    .toLocaleDateString("vi-VN")

                                                : ""

                                        }

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.line}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.station}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.deviceName}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.deviceId}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.serialNumber}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.model}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.ipAddress}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.faultCode}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.faultName}

                                    </td>

                                    <td className="px-3 py-3 max-w-[220px]">

                                        {item.description}

                                    </td>

                                    <td className="px-3 py-3 max-w-[220px]">

                                        {item.cause}

                                    </td>

                                    <td className="px-3 py-3 max-w-[220px]">

                                        {item.solution}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.repairedBy}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.note}

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

                                                onClick={() => onView(item)}

                                                className="text-blue-600"

                                            >

                                                <Eye size={18} />

                                            </button>

                                            {

                                                role === "admin" &&

                                                <>

                                                    <button

                                                        onClick={() => onEdit(item)}

                                                        className="text-amber-600"

                                                    >

                                                        <Pencil size={18} />

                                                    </button>

                                                    <button

                                                        onClick={() => onDelete(item)}

                                                        className="text-red-600"

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

    );

}
