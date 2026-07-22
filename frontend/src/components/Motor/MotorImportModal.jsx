import { useRef, useState } from "react";
import axios from "axios";
import API from "../../config";

import {
    X,
    Upload,
    FileSpreadsheet,
    Loader2
} from "lucide-react";

const statusColor = {

    NEW: "bg-green-100 text-green-700",

    UPDATE: "bg-yellow-100 text-yellow-700",

    SKIP: "bg-slate-100 text-slate-700"

};

export default function MotorImportModal({

    open,

    onClose,

    onSuccess

}) {

    const fileRef = useRef(null);

    const [file, setFile] = useState(null);

    const [preview, setPreview] = useState([]);

    const [loading, setLoading] = useState(false);

    const [importing, setImporting] = useState(false);

    const [summary, setSummary] = useState({

        total: 0,

        new: 0,

        update: 0,

        skip: 0

    });

    if (!open) return null;

    const handleChooseFile = (e) => {

        const selected = e.target.files?.[0];

        if (!selected) return;

        setFile(selected);

        previewFile(selected);

    };

    const previewFile = async (selected) => {

        try {

            setLoading(true);

            const form = new FormData();

            form.append("file", selected);

            const token =
                localStorage.getItem("token");

            const res =
                await axios.post(

                    `${API}/motors/preview-import`,

                    form,

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );

            setPreview(res.data.preview || []);

            setSummary({

                total:
                    res.data.summary?.total || 0,

                new:
                    res.data.summary?.new || 0,

                update:
                    res.data.summary?.update || 0,

                skip:
                    res.data.summary?.skip || 0

            });

        }

        catch (err) {

            console.error(err);

            alert("Không thể đọc file Excel.");

        }

        finally {

            setLoading(false);

        }

    };

    const handleImport = async () => {

        try {

            setImporting(true);

            const form = new FormData();

            form.append("file", file);

            const token =
                localStorage.getItem("token");

            await axios.post(

                `${API}/motors/import`,

                form,

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );

            alert("Import thành công.");

            onSuccess?.();

            onClose();

        }

        catch (err) {

            console.error(err);

            alert("Import thất bại.");

        }

        finally {

            setImporting(false);

        }

    };

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

                {/* Header */}

                <div
                    className="
                        flex
                        justify-between
                        items-center
                        border-b
                        px-6
                        py-4
                    "
                >

                    <div>

                        <h2
                            className="
                                text-2xl
                                font-bold
                            "
                        >

                            Import động cơ

                        </h2>

                        <p
                            className="
                                text-sm
                                text-slate-500
                                mt-1
                            "
                        >

                            Tải lên file Excel để thêm hoặc cập nhật dữ liệu động cơ.

                        </p>

                    </div>

                    <button

                        onClick={onClose}

                        className="
                            p-2
                            rounded-lg
                            hover:bg-slate-100
                        "

                    >

                        <X size={22} />

                    </button>

                </div>

                {/* Upload */}

                <div className="p-6">

                    <div
                        className="
                            border-2
                            border-dashed
                            rounded-2xl
                            border-slate-300
                            p-10
                            text-center
                        "
                    >

                        <FileSpreadsheet

                            size={48}

                            className="
                                mx-auto
                                text-emerald-600
                            "

                        />

                        <p
                            className="
                                mt-4
                                font-medium
                            "
                        >

                            Chọn file Excel (.xlsx)

                        </p>

                        <p
                            className="
                                text-sm
                                text-slate-500
                                mt-2
                            "
                        >

                            Hệ thống sẽ xem trước dữ liệu trước khi import.

                        </p>

                        <input

                            ref={fileRef}

                            type="file"

                            accept=".xlsx,.xls"

                            hidden

                            onChange={handleChooseFile}

                        />

                        <button

                            onClick={() =>
                                fileRef.current?.click()
                            }

                            className="
                                mt-6
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                px-6
                                py-3
                                transition
                            "

                        >

                            <Upload size={18} />

                            Chọn file

                        </button>

                        {

                            file &&

                            <div
                                className="
                                    mt-5
                                    text-sm
                                    text-slate-600
                                "
                            >

                                <strong>File:</strong>

                                {" "}

                                {file.name}

                            </div>

                        }

                        {

                            loading &&

                            <div
                                className="
                                    mt-5
                                    flex
                                    justify-center
                                    items-center
                                    gap-2
                                    text-blue-600
                                "
                            >

                                <Loader2
                                    className="animate-spin"
                                    size={18}
                                />

                                Đang đọc dữ liệu...

                            </div>

                        }

                    </div>

                    {/* Summary */}

                    {preview.length > 0 && (

                        <div className="px-6 pb-6">

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

                                <SummaryCard
                                    title="Tổng bản ghi"
                                    value={summary.total}
                                    color="bg-blue-50 text-blue-700"
                                />

                                <SummaryCard
                                    title="Mới"
                                    value={summary.new}
                                    color="bg-green-50 text-green-700"
                                />

                                <SummaryCard
                                    title="Cập nhật"
                                    value={summary.update}
                                    color="bg-yellow-50 text-yellow-700"
                                />

                                <SummaryCard
                                    title="Bỏ qua"
                                    value={summary.skip}
                                    color="bg-slate-100 text-slate-700"
                                />

                            </div>

                            {/* Preview Header */}

                            <div className="flex items-center justify-between mb-4">

                                <div>

                                    <h3 className="text-lg font-semibold">
                                        Xem trước dữ liệu
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        Kiểm tra dữ liệu trước khi import.
                                    </p>

                                </div>

                                <div className="flex items-center gap-2 text-sm">

                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
                                        NEW
                                    </span>

                                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                                        UPDATE
                                    </span>

                                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                                        SKIP
                                    </span>

                                </div>

                            </div>

                            {/* Preview Table */}

                            <div className="overflow-auto rounded-2xl border border-slate-200 max-h-[420px]">

                                <table className="min-w-full text-sm">

                                    <thead className="sticky top-0 bg-slate-100 z-10">

                                        <tr>

                                            <th className="px-4 py-3 text-left">STT</th>
                                            <th className="px-4 py-3 text-center">Trạng thái</th>
                                            <th className="px-4 py-3 text-left">Mã TB</th>
                                            <th className="px-4 py-3 text-left">Tên động cơ</th>
                                            <th className="px-4 py-3 text-left">Loại</th>
                                            <th className="px-4 py-3 text-left">Hãng</th>
                                            <th className="px-4 py-3 text-left">Model</th>
                                            <th className="px-4 py-3 text-left">Công suất</th>
                                            <th className="px-4 py-3 text-left">Tuyến</th>
                                            <th className="px-4 py-3 text-left">Nhà ga</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {preview.map((item, index) => {

                                            const row = item.row || {};

                                            return (

                                                <tr
                                                    key={index}
                                                    className="border-t hover:bg-slate-50"
                                                >

                                                    <td className="px-4 py-3">{index + 1}</td>

                                                    <td className="px-4 py-3 text-center">

                                                        <span
                                                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColor[item.action]}`}
                                                        >
                                                            {item.action}
                                                        </span>

                                                    </td>

                                                    <td className="px-4 py-3">{row.deviceId || "-"}</td>
                                                    <td className="px-4 py-3">{row.name || "-"}</td>
                                                    <td className="px-4 py-3">{row.type || "-"}</td>
                                                    <td className="px-4 py-3">{row.brand || "-"}</td>
                                                    <td className="px-4 py-3">{row.model || "-"}</td>
                                                    <td className="px-4 py-3">{row.power || "-"}</td>
                                                    <td className="px-4 py-3">{row.line || "-"}</td>
                                                    <td className="px-4 py-3">{row.station || "-"}</td>

                                                </tr>

                                            );

                                        })}

                                    </tbody>

                                </table>

                            </div>

                            {/* Changed Fields */}

                            {preview.some(item => item.changedFields?.length) && (

                                <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 p-4">

                                    <h4 className="font-semibold text-amber-700 mb-3">
                                        Các trường sẽ được cập nhật
                                    </h4>

                                    <div className="space-y-3 text-sm">

                                        {preview
                                            .filter(item => item.changedFields?.length)
                                            .map((item, index) => (

                                                <div key={index}>

                                                    <span className="font-medium">
                                                        {item.row?.name || item.row?.deviceId}
                                                    </span>

                                                    <div className="mt-1 flex flex-wrap gap-2">

                                                        {item.changedFields.map(field => (

                                                            <span
                                                                key={field}
                                                                className="px-2 py-1 rounded-lg bg-yellow-100 text-yellow-700 text-xs"
                                                            >
                                                                {field}
                                                            </span>

                                                        ))}

                                                    </div>

                                                </div>

                                            ))}

                                    </div>

                                </div>

                            )}

                            {/* Footer */}

                            <div className="border-t bg-white px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                <div className="text-sm text-slate-500">

                                    Có <strong>{summary.total}</strong> bản ghi.

                                    {" "}Trong đó{" "}

                                    <span className="text-green-600 font-medium">
                                        {summary.new} mới
                                    </span>

                                    ,{" "}

                                    <span className="text-yellow-600 font-medium">
                                        {summary.update} cập nhật
                                    </span>

                                    ,{" "}

                                    <span className="text-slate-600 font-medium">
                                        {summary.skip} bỏ qua
                                    </span>

                                </div>

                                <div className="flex justify-end gap-3">

                                    <button
                                        onClick={onClose}
                                        disabled={importing}
                                        className="px-5 py-2.5 rounded-xl border hover:bg-slate-100 disabled:opacity-50"
                                    >
                                        Đóng
                                    </button>

                                    <button
                                        onClick={handleImport}
                                        disabled={importing || !file}
                                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-6 py-2.5"
                                    >

                                        {importing ? (
                                            <>
                                                <Loader2
                                                    size={18}
                                                    className="animate-spin"
                                                />
                                                Đang import...
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

                    )}

                  
            </div> 

        </div> 

    </div> 

    );

}

/* ===========================
   HELPER COMPONENT
=========================== */

function SummaryCard({
    title,
    value,
    color
}) {

    return (

        <div
            className={`
                rounded-2xl
                p-5
                ${color}
            `}
        >

            <div className="text-sm font-medium">
                {title}
            </div>

            <div className="mt-2 text-3xl font-bold">
                {value}
            </div>

        </div>

    );

}
     
