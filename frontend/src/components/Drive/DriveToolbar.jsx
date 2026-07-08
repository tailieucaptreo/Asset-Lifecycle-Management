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
                    flex
                    flex-col
                    xl:flex-row
                    xl:items-center
                    xl:justify-between
                    gap-4
                "
            >
            
                {/* Left */}
            
                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                        flex-1
                    "
                >
            
                    {/* Search */}
            
                    <div className="relative flex-1 min-w-[260px]">
            
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

                </div>    
            
                {/* Right */}
            
                <div
                    className="
                        flex
                        flex-wrap
                        gap-3
                        justify-end
                    "
                >
            
                    <button
            
                        onClick={onHistory}
            
                        className="
                            h-11
                            flex
                            items-center
                            gap-2
                            px-4
                            rounded-xl
                            bg-slate-100
                            hover:bg-slate-200
                        "
            
                    >
            
                        <History size={18} />
            
                        Lịch sử lỗi
            
                    </button>
            
                    <button
            
                        onClick={onExport}
            
                        className="
                            h-11
                            flex
                            items-center
                            gap-2
                            px-4
                            rounded-xl
                            bg-green-600
                            text-white
                            hover:bg-green-700
                        "
            
                    >
            
                        <Download size={18} />
            
                        Export
            
                    </button>
            
                    <label
                        className="
                            h-11
                            flex
                            items-center
                            gap-2
                            px-4
                            rounded-xl
                            bg-amber-500
                            text-white
                            hover:bg-amber-600
                            cursor-pointer
                        "
                    >
            
                        <Upload size={18} />
            
                        Import
            
                        <input
            
                            type="file"
            
                            hidden
            
                            accept=".xlsx,.xls"
            
                            onChange={(e) => {
            
                                if (e.target.files?.length) {
            
                                    onImport(e.target.files[0]);
            
                                }
            
                            }}
            
                        />
            
                    </label>
            
                    {
            
                        role === "admin" && (
            
                            <button
            
                                onClick={onCreate}
            
                                className="
                                    h-11
                                    flex
                                    items-center
                                    gap-2
                                    px-5
                                    rounded-xl
                                    bg-blue-600
                                    text-white
                                    hover:bg-blue-700
                                "
            
                            >
            
                                <Plus size={18} />
            
                                Thêm biến tần
            
                            </button>
            
                        )
            
                    }
            
                </div>
            
            </div>
            
       </div>     

    );

}
