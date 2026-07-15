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

    status: "Running",

    installDate: "",

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
                        ? drive.installDate.substring(0, 10)
                        : ""

            });

        }

        else {

            setForm(initialForm);

        }

    }, [drive]);

    if (!open) return null;

    const readOnly =
        mode === "view";

    const change = (key, value) => {

        setForm(prev => ({

            ...prev,

            [key]: value

        }));

    };

    const submit = () => {

        onSave(form);

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
                    >
                        <X />
                    </button>

                </div>

                {/* Body */}

                <div className="p-6 space-y-8">

                    {/* Thông tin chung */}

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
                                onChange={v => change("name", v)}
                                readOnly={readOnly}
                            />

                            <Input
                                label="Mã thiết bị"
                                value={form.deviceId}
                                onChange={v => change("deviceId", v)}
                                readOnly={readOnly}
                            />

                            <Input
                                label="Serial Number"
                                value={form.serialNumber}
                                onChange={v => change("serialNumber", v)}
                                readOnly={readOnly}
                            />

                            <Select
                                label="Hãng"

                                value={form.brand}

                                readOnly={readOnly}

                                options={filters?.brands || []}

                                onChange={v =>
                                    change("brand", v)
                                }

                            />

                            <Select
                                label="Model"

                                value={form.model}

                                readOnly={readOnly}

                                options={filters?.models || []}

                                onChange={v =>
                                    change("model", v)
                                }

                            />

                            <Select
                                label="Trạng thái"

                                value={form.status}

                                readOnly={readOnly}

                                options={[
                                    "Running",
                                    "Maintenance",
                                    "Fault",
                                    "Spare"
                                ]}

                                onChange={v =>
                                    change("status", v)
                                }

                            />

                        </div>

                    </div>

                    {/* Vị trí */}

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

                                onChange={v =>
                                    change("line", v)
                                }

                            />

                            <Select

                                label="Nhà ga"

                                value={form.station}

                                readOnly={readOnly}

                                options={
                                    filters?.stations || []
                                }

                                onChange={v =>
                                    change("station", v)
                                }

                            />

                            <Input

                                label="Vị trí"

                                value={form.location}

                                readOnly={readOnly}

                                onChange={v =>
                                    change("location", v)
                                }

                            />

                        </div>

                    </div>

                    {/* Thông số */}

                    <div>

                        <h3 className="font-semibold mb-4">

                            Thông số

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

                                onChange={v =>
                                    change("ipAddress", v)
                                }

                            />

                            <Input

                                label="Firmware"

                                value={form.firmware}

                                readOnly={readOnly}

                                onChange={v =>
                                    change("firmware", v)
                                }

                            />

                            <Input

                                label="Công suất"

                                value={form.power}

                                readOnly={readOnly}

                                onChange={v =>
                                    change("power", v)
                                }

                            />

                            <Input

                                label="Điện áp"

                                value={form.voltage}

                                readOnly={readOnly}

                                onChange={v =>
                                    change("voltage", v)
                                }

                            />

                            <Input

                                type="date"

                                label="Ngày lắp đặt"

                                value={form.installDate}

                                readOnly={readOnly}

                                onChange={v =>
                                    change("installDate", v)
                                }

                            />

                        </div>

                        <div className="mt-4">

                            <label
                                className="
                                    block
                                    text-sm
                                    mb-2
                                    font-medium
                                "
                            >

                                Ghi chú

                            </label>

                            <textarea

                                rows={4}

                                value={form.note}

                                readOnly={readOnly}

                                onChange={(e) =>
                                    change(
                                        "note",
                                        e.target.value
                                    )
                                }

                                className="
                                    w-full
                                    border
                                    rounded-xl
                                    p-3
                                "

                            />

                        </div>

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

            <label
                className="
                    block
                    text-sm
                    font-medium
                    mb-2
                "
            >

                {label}

            </label>

            <input

                type={type}

                value={value}

                readOnly={readOnly}

                onChange={(e) =>
                    onChange(e.target.value)
                }

                className="
                    w-full
                    border
                    rounded-xl
                    px-3
                    py-2.5
                "

            />

        </div>

    );

}

function Select({

    label,

    value,

    options,

    onChange,

    readOnly

}) {

    return (

        <div>

            <label
                className="
                    block
                    text-sm
                    font-medium
                    mb-2
                "
            >

                {label}

            </label>

            <select

                value={value}

                disabled={readOnly}

                onChange={(e) =>
                    onChange(e.target.value)
                }

                className="
                    w-full
                    border
                    rounded-xl
                    px-3
                    py-2.5
                "

            >

                <option value="">
                    Chọn...
                </option>

                {options.map(item => (

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
