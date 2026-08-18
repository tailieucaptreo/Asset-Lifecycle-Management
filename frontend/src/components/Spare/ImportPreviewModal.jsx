import { useMemo, useState } from "react";
import {
    X,
    Upload,
    RefreshCw,
    ChevronRight
} from "lucide-react";

/* =====================================================
   ACTION LABEL
===================================================== */

const statusLabel = {
    NEW: "Tạo mới",
    UPDATE: "Cập nhật",
    SKIP: "Bỏ qua"
};

/* =====================================================
   ACTION COLOR
===================================================== */

const statusColor = {
    NEW:
        "bg-green-100 text-green-700",

    UPDATE:
        "bg-yellow-100 text-yellow-700",

    SKIP:
        "bg-slate-100 text-slate-600"
};

/* =====================================================
   CARD COLOR
===================================================== */

const cardColor = {

    total:
        "bg-blue-50 border-blue-200 text-blue-700",

    new:
        "bg-green-50 border-green-200 text-green-700",

    update:
        "bg-yellow-50 border-yellow-200 text-yellow-700",

    skip:
        "bg-slate-50 border-slate-200 text-slate-700"

};

/* =====================================================
   FIELD LABEL
===================================================== */

const fieldLabel = {

    name: "Tên thiết bị",

    deviceId: "Mã ID",

    symbol: "Ký hiệu",

    materialCode: "Mã vật tư",

    warehouse: "Kho",

    cabinet: "Tủ",

    shelf: "Kệ",

    slot: "Khay",

    initialQuantity: "Ban đầu",

    quantity: "Tồn",

    importQty: "Nhập",

    exportQty: "Xuất",

    unit: "Đơn vị",

    condition: "Tình trạng",

    buyDate: "Ngày mua",

    removedDate: "Ngày loại bỏ",

    note: "Ghi chú"

};

/* =====================================================
   SUMMARY CARD
===================================================== */

function Card({

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
                border
                rounded-xl
                p-5
                transition-all
                ${color}

                ${
                    active
                        ? "ring-2 ring-blue-400 shadow-md"
                        : "hover:shadow-md hover:-translate-y-[1px]"
                }
            `}

        >

            <div className="flex items-center justify-between">

                <div>

                    <div className="
                        text-sm
                        font-medium
                        opacity-80
                    ">
                        {title}
                    </div>

                    <div className="
                        text-4xl
                        font-bold
                        mt-2
                    ">
                        {value}
                    </div>

                </div>

                <ChevronRight
                    size={22}
                    className={`
                        opacity-50
                        transition-transform
                        ${
                            active
                                ? "rotate-90"
                                : ""
                        }
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

    const safeAction =
        action || "SKIP";

    return (

        <span
            className={`
                inline-flex
                items-center
                justify-center
                px-3
                py-1
                rounded-full
                text-xs
                font-semibold
                whitespace-nowrap
                ${
                    statusColor[safeAction]
                    ||
                    statusColor.SKIP
                }
            `}
        >

            {
                statusLabel[safeAction]
                ||
                safeAction
            }

        </span>

    );

}

/* =====================================================
   IMPORT PREVIEW MODAL
===================================================== */

export default function ImportPreviewModal({

    show,

    summary,

    rows = [],

    loading,

    onClose,

    onConfirm

}) {

    /*
     * all
     * NEW
     * UPDATE
     * SKIP
     */

    const [filter, setFilter] =
        useState("all");

    /* =================================================
       SUMMARY
    ================================================= */

    const total =
        summary?.total ??
        rows.length ??
        0;

    const newCount =
        summary?.newCount ??
        rows.filter(
            item =>
                item.action === "NEW"
        ).length;

    const updateCount =
        summary?.updateCount ??
        rows.filter(
            item =>
                item.action === "UPDATE"
        ).length;

    const skipCount =
        summary?.skipCount ??
        rows.filter(
            item =>
                item.action === "SKIP"
        ).length;

    /* =================================================
       FILTER ROWS
    ================================================= */

    const filteredRows = useMemo(() => {

        if (
            filter === "all"
        ) {

            return rows;

        }

        return rows.filter(
            item =>
                (
                    item.action ||
                    item.status
                ) === filter
        );

    }, [
        rows,
        filter
    ]);

    /* =================================================
       FILTER TITLE
    ================================================= */

    const filterTitle = useMemo(() => {

        if (
            filter === "NEW"
        ) {

            return (
                <>
                    Đang xem:{" "}
                    <strong>
                        Thiết bị tạo mới
                    </strong>{" "}
                    ({newCount} bản ghi)
                </>
            );

        }

        if (
            filter === "UPDATE"
        ) {

            return (
                <>
                    Đang xem:{" "}
                    <strong>
                        Thiết bị cập nhật
                    </strong>{" "}
                    ({updateCount} bản ghi)
                </>
            );

        }

        if (
            filter === "SKIP"
        ) {

            return (
                <>
                    Đang xem:{" "}
                    <strong>
                        Thiết bị bị bỏ qua
                    </strong>{" "}
                    ({skipCount} bản ghi)
                </>
            );

        }

        return (
            <>
                Đang xem:{" "}
                <strong>
                    Tất cả
                </strong>{" "}
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

    /* =================================================
       RESET
    ================================================= */

    const resetFilter = () => {

        setFilter("all");

    };

    /* =================================================
       CLOSE
    ================================================= */

    const handleClose = () => {

        if (loading)
            return;

        setFilter("all");

        onClose?.();

    };

    /* =================================================
       RENDER
    ================================================= */

    if (!show)
        return null;

    return (

        <div
            className="
                fixed
                inset-0
                bg-black/40
                z-50
                flex
                items-center
                justify-center
                p-3
            "
        >

            <div
                className="
                    bg-white
                    rounded-3xl
                    shadow-2xl
                    w-full
                    max-w-7xl
                    h-[92vh]
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
                        px-6
                        py-4
                        flex
                        justify-between
                        items-center
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
                            Preview Import Spare Device
                        </h2>

                        <p
                            className="
                                text-sm
                                text-slate-500
                                mt-1
                            "
                        >
                            Kiểm tra dữ liệu trước khi import
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="
                            w-10
                            h-10
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            hover:bg-slate-100
                            transition
                        "
                    >

                        <X size={24} />

                    </button>

                </div>

                {/* =================================================
                    CONTENT
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

                        <Card
                            title="Tổng"
                            value={total}
                            color={
                                cardColor.total
                            }
                            active={
                                filter === "all"
                            }
                            onClick={() =>
                                setFilter("all")
                            }
                        />

                        <Card
                            title="Tạo mới"
                            value={newCount}
                            color={
                                cardColor.new
                            }
                            active={
                                filter === "NEW"
                            }
                            onClick={() =>
                                setFilter("NEW")
                            }
                        />

                        <Card
                            title="Cập nhật"
                            value={updateCount}
                            color={
                                cardColor.update
                            }
                            active={
                                filter === "UPDATE"
                            }
                            onClick={() =>
                                setFilter("UPDATE")
                            }
                        />

                        <Card
                            title="Bỏ qua"
                            value={skipCount}
                            color={
                                cardColor.skip
                            }
                            active={
                                filter === "SKIP"
                            }
                            onClick={() =>
                                setFilter("SKIP")
                            }
                        />

                    </div>

                    {/* =================================================
                        FILTER INFORMATION
                    ================================================= */}

                    <div
                        className="
                            mt-5
                            flex
                            items-center
                            justify-between
                            shrink-0
                        "
                    >

                        <div
                            className="
                                text-sm
                                text-slate-500
                            "
                        >

                            {filterTitle}

                        </div>

                        {filter !== "all" && (

                            <button
                                type="button"
                                onClick={resetFilter}
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

                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <div
                        className="
                            flex-1
                            overflow-hidden
                            border
                            rounded-2xl
                            mt-4
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
                                                w-16
                                                px-4
                                                py-3
                                                text-center
                                            "
                                        >
                                            #
                                        </th>

                                        <th
                                            className="
                                                min-w-[280px]
                                                px-4
                                                py-3
                                                text-left
                                            "
                                        >
                                            Thiết bị
                                        </th>

                                        <th
                                            className="
                                                px-4
                                                py-3
                                                text-center
                                            "
                                        >
                                            Mã ID
                                        </th>

                                        <th
                                            className="
                                                px-4
                                                py-3
                                                text-center
                                            "
                                        >
                                            Kho
                                        </th>

                                        <th
                                            className="
                                                px-4
                                                py-3
                                                text-center
                                            "
                                        >
                                            Tủ
                                        </th>

                                        <th
                                            className="
                                                px-4
                                                py-3
                                                text-center
                                            "
                                        >
                                            Kệ
                                        </th>

                                        <th
                                            className="
                                                px-4
                                                py-3
                                                text-center
                                            "
                                        >
                                            Khay
                                        </th>

                                        <th
                                            className="
                                                px-4
                                                py-3
                                                text-center
                                            "
                                        >
                                            Ban đầu
                                        </th>

                                        <th
                                            className="
                                                px-4
                                                py-3
                                                text-center
                                            "
                                        >
                                            Tồn
                                        </th>

                                        <th
                                            className="
                                                w-32
                                                px-4
                                                py-3
                                                text-center
                                            "
                                        >
                                            Trạng thái
                                        </th>

                                        <th
                                            className="
                                                min-w-[280px]
                                                px-4
                                                py-3
                                                text-left
                                            "
                                        >
                                            Kết quả / Lý do
                                        </th>

                                        <th
                                            className="
                                                min-w-[240px]
                                                px-4
                                                py-3
                                                text-left
                                            "
                                        >
                                            Thay đổi
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredRows.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan={12}
                                                className="
                                                    py-16
                                                    text-center
                                                    text-slate-400
                                                "
                                            >
                                                Không có dữ liệu
                                            </td>

                                        </tr>

                                    ) : (

                                        filteredRows.map(
                                            (
                                                item,
                                                index
                                            ) => {

                                                /*
                                                 * Hỗ trợ cả:
                                                 *
                                                 * {
                                                 *   row: {...}
                                                 * }
                                                 *
                                                 * và:
                                                 *
                                                 * {...}
                                                 */

                                                const row =
                                                    item.row ||
                                                    item;

                                                const action =
                                                    item.action ||
                                                    item.status;

                                                const changedFields =
                                                    item.changedFields ||
                                                    [];

                                                return (

                                                    <tr
                                                        key={
                                                            item.existingId
                                                                ? `${action}-${item.existingId}-${index}`
                                                                : `${action}-${index}`
                                                        }
                                                        className="
                                                            border-t
                                                            hover:bg-slate-50
                                                        "
                                                    >

                                                        {/* # */}

                                                        <td
                                                            className="
                                                                px-4
                                                                py-4
                                                                text-center
                                                            "
                                                        >

                                                            {index + 1}

                                                        </td>

                                                        {/* DEVICE */}

                                                        <td
                                                            className="
                                                                px-4
                                                                py-4
                                                            "
                                                        >

                                                            <div
                                                                className="
                                                                    font-medium
                                                                    text-slate-800
                                                                    whitespace-pre-line
                                                                "
                                                            >

                                                                {
                                                                    row.name
                                                                    ||
                                                                    "-"
                                                                }

                                                            </div>

                                                        </td>

                                                        {/* DEVICE ID */}

                                                        <td
                                                            className="
                                                                px-4
                                                                py-4
                                                                text-center
                                                                whitespace-nowrap
                                                            "
                                                        >

                                                            {
                                                                row.deviceId
                                                                ||
                                                                "-"
                                                            }

                                                        </td>

                                                        {/* WAREHOUSE */}

                                                        <td
                                                            className="
                                                                px-4
                                                                py-4
                                                                text-center
                                                                whitespace-nowrap
                                                            "
                                                        >

                                                            {
                                                                row.warehouse
                                                                ||
                                                                "-"
                                                            }

                                                        </td>

                                                        {/* CABINET */}

                                                        <td
                                                            className="
                                                                px-4
                                                                py-4
                                                                text-center
                                                            "
                                                        >

                                                            {
                                                                row.cabinet
                                                                ||
                                                                "-"
                                                            }

                                                        </td>

                                                        {/* SHELF */}

                                                        <td
                                                            className="
                                                                px-4
                                                                py-4
                                                                text-center
                                                            "
                                                        >

                                                            {
                                                                row.shelf
                                                                ||
                                                                "-"
                                                            }

                                                        </td>

                                                        {/* SLOT */}

                                                        <td
                                                            className="
                                                                px-4
                                                                py-4
                                                                text-center
                                                            "
                                                        >

                                                            {
                                                                row.slot
                                                                ||
                                                                "-"
                                                            }

                                                        </td>

                                                        {/* INITIAL */}

                                                        <td
                                                            className="
                                                                px-4
                                                                py-4
                                                                text-center
                                                            "
                                                        >

                                                            {
                                                                row.initialQuantity
                                                                ??
                                                                0
                                                            }

                                                        </td>

                                                        {/* QUANTITY */}

                                                        <td
                                                            className="
                                                                px-4
                                                                py-4
                                                                text-center
                                                            "
                                                        >

                                                            {
                                                                row.quantity
                                                                ??
                                                                0
                                                            }

                                                        </td>

                                                        {/* STATUS */}

                                                        <td
                                                            className="
                                                                px-4
                                                                py-4
                                                                text-center
                                                            "
                                                        >

                                                            <StatusBadge
                                                                action={
                                                                    action
                                                                }
                                                            />

                                                        </td>

                                                        {/* REASON */}

                                                        <td
                                                            className="
                                                                px-4
                                                                py-4
                                                            "
                                                        >

                                                            {item.reason ? (

                                                                <div>

                                                                    <div
                                                                        className={`
                                                                            ${
                                                                                action === "SKIP"
                                                                                    ? "text-slate-600"
                                                                                    : action === "UPDATE"
                                                                                        ? "text-yellow-700"
                                                                                        : "text-green-700"
                                                                            }
                                                                        `}
                                                                    >

                                                                        {
                                                                            item.reason
                                                                        }

                                                                    </div>

                                                                    {item.matchedBy && (

                                                                        <div
                                                                            className="
                                                                                mt-1
                                                                                text-xs
                                                                                text-slate-400
                                                                            "
                                                                        >

                                                                            Match:
                                                                            {" "}
                                                                            {
                                                                                item.matchedBy
                                                                            }

                                                                        </div>

                                                                    )}

                                                                </div>

                                                            ) : (

                                                                action === "SKIP"

                                                                    ? (
                                                                        <span className="
                                                                            text-slate-500
                                                                        ">
                                                                            Thiết bị đã tồn tại và không có thay đổi
                                                                        </span>
                                                                    )

                                                                    : action === "UPDATE"

                                                                        ? (
                                                                            <span className="
                                                                                text-yellow-600
                                                                            ">
                                                                                Có dữ liệu thay đổi
                                                                            </span>
                                                                        )

                                                                        : (
                                                                            <span className="
                                                                                text-green-600
                                                                            ">
                                                                                Thiết bị chưa tồn tại
                                                                            </span>
                                                                        )

                                                            )}

                                                        </td>

                                                        {/* CHANGED FIELDS */}

                                                        <td
                                                            className="
                                                                px-4
                                                                py-4
                                                            "
                                                        >

                                                            {changedFields.length > 0 ? (

                                                                <div
                                                                    className="
                                                                        flex
                                                                        flex-wrap
                                                                        gap-1
                                                                    "
                                                                >

                                                                    {changedFields.map(
                                                                        field => (

                                                                            <span
                                                                                key={
                                                                                    field
                                                                                }
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
                                                                                    fieldLabel[field]
                                                                                    ||
                                                                                    field
                                                                                }

                                                                            </span>

                                                                        )
                                                                    )}

                                                                </div>

                                                            ) : (

                                                                <span className="
                                                                    text-slate-400
                                                                ">
                                                                    -
                                                                </span>

                                                            )}

                                                        </td>

                                                    </tr>

                                                );

                                            }
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    FOOTER
                ================================================= */}

                <div
                    className="
                        border-t
                        px-6
                        py-4
                        flex
                        items-center
                        justify-between
                        shrink-0
                    "
                >

                    <div
                        className="
                            text-sm
                            text-slate-500
                        "
                    >

                        Tổng cộng{" "}
                        <strong
                            className="
                                text-slate-700
                            "
                        >
                            {total}
                        </strong>{" "}
                        bản ghi.
                        {" "}

                        <span
                            className="
                                text-green-600
                                font-medium
                            "
                        >
                            Mới: {newCount}
                        </span>

                        {" "}

                        <span
                            className="
                                text-yellow-600
                                font-medium
                            "
                        >
                            Cập nhật: {updateCount}
                        </span>

                        {" "}

                        <span
                            className="
                                text-slate-500
                                font-medium
                            "
                        >
                            Bỏ qua: {skipCount}
                        </span>

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
                            onClick={handleClose}
                            disabled={loading}
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
                            onClick={onConfirm}
                            disabled={
                                loading ||
                                (
                                    newCount === 0 &&
                                    updateCount === 0
                                )
                            }
                            className="
                                px-6
                                py-2.5
                                rounded-xl
                                bg-blue-600
                                text-white
                                font-semibold
                                hover:bg-blue-700
                                disabled:bg-blue-300
                                disabled:cursor-not-allowed
                                flex
                                items-center
                                gap-2
                            "
                        >

                            {loading ? (

                                <>

                                    <RefreshCw
                                        size={18}
                                        className="
                                            animate-spin
                                        "
                                    />

                                    Đang import...

                                </>

                            ) : (

                                <>

                                    <Upload
                                        size={18}
                                    />

                                    Xác nhận Import

                                </>

                            )}

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}
