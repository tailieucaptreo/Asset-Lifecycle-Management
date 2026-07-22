import {
    Search,
    Plus,
    Upload,
    Download,
    History
} from "lucide-react";

export default function MotorToolbar({

    search,
    setSearch,

    onAdd,

    onImport,

    onExport,

    onHistory

}) {

    const role =
        localStorage.getItem("role");

    return (

        <div
            className="
                bg-white
                rounded-2xl
                shadow
                border
                border-slate-200
                p-4
                mb-5
            "
        >

            <div
                className="
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-4
                "
            >

                {/* SEARCH */}

                <div
                    className="
                        relative
                        flex-1
                    "
                >

                    <Search
                        size={18}
                        className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            text-slate-400
                        "
                    />

                    <input

                        type="text"

                        value={search}

                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }

                        placeholder="
Tìm theo tên, model, serial, hãng..."

                        className="
                            w-full
                            border
                            border-slate-300
                            rounded-xl
                            pl-10
                            pr-4
                            py-2.5
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            focus:border-blue-500
                            transition
                        "

                    />

                </div>

                {/* ACTION */}

                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                    "
                >

                    {/* ADD */}

                    {role === "admin" && (

                        <button

                            onClick={onAdd}

                            className="
                                flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                px-4
                                py-2.5
                                transition
                            "

                        >

                            <Plus size={18} />

                            <span className="hidden sm:inline">
                                Thêm
                            </span>

                        </button>

                    )}

                    {/* IMPORT */}

                    {role === "admin" && (

                        <button

                            onClick={onImport}

                            className="
                                flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-emerald-600
                                hover:bg-emerald-700
                                text-white
                                px-4
                                py-2.5
                                transition
                            "

                        >

                            <Upload size={18} />

                            <span className="hidden sm:inline">
                                Import
                            </span>

                        </button>

                    )}

                    {/* EXPORT */}

                    <button

                        onClick={onExport}

                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-amber-500
                            hover:bg-amber-600
                            text-white
                            px-4
                            py-2.5
                            transition
                        "

                    >

                        <Download size={18} />

                        <span className="hidden sm:inline">
                            Export
                        </span>

                    </button>

                    {/* HISTORY */}

                    <button

                        onClick={onHistory}

                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-slate-700
                            hover:bg-slate-800
                            text-white
                            px-4
                            py-2.5
                            transition
                        "

                    >

                        <History size={18} />

                        <span className="hidden sm:inline">
                            History
                        </span>

                    </button>

                </div>

            </div>

        </div>

    );

}
