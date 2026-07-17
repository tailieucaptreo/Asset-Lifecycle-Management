import { X } from "lucide-react";

const statusColor = {

    NEW: "bg-green-100 text-green-700",

    UPDATE: "bg-yellow-100 text-yellow-700",

    SKIP: "bg-slate-100 text-slate-600"

};

export default function PreviewImportModal({

    open,

    summary,

    rows = [],

    loading,

    onClose,

    onConfirm

}) {

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">

                {/* Header */}

                <div className="border-b px-6 py-4 flex justify-between items-center">

                    <div>

                        <h2 className="text-2xl font-bold">

                            Preview Import VACON

                        </h2>

                        <p className="text-sm text-slate-500">

                            Kiểm tra dữ liệu trước khi import

                        </p>

                    </div>

                    <button

                        onClick={onClose}

                        className="hover:text-red-600"

                    >

                        <X size={26} />

                    </button>

                </div>

                {/* Summary */}

                <div className="grid grid-cols-4 gap-4 p-6">

                    <Card

                        title="Tổng"

                        value={summary?.total || 0}

                    />

                    <Card

                        title="Tạo mới"

                        value={summary?.newCount || 0}

                        color="text-green-600"

                    />

                    <Card

                        title="Cập nhật"

                        value={summary?.updateCount || 0}

                        color="text-yellow-600"

                    />

                    <Card

                        title="Bỏ qua"

                        value={summary?.skipCount || 0}

                        color="text-slate-500"

                    />

                </div>

                {/* Table */}

                <div className="flex-1 overflow-auto px-6">

                    <table className="w-full table-fixed text-sm">

                        <thead className="sticky top-0 bg-slate-100">

                            <tr>

                                <th className="px-4 py-3 text-center w-16">#</th>
                                <th className="px-4 py-3 text-center">Device</th>
                                <th className="px-4 py-3 text-center">Serial</th>
                                <th className="px-4 py-3 text-center w-24">Station</th>
                                <th className="px-4 py-3 text-center w-32">Status</th>

                            </tr>

                        </thead>

                        <tbody>
                            {rows.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-b hover:bg-slate-50"
                                >
                                    <td className="px-4 py-3 text-center">
                                        {index + 1}
                                    </td>
                        
                                    <td className="px-4 py-3 text-center">
                                        {item.deviceName}
                                    </td>
                        
                                    <td className="px-4 py-3 text-center">
                                        {item.serialNumber}
                                    </td>
                        
                                    <td className="px-4 py-3 text-center">
                                        {item.station || "-"}
                                    </td>
                        
                                    <td className="px-4 py-3 text-center">
                                        <span
                                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${statusColor[item.status]}`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>

                {/* Footer */}

                <div className="border-t p-4 flex justify-end gap-3">

                    <button

                        onClick={onClose}

                        className="px-5 py-2 rounded-lg border"

                    >

                        Hủy

                    </button>

                    <button

                        disabled={loading}

                        onClick={onConfirm}

                        className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"

                    >

                        {

                            loading

                            ?

                            "Đang import..."

                            :

                            "Xác nhận Import"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}

function Card({

    title,

    value,

    color=""

}){

    return(

        <div className="border rounded-xl p-4">

            <div className="text-sm text-slate-500">

                {title}

            </div>

            <div className={`text-3xl font-bold mt-2 ${color}`}>

                {value}

            </div>

        </div>

    );

}
