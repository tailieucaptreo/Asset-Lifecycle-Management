import { useState } from "react";
import axios from "axios";

import {

    X,

    Upload,

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

            className="

                border

                rounded-xl

                bg-white

                p-5

                shadow-sm

            "

        >

            <div

                className="

                    text-slate-500

                    text-base

                "

            >

                {title}

            </div>

            <div

                className={`

                    mt-3

                    text-5xl

                    font-bold

                    ${color}

                `}

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

    const style = {

        NEW:

            "bg-green-100 text-green-700",

        UPDATE:

            "bg-amber-100 text-amber-700",

        SKIP:

            "bg-slate-100 text-slate-600"

    };

    return (

        <span

            className={`

                inline-flex

                items-center

                justify-center

                rounded-full

                px-4

                py-1

                text-xs

                font-semibold

                ${style[action]}

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

                "Không đọc được file Excel."

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
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[92vh] overflow-hidden flex flex-col">

                {/* ================= Header ================= */}

                <div className="border-b px-8 py-6 flex items-center justify-between">

                    <div>

                        <h2 className="text-4xl font-bold">

                            Preview Import Drive

                        </h2>

                        <p className="text-slate-500 mt-2">

                            Kiểm tra dữ liệu trước khi import

                        </p>

                    </div>

                    <button

                        onClick={handleClose}

                        className="p-2 rounded-lg hover:bg-slate-100"

                    >

                        <X size={34} />

                    </button>

                </div>

                {/* ================= Body ================= */}

                <div className="flex-1 overflow-auto p-8 space-y-8">

                    {/* Upload */}

                    <div className="flex items-center gap-4">

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

                            <Upload size={20} />

                            Chọn file Excel

                            <input

                                type="file"

                                accept=".xlsx,.xls"

                                hidden

                                onChange={(e)=>

                                    setFile(

                                        e.target.files?.[0] || null

                                    )

                                }

                            />

                        </label>

                        <div className="text-slate-600">

                            {

                                file

                                    ? file.name

                                    : "Chưa chọn file"

                            }

                        </div>

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
                                px-6
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

                        summary && (

                            <div className="grid grid-cols-4 gap-6">

                                <SummaryCard

                                    title="Tổng"

                                    value={summary.total}

                                    color="text-black"

                                />

                                <SummaryCard

                                    title="Tạo mới"

                                    value={summary.newCount}

                                    color="text-green-600"

                                />

                                <SummaryCard

                                    title="Cập nhật"

                                    value={summary.updateCount}

                                    color="text-amber-600"

                                />

                                <SummaryCard

                                    title="Bỏ qua"

                                    value={summary.skipCount}

                                    color="text-slate-500"

                                />

                            </div>

                        )

                    }

                    {/* ================= Preview Table ================= */}

                    {

                        rows.length > 0 && (

                            <div className="border rounded-2xl overflow-hidden">
                                                                <div className="max-h-[460px] overflow-auto">

                                    <table className="min-w-full text-sm">

                                        <thead className="sticky top-0 bg-slate-100 z-20">

                                            <tr className="border-b">

                                                <th className="px-4 py-3 text-left w-20">
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
                                                            className="border-b hover:bg-slate-50"
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
                        bg-white
                        px-8
                        py-5
                        flex
                        items-center
                        justify-between
                        shrink-0
                    "
                >

                    <div className="text-sm text-slate-500">

                        {

                            summary

                                ? `Tổng ${summary.total} • Thêm mới ${summary.newCount} • Cập nhật ${summary.updateCount} • Bỏ qua ${summary.skipCount}`

                                : "Chọn file Excel để bắt đầu."

                        }

                    </div>

                    <div className="flex items-center gap-3">

                        <button

                            type="button"

                            onClick={handleClose}

                            disabled={importing}

                            className="
                                px-6
                                py-3
                                rounded-xl
                                border
                                bg-white
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
                                !sessionId ||
                                importing ||
                                rows.length === 0
                            }

                            className="
                                inline-flex
                                items-center
                                gap-2
                                px-6
                                py-3
                                rounded-xl
                                bg-green-600
                                hover:bg-green-700
                                text-white
                                disabled:opacity-50
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