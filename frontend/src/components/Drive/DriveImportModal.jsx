import { useState } from "react";
import axios from "axios";
import {
    Upload,
    X,
    FileSpreadsheet,
    Loader2
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

/* =========================================================
   Helper
========================================================= */

const getValue = (row = {}, ...keys) => {

    for (const key of keys) {

        const value = row[key];

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {

            return value;

        }

    }

    return "";

};

/* =========================================================
   Summary Card
========================================================= */

function SummaryCard({

    title,

    value,

    color

}) {

    return (

        <div
            className={`
                ${color}
                rounded-xl
                p-4
                text-white
                shadow
            `}
        >

            <div
                className="
                    text-sm
                    opacity-90
                "
            >

                {title}

            </div>

            <div
                className="
                    mt-2
                    text-3xl
                    font-bold
                "
            >

                {value ?? 0}

            </div>

        </div>

    );

}

/* =========================================================
   Action Badge
========================================================= */

function ActionBadge({

    action

}) {

    const styles = {

        NEW:
            "bg-green-100 text-green-700",

        UPDATE:
            "bg-amber-100 text-amber-700",

        SKIP:
            "bg-slate-200 text-slate-600"

    };

    const className =
        styles[action] ??
        "bg-red-100 text-red-700";

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
                ${className}
            `}
        >

            {action}

        </span>

    );

}

/* =========================================================
   Main Component
========================================================= */

export default function DriveImportModal({

    open,

    onClose,

    onSuccess

}) {

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const [importing, setImporting] = useState(false);

    const [rows, setRows] = useState([]);

    const [summary, setSummary] = useState(null);

    const [sessionId, setSessionId] = useState(null);

    const token =
        localStorage.getItem("token");

    if (!open) return null;

    /* =====================================================
       Reset
    ===================================================== */

    function reset() {

        setFile(null);

        setRows([]);

        setSummary(null);

        setSessionId(null);

        setLoading(false);

        setImporting(false);

    }

    function handleClose() {

        reset();

        onClose?.();

    }

    /* =====================================================
       Preview Import
    ===================================================== */

    async function previewImport() {

        if (!file) {

            alert("Vui lòng chọn file Excel.");

            return;

        }

        try {

            setLoading(true);

            const formData = new FormData();

            formData.append("file", file);

            const res = await axios.post(

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

                res.data.summary || null

            );

            setSessionId(

                res.data.sessionId || null

            );

        }

        catch (err) {

            console.error(err);

            alert(

                err.response?.data?.message ||

                "Không thể đọc file Excel."

            );

        }

        finally {

            setLoading(false);

        }

    }

    /* =====================================================
       Confirm Import
    ===================================================== */

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

    /* =====================================================
       JSX
    ===================================================== */

    return (
         <div
            className="
                fixed
                inset-0
                bg-black/40
                flex
                items-center
                justify-center
                z-50
                p-4
            "
        >

            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow-xl
                    w-full
                    max-w-7xl
                    max-h-[90vh]
                    overflow-hidden
                    flex
                    flex-col
                "
            >

                {/* =========================
                    Header
                ========================= */}

                <div
                    className="
                        border-b
                        px-6
                        py-4
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div>

                        <h2
                            className="
                                text-xl
                                font-semibold
                            "
                        >

                            Import biến tần

                        </h2>

                        <p
                            className="
                                text-sm
                                text-gray-500
                            "
                        >

                            Xem trước dữ liệu trước khi ghi vào hệ thống

                        </p>

                    </div>

                    <button

                        onClick={handleClose}

                        className="
                            p-2
                            rounded-lg
                            hover:bg-gray-100
                        "

                    >

                        <X size={22} />

                    </button>

                </div>

                {/* =========================
                    Body
                ========================= */}

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
                            border-2
                            border-dashed
                            rounded-xl
                            p-8
                            text-center
                        "
                    >

                        <FileSpreadsheet

                            size={42}

                            className="
                                mx-auto
                                mb-4
                                text-green-600
                            "

                        />

                        <input

                            className="
                                block
                                mx-auto
                            "

                            type="file"

                            key={file?.name || "empty"}

                            accept=".xlsx,.xls"

                            onChange={(e)=>

                                setFile(

                                    e.target.files?.[0] || null

                                )

                            }

                        />

                        {

                            file && (

                                <p
                                    className="
                                        mt-3
                                        text-sm
                                        text-slate-600
                                    "
                                >

                                    {file.name}

                                </p>

                            )

                        }

                        <button

                            onClick={previewImport}

                            disabled={loading}

                            className="
                                mt-5
                                px-5
                                py-2
                                rounded-xl
                                bg-blue-600
                                hover:bg-blue-700
                                disabled:opacity-50
                                text-white
                                inline-flex
                                items-center
                                gap-2
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

                                        Đang đọc...

                                    </>

                                    :

                                    <>

                                        <Upload size={18} />

                                        Preview Import

                                    </>

                            }

                        </button>

                    </div>

                    {/* Summary */}

                    {

                        summary && (

                            <div
                                className="
                                    grid
                                    grid-cols-2
                                    md:grid-cols-4
                                    gap-4
                                "
                            >

                                <SummaryCard

                                    title="Tổng"

                                    value={summary.total}

                                    color="bg-slate-500"

                                />

                                <SummaryCard

                                    title="New"

                                    value={summary.newCount}

                                    color="bg-green-600"

                                />

                                <SummaryCard

                                    title="Update"

                                    value={summary.updateCount}

                                    color="bg-amber-500"

                                />

                                <SummaryCard

                                    title="Skip"

                                    value={summary.skipCount}

                                    color="bg-gray-500"

                                />

                            </div>

                        )

                    }

                    {/* =========================
                        Preview Table
                    ========================= */}

                    {

                        rows.length > 0 ? (

                            <div className="space-y-4">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <h3 className="text-lg font-semibold">

                                            Xem trước dữ liệu

                                        </h3>

                                        <p className="text-sm text-gray-500">

                                            Kiểm tra dữ liệu trước khi import

                                        </p>

                                    </div>

                                    <div className="text-sm text-gray-500">

                                        {rows.length} dòng

                                    </div>

                                </div>

                                <div
                                    className="
                                        border
                                        rounded-xl
                                        overflow-hidden
                                        bg-white
                                    "
                                >

                                    <div
                                        className="
                                            max-h-[420px]
                                            overflow-auto
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

                                                <tr>

                                                    <th className="px-4 py-3 text-left">

                                                        Action

                                                    </th>

                                                    <th className="px-4 py-3 text-left">

                                                        Device ID

                                                    </th>

                                                    <th className="px-4 py-3 text-left">

                                                        Tên biến tần

                                                    </th>

                                                    <th className="px-4 py-3 text-left">

                                                        Hãng

                                                    </th>

                                                    <th className="px-4 py-3 text-left">

                                                        Model

                                                    </th>

                                                    <th className="px-4 py-3 text-left">

                                                        Tuyến

                                                    </th>

                                                    <th className="px-4 py-3 text-left">

                                                        Nhà ga

                                                    </th>

                                                    <th className="px-4 py-3 text-left">

                                                        Trạng thái

                                                    </th>

                                                    <th className="px-4 py-3 text-left">

                                                        Thay đổi

                                                    </th>

                                                </tr>

                                            </thead>

                                            <tbody>

                                                {

                                                    rows.map((item, index) => {

                                                        const row = item.row || {};

                                                        const changedFields =
                                                            Array.isArray(item.changedFields)
                                                                ? item.changedFields
                                                                : [];

                                                        return (

                                                            <tr
                                                                key={index}
                                                                className="
                                                                    border-t
                                                                    hover:bg-slate-50
                                                                "
                                                            >

                                                                <td className="px-4 py-3">

                                                                    <ActionBadge
                                                                        action={item.action}
                                                                    />

                                                                </td>

                                                                <td className="px-4 py-3 font-medium">

                                                                    {

                                                                        getValue(
                                                                            row,
                                                                            "Mã thiết bị",
                                                                            "Device ID",
                                                                            "deviceId"
                                                                        )

                                                                    }

                                                                </td>

                                                                <td className="px-4 py-3">

                                                                    {

                                                                        getValue(
                                                                            row,
                                                                            "Tên biến tần",
                                                                            "Name"
                                                                        )

                                                                    }

                                                                </td>

                                                                <td className="px-4 py-3">

                                                                    {

                                                                        getValue(
                                                                            row,
                                                                            "Hãng",
                                                                            "Brand"
                                                                        )

                                                                    }

                                                                </td>

                                                                <td className="px-4 py-3">

                                                                    {

                                                                        getValue(
                                                                            row,
                                                                            "Model"
                                                                        )

                                                                    }

                                                                </td>

                                                                <td className="px-4 py-3">

                                                                    {

                                                                        getValue(
                                                                            row,
                                                                            "Tuyến",
                                                                            "Line"
                                                                        )

                                                                    }

                                                                </td>

                                                                <td className="px-4 py-3">

                                                                    {

                                                                        getValue(
                                                                            row,
                                                                            "Nhà ga",
                                                                            "Station"
                                                                        )

                                                                    }

                                                                </td>

                                                                <td className="px-4 py-3">

                                                                    {

                                                                        getValue(
                                                                            row,
                                                                            "Trạng thái",
                                                                            "Status"
                                                                        )

                                                                    }

                                                                </td>

                                                                <td className="px-4 py-3">

                                                                    {

                                                                        item.action === "UPDATE"

                                                                            ? (

                                                                                <div className="flex flex-wrap gap-1">

                                                                                    {

                                                                                        changedFields.length > 0

                                                                                            ? changedFields.map(field => (

                                                                                                <span
                                                                                                    key={field}
                                                                                                    className="
                                                                                                        px-2
                                                                                                        py-1
                                                                                                        rounded-full
                                                                                                        text-xs
                                                                                                        bg-amber-100
                                                                                                        text-amber-700
                                                                                                    "
                                                                                                >

                                                                                                    {field}

                                                                                                </span>

                                                                                            ))

                                                                                            : (

                                                                                                <span className="text-gray-400">

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

                                                                                    <span className="text-gray-400">

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

                            </div>

                        ) : (

                            summary && (

                                <div
                                    className="
                                        border
                                        rounded-xl
                                        p-8
                                        text-center
                                        text-gray-500
                                    "
                                >

                                    Không có dữ liệu để import.

                                </div>

                            )

                        )

                    }

                    {/* =========================
                        Footer
                    ========================= */}

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

                    <div className="text-sm text-gray-500">

                        {

                            summary

                                ? `Sẽ tạo ${summary.newCount} mới • Cập nhật ${summary.updateCount} • Bỏ qua ${summary.skipCount}`

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
                                py-2
                                rounded-xl
                                border
                                hover:bg-gray-100
                                disabled:opacity-50
                            "

                        >

                            Đóng

                        </button>

                        <button

                            type="button"

                            onClick={confirmImport}

                            disabled={
                                !sessionId ||
                                importing ||
                                rows.length === 0
                            }

                            className="
                                px-5
                                py-2
                                rounded-xl
                                bg-green-600
                                hover:bg-green-700
                                disabled:opacity-50
                                text-white
                                inline-flex
                                items-center
                                gap-2
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