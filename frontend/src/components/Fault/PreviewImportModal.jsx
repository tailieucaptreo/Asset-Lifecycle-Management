import { useState } from "react";
import {
    X,
    ChevronRight,
    AlertTriangle,
    CheckCircle2,
    Upload
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
     * QUAN TRỌNG:
     * Không được return trước khi khai báo Hook.
     */

    const [filter, setFilter] = useState("ALL");

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

    /*
     * Không dùng useMemo nữa.
     * Dữ liệu import vài trăm / vài nghìn dòng
     * vẫn xử lý được bình thường.
     */
    const filteredRows =
        filter === "ALL"
            ? rows
            : rows.filter(
                (item) =>
                    getAction(item) === filter
            );

    /*
     * Chỉ return sau khi tất cả Hook đã được gọi.
     */
    if (!open) return null;

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

    const handleCardClick = (type) => {
        setFilter(type);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">

            <div
                className="
                    bg-white
                    rounded-3xl
                    shadow-2xl
                    w-full
                    max-w-[1400px]
                    max-h-[94vh]
                    flex
                    flex-col
                    overflow-hidden
                "
            >

                {/* HEADER */}

                <div
                    className="
                        px-7
                        py-5
                        border-b
                        flex
                        items-center
                        justify-between
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
                        "
                    >
                        <X size={25} />
                    </button>

                </div>

                {/* SUMMARY */}

                <div
                    className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        xl:grid-cols-4
                        gap-4
                        px-7
                        py-5
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

                {/* FILTER */}

                <div
                    className="
                        px-7
                        pb-4
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div className="text-sm text-slate-500">

                        Đang xem:{" "}

                        <span className="font-semibold text-slate-700">

                            {filter === "ALL"
                                ? "Tất cả thiết bị"
                                : filter === "NEW"
                                    ? "Thiết bị mới"
                                    : filter === "UPDATE"
                                        ? "Thiết bị cập nhật"
                                        : "Thiết bị bị bỏ qua"
                            }

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

                {/* TABLE */}

                <div className="px-7 flex-1 min-h-0">

                    <div
                        className="
                            border
                            rounded-2xl
                            overflow-auto
                            max-h-[48vh]
                        "
                    >

                        <table
                            className="
                                min-w-[1250px]
                                w-full
                                text-sm
                            "
                        >

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

                                    <th className="px-4 py-3 text-center w-14">
                                        #
                                    </th>

                                    <th className="px-4 py-3 text-left min-w-[300px]">
                                        Thiết bị
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Serial
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Trạm
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Trạng thái
                                    </th>

                                    <th className="px-4 py-3 text-left min-w-[220px]">
                                        Kết quả / Lý do
                                    </th>

                                    <th className="px-4 py-3 text-left min-w-[250px]">
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
                                                statusConfig[action] ||
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
                                                        index
                                                    }
                                                    className={`
                                                        border-b
                                                        last:border-b-0
                                                        ${
                                                            action === "UPDATE"
                                                                ? "bg-amber-50"
                                                                : action === "NEW"
                                                                    ? "bg-emerald-50/60"
                                                                    : "bg-white"
                                                        }
                                                        hover:bg-slate-50
                                                    `}
                                                >

                                                    <td className="px-4 py-4 text-center text-slate-500">
                                                        {item?.rowIndex ||
                                                            item?.excelRow ||
                                                            index + 1}
                                                    </td>

                                                    <td className="px-4 py-4">

                                                        <div
                                                            className="
                                                                font-medium
                                                                text-slate-800
                                                            "
                                                        >
                                                            {
                                                                row?.deviceName ||
                                                                row?.name ||
                                                                row?.title ||
                                                                "-"
                                                            }
                                                        </div>

                                                        {module === "VACON" && (
                                                            <div className="text-xs text-slate-400 mt-1">
                                                                {
                                                                    row?.application ||
                                                                    "-"
                                                                }
                                                            </div>
                                                        )}

                                                    </td>

                                                    <td className="px-4 py-4">

                                                        {
                                                            row?.serialNumber ||
                                                            row?.serial ||
                                                            "-"
                                                        }

                                                    </td>

                                                    <td className="px-4 py-4">

                                                        {
                                                            row?.station ||
                                                            row?.line ||
                                                            "-"
                                                        }

                                                    </td>

                                                    <td className="px-4 py-4">

                                                        <span
                                                            className={`
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                                px-3
                                                                py-1
                                                                rounded-full
                                                                text-xs
                                                                font-semibold
                                                                ${config.className}
                                                            `}
                                                        >

                                                            {action === "UPDATE" && (
                                                                <AlertTriangle size={13} />
                                                            )}

                                                            {action === "NEW" && (
                                                                <CheckCircle2 size={13} />
                                                            )}

                                                            {config.label}

                                                        </span>

                                                    </td>

                                                    <td className="px-4 py-4">

                                                        <div
                                                            className={
                                                                action === "UPDATE"
                                                                    ? "text-amber-700"
                                                                    : "text-slate-600"
                                                            }
                                                        >
                                                            {reason}
                                                        </div>

                                                    </td>

                                                    <td className="px-4 py-4">

                                                        {action === "UPDATE" ? (

                                                            <div className="flex flex-wrap gap-1.5">

                                                                {Array.isArray(
                                                                    changedFields
                                                                ) &&
                                                                changedFields.length > 0 ? (

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
                                                                                    px-2.5
                                                                                    py-1
                                                                                    rounded-full
                                                                                    bg-blue-100
                                                                                    text-blue-700
                                                                                    text-xs
                                                                                    font-medium
                                                                                "
                                                                            >
                                                                                {
                                                                                    typeof field === "string"
                                                                                        ? field
                                                                                        : field?.field ||
                                                                                          field?.name ||
                                                                                          "Thay đổi"
                                                                                }
                                                                            </span>

                                                                        )
                                                                    )

                                                                ) : (

                                                                    <span className="text-slate-400">
                                                                        Có dữ liệu thay đổi
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

                {/* FOOTER */}

                <div
                    className="
                        border-t
                        mt-5
                        px-7
                        py-4
                        flex
                        items-center
                        justify-between
                        gap-4
                    "
                >

                    <div className="text-sm text-slate-500">

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

                    <div className="flex gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                px-5
                                py-2.5
                                rounded-xl
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
                                px-6
                                py-2.5
                                rounded-xl
                                bg-blue-600
                                text-white
                                font-semibold
                                hover:bg-blue-700
                                disabled:bg-slate-300
                                disabled:cursor-not-allowed
                            "
                        >

                            <Upload size={18} />

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


/* ========================================================= */
/* SUMMARY CARD */
/* ========================================================= */

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

    const c = colors[color];

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                text-left
                rounded-2xl
                border
                p-5
                transition
                ${c.bg}
                ${c.border}
                ${
                    active
                        ? "ring-2 ring-blue-500 ring-offset-1"
                        : "hover:shadow-md"
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

                <div className="text-sm font-medium text-slate-500">
                    {title}
                </div>

                <ChevronRight
                    size={20}
                    className={c.text}
                />

            </div>

            <div
                className={`
                    text-4xl
                    font-bold
                    mt-2
                    ${c.text}
                `}
            >
                {value}
            </div>

        </button>
    );
}
