import { useEffect, useState } from "react";
import { X } from "lucide-react";

const initialForm = {
    name: "",
    deviceId: "",
    serialNumber: "",

    brand: "",
    model: "",

    line: "",
    station: "",
    location: "",

    ipAddress: "",
    firmware: "",

    power: "",
    voltage: "",
    current: "",

    status: "Running",

    installDate: "",

    image: "",

    note: ""
};

export default function DriveModal({

    open,

    mode = "create",

    drive,

    filters,

    onClose,

    onSave

}) {

    const [form, setForm] = useState(initialForm);

    useEffect(() => {

        if (drive) {

            setForm({

                ...initialForm,

                ...drive,

                installDate:

                    drive.installDate

                        ? new Date(drive.installDate)
                            .toISOString()
                            .slice(0, 10)

                        : ""

            });

        }

        else {

            setForm(initialForm);

        }

    }, [drive, mode]);

    if (!open) return null;

    const readOnly =
        mode === "view";

    const change = (key, value) => {

        setForm(prev => ({

            ...prev,

            [key]: value

        }));

    };

    const validate = () => {

        const name = (form.name ?? "").trim();

        const deviceId = (form.deviceId ?? "").trim();

        const brand = (form.brand ?? "").trim();

        const model = (form.model ?? "").trim();

        if (!name) {

            alert("Chưa nhập tên biến tần");

            return false;

        }

        // Nếu Mã TB không bắt buộc thì bỏ đoạn này
        /*
        if (!deviceId) {
    
            alert("Chưa nhập mã thiết bị");
    
            return false;
    
        }
        */

        if (!brand) {

            alert("Chưa chọn hãng");

            return false;

        }

        if (!model) {

            alert("Chưa nhập model");

            return false;

        }

        return true;

    };

    const submit = () => {

        if (!validate()) return;

        onSave({

            ...form,

            name: (form.name ?? "").trim(),

            deviceId: (form.deviceId ?? "").trim() || null,

            serialNumber: (form.serialNumber ?? "").trim() || null,

            brand: (form.brand ?? "").trim(),

            model: (form.model ?? "").trim(),

            firmware: (form.firmware ?? "").trim() || null,

            ipAddress: (form.ipAddress ?? "").trim() || null,

            power: (form.power ?? "").trim() || null,

            voltage: (form.voltage ?? "").trim() || null,

            current: (form.current ?? "").trim() || null,

            line: (form.line ?? "").trim() || null,

            station: (form.station ?? "").trim() || null,

            location: (form.location ?? "").trim() || null,

            note: (form.note ?? "").trim() || null

        });

    };

    return (

        <div
            className="
                fixed
                inset-0
                bg-black/40
                flex
                items-center
                justify-center
                z-50
                p-4
            "
        >

            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow-xl
                    w-full
                    max-w-5xl
                    max-h-[90vh]
                    overflow-y-auto
                "
            >

                {/* Header */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        px-6
                        py-4
                    "
                >

                    <h2
                        className="
                            text-xl
                            font-semibold
                        "
                    >

                        {

                            mode === "create"

                                ? "Thêm biến tần"

                                : mode === "edit"

                                    ? "Cập nhật biến tần"

                                    : "Thông tin biến tần"

                        }

                    </h2>

                    <button

                        onClick={onClose}

                        className="
                            p-2
                            rounded-lg
                            hover:bg-gray-100
                        "

                    >

                        <X size={20} />

                    </button>

                </div>

                {/* Body */}

                <div className="p-6 space-y-8">

                    {/* =======================
                        THÔNG TIN CHUNG
                    ======================== */}

                    <div>

                        <h3 className="font-semibold mb-4">

                            Thông tin chung

                        </h3>

                        <div
                            className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                gap-4
                            "
                        >

                            <Input
                                label="Tên biến tần"
                                value={form.name}
                                readOnly={readOnly}
                                onChange={v => change("name", v)}
                            />

                            <Input
                                label="Mã thiết bị"
                                value={form.deviceId}
                                readOnly={readOnly}
                                onChange={v => change("deviceId", v)}
                            />

                            <Input
                                label="Serial Number"
                                value={form.serialNumber}
                                readOnly={readOnly}
                                onChange={v => change("serialNumber", v)}
                            />

                            <Select
                                label="Hãng"
                                value={form.brand}
                                readOnly={readOnly}
                                options={[
                                    "ABB",
                                    "VACON",
                                    ...(filters?.brands || [])
                                ]}
                                onChange={v => change("brand", v)}
                            />

                            <Input
                                label="Model"
                                value={form.model}
                                readOnly={readOnly}
                                onChange={v => change("model", v)}
                            />

                            <Select
                                label="Trạng thái"
                                value={form.status}
                                readOnly={readOnly}
                                options={[
                                    "Running",
                                    "Maintenance",
                                    "Fault",
                                    "Offline"
                                ]}
                                onChange={v => change("status", v)}
                            />

                        </div>

                    </div>
                    {/* =======================
                        VỊ TRÍ LẮP ĐẶT
                    ======================== */}

                    <div>

                        <h3 className="font-semibold mb-4">

                            Vị trí lắp đặt

                        </h3>

                        <div
                            className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                gap-4
                            "
                        >

                            <Select
                                label="Tuyến"
                                value={form.line}
                                readOnly={readOnly}
                                options={filters?.lines || []}
                                onChange={v => change("line", v)}
                            />

                            <Select
                                label="Nhà ga"
                                value={form.station}
                                readOnly={readOnly}
                                options={filters?.stations || []}
                                onChange={v => change("station", v)}
                            />

                            <Input
                                label="Vị trí"
                                value={form.location}
                                readOnly={readOnly}
                                onChange={v => change("location", v)}
                            />

                        </div>

                    </div>

                    {/* =======================
                        THÔNG SỐ KỸ THUẬT
                    ======================== */}

                    <div>

                        <h3 className="font-semibold mb-4">

                            Thông số kỹ thuật

                        </h3>

                        <div
                            className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                gap-4
                            "
                        >

                            <Input
                                label="IP Address"
                                value={form.ipAddress}
                                readOnly={readOnly}
                                onChange={v => change("ipAddress", v)}
                            />

                            <Input
                                label="Firmware"
                                value={form.firmware}
                                readOnly={readOnly}
                                onChange={v => change("firmware", v)}
                            />

                            <Input
                                label="Công suất"
                                value={form.power}
                                readOnly={readOnly}
                                onChange={v => change("power", v)}
                            />

                            <Input
                                label="Điện áp"
                                value={form.voltage}
                                readOnly={readOnly}
                                onChange={v => change("voltage", v)}
                            />

                            <Input
                                label="Dòng điện"
                                value={form.current}
                                readOnly={readOnly}
                                onChange={v => change("current", v)}
                            />

                            <Input
                                type="date"
                                label="Ngày lắp đặt"
                                value={form.installDate}
                                readOnly={readOnly}
                                onChange={v => change("installDate", v)}
                            />

                        </div>

                    </div>

                    {/* =======================
                        GHI CHÚ
                    ======================== */}

                    <div>

                        <h3 className="font-semibold mb-4">

                            Ghi chú

                        </h3>

                        <Textarea
                            value={form.note}
                            readOnly={readOnly}
                            onChange={v => change("note", v)}
                        />

                    </div>

                </div>

                {/* Footer */}

                <div
                    className="
                        border-t
                        p-4
                        flex
                        justify-end
                        gap-3
                    "
                >

                    <button
                        onClick={onClose}
                        className="
                            px-5
                            py-2
                            rounded-xl
                            border
                            hover:bg-gray-100
                        "
                    >
                        Đóng
                    </button>

                    {

                        !readOnly &&

                        <button
                            onClick={submit}
                            className="
                                px-5
                                py-2
                                rounded-xl
                                bg-blue-600
                                text-white
                                hover:bg-blue-700
                            "
                        >
                            Lưu
                        </button>

                    }

                </div>

            </div>

        </div>

    );

}

function Input({

    label,

    value,

    onChange,

    readOnly,

    type = "text"

}) {

    return (

        <div>

            <label className="block text-sm font-medium mb-2">

                {label}

            </label>

            <input

                type={type}

                value={value || ""}

                readOnly={readOnly}

                onChange={(e) => onChange(e.target.value)}

                className="
                    w-full
                    border
                    rounded-xl
                    px-3
                    py-2.5
                    focus:ring-2
                    focus:ring-blue-500
                    outline-none
                "

            />

        </div>

    );

}

function Select({

    label,

    value,

    options = [],

    onChange,

    readOnly

}) {

    const items = [...new Set(options.filter(Boolean))];

    return (

        <div>

            <label className="block text-sm font-medium mb-2">

                {label}

            </label>

            <select

                value={value || ""}

                disabled={readOnly}

                onChange={(e) => onChange(e.target.value)}

                className="
                    w-full
                    border
                    rounded-xl
                    px-3
                    py-2.5
                    focus:ring-2
                    focus:ring-blue-500
                    outline-none
                "

            >

                <option value="">

                    Chọn...

                </option>

                {items.map(item => (

                    <option

                        key={item}

                        value={item}

                    >

                        {item}

                    </option>

                ))}

            </select>

        </div>

    );

}

function Textarea({

    value,

    onChange,

    readOnly

}) {

    return (

        <textarea

            rows={5}

            value={value || ""}

            readOnly={readOnly}

            onChange={(e) => onChange(e.target.value)}

            className="
                w-full
                border
                rounded-xl
                p-3
                resize-none
                focus:ring-2
                focus:ring-blue-500
                outline-none
            "

        />

    );

}
