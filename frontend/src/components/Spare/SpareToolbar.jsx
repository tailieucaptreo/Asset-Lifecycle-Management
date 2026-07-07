import { Search } from "lucide-react";

export default function SpareToolbar({

    keyword,

    setKeyword,

    onReload,

    onImport,

    onExport,

    role

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
                    flex
                    flex-col
                    lg:flex-row
                    gap-4
                "
            >

                <div className="relative flex-1">

                    <Search
                        size={18}
                        className="
                            absolute
                            left-4
                            top-3.5
                            text-gray-400
                        "
                    />

                    <input

                        value={keyword}

                        onChange={(e)=>setKeyword(e.target.value)}

                        placeholder="Tìm thiết bị dự phòng..."

                        className="
                            w-full
                            pl-11
                            pr-4
                            py-3
                            border
                            rounded-xl
                        "

                    />

                </div>

                <button

                    onClick={onReload}

                    className="
                        px-5
                        rounded-xl
                        bg-slate-200
                        hover:bg-slate-300
                    "

                >

                    🔄 Reload

                </button>

                <button

                    onClick={onExport}

                    className="
                        px-5
                        rounded-xl
                        bg-green-600
                        hover:bg-green-700
                        text-white
                    "

                >

                    Export

                </button>

                {role === "admin" && (

                    <button

                        onClick={onImport}

                        className="
                            px-5
                            rounded-xl
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                        "

                    >

                        Import

                    </button>

                )}

            </div>

        </div>

    );

}
