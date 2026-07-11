import {
    X,
    Cpu,
    Calendar,
    Clock,
    FileText
} from "lucide-react";

export default function AbbDetailModal({

    open,

    data,

    onClose

}) {

    if (!open || !data) return null;

    const Item = ({ label, value }) => (

        <div className="border rounded-xl p-3 bg-gray-50">

            <p className="text-xs text-gray-500 mb-1">
                {label}
            </p>

            <p className="font-medium text-gray-800 whitespace-pre-wrap">
                {value || "-"}
            </p>

        </div>

    );

    const formatDate = (value) => {

        if (!value) return "-";
    
        return new Date(value).toLocaleDateString("vi-VN");
    
    };

    return (

        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

            <div className="bg-white rounded-2xl shadow-2xl w-[900px] max-w-[95vw] max-h-[90vh] overflow-hidden">

                {/* Header */}

                <div className="flex items-center justify-between border-b px-6 py-4">

                    <div>

                        <h2 className="text-2xl font-bold">
                            Chi tiết lịch sử lỗi ABB
                        </h2>

                        <p className="text-gray-500 mt-1">
                            {data.typeCode}
                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <X size={22} />
                    </button>

                </div>

                {/* Body */}

                <div className="p-6 overflow-y-auto max-h-[70vh]">

                    <div className="grid grid-cols-2 gap-4">

                        <Item
                            label="Type Code"
                            value={data.typeCode}
                        />

                        <Item
                            label="Serial Number"
                            value={data.serialNumber}
                        />

                        <Item
                            label="Tuyến"
                            value={data.line}
                        />

                        <Item
                            label="Nhà ga"
                            value={data.station}
                        />

                        <Item
                            label="Ứng dụng"
                            value={data.application}
                        />

                        <Item
                            label="Firmware"
                            value={data.firmware}
                        />

                        <Item
                            label="Tình trạng"
                            value={data.currentStatus}
                        />

                        <Item
                            label="Lý do thay thế"
                            value={data.replaceReason}
                        />

                        <Item
                            label="Giờ hoạt động"
                            value={data.operationHours}
                        />

                        <Item
                            label="Ngày thay thế"
                            value={formatDate(data.lastReplaceDate)}
                        />

                        <Item
                            label="On-time"
                            value={data.onTimeDay}
                        />

                        <Item
                            label="Running Day"
                            value={data.runningDay}
                        />

                        <Item
                            label="Ngày bảo dưỡng"
                            value={formatDate(data.lastMaintenance)}
                        />

                    </div>

                    {/* Công việc bảo dưỡng */}

                    <div className="mt-6">

                        <div className="border rounded-xl p-4">

                            <div className="flex items-center gap-2 mb-3">

                                <FileText size={18} />

                                <span className="font-semibold">
                                    Công việc bảo dưỡng
                                </span>

                            </div>

                            <p className="whitespace-pre-wrap text-gray-700">
                                {data.maintenanceWork || "-"}
                            </p>

                        </div>

                    </div>

                    {/* Ghi chú */}

                    <div className="mt-4">

                        <div className="border rounded-xl p-4">

                            <div className="flex items-center gap-2 mb-3">

                                <FileText size={18} />

                                <span className="font-semibold">
                                    Ghi chú
                                </span>

                            </div>

                            <p className="whitespace-pre-wrap text-gray-700">
                                {data.note || "-"}
                            </p>

                        </div>

                    </div>

                </div>

                {/* Footer */}

                <div className="border-t p-4 flex justify-end">

                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Đóng
                    </button>

                </div>

            </div>

        </div>

    );

}
