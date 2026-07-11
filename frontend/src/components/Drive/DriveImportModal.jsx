import { useState } from "react";
import { Upload, X, FileSpreadsheet } from "lucide-react";

export default function DriveImportModal({

    open,

    preview = [],

    loading,

    importFile,

    onClose,

    onUpload,

    onConfirm

}) {

    if (!open) return null;

    const columns = [
        { key: "typeCode", label: "Type code" },
        { key: "serialNumber", label: "Serial number" },
        { key: "line", label: "Tuyến cáp" },
        { key: "station", label: "Đặt tại Ga" },
        { key: "application", label: "Ký hiệu / Ứng dụng" },
        { key: "firmware", label: "Firmware" },
        { key: "currentStatus", label: "Tình trạng hiện tại" },
        { key: "replaceReason", label: "Lý do thay thế" },
        { key: "operationHours", label: "Giờ hoạt động" },
        { key: "lastReplaceDate", label: "Ngày thay" },
        { key: "onTimeDay", label: "On-time" },
        { key: "runningDay", label: "Running Day" },
        { key: "lastMaintenance", label: "Ngày bảo dưỡng" },
        { key: "maintenanceWork", label: "Nội dung bảo dưỡng" },
        { key: "note", label: "Ghi chú" }
    ];

    const chooseFile = (e) => {

        if (!e.target.files?.length) return;
    
        onUpload(e.target.files[0]);
    
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
                    shadow-xl
                    w-full
                    max-w-6xl
                    h-[90vh]
                    flex
                    flex-col
                "
            >

                {/* Header */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        px-6
                        py-4
                    "
                >

                    <h2
                        className="
                            text-xl
                            font-semibold
                        "
                    >

                        Import biến tần

                    </h2>

                    <button onClick={onClose}>

                        <X />

                    </button>

                </div>

                {/* Upload */}

                <div className="flex-1 overflow-y-auto p-6">

                    <label
                        className="
                            border-2
                            border-dashed
                            rounded-2xl
                            p-10
                            flex
                            flex-col
                            items-center
                            justify-center
                            cursor-pointer
                            hover:bg-slate-50
                        "
                    >

                        <Upload
                            size={42}
                            className="mb-4 text-blue-600"
                        />

                        <p className="font-medium">

                            Chọn file Excel

                        </p>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-2
                            "
                        >

                            .xlsx hoặc .xls

                        </p>

                        <input

                            hidden

                            type="file"

                            accept=".xlsx,.xls"

                            onChange={chooseFile}

                        />

                    </label>

                    {

                        importFile &&

                        <div
                            className="
                                mt-5
                                flex
                                items-center
                                gap-3
                                bg-slate-100
                                rounded-xl
                                p-3
                            "
                        >

                            <FileSpreadsheet
                                className="text-green-600"
                            />

                            <span>

                                {importFile.name}

                            </span>

                        </div>

                    }

                </div>

                {/* Preview */}

                {

                    preview.length > 0 &&

                    <div
                        className="
                            mt-6
                        "
                    >

                        <div
                            className="
                                flex
                                justify-between
                                items-center
                                mb-3
                            "
                        >

                            <h3
                                className="
                                    font-semibold
                                "
                            >

                                Preview

                            </h3>

                            <span
                                className="
                                    text-sm
                                    text-gray-500
                                "
                            >

                                {preview.length} dòng

                            </span>

                        </div>

                        <div
                            className="
                                overflow-auto
                                border
                                rounded-xl
                                max-h-[420px]
                            "
                        >

                            <table
                                className="
                                    min-w-[2200px]
                                    table-auto
                                    text-sm
                                "
                            >

                                <thead
                                    className="
                                        sticky
                                        top-0
                                        bg-slate-100
                                    "
                                >

                                    <tr>

                                        {

                                           columns.map(col => (
                                            
                                                <th
                                                    key={col.key}
                                                    className="px-4 py-3 whitespace-nowrap text-left"
                                                >
                                                    {col.label}
                                                </th>
                                            
                                            ))

                                        }

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        preview.map(

                                            (row, index) => (

                                                <tr
                                                    key={index}
                                                    className="
                                                        border-t
                                                    "
                                                >

                                                    {

                                                       columns.map(col => (

                                                            <td
                                                                key={col.key}
                                                                className="px-4 py-3 whitespace-nowrap"
                                                            >
                                                                {row[col.key] ?? ""}
                                                            </td>
                                                        
                                                        ))

                                                    }

                                                </tr>

                                            )

                                        )

                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>

                }

                {/* Footer */}

                <div
                    className="
                        border-t
                        bg-white
                        px-6
                        py-4
                        flex
                        justify-end
                        gap-3
                        shrink-0
                    "
                >

                    <button

                        onClick={onClose}

                        className="
                            px-5
                            py-2
                            border
                            rounded-xl
                        "

                    >

                        Hủy

                    </button>

                    <button

                        disabled={
                            !importFile ||
                            loading
                        }

                        onClick={onConfirm}

                        className="
                            px-5
                            py-2
                            rounded-xl
                            bg-blue-600
                            text-white
                            disabled:opacity-50
                        "

                    >

                        {

                            loading

                                ? "Đang import..."

                                : "Import"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}
