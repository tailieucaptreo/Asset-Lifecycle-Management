import { useEffect, useState } from "react";
import axios from "axios";
import API from "../../config";

import {
    X,
    Save,
    Upload,
    Image as ImageIcon
} from "lucide-react";

const brands = [
    "ABB",
    "Siemens",
    "WEG",
    "SEW",
    "Nord",
    "VEM",
    "Bonfiglioli",
    "Khác"
];

const statuses = [
    {
        value: "Running",
        label: "Đang hoạt động"
    },
    {
        value: "Maintenance",
        label: "Bảo trì"
    },
    {
        value: "Replaced",
        label: "Đã thay"
    },
    {
        value: "Normal",
        label: "Chưa thay"
    }
];

const motorTypes = [
    "Động cơ chính",
    "Động cơ bơm dầu",
    "Động cơ làm mát",
    "Động cơ phanh",
    "Động cơ nâng hạ",
    "Động cơ khác"
];

const emptyMotor = {

    deviceId: "",

    name: "",

    type: "",

    brand: "",

    model: "",

    serial: "",

    power: "",

    voltage: "",

    current: "",

    rpm: "",

    frequency: "",

    efficiency: "",

    pole: "",

    bearingCode: "",

    line: "",

    station: "",

    location: "",

    warehouse: "",

    status: "Running",

    installDate: "",

    maintenanceDate: "",

    replacementDate: "",

    runningHours: "",

    image: "",

    note: ""

};

export default function MotorModal({

    open,

    mode = "add",

    motor,

    token,

    onClose,

    onSuccess

}) {

    const [form, setForm] = useState(emptyMotor);

    const [loading, setLoading] = useState(false);

    const [preview, setPreview] = useState("");

    const readOnly = mode === "view";

    useEffect(() => {

        if (!open) return;

        if (motor) {

            setForm({

                ...emptyMotor,

                ...motor,

                installDate:
                    motor.installDate?.substring(0, 10) || "",

                maintenanceDate:
                    motor.maintenanceDate?.substring(0, 10) || "",

                replacementDate:
                    motor.replacementDate?.substring(0, 10) || ""

            });

            setPreview(motor.image || "");

        } else {

            setForm(emptyMotor);

            setPreview("");

        }

    }, [motor, open]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({

            ...prev,

            [name]: value

        }));

    };

    const handleImage = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const body = new FormData();

        body.append("image", file);

        try {

            const res = await axios.post(

                `${API}/upload`,

                body,

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );

            setForm(prev => ({

                ...prev,

                image: res.data.url

            }));

            setPreview(res.data.url);

        } catch {

            alert("Upload ảnh thất bại");

        }

    };

    const handleSubmit = async () => {

        try {

            setLoading(true);

            if (mode === "add") {

                await axios.post(

                    `${API}/api/motors`,

                    form,

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );

            } else {

                await axios.put(

                    `${API}/api/motors/${motor.id}`,

                    form,

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );

            }

            onSuccess();

            onClose();

        } catch {

            alert("Lưu dữ liệu thất bại");

        } finally {

            setLoading(false);

        }

    };

    if (!open) return null;

    return (

        <div
            className="
                fixed
                inset-0
                bg-black/50
                z-50
                flex
                items-center
                justify-center
                p-4
            "
        >

            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    w-full
                    max-w-6xl
                    max-h-[95vh]
                    overflow-y-auto
                "
            >

                {/* Header */}

                <div
                    className="
                        flex
                        justify-between
                        items-center
                        border-b
                        px-6
                        py-4
                    "
                >

                    <h2 className="text-2xl font-bold">

                        {

                            mode === "add"

                                ? "Thêm động cơ"

                                : mode === "edit"

                                    ? "Cập nhật động cơ"

                                    : "Chi tiết động cơ"

                        }

                    </h2>

                    <button

                        onClick={onClose}

                        className="
                            p-2
                            rounded-lg
                            hover:bg-slate-100
                        "

                    >

                        <X size={22} />

                    </button>

                </div>

                <div className="p-6 space-y-8">

                    {/* ===========================
                        THÔNG TIN CHUNG
                    ============================ */}

                    <div>

                        <h3
                            className="
                                text-lg
                                font-semibold
                                mb-4
                                border-b
                                pb-2
                            "
                        >

                            Thông tin chung

                        </h3>

                        <div
                            className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                xl:grid-cols-3
                                gap-5
                            "
                        >

                            <Input
                                label="Mã thiết bị"
                                name="deviceId"
                                value={form.deviceId}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />

                            <Input
                                label="Tên động cơ"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />

                            <Select
                                label="Loại động cơ"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                disabled={readOnly}
                                options={motorTypes}
                            />

                            <Select
                                label="Hãng"
                                name="brand"
                                value={form.brand}
                                onChange={handleChange}
                                disabled={readOnly}
                                options={brands}
                            />

                            <Select
                                label="Trạng thái"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                disabled={readOnly}
                                options={statuses}
                            />

                        </div>

                    </div>
                    {/* ===========================
                        THÔNG SỐ KỸ THUẬT
                    ============================ */}

                    <div>

                        <h3
                            className="
                                text-lg
                                font-semibold
                                mb-4
                                border-b
                                pb-2
                            "
                        >

                            Thông số kỹ thuật

                        </h3>

                        <div
                            className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                xl:grid-cols-3
                                gap-5
                            "
                        >

                            <Input
                                label="Model"
                                name="model"
                                value={form.model}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />

                            <Input
                                label="Serial Number"
                                name="serial"
                                value={form.serial}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />

                            <Input
                                label="Công suất (kW)"
                                name="power"
                                value={form.power}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />

                            <Input
                                label="Điện áp (V)"
                                name="voltage"
                                value={form.voltage}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />

                            <Input
                                label="Dòng điện (A)"
                                name="current"
                                value={form.current}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />

                            <Input
                                label="Tần số (Hz)"
                                name="frequency"
                                value={form.frequency}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />

                            <Input
                                label="Tốc độ (RPM)"
                                name="rpm"
                                value={form.rpm}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />

                            <Input
                                label="Hiệu suất (%)"
                                name="efficiency"
                                value={form.efficiency}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />

                            <Input
                                label="Số cực"
                                name="pole"
                                value={form.pole}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />

                            <Input
                                label="Mã ổ bi"
                                name="bearingCode"
                                value={form.bearingCode}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />

                            <Input
                                label="Số giờ vận hành"
                                name="runningHours"
                                value={form.runningHours}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />

                        </div>

                    </div>

                    {/* ===========================
                        VỊ TRÍ & BẢO TRÌ
                    ============================ */}

                    <div>

                        <h3
                            className="
                                text-lg
                                font-semibold
                                mb-4
                                border-b
                                pb-2
                            "
                        >

                            Vị trí & Bảo trì

                        </h3>

                        <div
                            className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                xl:grid-cols-3
                                gap-5
                            "
                        >

                            <Input
                                label="Tuyến"
                                name="line"
                                value={form.line}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />

                            <Input
                                label="Nhà ga"
                                name="station"
                                value={form.station}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />

                            <Input
                                label="Vị trí lắp đặt"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />

                            <Input
                                label="Kho lưu trữ"
                                name="warehouse"
                                value={form.warehouse}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />

                            <Input
                                type="date"
                                label="Ngày lắp đặt"
                                name="installDate"
                                value={form.installDate}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />

                            <Input
                                type="date"
                                label="Ngày bảo trì"
                                name="maintenanceDate"
                                value={form.maintenanceDate}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />

                            <Input
                                type="date"
                                label="Ngày thay thế"
                                name="replacementDate"
                                value={form.replacementDate}
                                onChange={handleChange}
                                readOnly={readOnly}
                            />

                        </div>

                    </div>

                    {/* ===========================
                        HÌNH ẢNH
                    ============================ */}

                    <div>

                        <h3
                            className="
                                text-lg
                                font-semibold
                                mb-4
                                border-b
                                pb-2
                            "
                        >

                            Hình ảnh động cơ

                        </h3>

                        <div
                            className="
                                flex
                                flex-col
                                lg:flex-row
                                gap-6
                                items-start
                            "
                        >

                            <div
                                className="
                                    w-64
                                    h-64
                                    rounded-2xl
                                    border-2
                                    border-dashed
                                    border-slate-300
                                    overflow-hidden
                                    bg-slate-50
                                    flex
                                    items-center
                                    justify-center
                                "
                            >

                                {

                                    preview

                                        ?

                                        <img

                                            src={preview}

                                            alt="Motor"

                                            className="
                                                w-full
                                                h-full
                                                object-cover
                                            "

                                        />

                                        :

                                        <div
                                            className="
                                                flex
                                                flex-col
                                                items-center
                                                text-slate-400
                                                gap-2
                                            "
                                        >

                                            <ImageIcon size={48} />

                                            <span>

                                                Chưa có hình ảnh

                                            </span>

                                        </div>

                                }

                            </div>

                            {

                                !readOnly &&

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-4
                                    "
                                >

                                    <label
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            px-5
                                            py-3
                                            rounded-xl
                                            bg-blue-600
                                            hover:bg-blue-700
                                            text-white
                                            cursor-pointer
                                            transition
                                        "
                                    >

                                        <Upload size={18} />

                                        Chọn hình ảnh

                                        <input

                                            type="file"

                                            accept="image/*"

                                            hidden

                                            onChange={handleImage}

                                        />

                                    </label>

                                    <p
                                        className="
                                            text-sm
                                            text-slate-500
                                            leading-relaxed
                                        "
                                    >

                                        Hỗ trợ định dạng JPG, PNG, WEBP.

                                        <br />

                                        Khuyến nghị kích thước 800 × 800 px.

                                    </p>

                                </div>

                            }

                        </div>

                    </div>

                    {/* ===========================
                        GHI CHÚ
                    ============================ */}

                    <div>

                        <h3
                            className="
                                text-lg
                                font-semibold
                                mb-4
                                border-b
                                pb-2
                            "
                        >

                            Ghi chú

                        </h3>

                        <textarea

                            name="note"

                            value={form.note}

                            onChange={handleChange}

                            readOnly={readOnly}

                            rows={5}

                            placeholder="Nhập ghi chú..."

                            className="
                                w-full
                                border
                                rounded-xl
                                px-4
                                py-3
                                resize-none
                                focus:ring-2
                                focus:ring-blue-500
                                outline-none
                                read-only:bg-slate-50
                            "

                        />

                    </div>

                </div>

                {/* Footer */}

                <div
                    className="
                        border-t
                        px-6
                        py-4
                        flex
                        justify-end
                        gap-3
                    "
                >

                    <button

                        onClick={onClose}

                        className="
                            px-5
                            py-2.5
                            rounded-xl
                            border
                            hover:bg-slate-100
                            transition
                        "

                    >

                        Đóng

                    </button>

                    {

                        !readOnly &&

                        <button

                            onClick={handleSubmit}

                            disabled={loading}

                            className="
                                inline-flex
                                items-center
                                gap-2
                                px-6
                                py-2.5
                                rounded-xl
                                bg-blue-600
                                hover:bg-blue-700
                                disabled:bg-blue-300
                                text-white
                                transition
                            "

                        >

                            <Save size={18} />

                            {

                                loading

                                    ? "Đang lưu..."

                                    : "Lưu"

                            }

                        </button>

                    }

                </div>

            </div>

        </div>

    );

}

/* ======================================================
   COMPONENT DÙNG CHUNG
====================================================== */

function Input({

    label,

    name,

    value,

    onChange,

    readOnly = false,

    type = "text"

}) {

    return (

        <div>

            <label
                className="
                    block
                    text-sm
                    font-medium
                    mb-1
                "
            >

                {label}

            </label>

            <input

                type={type}

                name={name}

                value={value || ""}

                onChange={onChange}

                readOnly={readOnly}

                className="
                    w-full
                    border
                    rounded-xl
                    px-4
                    py-2.5
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    read-only:bg-slate-50
                "

            />

        </div>

    );

}

function Select({

    label,

    name,

    value,

    onChange,

    options = [],

    disabled = false

}) {

    return (

        <div>

            <label
                className="
                    block
                    text-sm
                    font-medium
                    mb-1
                "
            >

                {label}

            </label>

            <select

                name={name}

                value={value}

                onChange={onChange}

                disabled={disabled}

                className="
                    w-full
                    border
                    rounded-xl
                    px-4
                    py-2.5
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    disabled:bg-slate-100
                "

            >

                <option value="">
                    -- Chọn --
                </option>

                {
                    options.map(option => {

                        const value =
                            typeof option === "object"
                                ? option.value
                                : option;

                        const label =
                            typeof option === "object"
                                ? option.label
                                : option;

                        return (
                            <option
                                key={value}
                                value={value}
                            >
                                {label}
                            </option>
                        );

                    })
                }

            </select>

        </div>

    );

}
