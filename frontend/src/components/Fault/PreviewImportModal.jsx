import { useState } from "react";
import {
    X,
    ChevronRight,
    AlertTriangle,
    CheckCircle2,
    Upload,
} from "lucide-react";

const statusConfig = {
    NEW: {
        label: "Mới",
        className: "bg-emerald-100 text-emerald-700",
    },

    UPDATE: {
        label: "Cập nhật",
        className: "bg-amber-100 text-amber-700",
    },

    SKIP: {
        label: "Bỏ qua",
        className: "bg-slate-100 text-slate-600",
    },
};

export default function PreviewImportModal({
    open,
    module = "VACON",
    summary = {},
    rows = [],
    loading = false,
    onClose,
    onConfirm,
}) {
    /*
     * Hook phải được khai báo trước khi return
     */
    const [filter, setFilter] = useState("ALL");

    /* =========================================================
       HELPER
    ========================================================= */

    const getAction = (item) => {
        return String(
            item?.action ||
            item?.status ||
            item?.result ||
            "SKIP"
        ).toUpperCase();
    };

    const getRow = (item) => {
        return item?.row || item?.data || item;
    };

    /* =========================================================
       FILTER
    ========================================================= */

    const filteredRows =
        filter === "ALL"
            ? rows
            : rows.filter(
                  (item) => getAction(item) === filter
              );

    /* =========================================================
       CLOSE
    ========================================================= */

    if (!open) {
        return null;
    }

    /* =========================================================
       SUMMARY
    ========================================================= */

    const total =
        summary?.total ??
        summary?.totalCount ??
        rows.length;

    const newCount =
        summary?.newCount ??
        summary?.new ??
        0;

    const updateCount =
        summary?.updateCount ??
        summary?.update ??
        0;

    const skipCount =
        summary?.skipCount ??
        summary?.skip ??
        0;

    const moduleName =
        module === "ABB"
            ? "ABB"
            : "VACON";

    /* =========================================================
       FILTER CARD
    ========================================================= */

    const handleCardClick = (type) => {
        setFilter(type);
    };

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <div
            className="
                fixed
                inset-0
                z-[100]
                bg-black/50
                flex
                items-center
                justify-center
                p-3
            "
        >
            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    w-full
                    max-w-[1240px]
                    max-h-[92vh]
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
                        px-6
                        py-4
                        border-b
                        flex
                        items-center
                        justify-between
                        shrink-0
                    "
                >
                    <div>
                        <h2
                            className="
                                text-xl
                                font-bold
                                text-slate-800
                            "
                        >
                            Preview Import {moduleName}
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
                        onClick={onClose}
                        className="
                            p-2
                            rounded-lg
                            hover:bg-slate-100
                            transition
                        "
                    >
                        <X size={23} />
                    </button>
                </div>

                {/* =================================================
                    SUMMARY
                ================================================= */}

                <div
                    className="
                        grid
                        grid-cols-4
                        gap-3
                        px-6
                        py-4
                        shrink-0
                    "
                >
                    <SummaryCard
                        title="Tổng"
                        value={total}
                        color="blue"
                        active={filter === "ALL"}
                        onClick={() =>
                            handleCardClick("ALL")
                        }
                    />

                    <SummaryCard
                        title="Tạo mới"
                        value={newCount}
                        color="green"
                        active={filter === "NEW"}
                        onClick={() =>
                            handleCardClick("NEW")
                        }
                    />

                    <SummaryCard
                        title="Cập nhật"
                        value={updateCount}
                        color="amber"
                        active={filter === "UPDATE"}
                        onClick={() =>
                            handleCardClick("UPDATE")
                        }
                    />

                    <SummaryCard
                        title="Bỏ qua"
                        value={skipCount}
                        color="slate"
                        active={filter === "SKIP"}
                        onClick={() =>
                            handleCardClick("SKIP")
                        }
                    />
                </div>

                {/* =================================================
                    FILTER HEADER
                ================================================= */}

                <div
                    className="
                        px-6
                        pb-3
                        flex
                        items-center
                        justify-between
                        shrink-0
                    "
                >
                    <div className="text-sm text-slate-500">
                        Đang xem:{" "}

                        <span
                            className="
                                font-semibold
                                text-slate-700
                            "
                        >
                            {filter === "ALL"
                                ? "Tất cả thiết bị"
                                : filter === "NEW"
                                ? "Thiết bị mới"
                                : filter === "UPDATE"
                                ? "Thiết bị cập nhật"
                                : "Thiết bị bị bỏ qua"}
                        </span>

                        <span className="ml-2">
                            ({filteredRows.length} bản ghi)
                        </span>
                    </div>

                    {filter !== "ALL" && (
                        <button
                            type="button"
                            onClick={() =>
                                setFilter("ALL")
                            }
                            className="
                                text-sm
                                text-blue-600
                                hover:text-blue-800
                                font-medium
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
                        px-6
                        flex-1
                        min-h-0
                    "
                >
                    <div
                        className="
                            border
                            rounded-xl
                            overflow-auto
                            h-full
                            max-h-[48vh]
                        "
                    >
                        <table
                            className="
                                w-full
                                table-fixed
                                text-sm
                                border-collapse
                            "
                        >
                            <colgroup>
                                <col className="w-[48px]" />
                                <col className="w-[27%]" />
                                <col className="w-[14%]" />
                                <col className="w-[9%]" />
                                <col className="w-[11%]" />
                                <col className="w-[19%]" />
                                <col className="w-[20%]" />
                            </colgroup>

                            <thead
                                className="
                                    sticky
                                    top-0
                                    z-20
                                    bg-slate-100
                                    border-b
                                "
                            >
                                <tr>
                                    <th
                                        className="
                                            px-3
                                            py-3
                                            text-center
                                            font-semibold
                                        "
                                    >
                                        #
                                    </th>

                                    <th
                                        className="
                                            px-3
                                            py-3
                                            text-left
                                            font-semibold
                                        "
                                    >
                                        Thiết bị
                                    </th>

                                    <th
                                        className="
                                            px-3
                                            py-3
                                            text-left
                                            font-semibold
                                        "
                                    >
                                        Serial
                                    </th>

                                    <th
                                        className="
                                            px-3
                                            py-3
                                            text-left
                                            font-semibold
                                        "
                                    >
                                        Trạm
                                    </th>

                                    <th
                                        className="
                                            px-3
                                            py-3
                                            text-center
                                            font-semibold
                                        "
                                    >
                                        Trạng thái
                                    </th>

                                    <th
                                        className="
                                            px-3
                                            py-3
                                            text-left
                                            font-semibold
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
                                            colSpan={7}
                                            className="
                                                text-center
                                                py-12
                                                text-slate-400
                                            "
                                        >
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRows.map(
                                        (item, index) => {
                                            const row =
                                                getRow(item);

                                            const action =
                                                getAction(item);

                                            const config =
                                                statusConfig[
                                                    action
                                                ] ||
                                                statusConfig.SKIP;

                                            const changedFields =
                                                item?.changedFields ||
                                                item?.changes ||
                                                [];

                                            const reason =
                                                item?.reason ||
                                                item?.skipReason ||
                                                item?.message ||
                                                item?.reasonText ||
                                                (
                                                    action === "SKIP"
                                                        ? "Thiết bị đã tồn tại và không có thay đổi"
                                                        : action === "UPDATE"
                                                        ? "Có dữ liệu thay đổi"
                                                        : "Thiết bị mới"
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        item?.id ||
                                                        item?.rowIndex ||
                                                        item?.excelRow ||
                                                        index
                                                    }
                                                    className={`
                                                        border-b
                                                        last:border-b-0
                                                        ${
                                                            action ===
                                                            "UPDATE"
                                                                ? "bg-amber-50"
                                                                : action ===
                                                                  "NEW"
                                                                ? "bg-emerald-50/60"
                                                                : "bg-white"
                                                        }
                                                        hover:bg-slate-50
                                                    `}
                                                >
                                                    {/* # */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                            text-center
                                                            text-slate-500
                                                            align-top
                                                        "
                                                    >
                                                        {item?.rowIndex ||
                                                            item?.excelRow ||
                                                            index + 1}
                                                    </td>

                                                    {/* DEVICE */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                            align-top
                                                        "
                                                    >
                                                        <div
                                                            className="
                                                                font-medium
                                                                text-slate-800
                                                                break-words
                                                                leading-5
                                                            "
                                                        >
                                                            {row?.deviceName ||
                                                                row?.name ||
                                                                row?.title ||
                                                                "-"}
                                                        </div>

                                                        {module ===
                                                            "VACON" && (
                                                            <div
                                                                className="
                                                                    text-xs
                                                                    text-slate-400
                                                                    mt-1
                                                                    break-words
                                                                "
                                                            >
                                                                {row?.application ||
                                                                    "-"}
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* SERIAL */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                            align-top
                                                            break-all
                                                        "
                                                    >
                                                        {row?.serialNumber ||
                                                            row?.serial ||
                                                            "-"}
                                                    </td>

                                                    {/* STATION */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                            align-top
                                                            break-words
                                                        "
                                                    >
                                                        {row?.station ||
                                                            row?.line ||
                                                            "-"}
                                                    </td>

                                                    {/* STATUS */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                            text-center
                                                            align-top
                                                        "
                                                    >
                                                        <span
                                                            className={`
                                                                inline-flex
                                                                items-center
                                                                justify-center
                                                                gap-1
                                                                px-2.5
                                                                py-1
                                                                rounded-full
                                                                text-xs
                                                                font-semibold
                                                                whitespace-nowrap
                                                                ${config.className}
                                                            `}
                                                        >
                                                            {action ===
                                                                "UPDATE" && (
                                                                <AlertTriangle
                                                                    size={
                                                                        13
                                                                    }
                                                                />
                                                            )}

                                                            {action ===
                                                                "NEW" && (
                                                                <CheckCircle2
                                                                    size={
                                                                        13
                                                                    }
                                                                />
                                                            )}

                                                            {config.label}
                                                        </span>
                                                    </td>

                                                    {/* REASON */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                            align-top
                                                        "
                                                    >
                                                        <div
                                                            className={`
                                                                break-words
                                                                leading-5
                                                                ${
                                                                    action ===
                                                                    "UPDATE"
                                                                        ? "text-amber-700"
                                                                        : "text-slate-600"
                                                                }
                                                            `}
                                                        >
                                                            {reason}
                                                        </div>
                                                    </td>

                                                    {/* CHANGES */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                            align-top
                                                        "
                                                    >
                                                        {action ===
                                                        "UPDATE" ? (
                                                            <div
                                                                className="
                                                                    flex
                                                                    flex-wrap
                                                                    gap-1
                                                                "
                                                            >
                                                                {Array.isArray(
                                                                    changedFields
                                                                ) &&
                                                                changedFields.length >
                                                                    0 ? (
                                                                    changedFields.map(
                                                                        (
                                                                            field,
                                                                            fieldIndex
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    fieldIndex
                                                                                }
                                                                                className="
                                                                                    px-2
                                                                                    py-1
                                                                                    rounded-full
                                                                                    bg-blue-100
                                                                                    text-blue-700
                                                                                    text-xs
                                                                                    font-medium
                                                                                    break-words
                                                                                "
                                                                            >
                                                                                {typeof field ===
                                                                                "string"
                                                                                    ? field
                                                                                    : field?.field ||
                                                                                      field?.name ||
                                                                                      "Thay đổi"}
                                                                            </span>
                                                                        )
                                                                    )
                                                                ) : (
                                                                    <span className="text-slate-400">
                                                                        Có dữ
                                                                        liệu
                                                                        thay
                                                                        đổi
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400">
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

                {/* =================================================
                    FOOTER
                ================================================= */}

                <div
                    className="
                        border-t
                        mt-4
                        px-6
                        py-3
                        flex
                        items-center
                        justify-between
                        gap-4
                        shrink-0
                    "
                >
                    <div
                        className="
                            text-sm
                            text-slate-500
                            whitespace-nowrap
                        "
                    >
                        Tổng cộng{" "}

                        <b className="text-slate-700">
                            {total}
                        </b>{" "}
                        bản ghi.

                        <span className="ml-2 text-emerald-600">
                            Mới: {newCount}
                        </span>

                        <span className="ml-2 text-amber-600">
                            Cập nhật: {updateCount}
                        </span>

                        <span className="ml-2 text-slate-500">
                            Bỏ qua: {skipCount}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                px-5
                                py-2
                                rounded-lg
                                border
                                border-slate-300
                                hover:bg-slate-50
                            "
                        >
                            Hủy
                        </button>

                        <button
                            type="button"
                            disabled={
                                loading ||
                                (
                                    newCount === 0 &&
                                    updateCount === 0
                                )
                            }
                            onClick={onConfirm}
                            className="
                                flex
                                items-center
                                gap-2
                                px-5
                                py-2
                                rounded-lg
                                bg-blue-600
                                text-white
                                font-semibold
                                hover:bg-blue-700
                                disabled:bg-slate-300
                                disabled:cursor-not-allowed
                            "
                        >
                            <Upload size={17} />

                            {loading
                                ? "Đang import..."
                                : "Xác nhận Import"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
    title,
    value,
    color,
    active,
    onClick,
}) {
    const colors = {
        blue: {
            bg: "bg-blue-50",
            border: "border-blue-200",
            text: "text-blue-600",
        },

        green: {
            bg: "bg-emerald-50",
            border: "border-emerald-200",
            text: "text-emerald-600",
        },

        amber: {
            bg: "bg-amber-50",
            border: "border-amber-200",
            text: "text-amber-600",
        },

        slate: {
            bg: "bg-slate-50",
            border: "border-slate-200",
            text: "text-slate-600",
        },
    };

    const c =
        colors[color] ||
        colors.slate;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                text-left
                rounded-xl
                border
                px-4
                py-3
                transition
                ${c.bg}
                ${c.border}
                ${
                    active
                        ? "ring-2 ring-blue-500 ring-offset-1"
                        : "hover:shadow-sm"
                }
            `}
        >
            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >
                <div
                    className="
                        text-sm
                        font-medium
                        text-slate-500
                    "
                >
                    {title}
                </div>

                <ChevronRight
                    size={18}
                    className={c.text}
                />
            </div>

            <div
                className={`
                    text-3xl
                    font-bold
                    mt-1
                    ${c.text}
                `}
            >
                {value}
            </div>
        </button>
    );
}
