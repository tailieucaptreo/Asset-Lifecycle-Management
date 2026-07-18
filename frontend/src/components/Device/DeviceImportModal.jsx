import { X, CheckCircle2, AlertTriangle, Plus } from "lucide-react";

const statusColor = {

    NEW: "bg-green-100 text-green-700",

    UPDATE: "bg-yellow-100 text-yellow-700",

    SKIP: "bg-slate-100 text-slate-700"

};

const statusLabel = {

    NEW: "Mới",

    UPDATE: "Cập nhật",

    SKIP: "Bỏ qua"

};

function Badge({ status }) {

    return (

        <span
            className={`
                inline-flex
                items-center
                px-2.5
                py-1
                rounded-full
                text-xs
                font-semibold
                ${statusColor[status] || statusColor.SKIP}
            `}
        >

            {statusLabel[status] || status}

        </span>

    );

}

function SummaryCard({

    title,

    value,

    color,

    icon

}) {

    return (

        <div
            className="
                bg-white
                rounded-xl
                border
                shadow-sm
                p-4
                flex
                items-center
                justify-between
            "
        >

            <div>

                <p className="text-sm text-slate-500">

                    {title}

                </p>

                <h2
                    className={`
                        mt-1
                        text-3xl
                        font-bold
                        ${color}
                    `}
                >

                    {value}

                </h2>

            </div>

            <div
                className={`
                    w-12
                    h-12
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    ${color.replace("text", "bg")}
                    bg-opacity-10
                `}
            >

                {icon}

            </div>

        </div>

    );

}

export default function DeviceImportModal({

    open,

    summary,

    rows,

    loading,

    onClose,

    onConfirm

}) {

    if (!open) return null;

    return (

        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    w-full
                    max-w-7xl
                    max-h-[92vh]
                    overflow-hidden
                    flex
                    flex-col
                "
            >

                {/* ================= HEADER ================= */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        px-6
                        py-4
                        border-b
                        bg-slate-50
                    "
                >

                    <div>

                        <h2 className="text-2xl font-bold text-slate-800">

                            Xem trước dữ liệu Import Thiết bị

                        </h2>

                        <p className="text-sm text-slate-500 mt-1">

                            Kiểm tra dữ liệu trước khi cập nhật vào hệ thống.

                        </p>

                    </div>

                    <button

                        onClick={onClose}

                        className="
                            p-2
                            rounded-lg
                            hover:bg-slate-200
                            transition
                        "

                    >

                        <X size={22} />

                    </button>

                </div>

                {/* ================= SUMMARY ================= */}

                <div className="p-6 bg-slate-50 border-b">

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                        <SummaryCard

                            title="Tổng bản ghi"

                            value={summary?.total || 0}

                            color="text-blue-600"

                            icon={

                                <CheckCircle2
                                    size={24}
                                    className="text-blue-600"
                                />

                            }

                        />

                        <SummaryCard

                            title="Thiết bị mới"

                            value={summary?.newCount || 0}

                            color="text-green-600"

                            icon={

                                <Plus
                                    size={24}
                                    className="text-green-600"
                                />

                            }

                        />

                        <SummaryCard

                            title="Cập nhật"

                            value={summary?.updateCount || 0}

                            color="text-amber-600"

                            icon={

                                <AlertTriangle
                                    size={24}
                                    className="text-amber-600"
                                />

                            }

                        />

                        <SummaryCard

                            title="Bỏ qua"

                            value={summary?.skipCount || 0}

                            color="text-slate-600"

                            icon={

                                <X
                                    size={24}
                                    className="text-slate-600"
                                />

                            }

                        />

                    </div>

                </div>

                {/* ================= PREVIEW TABLE ================= */}

                <div
                    className="
                        flex-1
                        overflow-auto
                        p-6
                    "
                >
                    <div className="overflow-auto border rounded-xl">

                        <table className="min-w-full text-sm">

                            <thead className="sticky top-0 bg-slate-100 z-10">

                                <tr className="text-left">

                                    <th className="px-3 py-3 border-b w-16">

                                        STT

                                    </th>

                                    <th className="px-3 py-3 border-b w-32">

                                        Kết quả

                                    </th>

                                    <th className="px-3 py-3 border-b min-w-[220px]">

                                        Tên thiết bị

                                    </th>

                                    <th className="px-3 py-3 border-b min-w-[140px]">

                                        Tuyến

                                    </th>

                                    <th className="px-3 py-3 border-b min-w-[160px]">

                                        Nhà ga

                                    </th>

                                    <th className="px-3 py-3 border-b min-w-[160px]">

                                        Phân loại

                                    </th>

                                    <th className="px-3 py-3 border-b min-w-[150px]">

                                        Device ID

                                    </th>

                                    <th className="px-3 py-3 border-b min-w-[120px]">

                                        Ký hiệu

                                    </th>

                                    <th className="px-3 py-3 border-b min-w-[150px]">

                                        Khu vực

                                    </th>

                                    <th className="px-3 py-3 border-b min-w-[150px]">

                                        Trạng thái

                                    </th>

                                    <th className="px-3 py-3 border-b min-w-[120px]">

                                        Tuổi thọ

                                    </th>

                                    <th className="px-3 py-3 border-b min-w-[260px]">

                                        Ghi chú

                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {(rows || []).map((row, index) => {

                                    const bg =

                                        row.status === "NEW"

                                            ? "bg-green-50"

                                            : row.status === "UPDATE"

                                                ? "bg-yellow-50"

                                                : "bg-slate-50";

                                    return (

                                        <tr

                                            key={index}

                                            className={`${bg} hover:bg-blue-50 transition-colors`}

                                        >

                                            <td className="px-3 py-3 border-b">

                                                {index + 1}

                                            </td>

                                            <td className="px-3 py-3 border-b">

                                                <Badge

                                                    status={row.status}

                                                />

                                            </td>

                                            <td className="px-3 py-3 border-b font-medium">

                                                {row.name || "-"}

                                            </td>

                                            <td className="px-3 py-3 border-b">

                                                {row.line || "-"}

                                            </td>

                                            <td className="px-3 py-3 border-b">

                                                {row.station || "-"}

                                            </td>

                                            <td className="px-3 py-3 border-b">

                                                {row.category || "-"}

                                            </td>

                                            <td className="px-3 py-3 border-b">

                                                {row.deviceId || "-"}

                                            </td>

                                            <td className="px-3 py-3 border-b">

                                                {row.code || "-"}

                                            </td>

                                            <td className="px-3 py-3 border-b">

                                                {row.area || "-"}

                                            </td>

                                            <td className="px-3 py-3 border-b">

                                                {row.deviceStatus ||

                                                    row.statusDevice ||

                                                    row.runningStatus ||

                                                    "-"}

                                            </td>

                                            <td className="px-3 py-3 border-b">

                                                {row.lifespan || "-"}

                                            </td>

                                            <td className="px-3 py-3 border-b text-slate-500">

                                                {row.note ||

                                                    row.message ||

                                                    ""}

                                            </td>

                                        </tr>

                                    );

                                })}

                                {!rows?.length && (

                                    <tr>

                                        <td

                                            colSpan={12}

                                            className="text-center py-10 text-slate-500"

                                        >

                                            Không có dữ liệu để hiển thị.

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>
                
                {/* ================= FOOTER ================= */}

                <div
                    className="
                        border-t
                        bg-white
                        px-6
                        py-4
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div className="text-sm text-slate-500">

                        Tổng cộng

                        <span className="font-semibold mx-1">

                            {summary?.total || rows?.length || 0}

                        </span>

                        bản ghi.

                        <span className="ml-3 text-green-600 font-medium">

                            Mới: {summary?.newCount || 0}

                        </span>

                        <span className="ml-3 text-amber-600 font-medium">

                            Cập nhật: {summary?.updateCount || 0}

                        </span>

                        <span className="ml-3 text-slate-600 font-medium">

                            Bỏ qua: {summary?.skipCount || 0}

                        </span>

                    </div>

                    <div className="flex gap-3">

                        <button

                            type="button"

                            onClick={onClose}

                            disabled={loading}

                            className="
                                px-5
                                py-2.5
                                rounded-lg
                                border
                                border-slate-300
                                hover:bg-slate-100
                                disabled:opacity-50
                            "

                        >

                            Hủy

                        </button>

                        <button

                            type="button"

                            onClick={onConfirm}

                            disabled={
                                loading ||
                                !rows?.length
                            }

                            className="
                                px-6
                                py-2.5
                                rounded-lg
                                bg-blue-600
                                text-white
                                hover:bg-blue-700
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "

                        >

                            {

                                loading

                                    ? "Đang import..."

                                    : `Import ${summary?.newCount || 0} mới + ${summary?.updateCount || 0} cập nhật`

                            }

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}