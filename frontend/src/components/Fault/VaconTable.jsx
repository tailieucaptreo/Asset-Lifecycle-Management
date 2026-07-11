import {
    Eye,
    Pencil,
    Trash2
} from "lucide-react";

export default function VaconTable({

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
                        min-w-[1800px]
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
                                Nhà ga
                            </th>

                            <th className="px-3 py-3 text-left">
                                Tandem
                            </th>

                            <th className="px-3 py-3 text-left">
                                Thiết bị
                            </th>

                            <th className="px-3 py-3 text-left">
                                Serial
                            </th>

                            <th className="px-3 py-3 text-left">
                                Application
                            </th>

                            <th className="px-3 py-3 text-left">
                                Power Unit
                            </th>

                            <th className="px-3 py-3 text-left">
                                Fault History
                            </th>

                            <th className="px-3 py-3 text-left">
                                Operation Hours
                            </th>

                            <th className="px-3 py-3 text-left">
                                Description
                            </th>

                            <th className="px-3 py-3 text-left">
                                Possible Cause
                            </th>

                            <th className="px-3 py-3 text-left">
                                Corrective Actions
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
                                    className="border-t hover:bg-slate-50"
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

                                        {item.station}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.tandem}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.deviceName}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.serialNumber}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.application}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.powerUnitDate}

                                    </td>

                                    <td className="px-3 py-3 max-w-[220px]">

                                        {item.faultHistory}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.operationHours}

                                    </td>

                                    <td className="px-3 py-3 max-w-[250px]">

                                        {item.description}

                                    </td>

                                    <td className="px-3 py-3 max-w-[250px]">

                                        {item.possibleCause}

                                    </td>

                                    <td className="px-3 py-3 max-w-[250px]">

                                        {item.correctiveActions}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.note}

                                    </td>

                                    <td
                                        className="
                                            px-3
                                            py-3
                                        "
                                    >

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
