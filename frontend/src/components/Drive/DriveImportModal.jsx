import { useState } from "react";
import { Upload, X, FileSpreadsheet } from "lucide-react";

export default function DriveImportModal({

    open,

    preview = [],

    loading,

    onClose,

    onUpload,

    onConfirm

}) {

    const [file, setFile] = useState(null);

    if (!open) return null;

    const chooseFile = (e) => {

        if (!e.target.files?.length) return;

        const f = e.target.files[0];

        setFile(f);

        onUpload(f);

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
                    max-h-[90vh]
                    overflow-hidden
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

                <div className="p-6">

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

                        file &&

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

                                {file.name}

                            </span>

                        </div>

                    }

                </div>

                {/* Preview */}

                {

                    preview.length > 0 &&

                    <div
                        className="
                            px-6
                            pb-6
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
                                max-h-80
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
                                    "
                                >

                                    <tr>

                                        {

                                            Object.keys(
                                                preview[0]
                                            ).map(key => (

                                                <th

                                                    key={key}

                                                    className="
                                                        px-3
                                                        py-2
                                                        text-left
                                                    "

                                                >

                                                    {key}

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

                                                        Object.values(
                                                            row
                                                        ).map(

                                                            (value, i) => (

                                                                <td

                                                                    key={i}

                                                                    className="
                                                                        px-3
                                                                        py-2
                                                                    "

                                                                >

                                                                    {String(value)}

                                                                </td>

                                                            )

                                                        )

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
                        px-6
                        py-4
                        flex
                        justify-end
                        gap-3
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
                            !file ||
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
