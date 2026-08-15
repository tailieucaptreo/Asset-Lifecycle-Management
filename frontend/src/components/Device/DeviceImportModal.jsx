import { useEffect, useMemo, useState } from "react";
import { X, CheckCircle2, AlertTriangle, Plus } from "lucide-react";

// =====================================================
// STATUS CONFIG
// =====================================================

const statusColor = {
    NEW: "bg-green-100 text-green-700",
    UPDATE: "bg-yellow-100 text-yellow-700",
    ERROR: "bg-red-100 text-red-700",
    SKIP: "bg-slate-100 text-slate-700",
};

const statusLabel = {
    NEW: "Mới",
    UPDATE: "Cập nhật",
    ERROR: "Lỗi",
    SKIP: "Bỏ qua",
};

// =====================================================
// BADGE
// =====================================================

function Badge({ status }) {
    const normalizedStatus = String(
        status || "SKIP"
    ).toUpperCase();

    return (
        <span
            className={`
                inline-flex
                items-center
                justify-center
                px-2.5
                py-1
                rounded-full
                text-xs
                font-semibold
                whitespace-nowrap
                ${statusColor[normalizedStatus] || statusColor.SKIP}
            `}
        >
            {statusLabel[normalizedStatus] || normalizedStatus}
        </span>
    );
}

// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
    title,
    value,
    color,
    icon,
    active,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                w-full
                bg-white
                rounded-xl
                border
                shadow-sm
                p-4
                flex
                items-center
                justify-between
                text-left
                transition-all
                cursor-pointer
                hover:-translate-y-0.5
                hover:shadow-md
                focus:outline-none
                ${
                    active
                        ? "ring-2 ring-blue-300 border-blue-400"
                        : "border-slate-200"
                }
            `}
        >
            <div>
                <p className="text-sm text-slate-500">
                    {title}
                </p>

                <h2
                    className={`
                        mt-1
                        text-3xl
                        font-bold
                        ${color}
                    `}
                >
                    {value}
                </h2>
            </div>

            <div
                className={`
                    w-12
                    h-12
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    ${color.replace("text", "bg")}
                    bg-opacity-10
                `}
            >
                {icon}
            </div>
        </button>
    );
}

// =====================================================
// HELPERS
// =====================================================

function getAction(row) {
    return String(
        row?.action || "SKIP"
    ).toUpperCase();
}

function getRowData(row) {
    /*
     * Backend hiện tại của bạn có thể trả 2 dạng:
     *
     * 1.
     * {
     *   action: "UPDATE",
     *   row: {...}
     * }
     *
     * 2.
     * {
     *   action: "UPDATE",
     *   name: "...",
     *   line: "...",
     *   ...
     * }
     *
     * Hỗ trợ cả hai.
     */
    return row?.row || row || {};
}

function getChangedFields(row) {
    if (Array.isArray(row?.changedFields)) {
        return row.changedFields;
    }

    if (Array.isArray(row?.changed)) {
        return row.changed;
    }

    return [];
}

function getSkipReason(row) {
    return (
        row?.reason ||
        row?.skipReason ||
        row?.message ||
        row?.error ||
        row?.skipReasonText ||
        "Thiết bị bị bỏ qua"
    );
}

function getMatchedBy(row) {
    return (
        row?.matchedBy ||
        row?.matchBy ||
        row?.matched_by ||
        ""
    );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function DeviceImportModal({
    open,
    summary,
    rows,
    loading,
    onClose,
    onConfirm,
}) {
    // =================================================
    // FILTER
    // =================================================

    const [activeFilter, setActiveFilter] =
        useState("ALL");

    // Khi mở modal mới -> luôn xem tất cả
    useEffect(() => {
        if (open) {
            setActiveFilter("ALL");
        }
    }, [open]);

    // =================================================
    // DATA
    // =================================================

    const allRows = Array.isArray(rows)
        ? rows
        : [];

    const filteredRows = useMemo(() => {
        if (activeFilter === "ALL") {
            return allRows;
        }

        return allRows.filter(
            (row) =>
                getAction(row) === activeFilter
        );
    }, [
        allRows,
        activeFilter,
    ]);

    // =================================================
    // COUNTS
    // =================================================

    const totalCount =
        summary?.total ??
        allRows.length;

    const newCount =
        summary?.newCount ??
        allRows.filter(
            (row) => getAction(row) === "NEW"
        ).length;

    const updateCount =
        summary?.updateCount ??
        allRows.filter(
            (row) => getAction(row) === "UPDATE"
        ).length;

    const skipCount =
        summary?.skipCount ??
        allRows.filter(
            (row) => getAction(row) === "SKIP"
        ).length;

    const errorCount =
        summary?.errorCount ??
        allRows.filter(
            (row) => getAction(row) === "ERROR"
        ).length;

    // =================================================
    // FILTER LABEL
    // =================================================

    const filterLabel = {
        ALL: "Tất cả bản ghi",
        NEW: "Thiết bị mới",
        UPDATE: "Thiết bị cần cập nhật",
        SKIP: "Thiết bị bị bỏ qua",
        ERROR: "Thiết bị lỗi",
    };

    // =================================================
    // CLOSE
    // =================================================

    if (!open) {
        return null;
    }

    // =================================================
    // TABLE COLUMN COUNT
    // =================================================

    const tableColumnCount =
        activeFilter === "UPDATE" ||
        activeFilter === "SKIP"
            ? 12
            : 12;

    // =================================================
    // RENDER
    // =================================================

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                bg-black/40
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
                    max-w-7xl
                    max-h-[92vh]
                    overflow-hidden
                    flex
                    flex-col
                "
            >
                {/* =====================================
                    HEADER
                ====================================== */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        px-6
                        py-4
                        border-b
                        bg-slate-50
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
                            Xem trước dữ liệu Import Thiết bị
                        </h2>

                        <p
                            className="
                                text-sm
                                text-slate-500
                                mt-1
                            "
                        >
                            Kiểm tra dữ liệu trước khi cập nhật
                            vào hệ thống.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            p-2
                            rounded-lg
                            hover:bg-slate-200
                            transition
                            disabled:opacity-50
                        "
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* =====================================
                    SUMMARY CARDS
                ====================================== */}

                <div
                    className="
                        p-6
                        bg-slate-50
                        border-b
                        shrink-0
                    "
                >
                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            xl:grid-cols-4
                            gap-5
                        "
                    >
                        {/* TOTAL */}

                        <SummaryCard
                            title="Tổng bản ghi"
                            value={totalCount}
                            color="text-blue-600"
                            active={
                                activeFilter === "ALL"
                            }
                            onClick={() =>
                                setActiveFilter("ALL")
                            }
                            icon={
                                <CheckCircle2
                                    size={24}
                                    className="text-blue-600"
                                />
                            }
                        />

                        {/* NEW */}

                        <SummaryCard
                            title="Thiết bị mới"
                            value={newCount}
                            color="text-green-600"
                            active={
                                activeFilter === "NEW"
                            }
                            onClick={() =>
                                setActiveFilter("NEW")
                            }
                            icon={
                                <Plus
                                    size={24}
                                    className="text-green-600"
                                />
                            }
                        />

                        {/* UPDATE */}

                        <SummaryCard
                            title="Cập nhật"
                            value={updateCount}
                            color="text-amber-600"
                            active={
                                activeFilter === "UPDATE"
                            }
                            onClick={() =>
                                setActiveFilter("UPDATE")
                            }
                            icon={
                                <AlertTriangle
                                    size={24}
                                    className="text-amber-600"
                                />
                            }
                        />

                        {/* SKIP */}

                        <SummaryCard
                            title="Bỏ qua"
                            value={skipCount}
                            color="text-slate-600"
                            active={
                                activeFilter === "SKIP"
                            }
                            onClick={() =>
                                setActiveFilter("SKIP")
                            }
                            icon={
                                <X
                                    size={24}
                                    className="text-slate-600"
                                />
                            }
                        />
                    </div>
                </div>

                {/* =====================================
                    FILTER BAR
                ====================================== */}

                <div
                    className="
                        px-6
                        py-3
                        border-b
                        bg-white
                        flex
                        items-center
                        justify-between
                        gap-3
                        shrink-0
                    "
                >
                    <div
                        className="
                            text-sm
                            text-slate-600
                        "
                    >
                        Đang xem:

                        <span
                            className="
                                ml-1
                                font-semibold
                                text-slate-800
                            "
                        >
                            {filterLabel[activeFilter]}
                        </span>

                        <span
                            className="
                                ml-2
                                text-slate-400
                            "
                        >
                            ({filteredRows.length} bản ghi)
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
                                hover:text-blue-700
                                hover:underline
                            "
                        >
                            Xem tất cả
                        </button>
                    )}
                </div>

                {/* =====================================
                    TABLE
                ====================================== */}

                <div
                    className="
                        flex-1
                        overflow-auto
                        p-6
                    "
                >
                    <div
                        className="
                            overflow-auto
                            border
                            rounded-xl
                        "
                    >
                        <table
                            className="
                                min-w-full
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
                                <tr className="text-left">
                                    <th
                                        className="
                                            px-3
                                            py-3
                                            border-b
                                            w-16
                                        "
                                    >
                                        STT
                                    </th>

                                    <th
                                        className="
                                            px-3
                                            py-3
                                            border-b
                                            w-32
                                        "
                                    >
                                        Kết quả
                                    </th>

                                    <th
                                        className="
                                            px-3
                                            py-3
                                            border-b
                                            min-w-[220px]
                                        "
                                    >
                                        Tên thiết bị
                                    </th>

                                    <th
                                        className="
                                            px-3
                                            py-3
                                            border-b
                                            min-w-[140px]
                                        "
                                    >
                                        Tuyến
                                    </th>

                                    <th
                                        className="
                                            px-3
                                            py-3
                                            border-b
                                            min-w-[160px]
                                        "
                                    >
                                        Nhà ga
                                    </th>

                                    <th
                                        className="
                                            px-3
                                            py-3
                                            border-b
                                            min-w-[160px]
                                        "
                                    >
                                        Phân loại
                                    </th>

                                    <th
                                        className="
                                            px-3
                                            py-3
                                            border-b
                                            min-w-[150px]
                                        "
                                    >
                                        Device ID
                                    </th>

                                    <th
                                        className="
                                            px-3
                                            py-3
                                            border-b
                                            min-w-[120px]
                                        "
                                    >
                                        Ký hiệu
                                    </th>

                                    <th
                                        className="
                                            px-3
                                            py-3
                                            border-b
                                            min-w-[150px]
                                        "
                                    >
                                        Khu vực
                                    </th>

                                    <th
                                        className="
                                            px-3
                                            py-3
                                            border-b
                                            min-w-[150px]
                                        "
                                    >
                                        Trạng thái
                                    </th>

                                    <th
                                        className="
                                            px-3
                                            py-3
                                            border-b
                                            min-w-[120px]
                                        "
                                    >
                                        Tuổi thọ
                                    </th>

                                    {/* UPDATE */}

                                    {activeFilter === "UPDATE" && (
                                        <th
                                            className="
                                                px-3
                                                py-3
                                                border-b
                                                min-w-[280px]
                                            "
                                        >
                                            Trường thay đổi
                                        </th>
                                    )}

                                    {/* SKIP */}

                                    {activeFilter === "SKIP" && (
                                        <th
                                            className="
                                                px-3
                                                py-3
                                                border-b
                                                min-w-[320px]
                                            "
                                        >
                                            Lý do bỏ qua
                                        </th>
                                    )}

                                    {/* ALL / NEW / ERROR */}

                                    {activeFilter !== "UPDATE" &&
                                        activeFilter !== "SKIP" && (
                                            <th
                                                className="
                                                    px-3
                                                    py-3
                                                    border-b
                                                    min-w-[260px]
                                                "
                                            >
                                                Ghi chú
                                            </th>
                                        )}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredRows.map(
                                    (row, index) => {
                                        const data =
                                            getRowData(row);

                                        const action =
                                            getAction(row);

                                        const changedFields =
                                            getChangedFields(row);

                                        const skipReason =
                                            getSkipReason(row);

                                        const matchedBy =
                                            getMatchedBy(row);

                                        const bg =
                                            action === "NEW"
                                                ? "bg-green-50"
                                                : action ===
                                                  "UPDATE"
                                                    ? "bg-yellow-50"
                                                    : action ===
                                                      "ERROR"
                                                        ? "bg-red-50"
                                                        : "bg-slate-50";

                                        return (
                                            <tr
                                                key={
                                                    row?.deviceKey ||
                                                    data?.deviceKey ||
                                                    row?.id ||
                                                    `${action}-${index}`
                                                }
                                                className={`
                                                    ${bg}
                                                    hover:bg-blue-50
                                                    transition-colors
                                                `}
                                            >
                                                {/* STT */}

                                                <td
                                                    className="
                                                        px-3
                                                        py-3
                                                        border-b
                                                    "
                                                >
                                                    {index + 1}
                                                </td>

                                                {/* RESULT */}

                                                <td
                                                    className="
                                                        px-3
                                                        py-3
                                                        border-b
                                                    "
                                                >
                                                    <Badge
                                                        status={
                                                            action
                                                        }
                                                    />
                                                </td>

                                                {/* NAME */}

                                                <td
                                                    className="
                                                        px-3
                                                        py-3
                                                        border-b
                                                        font-medium
                                                    "
                                                >
                                                    {data.name ||
                                                        "-"}
                                                </td>

                                                {/* LINE */}

                                                <td
                                                    className="
                                                        px-3
                                                        py-3
                                                        border-b
                                                    "
                                                >
                                                    {data.line ||
                                                        "-"}
                                                </td>

                                                {/* STATION */}

                                                <td
                                                    className="
                                                        px-3
                                                        py-3
                                                        border-b
                                                    "
                                                >
                                                    {data.station ||
                                                        "-"}
                                                </td>

                                                {/* CATEGORY */}

                                                <td
                                                    className="
                                                        px-3
                                                        py-3
                                                        border-b
                                                    "
                                                >
                                                    {data.category ||
                                                        data.classification ||
                                                        "-"}
                                                </td>

                                                {/* DEVICE ID */}

                                                <td
                                                    className="
                                                        px-3
                                                        py-3
                                                        border-b
                                                    "
                                                >
                                                    {data.deviceId ||
                                                        "-"}
                                                </td>

                                                {/* CODE */}

                                                <td
                                                    className="
                                                        px-3
                                                        py-3
                                                        border-b
                                                    "
                                                >
                                                    {data.code ||
                                                        "-"}
                                                </td>

                                                {/* AREA */}

                                                <td
                                                    className="
                                                        px-3
                                                        py-3
                                                        border-b
                                                    "
                                                >
                                                    {data.area ||
                                                        "-"}
                                                </td>

                                                {/* STATUS */}

                                                <td
                                                    className="
                                                        px-3
                                                        py-3
                                                        border-b
                                                    "
                                                >
                                                    {data.status ||
                                                        "-"}
                                                </td>

                                                {/* LIFESPAN */}

                                                <td
                                                    className="
                                                        px-3
                                                        py-3
                                                        border-b
                                                    "
                                                >
                                                    {data.lifespan ??
                                                        "-"}
                                                </td>

                                                {/* =================================
                                                    UPDATE DETAILS
                                                ================================== */}

                                                {activeFilter ===
                                                    "UPDATE" && (
                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                            border-b
                                                        "
                                                    >
                                                        {changedFields.length >
                                                        0 ? (
                                                            <div
                                                                className="
                                                                    flex
                                                                    flex-wrap
                                                                    gap-1.5
                                                                "
                                                            >
                                                                {changedFields.map(
                                                                    (
                                                                        field,
                                                                        fieldIndex
                                                                    ) => (
                                                                        <span
                                                                            key={`${field}-${fieldIndex}`}
                                                                            className="
                                                                                inline-flex
                                                                                items-center
                                                                                rounded-full
                                                                                bg-amber-100
                                                                                px-2
                                                                                py-1
                                                                                text-xs
                                                                                font-medium
                                                                                text-amber-700
                                                                            "
                                                                        >
                                                                            {
                                                                                field
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
                                                                Không xác định
                                                            </span>
                                                        )}
                                                    </td>
                                                )}

                                                {/* =================================
                                                    SKIP DETAILS
                                                ================================== */}

                                                {activeFilter ===
                                                    "SKIP" && (
                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                            border-b
                                                        "
                                                    >
                                                        <div
                                                            className="
                                                                text-sm
                                                                font-medium
                                                                text-slate-700
                                                            "
                                                        >
                                                            {
                                                                skipReason
                                                            }
                                                        </div>

                                                        {matchedBy && (
                                                            <div
                                                                className="
                                                                    mt-1
                                                                    text-xs
                                                                    text-slate-500
                                                                "
                                                            >
                                                                Match:{" "}
                                                                {
                                                                    matchedBy
                                                                }
                                                            </div>
                                                        )}

                                                        {row?.deviceKey && (
                                                            <div
                                                                className="
                                                                    mt-1
                                                                    text-xs
                                                                    text-slate-400
                                                                    break-all
                                                                "
                                                            >
                                                                Device Key:{" "}
                                                                {
                                                                    row.deviceKey
                                                                }
                                                            </div>
                                                        )}
                                                    </td>
                                                )}

                                                {/* =================================
                                                    NOTE
                                                ================================== */}

                                                {activeFilter !==
                                                    "UPDATE" &&
                                                    activeFilter !==
                                                        "SKIP" && (
                                                        <td
                                                            className="
                                                                px-3
                                                                py-3
                                                                border-b
                                                                text-slate-500
                                                            "
                                                        >
                                                            {data.note ||
                                                                row?.message ||
                                                                ""}
                                                        </td>
                                                    )}
                                            </tr>
                                        );
                                    }
                                )}

                                {/* EMPTY */}

                                {!filteredRows.length && (
                                    <tr>
                                        <td
                                            colSpan={
                                                tableColumnCount
                                            }
                                            className="
                                                text-center
                                                py-10
                                                text-slate-500
                                            "
                                        >
                                            {activeFilter ===
                                            "SKIP"
                                                ? "Không có thiết bị bị bỏ qua."
                                                : activeFilter ===
                                                  "UPDATE"
                                                    ? "Không có thiết bị cần cập nhật."
                                                    : activeFilter ===
                                                      "NEW"
                                                        ? "Không có thiết bị mới."
                                                        : activeFilter ===
                                                          "ERROR"
                                                            ? "Không có thiết bị lỗi."
                                                            : "Không có dữ liệu để hiển thị."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* =====================================
                    FOOTER
                ====================================== */}

                <div
                    className="
                        border-t
                        bg-white
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
                        Tổng cộng

                        <span
                            className="
                                font-semibold
                                mx-1
                            "
                        >
                            {totalCount}
                        </span>

                        bản ghi.

                        <span
                            className="
                                ml-3
                                text-green-600
                                font-medium
                            "
                        >
                            Mới: {newCount}
                        </span>

                        <span
                            className="
                                ml-3
                                text-amber-600
                                font-medium
                            "
                        >
                            Cập nhật: {updateCount}
                        </span>

                        <span
                            className="
                                ml-3
                                text-slate-600
                                font-medium
                            "
                        >
                            Bỏ qua: {skipCount}
                        </span>

                        {errorCount > 0 && (
                            <span
                                className="
                                    ml-3
                                    text-red-600
                                    font-medium
                                "
                            >
                                Lỗi: {errorCount}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-3">
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
                                hover:bg-slate-100
                                disabled:opacity-50
                            "
                        >
                            Hủy
                        </button>

                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={
                                loading ||
                                !allRows.length
                            }
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
                                ? "Đang xác nhận..."
                                : "Xác nhận"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
