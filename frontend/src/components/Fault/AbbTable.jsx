import {
    Eye,
    Pencil,
    Trash2
} from "lucide-react";

import AbbDetailModal from "./AbbDetailModal";
import { Eye } from "lucide-react";

export default function AbbTable({

    role,

    records = [],

    loading,

    onView,

    onEdit,

    onDelete

}) {

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

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
                                Type Code
                            </th>

                            <th className="px-3 py-3 text-left">
                                Serial Number
                            </th>

                            <th className="px-3 py-3 text-left">
                                Tuyến
                            </th>

                            <th className="px-3 py-3 text-left">
                                Nhà ga
                            </th>

                            <th className="px-3 py-3 text-left">
                                Ứng dụng
                            </th>

                            <th className="px-3 py-3 text-left">
                                Firmware
                            </th>

                            <th className="px-3 py-3 text-left">
                                Tình trạng
                            </th>

                            <th className="px-3 py-3 text-left">
                                Lý do thay thế
                            </th>

                            <th className="px-3 py-3 text-left">
                                Giờ hoạt động
                            </th>

                            <th className="px-3 py-3 text-left">
                                Ngày thay
                            </th>

                            <th className="px-3 py-3 text-left">
                                On-time
                            </th>

                            <th className="px-3 py-3 text-left">
                                Running Day
                            </th>

                            <th className="px-3 py-3 text-left">
                                Ngày bảo dưỡng
                            </th>

                            <th className="px-3 py-3 text-left">
                                Công việc bảo dưỡng
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

                                        {item.typeCode}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.serialNumber}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.line}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.station}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.application}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.firmware}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.currentStatus}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.replaceReason}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.operationHours}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.lastReplaceDate}

                                    </td>

                                    <td className="px-3 py-3 max-w-[220px]">

                                        {item.onTimeDay}

                                    </td>

                                    <td className="px-3 py-3 max-w-[220px]">

                                        {item.runningDay}

                                    </td>

                                    <td className="px-3 py-3 max-w-[220px]">

                                        {item.lastMaintenance}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.maintenanceWork}

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
                                                onClick={() => {
                                                    setSelected(item);
                                                    setOpen(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-800"
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
