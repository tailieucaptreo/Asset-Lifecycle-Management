import {
    Search,
    Plus,
    Download,
    Upload,
    History
} from "lucide-react";

export default function DriveToolbar({

    role,

    search,
    setSearch,

    brand,
    setBrand,

    status,
    setStatus,

    line,
    setLine,

    onCreate,
    onImport,
    onExport,
    onHistory

}) {

    return (

        <div
            className="
                bg-white
                rounded-2xl
                shadow
                p-4
                mb-6
            "
        >

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-6
                    gap-3
                "
            >

                {/* Search */}

                <div className="relative xl:col-span-2">

                    <Search
                        size={18}
                        className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            text-gray-400
                        "
                    />

                    <input

                        value={search}

                        onChange={(e) =>
                            setSearch(e.target.value)
                        }

                        placeholder="Tìm biến tần..."

                        className="
                            w-full
                            border
                            rounded-xl
                            pl-10
                            pr-3
                            py-2.5
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "

                    />

                </div>

                {/* Brand */}

                <select

                    value={brand}

                    onChange={(e) =>
                        setBrand(e.target.value)
                    }

                    className="
                        border
                        rounded-xl
                        px-3
                        py-2.5
                    "

                >

                    <option value="All">

                        Tất cả hãng

                    </option>

                    <option value="ABB">

                        ABB

                    </option>

                    <option value="VACON">

                        VACON

                    </option>

                </select>

                {/* Status */}

                <select

                    value={status}

                    onChange={(e) =>
                        setStatus(e.target.value)
                    }

                    className="
                        border
                        rounded-xl
                        px-3
                        py-2.5
                    "

                >

                    <option value="All">

                        Tất cả trạng thái

                    </option>

                    <option value="Running">

                        Running

                    </option>

                    <option value="Maintenance">

                        Maintenance

                    </option>

                    <option value="Fault">

                        Fault

                    </option>

                    <option value="Offline">

                        Offline

                    </option>

                </select>

                {/* Line */}

                <input

                    value={line}

                    onChange={(e) =>
                        setLine(e.target.value)
                    }

                    placeholder="Tuyến"

                    className="
                        border
                        rounded-xl
                        px-3
                        py-2.5
                    "

                />

            </div>

            {/* Buttons */}

            <div
                className="
                    flex
                    flex-wrap
                    gap-3
                    mt-4
                    justify-end
                "
            >

                <button

                    onClick={onHistory}

                    className="
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2.5
                        rounded-xl
                        bg-slate-100
                        hover:bg-slate-200
                    "

                >

                    <History size={18}/>

                    Lịch sử lỗi

                </button>

                <button

                    onClick={onExport}

                    className="
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2.5
                        rounded-xl
                        bg-green-600
                        text-white
                        hover:bg-green-700
                    "

                >

                    <Download size={18}/>

                    Export

                </button>

                <label
                    className="
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2.5
                        rounded-xl
                        bg-amber-500
                        text-white
                        hover:bg-amber-600
                        cursor-pointer
                    "
                >

                    <Upload size={18}/>

                    Import

                    <input

                        type="file"

                        accept=".xlsx,.xls"

                        hidden

                        onChange={(e) => {

                            if (e.target.files?.length) {

                                onImport(
                                    e.target.files[0]
                                );

                            }

                        }}

                    />

                </label>

                {

                    role === "admin"

                    &&

                    <button

                        onClick={onCreate}

                        className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2.5
                            rounded-xl
                            bg-blue-600
                            text-white
                            hover:bg-blue-700
                        "

                    >

                        <Plus size={18}/>

                        Thêm biến tần

                    </button>

                }

            </div>

        </div>

    );

}
