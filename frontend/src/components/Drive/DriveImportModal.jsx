import { useState } from "react";
import axios from "axios";

import API from "../../config";

import {
    X,
    Upload,
    Loader2,
    FileSpreadsheet
} from "lucide-react";

/* ======================================================
   Helper
====================================================== */

function getValue(row = {}, ...keys) {

    for (const key of keys) {

        if (
            row[key] !== undefined &&
            row[key] !== null &&
            row[key] !== ""
        ) {

            return row[key];

        }

    }

    return "";

}

/* ======================================================
   Summary Card
====================================================== */

function SummaryCard({

    title,

    value,

    color = "text-slate-900"

}) {

    return (

        <div
            className="
                border
                rounded-2xl
                bg-white
                p-5
                shadow-sm
            "
        >

            <div
                className="
                    text-sm
                    text-slate-500
                "
            >

                {title}

            </div>

            <div
                className={`
                    mt-3
                    text-4xl
                    font-bold
                    ${color}
                `}
            >

                {value ?? 0}

            </div>

        </div>

    );

}

/* ======================================================
   Action Badge
====================================================== */

function ActionBadge({

    action

}) {

    const styles = {

        NEW:
            "bg-green-100 text-green-700",

        UPDATE:
            "bg-yellow-100 text-yellow-700",

        SKIP:
            "bg-slate-100 text-slate-600"

    };

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
                ${styles[action] || styles.SKIP}
            `}
        >

            {action}

        </span>

    );

}

/* ======================================================
   Main Component
====================================================== */

export default function DriveImportModal({

    open,

    onClose,

    onSuccess

}) {

    const token =
        localStorage.getItem("token");

    const [file, setFile] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [importing, setImporting] =
        useState(false);

    const [rows, setRows] =
        useState([]);

    const [summary, setSummary] =
        useState(null);

    const [sessionId, setSessionId] =
        useState("");

    if (!open) return null;

    /* ==================================================
       Reset
    ================================================== */

    function reset() {

        setFile(null);

        setRows([]);

        setSummary(null);

        setSessionId("");

        setLoading(false);

        setImporting(false);

    }

    function handleClose() {

        reset();

        onClose?.();

    }

    /* ==================================================
       Preview Import
    ================================================== */

    async function previewImport() {

        if (!file) {

            alert("Vui lòng chọn file Excel.");

            return;

        }

        try {

            setLoading(true);

            const formData =
                new FormData();

            formData.append("file", file);

            const res =
                await axios.post(

                    `${API}/api/drives/preview-import`,

                    formData,

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "multipart/form-data"

                        }

                    }

                );

            setRows(

                Array.isArray(res.data.rows)

                    ? res.data.rows

                    : []

            );

            setSummary(

                res.data.summary || {}

            );

            setSessionId(

                res.data.sessionId || ""

            );

        }

        catch (err) {

            console.error(err);

            alert(

                err.response?.data?.message ||

                "Không thể preview file."

            );

        }

        finally {

            setLoading(false);

        }

    }

    /* ==================================================
       Confirm Import
    ================================================== */

    async function confirmImport() {

        if (!sessionId) {

            return;

        }

        try {

            setImporting(true);

            await axios.post(

                `${API}/api/drives/import`,

                {

                    sessionId

                },

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );

            alert("Import thành công.");

            await onSuccess?.();

            handleClose();

        }

        catch (err) {

            console.error(err);

            alert(

                err.response?.data?.message ||

                "Import thất bại."

            );

        }

        finally {

            setImporting(false);

        }

    }

    /* ==================================================
       JSX
    ================================================== */

    return (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

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

                {/* ================= Header ================= */}

                <div
                    className="
                        border-b
                        px-6
                        py-5
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div>

                        <h2
                            className="
                                text-3xl
                                font-bold
                            "
                        >

                            Preview Import Drive

                        </h2>

                        <p
                            className="
                                text-slate-500
                                mt-1
                            "
                        >

                            Kiểm tra dữ liệu trước khi import

                        </p>

                    </div>

                    <button
                        onClick={handleClose}
                        className="
                            p-2
                            rounded-lg
                            hover:bg-slate-100
                        "
                    >

                        <X size={24} />

                    </button>

                </div>

                {/* ================= Body ================= */}

                <div
                    className="
                        flex-1
                        overflow-auto
                        p-6
                        space-y-6
                    "
                >

                    {/* Upload */}

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            flex-wrap
                        "
                    >

                        <label
                            className="
                                inline-flex
                                items-center
                                gap-2
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                px-5
                                py-3
                                rounded-xl
                                cursor-pointer
                            "
                        >

                            <Upload size={18} />

                            Chọn file Excel

                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                hidden
                                onChange={(e) =>
                                    setFile(
                                        e.target.files?.[0] || null
                                    )
                                }
                            />

                        </label>

                        <span
                            className="
                                text-slate-600
                                truncate
                                max-w-md
                            "
                        >

                            {file
                                ? file.name
                                : "Chưa chọn file"}

                        </span>

                        <button
                            onClick={previewImport}
                            disabled={loading}
                            className="
                                ml-auto
                                inline-flex
                                items-center
                                gap-2
                                bg-green-600
                                hover:bg-green-700
                                text-white
                                px-5
                                py-3
                                rounded-xl
                                disabled:opacity-50
                            "
                        >

                            {

                                loading

                                    ?

                                    <>

                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />

                                        Đang Preview...

                                    </>

                                    :

                                    <>

                                        <FileSpreadsheet size={18} />

                                        Preview Import

                                    </>

                            }

                        </button>

                    </div>

                    {/* Summary */}

                    {

                        summary &&

                        <div
                            className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                xl:grid-cols-4
                                gap-5
                            "
                        >

                            <SummaryCard
                                title="Tổng"
                                value={summary.total}
                            />

                            <SummaryCard
                                title="Tạo mới"
                                value={summary.newCount}
                                color="text-green-600"
                            />

                            <SummaryCard
                                title="Cập nhật"
                                value={summary.updateCount}
                                color="text-yellow-600"
                            />

                            <SummaryCard
                                title="Bỏ qua"
                                value={summary.skipCount}
                                color="text-slate-500"
                            />

                        </div>

                    }

                    {/* ================= Preview Table ================= */}

                    {

                        rows.length > 0 && (

                            <div
                                className="
                                    border
                                    rounded-2xl
                                    overflow-hidden
                                "
                            >
                             <div
                                    className="
                                        max-h-[460px]
                                        overflow-auto
                                    "
                                >

                                    <table className="min-w-full text-sm">

                                        <thead className="sticky top-0 bg-slate-100 z-20">

                                            <tr className="border-b">

                                                <th className="px-4 py-3 text-center w-28">
                                                    Action
                                                </th>

                                                <th className="px-4 py-3 text-left min-w-[130px]">
                                                    Device ID
                                                </th>

                                                <th className="px-4 py-3 text-left min-w-[220px]">
                                                    Name
                                                </th>

                                                <th className="px-4 py-3 text-center min-w-[100px]">
                                                    Brand
                                                </th>

                                                <th className="px-4 py-3 text-left min-w-[180px]">
                                                    Model
                                                </th>

                                                <th className="px-4 py-3 text-center min-w-[120px]">
                                                    Line
                                                </th>

                                                <th className="px-4 py-3 text-center min-w-[120px]">
                                                    Station
                                                </th>

                                                <th className="px-4 py-3 text-center min-w-[120px]">
                                                    Status
                                                </th>

                                                <th className="px-4 py-3 text-left min-w-[220px]">
                                                    Changed Fields
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {

                                                rows.map((item, index) => {

                                                    const row =
                                                        item.row || {};

                                                    const changedFields =
                                                        item.changedFields || [];

                                                    return (

                                                        <tr
                                                            key={index}
                                                            className="
                                                                border-b
                                                                hover:bg-slate-50
                                                            "
                                                        >

                                                            <td className="px-4 py-3 text-center">

                                                                <ActionBadge
                                                                    action={item.action}
                                                                />

                                                            </td>

                                                            <td className="px-4 py-3 font-medium">

                                                                {

                                                                    getValue(

                                                                        row,

                                                                        "deviceId",

                                                                        "Device ID",

                                                                        "Mã thiết bị"

                                                                    )

                                                                }

                                                            </td>

                                                            <td className="px-4 py-3">

                                                                {

                                                                    getValue(

                                                                        row,

                                                                        "name",

                                                                        "Name",

                                                                        "Tên biến tần"

                                                                    )

                                                                }

                                                            </td>

                                                            <td className="px-4 py-3 text-center">

                                                                {

                                                                    getValue(

                                                                        row,

                                                                        "brand",

                                                                        "Brand",

                                                                        "Hãng"

                                                                    )

                                                                }

                                                            </td>

                                                            <td className="px-4 py-3">

                                                                {

                                                                    getValue(

                                                                        row,

                                                                        "model",

                                                                        "Model"

                                                                    )

                                                                }

                                                            </td>

                                                            <td className="px-4 py-3 text-center">

                                                                {

                                                                    getValue(

                                                                        row,

                                                                        "line",

                                                                        "Line",

                                                                        "Tuyến"

                                                                    )

                                                                }

                                                            </td>

                                                            <td className="px-4 py-3 text-center">

                                                                {

                                                                    getValue(

                                                                        row,

                                                                        "station",

                                                                        "Station",

                                                                        "Nhà ga"

                                                                    )

                                                                }

                                                            </td>

                                                            <td className="px-4 py-3 text-center">

                                                                {

                                                                    getValue(

                                                                        row,

                                                                        "status",

                                                                        "Status",

                                                                        "Trạng thái"

                                                                    )

                                                                }

                                                            </td>

                                                            <td className="px-4 py-3">

                                                                {

                                                                    item.action === "UPDATE"

                                                                        ? (

                                                                            <div className="flex flex-wrap gap-1">

                                                                                {

                                                                                    changedFields.length

                                                                                        ? changedFields.map(field => (

                                                                                            <span

                                                                                                key={field}

                                                                                                className="
                                                                                                    px-2
                                                                                                    py-1
                                                                                                    rounded-full
                                                                                                    bg-yellow-100
                                                                                                    text-yellow-700
                                                                                                    text-xs
                                                                                                "

                                                                                            >

                                                                                                {field}

                                                                                            </span>

                                                                                        ))

                                                                                        : (

                                                                                            <span className="text-slate-400">

                                                                                                -

                                                                                            </span>

                                                                                        )

                                                                                }

                                                                            </div>

                                                                        )

                                                                        : item.action === "NEW"

                                                                            ? (

                                                                                <span className="text-green-600 font-medium">

                                                                                    Thêm mới

                                                                                </span>

                                                                            )

                                                                            : (

                                                                                <span className="text-slate-400">

                                                                                    Không thay đổi

                                                                                </span>

                                                                            )

                                                                }

                                                            </td>

                                                        </tr>

                                                    );

                                                })

                                            }

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        )

                    }
                                        {/* ================= Footer ================= */}

                </div>

                <div
                    className="
                        border-t
                        px-6
                        py-4
                        flex
                        items-center
                        justify-between
                        bg-white
                    "
                >

                    <div className="text-sm text-slate-500">

                        {

                            summary

                                ? `Tổng: ${summary.total || 0} • Thêm mới: ${summary.newCount || 0} • Cập nhật: ${summary.updateCount || 0} • Bỏ qua: ${summary.skipCount || 0}`

                                : "Chọn file Excel để bắt đầu."

                        }

                    </div>

                    <div className="flex items-center gap-3">

                        <button

                            type="button"

                            onClick={handleClose}

                            disabled={importing}

                            className="
                                px-5
                                py-2.5
                                rounded-xl
                                border
                                hover:bg-slate-100
                                disabled:opacity-50
                            "

                        >

                            Hủy

                        </button>

                        <button

                            type="button"

                            onClick={confirmImport}

                            disabled={
                                importing ||
                                !sessionId ||
                                rows.length === 0
                            }

                            className="
                                inline-flex
                                items-center
                                gap-2
                                px-5
                                py-2.5
                                rounded-xl
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            "

                        >

                            {

                                importing

                                    ? (

                                        <>

                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />

                                            Đang Import...

                                        </>

                                    )

                                    : (

                                        <>

                                            <Upload size={18} />

                                            Xác nhận Import

                                        </>

                                    )

                            }

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}