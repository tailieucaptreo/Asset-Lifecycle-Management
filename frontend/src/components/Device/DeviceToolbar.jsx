import {
    RefreshCw,
    Plus,
    Download,
    Upload,
    History
} from "lucide-react";

export default function DeviceToolbar({

    title,

    onReload,

    onExport,

    onImport,

    onAdd,

    onHistory,

    role


}) {

    return (

        <div
            className="
                flex
                flex-col
                lg:flex-row
                justify-between
                gap-4
                mb-5
            "
        >

            <h1
                className="
                    text-2xl
                    font-bold
                "
            >
                {title}
            </h1>

            <div
                className="
                    flex
                    flex-wrap
                    gap-3
                "
            >

                <button

                    onClick={onReload}

                    className="
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        rounded-lg
                        bg-blue-600
                        text-white
                        hover:bg-blue-700
                    "

                >

                    <RefreshCw size={18} />

                    Reload

                </button>

                {role === "admin" && (

                    <button

                        onClick={onAdd}

                        className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            rounded-lg
                            bg-green-600
                            text-white
                            hover:bg-green-700
                        "

                    >

                        <Plus size={18} />

                        Thêm

                    </button>

                )}

                {role === "admin" && (

                    <button

                        onClick={onImport}

                        className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            rounded-lg
                            bg-amber-500
                            text-white
                            hover:bg-amber-600
                        "

                    >

                        <Upload size={18} />

                        Import

                    </button>

                )}

                <button

                    onClick={onExport}

                    className="
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        rounded-lg
                        bg-slate-700
                        text-white
                        hover:bg-slate-800
                    "

                >

                    <Download size={18} />

                    Export

                </button>

                {

                    onHistory && (

                        <button

                            onClick={onHistory}

                            className="
                                flex
                                items-center
                                gap-2
                                px-4    
                                py-2
                                rounded-lg
                                bg-violet-600
                                text-white
                                hover:bg-violet-700
                            "

                        >

                            <History size={18} />

                            History

                        </button>

                    )

                }

            </div>

        </div>

    );

}
