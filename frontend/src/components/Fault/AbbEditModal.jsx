import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";

export default function AbbEditModal({

    open,

    data,

    onClose,

    onSave

}) {

    const [form, setForm] = useState({});

    useEffect(() => {

        if (data) {

            setForm({

                ...data,

                lastReplaceDate: data.lastReplaceDate
                    ? data.lastReplaceDate.slice(0, 10)
                    : "",

                lastMaintenance: data.lastMaintenance
                    ? data.lastMaintenance.slice(0, 10)
                    : ""

            });

        }

    }, [data]);

    if (!open) return null;

    const change = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({

            ...prev,

            [name]: value

        }));

    };

    const submit = () => {

        onSave(form);

    };

    const Input = ({

        label,

        name,

        type = "text"

    }) => (

        <div>

            <label className="block text-sm font-medium mb-1">

                {label}

            </label>

            <input

                type={type}

                name={name}

                value={form[name] || ""}

                onChange={change}

                className="w-full border rounded-xl px-3 py-2"

            />

        </div>

    );

    return (

        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">

            <div className="bg-white rounded-2xl shadow-xl w-[950px] max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}

                <div className="flex justify-between items-center border-b px-6 py-4">

                    <h2 className="text-2xl font-bold">

                        Chỉnh sửa lịch sử ABB

                    </h2>

                    <button

                        onClick={onClose}

                        className="p-2 hover:bg-gray-100 rounded-lg"

                    >

                        <X />

                    </button>

                </div>

                {/* Body */}

                <div className="flex-1 overflow-y-auto p-6">

                    <div className="grid grid-cols-2 gap-5">

                        <Input
                            label="Type Code"
                            name="typeCode"
                        />

                        <Input
                            label="Serial Number"
                            name="serialNumber"
                        />

                        <Input
                            label="Tuyến"
                            name="line"
                        />

                        <Input
                            label="Nhà ga"
                            name="station"
                        />

                        <Input
                            label="Ứng dụng"
                            name="application"
                        />

                        <Input
                            label="Firmware"
                            name="firmware"
                        />

                        <Input
                            label="Tình trạng"
                            name="currentStatus"
                        />

                        <Input
                            label="Lý do thay thế"
                            name="replaceReason"
                        />

                        <Input
                            label="Giờ hoạt động"
                            name="operationHours"
                            type="number"
                        />

                        <Input
                            label="Ngày thay"
                            name="lastReplaceDate"
                            type="date"
                        />

                        <Input
                            label="On-time"
                            name="onTimeDay"
                            type="number"
                        />

                        <Input
                            label="Running Day"
                            name="runningDay"
                            type="number"
                        />

                        <Input
                            label="Ngày bảo dưỡng"
                            name="lastMaintenance"
                            type="date"
                        />

                    </div>

                    {/* Công việc bảo dưỡng */}

                    <div className="mt-5">

                        <label className="block text-sm font-medium mb-2">

                            Công việc bảo dưỡng

                        </label>

                        <textarea

                            rows={5}

                            name="maintenanceWork"

                            value={form.maintenanceWork || ""}

                            onChange={change}

                            className="w-full border rounded-xl p-3"

                        />

                    </div>

                    {/* Ghi chú */}

                    <div className="mt-5">

                        <label className="block text-sm font-medium mb-2">

                            Ghi chú

                        </label>

                        <textarea

                            rows={4}

                            name="note"

                            value={form.note || ""}

                            onChange={change}

                            className="w-full border rounded-xl p-3"

                        />

                    </div>

                </div>

                {/* Footer */}

                <div className="border-t px-6 py-4 flex justify-end gap-3">

                    <button

                        onClick={onClose}

                        className="px-5 py-2 border rounded-xl"

                    >

                        Hủy

                    </button>

                    <button

                        onClick={submit}

                        className="px-5 py-2 rounded-xl bg-blue-600 text-white flex items-center gap-2"

                    >

                        <Save size={18} />

                        Lưu thay đổi

                    </button>

                </div>

            </div>

        </div>

    );

}
