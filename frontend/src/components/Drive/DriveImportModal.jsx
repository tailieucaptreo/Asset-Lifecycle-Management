import { useRef, useState } from "react";
import axios from "axios";
import { Upload, X } from "lucide-react";

const statusColor = {
    NEW: "bg-green-100 text-green-700",
    UPDATE: "bg-yellow-100 text-yellow-700",
    SKIP: "bg-slate-100 text-slate-600",
};

export default function DriveImportModal({
    open,
    onClose,
    onSuccess,
}) {
    const fileRef = useRef(null);

    const [file, setFile] = useState(null);

    const [summary, setSummary] = useState({
        total: 0,
        newCount: 0,
        updateCount: 0,
        skipCount: 0,
    });

    const [rows, setRows] = useState([]);

    const [loadingPreview, setLoadingPreview] = useState(false);
    const [loadingImport, setLoadingImport] = useState(false);

    if (!open) return null;

    const chooseFile = () => {
        fileRef.current?.click();
    };

    const handleFile = async (e) => {
        const selected = e.target.files?.[0];

        if (!selected) return;

        setFile(selected);

        const formData = new FormData();
        formData.append("file", selected);

        try {
            setLoadingPreview(true);

            const token = localStorage.getItem("token");

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/drives/preview-import`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setSummary(
                res.data.summary || {
                    total: 0,
                    newCount: 0,
                    updateCount: 0,
                    skipCount: 0,
                }
            );

            setRows(res.data.rows || []);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Preview thất bại.");
        } finally {
            setLoadingPreview(false);
        }
    };

    const handleImport = async () => {
        if (!file) return;

        try {
            setLoadingImport(true);

            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("file", file);

            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/drives/import`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            alert("Import thành công.");

            onSuccess?.();
            onClose();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Import thất bại.");
        } finally {
            setLoadingImport(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col">

                {/* Header */}

                <div className="border-b px-6 py-4 flex justify-between items-center">

                    <div>
                        <h2 className="text-2xl font-bold">
                            Preview Import Drive
                        </h2>

                        <p className="text-sm text-slate-500">
                            Kiểm tra dữ liệu trước khi import
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="hover:text-red-600"
                    >
                        <X size={26} />
                    </button>

                </div>

                {/* Upload */}

                <div className="border-b p-6">

                    <input
                        ref={fileRef}
                        type="file"
                        accept=".xlsx,.xls"
                        hidden
                        onChange={handleFile}
                    />

                    <div className="flex items-center gap-4">

                        <button
                            onClick={chooseFile}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
                        >
                            <Upload size={18} />
                            Chọn file Excel
                        </button>

                        <span className="text-slate-500">
                            {file ? file.name : "Chưa chọn file"}
                        </span>

                        {loadingPreview && (
                            <span className="text-blue-600 text-sm">
                                Đang phân tích...
                            </span>
                        )}

                    </div>

                </div>

                {/* Summary */}

                <div className="grid grid-cols-4 gap-4 p-6">

                    <Card
                        title="Tổng"
                        value={summary.total}
                    />

                    <Card
                        title="Tạo mới"
                        value={summary.newCount}
                        color="text-green-600"
                    />

                    <Card
                        title="Cập nhật"
                        value={summary.updateCount}
                        color="text-yellow-600"
                    />

                    <Card
                        title="Bỏ qua"
                        value={summary.skipCount}
                        color="text-slate-500"
                    />

                </div>

                {/* Table */}

                <div className="flex-1 overflow-auto px-6">

                    <table className="w-full table-fixed text-sm">

                        <thead className="sticky top-0 bg-slate-100 z-10">

                            <tr>

                                <th className="px-3 py-3 w-14 text-center">
                                    #
                                </th>

                                <th className="px-3 py-3 text-center">
                                    Mã TB
                                </th>

                                <th className="px-3 py-3 text-center">
                                    Thiết bị
                                </th>

                                <th className="px-3 py-3 text-center">
                                    Hãng
                                </th>

                                <th className="px-3 py-3 text-center">
                                    Model
                                </th>

                                <th className="px-3 py-3 text-center">
                                    Tuyến
                                </th>

                                <th className="px-3 py-3 text-center">
                                    Nhà ga
                                </th>

                                <th className="px-3 py-3 w-36 text-center">
                                    Trạng thái
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {rows.map((item, index) => {

                                const row = item.row || item;

                                return (

                                    <tr
                                        key={index}
                                        className="border-b hover:bg-slate-50"
                                    >

                                        <td className="text-center py-3">
                                            {index + 1}
                                        </td>

                                        <td className="text-center">
                                            {row.deviceId}
                                        </td>

                                        <td className="text-center">
                                            {row.name}
                                        </td>

                                        <td className="text-center">
                                            {row.brand}
                                        </td>

                                        <td className="text-center">
                                            {row.model}
                                        </td>

                                        <td className="text-center">
                                            {row.line || "-"}
                                        </td>

                                        <td className="text-center">
                                            {row.station || "-"}
                                        </td>

                                        <td className="text-center">

                                            <span
                                                className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${statusColor[item.action || item.status]}`}
                                            >
                                                {item.action || item.status}
                                            </span>

                                        </td>

                                    </tr>

                                );

                            })}

                        </tbody>

                    </table>

                </div>

                {/* Footer */}

                <div className="border-t p-4 flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg border"
                    >
                        Hủy
                    </button>

                    <button
                        disabled={!file || loadingImport}
                        onClick={handleImport}
                        className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {loadingImport
                            ? "Đang import..."
                            : "Xác nhận Import"}
                    </button>

                </div>

            </div>
        </div>
    );
}

function Card({
    title,
    value,
    color = "",
}) {
    return (
        <div className="border rounded-xl p-4">

            <div className="text-sm text-slate-500">
                {title}
            </div>

            <div className={`text-3xl font-bold mt-2 ${color}`}>
                {value}
            </div>

        </div>
    );
}