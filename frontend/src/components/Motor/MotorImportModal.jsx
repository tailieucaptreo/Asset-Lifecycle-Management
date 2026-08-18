import { useMemo, useState } from "react";
import axios from "axios";

import {
    X,
    Upload,
    RefreshCw,
    ChevronRight
} from "lucide-react";

import API from "../../config";

/* =====================================================
   LABEL
===================================================== */

const ACTION_LABEL = {
    NEW: "Thêm mới",
    UPDATE: "Cập nhật",
    SKIP: "Bỏ qua"
};

const FIELD_LABEL = {

    line: "Tuyến",
    station: "Nhà ga",
    deviceId: "Mã TB",
    name: "Tên động cơ",
    type: "Loại",
    location: "Vị trí",
    brand: "Hãng",
    model: "Model",
    serial: "Serial",
    power: "Công suất",
    bearingCode: "Mã ổ bi",
    quantity: "Số lượng",
    runningHours: "Số giờ vận hành",
    status: "Trạng thái",
    replacementDate: "Ngày thay thế",
    oldMotor: "Động cơ cũ",
    newMotor: "Động cơ mới",
    warehouse: "Vị trí lưu kho",
    maintenanceDate: "Ngày bảo trì",
    maintenanceContent: "Nội dung bảo trì",
    note: "Ghi chú"

};

/* =====================================================
   COLORS
===================================================== */

const badgeColor = {

    NEW:
        "bg-emerald-100 text-emerald-700",

    UPDATE:
        "bg-amber-100 text-amber-700",

    SKIP:
        "bg-slate-100 text-slate-600"

};

const cardColor = {

    total:
        "bg-blue-50 border-blue-200 text-blue-700",

    new:
        "bg-emerald-50 border-emerald-200 text-emerald-700",

    update:
        "bg-amber-50 border-amber-200 text-amber-700",

    skip:
        "bg-slate-50 border-slate-200 text-slate-700"

};

/* =====================================================
   SUMMARY CARD
===================================================== */

function SummaryCard({
    title,
    value,
    color,
    active,
    onClick
}) {

    return (

        <button
            type="button"
            onClick={onClick}
            className={`
                w-full
                text-left
                rounded-xl
                border
                p-4
                transition-all
                ${color}

                ${
                    active
                        ? "ring-2 ring-blue-400 shadow-md scale-[1.01]"
                        : "hover:shadow-md hover:-translate-y-[1px]"
                }
            `}
        >

            <div className="flex items-center justify-between">

                <div>

                    <div
                        className="
                            text-sm
                            font-medium
                            opacity-80
                        "
                    >
                        {title}
                    </div>

                    <div
                        className="
                            mt-2
                            text-4xl
                            font-bold
                        "
                    >
                        {value}
                    </div>

                </div>

                <ChevronRight
                    size={22}
                    className={`
                        opacity-50
                        transition-transform
                        ${active ? "rotate-90" : ""}
                    `}
                />

            </div>

        </button>

    );

}

/* =====================================================
   STATUS BADGE
===================================================== */

function StatusBadge({ action }) {

    return (

        <span
            className={`
                inline-flex
                items-center
                rounded-full
                px-2.5
                py-1
                text-xs
                font-semibold
                ${badgeColor[action] || badgeColor.SKIP}
            `}
        >
            {ACTION_LABEL[action] || action}
        </span>

    );

}

/* =====================================================
   FIELD LABEL
===================================================== */

function fieldLabel(field) {

    return FIELD_LABEL[field] || field;

}

/* =====================================================
   MAIN
===================================================== */

export default function MotorImportModal({

    open,

    file,

    preview = [],

    summary,

    token,

    onClose,

    onSuccess

}) {

    const [loading, setLoading] = useState(false);

    /*
     * all = tất cả
     * NEW
     * UPDATE
     * SKIP
     */
    const [filter, setFilter] = useState("all");

    const total =
        summary?.total ??
        preview.length;

    const newCount =
        summary?.new ?? 0;

    const updateCount =
        summary?.update ?? 0;

    const skipCount =
        summary?.skip ?? 0;

    const hasData =
        preview.length > 0;

    const canImport =
        newCount > 0 ||
        updateCount > 0;

    /* =====================================================
       FILTER
    ===================================================== */

    const filteredPreview = useMemo(() => {

        if (filter === "all")
            return preview;

        return preview.filter(
            item => item.action === filter
        );

    }, [
        preview,
        filter
    ]);

    /* =====================================================
       FILTER TITLE
    ===================================================== */

    const filterTitle = useMemo(() => {

        if (filter === "NEW") {

            return (
                <>
                    Đang xem:{" "}
                    <strong>Thiết bị thêm mới</strong>{" "}
                    ({newCount} bản ghi)
                </>
            );

        }

        if (filter === "UPDATE") {

            return (
                <>
                    Đang xem:{" "}
                    <strong>Thiết bị cập nhật</strong>{" "}
                    ({updateCount} bản ghi)
                </>
            );

        }

        if (filter === "SKIP") {

            return (
                <>
                    Đang xem:{" "}
                    <strong>Thiết bị bỏ qua</strong>{" "}
                    ({skipCount} bản ghi)
                </>
            );

        }

        return (
            <>
                Đang xem:{" "}
                <strong>Tất cả</strong>{" "}
                ({total} bản ghi)
            </>
        );

    }, [
        filter,
        total,
        newCount,
        updateCount,
        skipCount
    ]);

    /* =====================================================
       IMPORT
    ===================================================== */

    const handleImport = async () => {

        if (!file)
            return;

        try {

            setLoading(true);

            const form =
                new FormData();

            form.append(
                "file",
                file
            );

            await axios.post(

                `${API}/api/motors/import`,

                form,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );

            onSuccess?.();

        }

        catch (err) {

            console.error(
                "MOTOR IMPORT ERROR:",
                err
            );

            alert(

                err.response?.data?.message ||

                "Import thất bại."

            );

        }

        finally {

            setLoading(false);

        }

    };

    /* =====================================================
       CLOSE
    ===================================================== */

    const handleClose = () => {

        if (loading)
            return;

        setFilter("all");

        onClose?.();

    };

    /* =====================================================
       RENDER
    ===================================================== */

    if (!open)
        return null;

    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/40
                backdrop-blur-sm
                p-4
            "
        >

            <div
                className="
                    w-full
                    max-w-7xl
                    h-[92vh]
                    bg-white
                    rounded-3xl
                    shadow-2xl
                    flex
                    flex-col
                    overflow-hidden
                "
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        border-b
                        border-slate-200
                        px-6
                        py-5
                        flex
                        items-center
                        justify-between
                        shrink-0
                    "
                >

                    <div>

                        <h2
                            className="
                                text-2xl
                                font-bold
                                text-slate-800
                            "
                        >
                            Xem trước dữ liệu Import
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            Kiểm tra dữ liệu trước khi cập nhật vào hệ thống.
                        </p>

                        {file && (

                            <p
                                className="
                                    mt-2
                                    text-xs
                                    text-slate-400
                                "
                            >
                                File:
                                <span className="font-medium">
                                    {" "}
                                    {file.name}
                                </span>
                            </p>

                        )}

                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="
                            w-10
                            h-10
                            rounded-xl
                            hover:bg-slate-100
                            flex
                            items-center
                            justify-center
                            transition
                        "
                    >

                        <X size={22} />

                    </button>

                </div>

                {/* =================================================
                    BODY
                ================================================= */}

                <div
                    className="
                        flex-1
                        flex
                        flex-col
                        p-6
                        overflow-hidden
                    "
                >

                    {/* =================================================
                        SUMMARY CARDS
                    ================================================= */}

                    <div
                        className="
                            grid
                            grid-cols-2
                            lg:grid-cols-4
                            gap-4
                            shrink-0
                        "
                    >

                        <SummaryCard
                            title="Tổng bản ghi"
                            value={total}
                            color={cardColor.total}
                            active={filter === "all"}
                            onClick={() =>
                                setFilter("all")
                            }
                        />

                        <SummaryCard
                            title="Thêm mới"
                            value={newCount}
                            color={cardColor.new}
                            active={filter === "NEW"}
                            onClick={() =>
                                setFilter("NEW")
                            }
                        />

                        <SummaryCard
                            title="Cập nhật"
                            value={updateCount}
                            color={cardColor.update}
                            active={filter === "UPDATE"}
                            onClick={() =>
                                setFilter("UPDATE")
                            }
                        />

                        <SummaryCard
                            title="Bỏ qua"
                            value={skipCount}
                            color={cardColor.skip}
                            active={filter === "SKIP"}
                            onClick={() =>
                                setFilter("SKIP")
                            }
                        />

                    </div>

                    {/* =================================================
                        CURRENT FILTER
                    ================================================= */}

                    {hasData && (

                        <div
                            className="
                                mt-5
                                flex
                                items-center
                                justify-between
                                gap-3
                                shrink-0
                            "
                        >

                            <div>

                                <div
                                    className="
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    {filterTitle}
                                </div>

                            </div>

                            {filter !== "all" && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        setFilter("all")
                                    }
                                    className="
                                        text-sm
                                        text-blue-600
                                        hover:underline
                                    "
                                >
                                    Xem tất cả
                                </button>

                            )}

                        </div>

                    )}

                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <div
                        className="
                            mt-4
                            flex-1
                            border
                            rounded-2xl
                            overflow-hidden
                            min-h-0
                        "
                    >

                        <div
                            className="
                                h-full
                                overflow-auto
                            "
                        >

                            <table
                                className="
                                    min-w-[1500px]
                                    w-full
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

                                        <th
                                            className="
                                                px-3
                                                py-3
                                                text-left
                                                font-semibold
                                                w-14
                                            "
                                        >
                                            STT
                                        </th>

                                        <th
                                            className="
                                                px-3
                                                py-3
                                                text-left
                                                font-semibold
                                            "
                                        >
                                            Kết quả
                                        </th>

                                        <th
                                            className="
                                                px-3
                                                py-3
                                                text-left
                                                font-semibold
                                            "
                                        >
                                            Mã TB
                                        </th>

                                        <th
                                            className="
                                                px-3
                                                py-3
                                                text-left
                                                font-semibold
                                                min-w-[260px]
                                            "
                                        >
                                            Tên động cơ
                                        </th>

                                        <th
                                            className="
                                                px-3
                                                py-3
                                                text-left
                                                font-semibold
                                            "
                                        >
                                            Loại
                                        </th>

                                        <th
                                            className="
                                                px-3
                                                py-3
                                                text-left
                                                font-semibold
                                            "
                                        >
                                            Hãng
                                        </th>

                                        <th
                                            className="
                                                px-3
                                                py-3
                                                text-left
                                                font-semibold
                                            "
                                        >
                                            Model
                                        </th>

                                        <th
                                            className="
                                                px-3
                                                py-3
                                                text-left
                                                font-semibold
                                            "
                                        >
                                            Tuyến
                                        </th>

                                        <th
                                            className="
                                                px-3
                                                py-3
                                                text-left
                                                font-semibold
                                            "
                                        >
                                            Ga
                                        </th>

                                        <th
                                            className="
                                                px-3
                                                py-3
                                                text-left
                                                font-semibold
                                                min-w-[280px]
                                            "
                                        >
                                            Kết quả / Lý do
                                        </th>

                                        <th
                                            className="
                                                px-3
                                                py-3
                                                text-left
                                                font-semibold
                                                min-w-[280px]
                                            "
                                        >
                                            Thay đổi
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {!filteredPreview.length && (

                                        <tr>

                                            <td
                                                colSpan={11}
                                                className="
                                                    py-16
                                                    text-center
                                                    text-slate-500
                                                "
                                            >
                                                Không có bản ghi trong nhóm này.
                                            </td>

                                        </tr>

                                    )}

                                    {filteredPreview.map(
                                        (item, index) => {

                                            const row =
                                                item.row || {};

                                            const changed =
                                                item.changedFields || [];

                                            return (

                                                <tr
                                                    key={
                                                        item.existingId
                                                        ? `${item.action}-${item.existingId}-${index}`
                                                        : `${item.action}-${index}`
                                                    }
                                                    className="
                                                        border-t
                                                        hover:bg-slate-50
                                                        transition
                                                    "
                                                >

                                                    {/* STT */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                        "
                                                    >
                                                        {index + 1}
                                                    </td>

                                                    {/* ACTION */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                        "
                                                    >

                                                        <StatusBadge
                                                            action={
                                                                item.action
                                                            }
                                                        />

                                                    </td>

                                                    {/* DEVICE ID */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                            font-medium
                                                            whitespace-nowrap
                                                        "
                                                    >
                                                        {row.deviceId || "-"}
                                                    </td>

                                                    {/* NAME */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                        "
                                                    >
                                                        {row.name || "-"}
                                                    </td>

                                                    {/* TYPE */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                            whitespace-nowrap
                                                        "
                                                    >
                                                        {row.type || "-"}
                                                    </td>

                                                    {/* BRAND */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                            whitespace-nowrap
                                                        "
                                                    >
                                                        {row.brand || "-"}
                                                    </td>

                                                    {/* MODEL */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                            whitespace-nowrap
                                                        "
                                                    >
                                                        {row.model || "-"}
                                                    </td>

                                                    {/* LINE */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                            whitespace-nowrap
                                                        "
                                                    >
                                                        {row.line || "-"}
                                                    </td>

                                                    {/* STATION */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                            whitespace-nowrap
                                                        "
                                                    >
                                                        {row.station || "-"}
                                                    </td>

                                                    {/* REASON */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                        "
                                                    >

                                                        {item.reason ? (

                                                            <span
                                                                className={`
                                                                    ${
                                                                        item.action === "SKIP"
                                                                            ? "text-slate-600"
                                                                            : item.action === "UPDATE"
                                                                                ? "text-amber-700"
                                                                                : "text-emerald-700"
                                                                    }
                                                                `}
                                                            >
                                                                {item.reason}
                                                            </span>

                                                        ) : (

                                                            item.action === "SKIP"
                                                                ? (
                                                                    <span className="text-slate-500">
                                                                        Đã tồn tại, không có thay đổi
                                                                    </span>
                                                                )
                                                                : item.action === "UPDATE"
                                                                    ? (
                                                                        <span className="text-amber-600">
                                                                            Có dữ liệu thay đổi
                                                                        </span>
                                                                    )
                                                                    : (
                                                                        <span className="text-emerald-600">
                                                                            Không tìm thấy trong hệ thống
                                                                        </span>
                                                                    )

                                                        )}

                                                    </td>

                                                    {/* CHANGED FIELDS */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                        "
                                                    >

                                                        {changed.length > 0 ? (

                                                            <div
                                                                className="
                                                                    flex
                                                                    flex-wrap
                                                                    gap-1
                                                                "
                                                            >

                                                                {changed.map(
                                                                    field => (

                                                                        <span
                                                                            key={field}
                                                                            className="
                                                                                px-2
                                                                                py-1
                                                                                rounded-full
                                                                                text-xs
                                                                                bg-blue-100
                                                                                text-blue-700
                                                                            "
                                                                        >
                                                                            {
                                                                                fieldLabel(
                                                                                    field
                                                                                )
                                                                            }
                                                                        </span>

                                                                    )
                                                                )}

                                                            </div>

                                                        ) : (

                                                            <span
                                                                className="
                                                                    text-slate-400
                                                                "
                                                            >
                                                                -
                                                            </span>

                                                        )}

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div
                        className="
                            mt-4
                            border-t
                            pt-5
                            flex
                            items-center
                            justify-between
                            flex-wrap
                            gap-4
                            shrink-0
                        "
                    >

                        <div
                            className="
                                text-sm
                                text-slate-500
                            "
                        >

                            {canImport

                                ? (
                                    <>
                                        Có{" "}
                                        <strong>
                                            {newCount + updateCount}
                                        </strong>{" "}
                                        bản ghi sẽ được thêm hoặc cập nhật.
                                    </>
                                )

                                : (
                                    "Không có dữ liệu cần import."
                                )

                            }

                        </div>

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <button
                                type="button"
                                disabled={loading}
                                onClick={handleClose}
                                className="
                                    px-5
                                    py-2.5
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
                                type="button"
                                disabled={
                                    loading ||
                                    !canImport
                                }
                                onClick={handleImport}
                                className="
                                    px-6
                                    py-2.5
                                    rounded-xl
                                    bg-blue-600
                                    hover:bg-blue-700
                                    text-white
                                    font-semibold
                                    flex
                                    items-center
                                    gap-2
                                    transition
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >

                                {loading ? (

                                    <>

                                        <RefreshCw
                                            size={18}
                                            className="animate-spin"
                                        />

                                        Đang Import...

                                    </>

                                ) : (

                                    <>

                                        <Upload size={18} />

                                        Xác nhận Import

                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}
