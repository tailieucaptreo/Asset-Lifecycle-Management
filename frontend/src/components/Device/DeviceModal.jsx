import { useEffect, useState } from "react";
import axios from "axios";
import API from "../../config";
import { X } from "lucide-react";

const defaultDevice = {

    name: "",

    line: "",

    station: "",

    category: "",

    code: "",

    area: "",

    deviceId: "",

    status: "Đang hoạt động",

    installDate: "",

    lastMaintenance: "",

    lifespan: "",

    expiryDate: ""

};

export default function DeviceModal({

    open,

    onClose,

    onSuccess,

    device = null

}) {

    const [form, setForm] =
        useState(defaultDevice);

    const [loading, setLoading] =
        useState(false);

    const token =
        localStorage.getItem("token");

    const config = {

        headers: {

            Authorization:
                `Bearer ${token}`

        }

    };

    // ==========================
    // LOAD DATA WHEN EDIT
    // ==========================

    useEffect(() => {

        if (!open) return;

        if (device) {

            setForm({

                name:
                    device.name || "",

                line:
                    device.line || "",

                station:
                    device.station || "",

                category:
                    device.category || "",

                code:
                    device.code || "",

                area:
                    device.area || "",

                deviceId:
                    device.deviceId || "",

                status:
                    device.status || "Đang hoạt động",

                installDate:
                    device.installDate
                        ? device.installDate.slice(0, 10)
                        : "",

                lastMaintenance:
                    device.lastMaintenance
                        ? device.lastMaintenance.slice(0, 10)
                        : "",

                lifespan:
                    device.lifespan || "",

                expiryDate:
                    device.expiryDate
                        ? device.expiryDate.slice(0, 10)
                        : ""

            });

        }

        else {

            setForm(defaultDevice);

        }

    }, [open, device]);

    // ==========================
    // AUTO CALCULATE EXPIRY DATE
    // ==========================

    useEffect(() => {

        if (

            !form.installDate ||

            !form.lifespan

        ) {

            return;

        }

        const date =
            new Date(form.installDate);

        date.setFullYear(

            date.getFullYear() +

            Number(form.lifespan)

        );

        setForm(prev => ({

            ...prev,

            expiryDate:

                date

                    .toISOString()

                    .slice(0, 10)

        }));

    }, [

        form.installDate,

        form.lifespan

    ]);

    // ==========================
    // HANDLE CHANGE
    // ==========================

    const handleChange = (e) => {

        const {

            name,

            value

        } = e.target;

        setForm(prev => ({

            ...prev,

            [name]: value

        }));

    };

    // ==========================
    // HANDLE SUBMIT
    // ==========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.name.trim()) {

            alert("Vui lòng nhập tên thiết bị");

            return;

        }

        if (!form.line.trim()) {

            alert("Vui lòng nhập tuyến");

            return;

        }

        if (!form.station.trim()) {

            alert("Vui lòng nhập nhà ga");

            return;

        }

        try {

            setLoading(true);

            const payload = {

                name:
                    form.name.trim(),

                line:
                    form.line.trim(),

                station:
                    form.station.trim(),

                category:
                    form.category.trim(),

                code:
                    form.code.trim(),

                area:
                    form.area.trim(),

                deviceId:
                    form.deviceId.trim(),

                status:
                    form.status,

                installDate:
                    form.installDate || null,

                lastMaintenance:
                    form.lastMaintenance || null,

                lifespan:
                    Number(form.lifespan || 0),

                expiryDate:
                    form.expiryDate || null

            };

            // =====================
            // UPDATE
            // =====================

            if (device?.id) {

                await axios.put(

                    `${API}/api/devices/${device.id}`,

                    payload,

                    config

                );

            }

            // =====================
            // CREATE
            // =====================

            else {

                await axios.post(

                    `${API}/api/devices`,

                    payload,

                    config

                );

            }

            if (onSuccess) {

                await onSuccess();

            }

            setForm(defaultDevice);

            onClose();

        }

        catch (err) {

            console.log(err);

            alert(

                err.response?.data?.error ||

                err.response?.data?.message ||

                "Không thể lưu thiết bị"

            );

        }

        finally {

            setLoading(false);

        }

    };

    // ==========================
    // CLOSE
    // ==========================

    if (!open) {

        return null;

    }
    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div
                className="
                    w-full
                    max-w-6xl
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    overflow-hidden
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
                    "
                >

                    <h2 className="text-2xl font-bold">

                        {device
                            ? "Cập nhật thiết bị"
                            : "Thêm thiết bị"}

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

                {/* ================= FORM ================= */}

                <form
                    onSubmit={handleSubmit}
                    className="p-6"
                >

                    {/* ================= THÔNG TIN CHUNG ================= */}

                    <div className="mb-8">

                        <h3 className="font-semibold text-lg mb-4">

                            Thông tin chung

                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                            <div>

                                <label className="block mb-1 font-medium">

                                    Tên thiết bị

                                </label>

                                <input

                                    name="name"

                                    value={form.name}

                                    onChange={handleChange}

                                    className="w-full border rounded-lg px-3 py-2"

                                    required

                                />

                            </div>

                            <div>

                                <label className="block mb-1 font-medium">

                                    Phân loại

                                </label>

                                <input

                                    name="category"

                                    value={form.category}

                                    onChange={handleChange}

                                    className="w-full border rounded-lg px-3 py-2"

                                />

                            </div>

                            <div>

                                <label className="block mb-1 font-medium">

                                    Trạng thái

                                </label>

                                <select

                                    name="status"

                                    value={form.status}

                                    onChange={handleChange}

                                    className="w-full border rounded-lg px-3 py-2"

                                >

                                    <option>

                                        Đang hoạt động

                                    </option>

                                    <option>

                                        Bảo trì

                                    </option>

                                    <option>

                                        Hỏng

                                    </option>

                                    <option>

                                        Dự phòng

                                    </option>

                                </select>

                            </div>

                            <div>

                                <label className="block mb-1 font-medium">

                                    Mã ID

                                </label>

                                <input

                                    name="deviceId"

                                    value={form.deviceId}

                                    onChange={handleChange}

                                    className="w-full border rounded-lg px-3 py-2"

                                />

                            </div>

                            <div>

                                <label className="block mb-1 font-medium">

                                    Ký hiệu

                                </label>

                                <input

                                    name="code"

                                    value={form.code}

                                    onChange={handleChange}

                                    className="w-full border rounded-lg px-3 py-2"

                                />

                            </div>

                            <div>

                                <label className="block mb-1 font-medium">

                                    Khu vực

                                </label>

                                <input

                                    name="area"

                                    value={form.area}

                                    onChange={handleChange}

                                    className="w-full border rounded-lg px-3 py-2"

                                />

                            </div>

                        </div>

                    </div>

                    {/* ================= VỊ TRÍ ================= */}

                    <div className="mb-8">

                        <h3 className="font-semibold text-lg mb-4">

                            Vị trí lắp đặt

                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>

                                <label className="block mb-1 font-medium">

                                    Tuyến

                                </label>

                                <input

                                    name="line"

                                    value={form.line}

                                    onChange={handleChange}

                                    className="w-full border rounded-lg px-3 py-2"

                                />

                            </div>

                            <div>

                                <label className="block mb-1 font-medium">

                                    Nhà ga

                                </label>

                                <input

                                    name="station"

                                    value={form.station}

                                    onChange={handleChange}

                                    className="w-full border rounded-lg px-3 py-2"

                                />

                            </div>

                        </div>

                    </div>
                    
                    {/* ================= THỜI GIAN ================= */}

                    <div className="mb-8">

                        <h3 className="font-semibold text-lg mb-4">

                            Thời gian & Tuổi thọ

                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                            <div>

                                <label className="block mb-1 font-medium">

                                    Ngày lắp đặt

                                </label>

                                <input

                                    type="date"

                                    name="installDate"

                                    value={form.installDate}

                                    onChange={handleChange}

                                    className="w-full border rounded-lg px-3 py-2"

                                />

                            </div>

                            <div>

                                <label className="block mb-1 font-medium">

                                    Bảo trì gần nhất

                                </label>

                                <input

                                    type="date"

                                    name="lastMaintenance"

                                    value={form.lastMaintenance}

                                    onChange={handleChange}

                                    className="w-full border rounded-lg px-3 py-2"

                                />

                            </div>

                            <div>

                                <label className="block mb-1 font-medium">

                                    Tuổi thọ (năm)

                                </label>

                                <input

                                    type="number"

                                    min="0"

                                    name="lifespan"

                                    value={form.lifespan}

                                    onChange={handleChange}

                                    className="w-full border rounded-lg px-3 py-2"

                                />

                            </div>

                            <div>

                                <label className="block mb-1 font-medium">

                                    Ngày hết hạn

                                </label>

                                <input

                                    type="date"

                                    name="expiryDate"

                                    value={form.expiryDate}

                                    readOnly

                                    className="
                                        w-full
                                        border
                                        rounded-lg
                                        px-3
                                        py-2
                                        bg-slate-100
                                        text-slate-600
                                    "

                                />

                            </div>

                        </div>

                    </div>

                    {/* ================= FOOTER ================= */}

                    <div
                        className="
                            flex
                            justify-end
                            gap-3
                            pt-6
                            border-t
                        "
                    >

                        <button

                            type="button"

                            onClick={onClose}

                            className="
                                px-6
                                py-2.5
                                rounded-lg
                                border
                                border-slate-300
                                hover:bg-slate-100
                            "

                        >

                            Hủy

                        </button>

                        <button

                            type="submit"

                            disabled={loading}

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

                            {loading
                                ? "Đang lưu..."
                                : device
                                    ? "Cập nhật"
                                    : "Thêm thiết bị"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}