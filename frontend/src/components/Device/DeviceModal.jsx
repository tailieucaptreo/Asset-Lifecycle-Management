import { useEffect, useMemo, useState } from "react";

import {
    X,
    ClipboardList,
    MapPin,
    CalendarClock,
    Save
} from "lucide-react";

// ======================================================
// CATEGORY OPTIONS
// ======================================================

const CATEGORY_OPTIONS = [

    "PLC",

    "Biến tần",

    "BECKHOFF",

    "Điện điều khiển",

    "Cảm biến",

    "Động cơ",

    "An toàn",

    "Khác"

];

// ======================================================
// STATUS OPTIONS
// ======================================================

const STATUS_OPTIONS = [

    {
        value: "Active",
        label: "Đang hoạt động"
    },

    {
        value: "Maintenance",
        label: "Bảo trì"
    },

    {
        value: "Inactive",
        label: "Ngừng hoạt động"
    },

    {
        value: "Expired",
        label: "Hết hạn"
    }

];

// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(value) {

    if (!value) return "";

    const date = new Date(value);

    if (isNaN(date.getTime())) return "";

    return date.toISOString().split("T")[0];

}

// ======================================================
// ADD YEARS
// ======================================================

function addYears(date, years) {

    if (!date || !years) return "";

    const d = new Date(date);

    d.setFullYear(

        d.getFullYear() + Number(years)

    );

    return formatDate(d);

}

// ======================================================
// CARD TITLE
// ======================================================

function SectionTitle({

    icon,

    title

}) {

    return (

        <div
            className="
                flex
                items-center
                gap-2
                mb-5
            "
        >

            <div
                className="
                    w-10
                    h-10
                    rounded-xl
                    bg-blue-100
                    text-blue-600
                    flex
                    items-center
                    justify-center
                "
            >

                {icon}

            </div>

            <h2
                className="
                    text-xl
                    font-bold
                    text-slate-800
                "
            >

                {title}

            </h2>

        </div>

    );

}

// ======================================================
// INPUT
// ======================================================

function Input({

    label,

    ...props

}) {

    return (

        <div>

            <label
                className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                "
            >

                {label}

            </label>

            <input

                {...props}

                className={`
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    px-4
                    py-3
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                    ${props.readOnly
                        ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                        : "bg-white"}
                    ${props.className || ""}
                `}

            />

        </div>

    );

}

// ======================================================
// SELECT
// ======================================================

function Select({

    label,

    options,

    className = "",

    ...props

}) {

    return (

        <div>

            <label
                className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                "
            >

                {label}

            </label>

            <select

                {...props}

                className={`
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    px-4
                    py-3
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                    ${className}
                `}

            >

                <option value="">

                    -- Chọn --

                </option>

                {options.map(item => (

                    typeof item === "string"

                        ? (

                            <option

                                key={item}

                                value={item}

                            >

                                {item}

                            </option>

                        )

                        : (

                            <option

                                key={item.value}

                                value={item.value}

                            >

                                {item.label}

                            </option>

                        )

                ))}

            </select>

        </div>

    );

}

// ======================================================
// DEVICE MODAL
// ======================================================

export default function DeviceModal({

    open,

    device,

    onClose,

    onSave,

    loading = false

}) {

    const [form, setForm] = useState({

        name: "",

        category: "",

        status: "Active",

        deviceId: "",

        code: "",

        area: "",

        line: "",

        station: "",

        installDate: "",

        lastMaintenance: "",

        lifespan: "",

        expiryDate: ""

    });

    // ================= LOAD DEVICE =================

    useEffect(() => {

        if (!device) return;

        setForm({

            name: device.name || "",

            category: device.category || "",

            status: device.status || "Active",

            deviceId: device.deviceId || "",

            code: device.code || "",

            area: device.area || "",

            line: device.line || "",

            station: device.station || "",

            installDate: formatDate(

                device.installDate

            ),

            lastMaintenance: formatDate(

                device.lastMaintenance

            ),

            lifespan: device.lifespan || "",

            expiryDate: formatDate(

                device.expiryDate

            )

        });

    }, [device]);

    // ================= AUTO CALCULATE EXPIRED =================

    const expiryDate = useMemo(() => {

        if (

            !form.installDate ||

            !form.lifespan

        ) {

            return "";

        }

        return addYears(

            form.installDate,

            form.lifespan

        );

    }, [

        form.installDate,

        form.lifespan

    ]);

    // ================= CHANGE =================

    const handleChange = e => {

        const {

            name,

            value

        } = e.target;

        setForm(prev => ({

            ...prev,

            [name]: value

        }));

    };

    // ================= SAVE =================

    const handleSubmit = e => {

        e.preventDefault();

        onSave({

            ...form,

            expiryDate

        });

    };

    if (!open) return null;

    return (

        <div
            className="
                fixed
                inset-0
                z-50
                bg-black/40
                backdrop-blur-sm
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
                        px-7
                        py-5
                        border-b
                        bg-slate-50
                    "
                >

                    <div>

                        <h1
                            className="
                                text-3xl
                                font-bold
                                text-slate-800
                            "
                        >

                            {device?.id

                                ? "Cập nhật thiết bị"

                                : "Thêm thiết bị"}

                        </h1>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >

                            Quản lý thông tin và vòng đời thiết bị.

                        </p>

                    </div>

                    <button

                        onClick={onClose}

                        className="
                            w-10
                            h-10
                            rounded-xl
                            hover:bg-slate-200
                            flex
                            items-center
                            justify-center
                            transition
                        "

                    >

                        <X size={22} />

                    </button>

                </div>

                {/* ================= BODY ================= */}

                <form

                    onSubmit={handleSubmit}

                    className="
                        flex-1
                        overflow-y-auto
                        p-7
                        space-y-8
                    "
                >

                    {/* ====================================================== */}
                    {/* THÔNG TIN CHUNG */}
                    {/* ====================================================== */}

                    <div
                        className="
                            bg-white
                            border
                            rounded-2xl
                            shadow-sm
                            p-6
                        "
                    >

                        <SectionTitle

                            icon={<ClipboardList size={22} />}

                            title="Thông tin chung"

                        />

                        <div
                            className="
                                grid
                                grid-cols-1
                                lg:grid-cols-3
                                gap-6
                            "
                        >

                            <div className="lg:col-span-2">

                                <Input

                                    label="Tên thiết bị"

                                    name="name"

                                    value={form.name}

                                    onChange={handleChange}

                                    placeholder="Nhập tên thiết bị"

                                    required

                                />

                            </div>

                            <div>

                                <Select

                                    label="Trạng thái"

                                    name="status"

                                    value={form.status}

                                    onChange={handleChange}

                                    options={STATUS_OPTIONS}

                                />

                            </div>

                            <Input

                                label="Mã ID"

                                name="deviceId"

                                value={form.deviceId}

                                onChange={handleChange}

                                placeholder="Device ID"

                            />

                            <Input

                                label="Ký hiệu"

                                name="code"

                                value={form.code}

                                onChange={handleChange}

                                placeholder="Ví dụ: 200A2"

                            />

                            <Select

                                label="Phân loại"

                                name="category"

                                value={form.category}

                                onChange={handleChange}

                                options={CATEGORY_OPTIONS}

                            />

                        </div>

                        <div
                            className="
                                grid
                                grid-cols-1
                                lg:grid-cols-2
                                gap-6
                                mt-6
                            "
                        >

                            <Input

                                label="Khu vực"

                                name="area"

                                value={form.area}

                                onChange={handleChange}

                                placeholder="Ví dụ: Phòng điều khiển"

                            />

                            <div
                                className="
                                    rounded-xl
                                    border
                                    bg-slate-50
                                    px-4
                                    py-3
                                    flex
                                    flex-col
                                    justify-center
                                "
                            >

                                <span
                                    className="
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    "
                                >

                                    Thông tin

                                </span>

                                <span
                                    className="
                                        mt-2
                                        text-sm
                                        text-slate-500
                                        leading-6
                                    "
                                >

                                    Thiết bị được định danh theo

                                    <strong> Tuyến + Ký hiệu </strong>

                                    để tránh trùng dữ liệu khi import.

                                </span>

                            </div>

                        </div>

                    </div>

                                        {/* ====================================================== */}
                    {/* VỊ TRÍ LẮP ĐẶT */}
                    {/* ====================================================== */}

                    <div
                        className="
                            bg-white
                            border
                            rounded-2xl
                            shadow-sm
                            p-6
                        "
                    >

                        <SectionTitle

                            icon={<MapPin size={22} />}

                            title="Vị trí lắp đặt"

                        />

                        <div
                            className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                lg:grid-cols-3
                                gap-6
                            "
                        >

                            <Input

                                label="Tuyến"

                                name="line"

                                value={form.line}

                                onChange={handleChange}

                                placeholder="Ví dụ: Tuyến 1"

                                required

                            />

                            <Input

                                label="Nhà ga"

                                name="station"

                                value={form.station}

                                onChange={handleChange}

                                placeholder="Ví dụ: Ga đi"

                            />

                            <Input

                                label="Khu vực"

                                name="area"

                                value={form.area}

                                onChange={handleChange}

                                placeholder="Ví dụ: Tủ MCC"

                            />

                        </div>

                    </div>

                    {/* ====================================================== */}
                    {/* THỜI GIAN & TUỔI THỌ */}
                    {/* ====================================================== */}

                    <div
                        className="
                            bg-white
                            border
                            rounded-2xl
                            shadow-sm
                            p-6
                        "
                    >

                        <SectionTitle

                            icon={<CalendarClock size={22} />}

                            title="Thời gian & Tuổi thọ"

                        />

                        <div
                            className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                lg:grid-cols-4
                                gap-6
                            "
                        >

                            <Input

                                label="Ngày lắp đặt"

                                type="date"

                                name="installDate"

                                value={form.installDate}

                                onChange={handleChange}

                            />

                            <Input

                                label="Bảo trì gần nhất"

                                type="date"

                                name="lastMaintenance"

                                value={form.lastMaintenance}

                                onChange={handleChange}

                            />

                            <Input

                                label="Tuổi thọ (năm)"

                                type="number"

                                min="0"

                                name="lifespan"

                                value={form.lifespan}

                                onChange={handleChange}

                                placeholder="10"

                            />

                            <Input

                                label="Ngày hết hạn"

                                type="date"

                                value={expiryDate}

                                readOnly

                            />

                        </div>

                        <div
                            className="
                                mt-6
                                rounded-xl
                                bg-blue-50
                                border
                                border-blue-200
                                px-5
                                py-4
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    text-blue-700
                                    leading-6
                                "
                            >

                                <strong>Lưu ý:</strong> Ngày hết hạn sẽ được tính
                                tự động từ <strong>Ngày lắp đặt</strong> +
                                <strong> Tuổi thọ</strong>. Trường này chỉ hiển
                                thị và không thể chỉnh sửa thủ công.

                            </p>

                        </div>

                    </div>
                    {/* ================= FOOTER ================= */}

                    <div
                        className="
                            sticky
                            bottom-0
                            bg-white
                            border-t
                            px-7
                            py-5
                            flex
                            items-center
                            justify-end
                            gap-3
                        "
                    >

                        <button

                            type="button"

                            onClick={onClose}

                            className="
                                px-6
                                py-3
                                rounded-xl
                                border
                                border-slate-300
                                hover:bg-slate-100
                                transition
                            "

                        >

                            Hủy

                        </button>

                        <button

                            type="submit"

                            disabled={loading}

                            className="
                                inline-flex
                                items-center
                                gap-2
                                px-6
                                py-3
                                rounded-xl
                                bg-blue-600
                                text-white
                                hover:bg-blue-700
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                transition
                            "

                        >

                            <Save size={18} />

                            {

                                loading

                                    ? "Đang lưu..."

                                    : device?.id

                                        ? "Cập nhật"

                                        : "Thêm thiết bị"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}