import React, { useMemo, useState } from "react";
import {
    X,
    ChevronRight,
    ChevronDown,
    AlertTriangle,
    CheckCircle2,
    Minus,
    Upload,
} from "lucide-react";

// ============================================================
// ACTION CONFIG
// ============================================================

const ACTION_CONFIG = {
    NEW: {
        label: "Tạo mới",
        shortLabel: "NEW",
        cardClass:
            "border-emerald-200 bg-emerald-50/70 hover:border-emerald-400",
        valueClass: "text-emerald-600",
        badgeClass:
            "bg-emerald-100 text-emerald-700 border border-emerald-200",
        dotClass: "bg-emerald-500",
    },

    UPDATE: {
        label: "Cập nhật",
        shortLabel: "UPDATE",
        cardClass:
            "border-amber-200 bg-amber-50/70 hover:border-amber-400",
        valueClass: "text-amber-600",
        badgeClass:
            "bg-amber-100 text-amber-700 border border-amber-200",
        dotClass: "bg-amber-500",
    },

    SKIP: {
        label: "Bỏ qua",
        shortLabel: "SKIP",
        cardClass:
            "border-slate-200 bg-slate-50 hover:border-slate-400",
        valueClass: "text-slate-600",
        badgeClass:
            "bg-slate-100 text-slate-600 border border-slate-200",
        dotClass: "bg-slate-400",
    },
};

// ============================================================
// HELPERS
// ============================================================

function safeValue(value, fallback = "-") {
    if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    ) {
        return fallback;
    }

    return value;
}

function normalizeAction(item) {
    const raw =
        item?.action ??
        item?.status ??
        item?.result ??
        item?.type ??
        "";

    const value = String(raw).trim().toUpperCase();

    if (
        value === "NEW" ||
        value === "CREATE" ||
        value === "CREATED" ||
        value === "INSERT"
    ) {
        return "NEW";
    }

    if (
        value === "UPDATE" ||
        value === "UPDATED" ||
        value === "CHANGE" ||
        value === "CHANGED"
    ) {
        return "UPDATE";
    }

    if (
        value === "SKIP" ||
        value === "SKIPPED" ||
        value === "IGNORE"
    ) {
        return "SKIP";
    }

    return "SKIP";
}

function getRow(item) {
    return item?.row || item?.data || item || {};
}

function getDeviceName(row) {
    return (
        row?.deviceName ??
        row?.name ??
        row?.device ??
        row?.title ??
        "-"
    );
}

function getSerial(row) {
    return (
        row?.serialNumber ??
        row?.serial ??
        row?.serialNo ??
        row?.serial_number ??
        "-"
    );
}

function getStation(row) {
    return (
        row?.station ??
        row?.line ??
        row?.tandem ??
        "-"
    );
}

function getReason(item, action) {
    if (item?.reason) {
        return item.reason;
    }

    if (item?.message) {
        return item.message;
    }

    if (item?.skipReason) {
        return item.skipReason;
    }

    if (item?.resultReason) {
        return item.resultReason;
    }

    if (action === "NEW") {
        return "Thiết bị mới";
    }

    if (action === "UPDATE") {
        return "Có dữ liệu thay đổi";
    }

    return "Thiết bị đã tồn tại và không có thay đổi";
}

function getChangedFields(item) {
    const fields =
        item?.changedFields ??
        item?.changes ??
        item?.changed ??
        [];

    if (Array.isArray(fields)) {
        return fields;
    }

    if (typeof fields === "string") {
        return fields
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean);
    }

    if (fields && typeof fields === "object") {
        return Object.keys(fields);
    }

    return [];
}

function normalizeFieldName(field) {
    if (!field) return "Thay đổi";

    if (typeof field === "object") {
        return (
            field.field ??
            field.name ??
            field.key ??
            "Thay đổi"
        );
    }

    const map = {
        deviceName: "Tên",
        name: "Tên",
        serialNumber: "Serial",
        serial: "Serial",
        station: "Trạm",
        line: "Tuyến",
        application: "Ứng dụng",
        powerUnitDate: "Power Unit Date",
        faultHistory: "Lịch sử lỗi",
        operationHours: "Operation Hours",
        description: "Mô tả",
        possibleCause: "Nguyên nhân",
        correctiveActions: "Khắc phục",
        note: "Ghi chú",
        status: "Trạng thái",
        firmware: "Firmware",
        tandem: "Tandem",
    };

    return map[field] || field;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function PreviewImportModal({
    show,
    summary,
    rows = [],
    loading = false,
    onClose,
    onConfirm,
    module = "VACON",
    title,
    subtitle,
}) {
    const [activeFilter, setActiveFilter] = useState("ALL");

    // --------------------------------------------------------
    // RESET FILTER WHEN MODAL OPENS / ROWS CHANGE
    // --------------------------------------------------------

    React.useEffect(() => {
        if (show) {
            setActiveFilter("ALL");
        }
    }, [show]);

    // --------------------------------------------------------
    // NORMALIZE ROWS
    // --------------------------------------------------------

    const normalizedRows = useMemo(() => {
        return (Array.isArray(rows) ? rows : []).map(
            (item, index) => {
                const row = getRow(item);
                const action = normalizeAction(item);

                return {
                    original: item,
                    row,
                    action,
                    index: index + 1,
                    reason: getReason(item, action),
                    changedFields: getChangedFields(item),
                };
            }
        );
    }, [rows]);

    // --------------------------------------------------------
    // COUNTS
    // --------------------------------------------------------

    const counts = useMemo(() => {
        const result = {
            ALL: normalizedRows.length,
            NEW: 0,
            UPDATE: 0,
            SKIP: 0,
        };

        normalizedRows.forEach((item) => {
            if (result[item.action] !== undefined) {
                result[item.action]++;
            }
        });

        // Ưu tiên summary từ backend nếu có
        return {
            total:
                summary?.total ??
                normalizedRows.length,

            NEW:
                summary?.newCount ??
                result.NEW,

            UPDATE:
                summary?.updateCount ??
                result.UPDATE,

            SKIP:
                summary?.skipCount ??
                result.SKIP,
        };
    }, [normalizedRows, summary]);

    // --------------------------------------------------------
    // FILTER
    // --------------------------------------------------------

    const visibleRows = useMemo(() => {
        if (activeFilter === "ALL") {
            return normalizedRows;
        }

        return normalizedRows.filter(
            (item) => item.action === activeFilter
        );
    }, [normalizedRows, activeFilter]);

    // --------------------------------------------------------
    // TITLE
    // --------------------------------------------------------

    const displayTitle =
        title ||
        `Preview Import ${module}`;

    const displaySubtitle =
        subtitle ||
        "Kiểm tra dữ liệu trước khi import";

    // --------------------------------------------------------
    // CLOSE
    // --------------------------------------------------------

    if (!show) {
        return null;
    }

    // --------------------------------------------------------
    // FILTER LABEL
    // --------------------------------------------------------

    const filterLabel =
        activeFilter === "ALL"
            ? "Tất cả thiết bị"
            : activeFilter === "NEW"
                ? "Thiết bị mới"
                : activeFilter === "UPDATE"
                    ? "Thiết bị cập nhật"
                    : "Thiết bị bị bỏ qua";

    // --------------------------------------------------------
    // CONFIRM ENABLE
    // --------------------------------------------------------

    const canImport =
        counts.NEW > 0 ||
        counts.UPDATE > 0;

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div
            className="
                fixed
                inset-0
                z-[9999]
                bg-black/50
                backdrop-blur-[1px]
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
                    max-w-[1280px]
                    max-h-[92vh]
                    flex
                    flex-col
                    overflow-hidden
                "
            >
                {/* =====================================================
                    HEADER
                ====================================================== */}

                <div
                    className="
                        shrink-0
                        border-b
                        border-slate-200
                        px-6
                        py-4
                        flex
                        items-start
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
                            {displayTitle}
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            {displaySubtitle}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            p-2
                            rounded-lg
                            text-slate-500
                            hover:text-slate-800
                            hover:bg-slate-100
                            disabled:opacity-50
                        "
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* =====================================================
                    SUMMARY CARDS
                ====================================================== */}

                <div
                    className="
                        shrink-0
                        grid
                        grid-cols-4
                        gap-4
                        px-6
                        py-5
                    "
                >
                    <SummaryCard
                        title="Tổng"
                        value={counts.total}
                        type="ALL"
                        active={activeFilter === "ALL"}
                        onClick={() =>
                            setActiveFilter("ALL")
                        }
                    />

                    <SummaryCard
                        title="Tạo mới"
                        value={counts.NEW}
                        type="NEW"
                        active={activeFilter === "NEW"}
                        onClick={() =>
                            setActiveFilter("NEW")
                        }
                    />

                    <SummaryCard
                        title="Cập nhật"
                        value={counts.UPDATE}
                        type="UPDATE"
                        active={activeFilter === "UPDATE"}
                        onClick={() =>
                            setActiveFilter("UPDATE")
                        }
                    />

                    <SummaryCard
                        title="Bỏ qua"
                        value={counts.SKIP}
                        type="SKIP"
                        active={activeFilter === "SKIP"}
                        onClick={() =>
                            setActiveFilter("SKIP")
                        }
                    />
                </div>

                {/* =====================================================
                    CURRENT FILTER
                ====================================================== */}

                <div
                    className="
                        shrink-0
                        px-6
                        pb-3
                        flex
                        items-center
                        justify-between
                    "
                >
                    <div className="text-sm text-slate-500">
                        Đang xem:{" "}
                        <span className="font-semibold text-slate-700">
                            {filterLabel}
                        </span>{" "}
                        <span className="text-slate-400">
                            ({visibleRows.length} bản ghi)
                        </span>
                    </div>

                    {activeFilter !== "ALL" && (
                        <button
                            type="button"
                            onClick={() =>
                                setActiveFilter("ALL")
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

                {/* =====================================================
                    TABLE
                ====================================================== */}

                <div
                    className="
                        flex-1
                        min-h-0
                        px-6
                        pb-4
                    "
                >
                    <div
                        className="
                            h-full
                            max-h-[48vh]
                            border
                            border-slate-200
                            rounded-xl
                            overflow-auto
                        "
                    >
                        <table
                            className="
                                w-full
                                text-sm
                                table-fixed
                            "
                        >
                            <thead
                                className="
                                    sticky
                                    top-0
                                    z-30
                                    bg-slate-100
                                    border-b
                                    border-slate-200
                                "
                            >
                                <tr>
                                    {/* # */}

                                    <th
                                        className="
                                            w-[50px]
                                            px-3
                                            py-3
                                            text-center
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        #
                                    </th>

                                    {/* DEVICE */}

                                    <th
                                        className="
                                            w-[24%]
                                            px-3
                                            py-3
                                            text-left
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        Thiết bị
                                    </th>

                                    {/* SERIAL */}

                                    <th
                                        className="
                                            w-[15%]
                                            px-3
                                            py-3
                                            text-left
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        Serial
                                    </th>

                                    {/* STATION */}

                                    <th
                                        className="
                                            w-[10%]
                                            px-3
                                            py-3
                                            text-center
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        Trạm
                                    </th>

                                    {/* STATUS */}

                                    <th
                                        className="
                                            w-[12%]
                                            px-3
                                            py-3
                                            text-center
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        Trạng thái
                                    </th>

                                    {/* REASON */}

                                    <th
                                        className="
                                            w-[22%]
                                            px-3
                                            py-3
                                            text-left
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        Kết quả / Lý do
                                    </th>

                                    {/* CHANGES */}

                                    <th
                                        className="
                                            w-[12%]
                                            px-3
                                            py-3
                                            text-left
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        Thay đổi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {visibleRows.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
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
                                    visibleRows.map(
                                        (item) => (
                                            <PreviewRow
                                                key={`${item.index}-${item.action}`}
                                                item={item}
                                                module={module}
                                            />
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* =====================================================
                    FOOTER
                ====================================================== */}

                <div
                    className="
                        shrink-0
                        border-t
                        border-slate-200
                        px-6
                        py-4
                        flex
                        items-center
                        justify-between
                        gap-4
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
                        <strong className="text-slate-700">
                            {counts.total}
                        </strong>{" "}
                        bản ghi.{" "}

                        <span className="text-emerald-600 font-medium">
                            Mới: {counts.NEW}
                        </span>{" "}

                        <span className="text-amber-600 font-medium ml-1">
                            Cập nhật: {counts.UPDATE}
                        </span>{" "}

                        <span className="text-slate-500 font-medium ml-1">
                            Bỏ qua: {counts.SKIP}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="
                                px-5
                                py-2.5
                                rounded-lg
                                border
                                border-slate-300
                                text-slate-700
                                bg-white
                                hover:bg-slate-50
                                disabled:opacity-50
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
                            onClick={onConfirm}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                px-6
                                py-2.5
                                rounded-lg
                                bg-blue-600
                                text-white
                                font-semibold
                                hover:bg-blue-700
                                disabled:bg-slate-300
                                disabled:text-slate-500
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

// ============================================================
// SUMMARY CARD
// ============================================================

function SummaryCard({
    title,
    value,
    type,
    active,
    onClick,
}) {
    const config =
        type === "ALL"
            ? {
                  card:
                      "border-blue-200 bg-blue-50/70 hover:border-blue-400",
                  value:
                      "text-blue-600",
              }
            : ACTION_CONFIG[type];

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                w-full
                text-left
                border
                rounded-xl
                px-5
                py-5
                transition
                duration-150
                ${config.cardClass || config.card}
                ${
                    active
                        ? "ring-2 ring-blue-500 ring-offset-1"
                        : ""
                }
            `}
        >
            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >
                <span
                    className="
                        text-sm
                        font-medium
                        text-slate-500
                    "
                >
                    {title}
                </span>

                {active ? (
                    <ChevronDown
                        size={20}
                        className="text-slate-500"
                    />
                ) : (
                    <ChevronRight
                        size={20}
                        className="text-slate-400"
                    />
                )}
            </div>

            <div
                className={`
                    mt-2
                    text-4xl
                    font-bold
                    ${
                        config.valueClass ||
                        config.value
                    }
                `}
            >
                {value}
            </div>
        </button>
    );
}

// ============================================================
// PREVIEW ROW
// ============================================================

function PreviewRow({
    item,
    module,
}) {
    const {
        row,
        action,
        index,
        reason,
        changedFields,
    } = item;

    const config =
        ACTION_CONFIG[action] ||
        ACTION_CONFIG.SKIP;

    const deviceName =
        getDeviceName(row);

    const serial =
        getSerial(row);

    const station =
        getStation(row);

    return (
        <tr
            className="
                border-b
                border-slate-200
                hover:bg-slate-50
                transition
            "
        >
            {/* =================================================
                INDEX
            ================================================== */}

            <td
                className="
                    px-3
                    py-4
                    text-center
                    align-top
                    text-slate-500
                "
            >
                {index}
            </td>

            {/* =================================================
                DEVICE
            ================================================== */}

            <td
                className="
                    px-3
                    py-4
                    align-top
                "
            >
                <div
                    className="
                        font-semibold
                        text-slate-800
                        break-words
                        leading-5
                    "
                    title={deviceName}
                >
                    {safeValue(deviceName)}
                </div>

                {/* VACON application */}

                {module?.toUpperCase() ===
                    "VACON" &&
                    row?.application && (
                        <div
                            className="
                                mt-1
                                text-xs
                                text-slate-400
                                truncate
                            "
                            title={
                                row.application
                            }
                        >
                            {row.application}
                        </div>
                    )}

                {/* ABB type */}

                {module?.toUpperCase() ===
                    "ABB" &&
                    row?.typeCode && (
                        <div
                            className="
                                mt-1
                                text-xs
                                text-slate-400
                            "
                        >
                            Type:{" "}
                            {row.typeCode}
                        </div>
                    )}
            </td>

            {/* =================================================
                SERIAL
            ================================================== */}

            <td
                className="
                    px-3
                    py-4
                    align-top
                    break-all
                    text-slate-700
                "
            >
                {safeValue(serial)}
            </td>

            {/* =================================================
                STATION
            ================================================== */}

            <td
                className="
                    px-3
                    py-4
                    align-top
                    text-center
                    text-slate-700
                "
            >
                {safeValue(station)}
            </td>

            {/* =================================================
                STATUS
            ================================================== */}

            <td
                className="
                    px-3
                    py-4
                    align-top
                    text-center
                "
            >
                <StatusBadge
                    action={action}
                />
            </td>

            {/* =================================================
                REASON
            ================================================== */}

            <td
                className="
                    px-3
                    py-4
                    align-top
                "
            >
                <div
                    className="
                        text-slate-600
                        leading-5
                    "
                    title={reason}
                >
                    {safeValue(reason)}
                </div>
            </td>

            {/* =================================================
                CHANGES
            ================================================== */}

            <td
                className="
                    px-3
                    py-4
                    align-top
                "
            >
                {action ===
                "UPDATE" ? (
                    changedFields.length >
                    0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {changedFields.map(
                                (
                                    field,
                                    fieldIndex
                                ) => (
                                    <span
                                        key={
                                            fieldIndex
                                        }
                                        className="
                                            inline-flex
                                            items-center
                                            px-2
                                            py-1
                                            rounded-full
                                            bg-blue-100
                                            text-blue-700
                                            text-xs
                                            font-medium
                                        "
                                    >
                                        {normalizeFieldName(
                                            field
                                        )}
                                    </span>
                                )
                            )}
                        </div>
                    ) : (
                        <span
                            className="
                                text-slate-500
                                text-xs
                            "
                        >
                            Có thay đổi
                        </span>
                    )
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

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({
    action,
}) {
    const config =
        ACTION_CONFIG[action] ||
        ACTION_CONFIG.SKIP;

    return (
        <span
            className={`
                inline-flex
                items-center
                justify-center
                gap-1.5
                px-3
                py-1
                rounded-full
                text-xs
                font-semibold
                whitespace-nowrap
                ${config.badgeClass}
            `}
        >
            {action === "NEW" && (
                <CheckCircle2
                    size={12}
                />
            )}

            {action === "UPDATE" && (
                <AlertTriangle
                    size={12}
                />
            )}

            {action === "SKIP" && (
                <Minus size={12} />
            )}

            {config.shortLabel}
        </span>
    );
}
