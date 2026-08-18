import { useState } from "react";
import {
    X,
    ChevronRight,
    AlertTriangle,
    CheckCircle2,
    Upload,
} from "lucide-react";

/* =========================================================
   STATUS CONFIG
========================================================= */

const statusConfig = {
    NEW: {
        label: "Mới",
        className: "bg-emerald-100 text-emerald-700",
    },

    UPDATE: {
        label: "Cập nhật",
        className: "bg-amber-100 text-amber-700",
    },

    UPDATE_HISTORY: {
        label: "Cập nhật",
        className: "bg-amber-100 text-amber-700",
    },

    UPDATE_DEVICE: {
        label: "Cập nhật",
        className: "bg-amber-100 text-amber-700",
    },

    UPDATE_BOTH: {
        label: "Cập nhật",
        className: "bg-amber-100 text-amber-700",
    },

    SKIP: {
        label: "Bỏ qua",
        className: "bg-slate-100 text-slate-600",
    },
};

/* =========================================================
   ACTION NORMALIZER
========================================================= */

function normalizeAction(item) {
    const raw =
        item?.action ??
        item?.status ??
        item?.result ??
        "";

    const value = String(raw).trim().toUpperCase();

    /*
     * Các trạng thái cập nhật lịch sử
     */
    if (
        value === "UPDATE_HISTORY" ||
        value === "HISTORY_UPDATE"
    ) {
        return "UPDATE_HISTORY";
    }

    /*
     * Các trạng thái cập nhật thông tin thiết bị
     */
    if (
        value === "UPDATE_DEVICE" ||
        value === "DEVICE_UPDATE"
    ) {
        return "UPDATE_DEVICE";
    }

    /*
     * Thiết bị + lịch sử cùng thay đổi
     */
    if (
        value === "UPDATE_BOTH" ||
        value === "BOTH_UPDATE"
    ) {
        return "UPDATE_BOTH";
    }

    /*
     * UPDATE thông thường
     */
    if (value === "UPDATE") {
        return "UPDATE";
    }

    /*
     * Thiết bị mới
     */
    if (
        value === "NEW" ||
        value === "CREATE" ||
        value === "CREATED"
    ) {
        return "NEW";
    }

    /*
     * Bỏ qua
     */
    if (
        value === "SKIP" ||
        value === "IGNORE" ||
        value === "IGNORED"
    ) {
        return "SKIP";
    }

    /*
     * Không được tự động coi là NEW.
     * An toàn nhất là SKIP.
     */
    return "SKIP";
}

/* =========================================================
   IS UPDATE
========================================================= */

function isUpdateAction(action) {
    return (
        action === "UPDATE" ||
        action === "UPDATE_HISTORY" ||
        action === "UPDATE_DEVICE" ||
        action === "UPDATE_BOTH"
    );
}

/* =========================================================
   GET ROW
========================================================= */

function getRow(item) {
    return (
        item?.row ||
        item?.data ||
        item
    );
}

/* =========================================================
   GET CHANGED FIELDS
========================================================= */

function getChangedFields(item) {
    /*
     * Backend có thể trả:
     *
     * changedFields: ["Note"]
     *
     * hoặc:
     *
     * changes: ["Note"]
     *
     * hoặc:
     *
     * updateData: {
     *     note: "..."
     * }
     */

    if (
        Array.isArray(item?.changedFields) &&
        item.changedFields.length > 0
    ) {
        return item.changedFields;
    }

    if (
        Array.isArray(item?.changes) &&
        item.changes.length > 0
    ) {
        return item.changes;
    }

    if (
        Array.isArray(item?.changed) &&
        item.changed.length > 0
    ) {
        return item.changed;
    }

    /*
     * Nếu backend trả updateData dạng object
     */
    if (
        item?.updateData &&
        typeof item.updateData === "object" &&
        !Array.isArray(item.updateData)
    ) {
        return Object.keys(item.updateData);
    }

    return [];
}

/* =========================================================
   FIELD LABEL
========================================================= */

function getFieldLabel(field) {
    if (!field) {
        return "Thay đổi";
    }

    if (typeof field === "object") {
        return (
            field?.label ||
            field?.name ||
            field?.field ||
            "Thay đổi"
        );
    }

    const key = String(field);

    const labels = {
        note: "Ghi chú",
        Note: "Note",

        deviceName: "Tên thiết bị",
        name: "Tên thiết bị",
        "Tên thiết bị": "Tên thiết bị",

        serialNumber: "Serial",
        serial: "Serial",
        "Số serial": "Serial",

        station: "Trạm",
        tandem: "Tandem",
        application: "Ứng dụng",

        recordDate: "Ngày ghi nhận",
        operationHours: "Giờ vận hành",
        powerUnitDate: "Power Unit Date",

        faultHistory: "Lịch sử lỗi",
        description: "Mô tả",
        possibleCause: "Nguyên nhân",
        correctiveActions: "Biện pháp khắc phục",
    };

    return labels[key] || key;
}

/* =========================================================
   GET REASON
========================================================= */

function getReason(item, action) {
    /*
     * Nếu backend đã gửi reason cụ thể
     * thì ưu tiên sử dụng.
     */

    if (
        item?.reason &&
        String(item.reason).trim()
    ) {
        return item.reason;
    }

    if (
        item?.skipReason &&
        String(item.skipReason).trim()
    ) {
        return item.skipReason;
    }

    if (
        item?.message &&
        String(item.message).trim()
    ) {
        return item.message;
    }

    if (
        item?.reasonText &&
        String(item.reasonText).trim()
    ) {
        return item.reasonText;
    }

    /*
     * QUAN TRỌNG:
     * Không được dùng deviceId để xác định NEW.
     */

    switch (action) {
        case "NEW":
            return "Thiết bị mới";

        case "UPDATE_HISTORY":
            return "Dữ liệu lịch sử thay đổi";

        case "UPDATE_DEVICE":
            return "Thông tin thiết bị thay đổi";

        case "UPDATE_BOTH":
            return "Thiết bị và lịch sử thay đổi";

        case "UPDATE":
            return "Có dữ liệu thay đổi";

        case "SKIP":
        default:
            return "Thiết bị đã tồn tại và không có thay đổi";
    }
}

/* =========================================================
   GET SUMMARY
========================================================= */

function getSummary(summary, rows) {
    const total =
        summary?.total ??
        summary?.totalCount ??
        rows.length;

    const newCount =
        summary?.newCount ??
        summary?.new ??
        0;

    /*
     * Backend VACON hiện tại có thể trả:
     *
     * deviceUpdateCount
     * historyUpdateCount
     * bothUpdateCount
     *
     * thay vì updateCount.
     */

    const deviceUpdateCount =
        Number(summary?.deviceUpdateCount ?? 0);

    const historyUpdateCount =
        Number(summary?.historyUpdateCount ?? 0);

    const bothUpdateCount =
        Number(summary?.bothUpdateCount ?? 0);

    const calculatedUpdateCount =
        deviceUpdateCount +
        historyUpdateCount +
        bothUpdateCount;

    const updateCount =
        summary?.updateCount ??
        summary?.update ??
        (
            calculatedUpdateCount > 0
                ? calculatedUpdateCount
                : 0
        );

    const skipCount =
        summary?.skipCount ??
        summary?.skip ??
        0;

    return {
        total,
        newCount,
        updateCount,
        skipCount,
        deviceUpdateCount,
        historyUpdateCount,
        bothUpdateCount,
    };
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

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
     * Hook phải luôn được khai báo trước return.
     */
    const [filter, setFilter] = useState("ALL");

    /* =====================================================
       SUMMARY
    ===================================================== */

    const {
        total,
        newCount,
        updateCount,
        skipCount,
    } = getSummary(
        summary,
        rows
    );

    /* =====================================================
       FILTER
    ===================================================== */

    const filteredRows =
        filter === "ALL"
            ? rows
            : rows.filter((item) => {
                  const action =
                      normalizeAction(item);

                  if (filter === "UPDATE") {
                      return isUpdateAction(action);
                  }

                  return action === filter;
              });

    /* =====================================================
       MODULE NAME
    ===================================================== */

    const moduleName =
        String(module).toUpperCase() === "ABB"
            ? "ABB"
            : "VACON";

    /* =====================================================
       CURRENT FILTER LABEL
    ===================================================== */

    const filterLabel =
        filter === "ALL"
            ? "Tất cả thiết bị"
            : filter === "NEW"
            ? "Thiết bị mới"
            : filter === "UPDATE"
            ? "Thiết bị cập nhật"
            : "Thiết bị bị bỏ qua";

    /* =====================================================
       IF CLOSED
    ===================================================== */

    if (!open) {
        return null;
    }

    /* =====================================================
       RENDER
    ===================================================== */

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
                    SUMMARY CARDS
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
                    {/* TOTAL */}

                    <SummaryCard
                        title="Tổng"
                        value={total}
                        color="blue"
                        active={filter === "ALL"}
                        onClick={() =>
                            setFilter("ALL")
                        }
                    />

                    {/* NEW */}

                    <SummaryCard
                        title="Tạo mới"
                        value={newCount}
                        color="green"
                        active={filter === "NEW"}
                        onClick={() =>
                            setFilter("NEW")
                        }
                    />

                    {/* UPDATE */}

                    <SummaryCard
                        title="Cập nhật"
                        value={updateCount}
                        color="amber"
                        active={filter === "UPDATE"}
                        onClick={() =>
                            setFilter("UPDATE")
                        }
                    />

                    {/* SKIP */}

                    <SummaryCard
                        title="Bỏ qua"
                        value={skipCount}
                        color="slate"
                        active={filter === "SKIP"}
                        onClick={() =>
                            setFilter("SKIP")
                        }
                    />
                </div>

                {/* =================================================
                    CURRENT FILTER
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
                    <div
                        className="
                            text-sm
                            text-slate-500
                        "
                    >
                        Đang xem:{" "}

                        <span
                            className="
                                font-semibold
                                text-slate-700
                            "
                        >
                            {filterLabel}
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
                            border-slate-300
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
                                <col className="w-[45px]" />

                                <col className="w-[25%]" />

                                <col className="w-[14%]" />

                                <col className="w-[8%]" />

                                <col className="w-[12%]" />

                                <col className="w-[18%]" />

                                <col className="w-[18%]" />
                            </colgroup>

                            {/* =================================================
                                THEAD
                            ================================================= */}

                            <thead
                                className="
                                    sticky
                                    top-0
                                    z-20
                                    bg-slate-100
                                    border-b
                                    border-slate-300
                                "
                            >
                                <tr>
                                    <th
                                        className="
                                            px-2
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
                                            text-center
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

                            {/* =================================================
                                TBODY
                            ================================================= */}

                            <tbody>
                                {filteredRows.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="
                                                py-12
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
                                            const row =
                                                getRow(item);

                                            /*
                                             * QUAN TRỌNG:
                                             * action lấy từ item.status/action.
                                             *
                                             * Không lấy deviceId
                                             * để xác định NEW.
                                             */

                                            const action =
                                                normalizeAction(
                                                    item
                                                );

                                            const config =
                                                statusConfig[
                                                    action
                                                ] ||
                                                statusConfig.SKIP;

                                            const changedFields =
                                                getChangedFields(
                                                    item
                                                );

                                            const reason =
                                                getReason(
                                                    item,
                                                    action
                                                );

                                            const rowNumber =
                                                item?.rowIndex ??
                                                item?.excelRow ??
                                                item?.index ??
                                                index + 1;

                                            return (
                                                <tr
                                                    key={
                                                        item?.id ??
                                                        item?.historyId ??
                                                        item?.rowIndex ??
                                                        item?.excelRow ??
                                                        index
                                                    }
                                                    className={`
                                                        border-b
                                                        last:border-b-0
                                                        transition
                                                        ${
                                                            action ===
                                                            "UPDATE_HISTORY"
                                                                ? "bg-amber-50"
                                                                : action ===
                                                                  "UPDATE_DEVICE"
                                                                ? "bg-amber-50"
                                                                : action ===
                                                                  "UPDATE_BOTH"
                                                                ? "bg-amber-50"
                                                                : action ===
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
                                                    {/* =================================
                                                        #
                                                    ================================= */}

                                                    <td
                                                        className="
                                                            px-2
                                                            py-3
                                                            text-center
                                                            text-slate-500
                                                            align-top
                                                        "
                                                    >
                                                        {rowNumber}
                                                    </td>

                                                    {/* =================================
                                                        DEVICE
                                                    ================================= */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                            align-top
                                                            min-w-0
                                                        "
                                                    >
                                                        <div
                                                            className="
                                                                font-semibold
                                                                text-slate-800
                                                                break-words
                                                                leading-5
                                                            "
                                                        >
                                                            {row?.deviceName ||
                                                                row?.name ||
                                                                row?.title ||
                                                                item?.deviceName ||
                                                                "-"}
                                                        </div>

                                                        {moduleName ===
                                                            "VACON" && (
                                                            <div
                                                                className="
                                                                    text-xs
                                                                    text-slate-400
                                                                    mt-1
                                                                    break-words
                                                                    leading-4
                                                                "
                                                            >
                                                                {row?.application ||
                                                                    item?.application ||
                                                                    "-"}
                                                            </div>
                                                        )}

                                                        {moduleName ===
                                                            "ABB" && (
                                                            <div
                                                                className="
                                                                    text-xs
                                                                    text-slate-400
                                                                    mt-1
                                                                    break-words
                                                                    leading-4
                                                                "
                                                            >
                                                                {row?.typeCode ||
                                                                    row?.application ||
                                                                    "-"}
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* =================================
                                                        SERIAL
                                                    ================================= */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                            align-top
                                                            break-all
                                                            text-slate-700
                                                        "
                                                    >
                                                        {row?.serialNumber ||
                                                            row?.serial ||
                                                            item?.serialNumber ||
                                                            "-"}
                                                    </td>

                                                    {/* =================================
                                                        STATION
                                                    ================================= */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                            text-center
                                                            align-top
                                                            break-words
                                                        "
                                                    >
                                                        {row?.station ||
                                                            item?.station ||
                                                            row?.line ||
                                                            "-"}
                                                    </td>

                                                    {/* =================================
                                                        STATUS
                                                    ================================= */}

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
                                                            {isUpdateAction(
                                                                action
                                                            ) && (
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

                                                            {
                                                                config.label
                                                            }
                                                        </span>
                                                    </td>

                                                    {/* =================================
                                                        REASON
                                                    ================================= */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                            align-top
                                                            break-words
                                                        "
                                                    >
                                                        <div
                                                            className={`
                                                                leading-5
                                                                ${
                                                                    isUpdateAction(
                                                                        action
                                                                    )
                                                                        ? "text-amber-700"
                                                                        : "text-slate-600"
                                                                }
                                                            `}
                                                        >
                                                            {reason}
                                                        </div>
                                                    </td>

                                                    {/* =================================
                                                        CHANGES
                                                    ================================= */}

                                                    <td
                                                        className="
                                                            px-3
                                                            py-3
                                                            align-top
                                                        "
                                                    >
                                                        {isUpdateAction(
                                                            action
                                                        ) ? (
                                                            changedFields.length >
                                                            0 ? (
                                                                <div
                                                                    className="
                                                                        flex
                                                                        flex-wrap
                                                                        gap-1
                                                                    "
                                                                >
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
                                                                                    break-words
                                                                                "
                                                                            >
                                                                                {getFieldLabel(
                                                                                    field
                                                                                )}
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
                                                                    Có dữ liệu
                                                                    thay đổi
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
                    {/* SUMMARY TEXT */}

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

                        <span
                            className="
                                ml-2
                                text-emerald-600
                            "
                        >
                            Mới: {newCount}
                        </span>

                        <span
                            className="
                                ml-2
                                text-amber-600
                            "
                        >
                            Cập nhật: {updateCount}
                        </span>

                        <span
                            className="
                                ml-2
                                text-slate-500
                            "
                        >
                            Bỏ qua: {skipCount}
                        </span>
                    </div>

                    {/* BUTTONS */}

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
                                transition
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
                                transition
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
