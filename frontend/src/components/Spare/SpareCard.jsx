import { Eye, Pencil, Trash2, Package } from "lucide-react";
import SpareStatus from "./SpareStatus";

export default function SpareCard({

    item,

    role,

    onView,

    onEdit,

    onDelete

}) {

    return (

        <div
            className="
                bg-white
                rounded-2xl
                shadow
                p-5
                border
                border-slate-200
            "
        >

            {/* Header */}

            <div className="flex justify-between items-start">

                <div className="flex items-center gap-3">

                    <div
                        className="
                            w-14
                            h-14
                            rounded-xl
                            bg-blue-100
                            flex
                            items-center
                            justify-center
                        "
                    >

                        <Package
                            size={28}
                            className="text-blue-600"
                        />

                    </div>

                    <div>

                        <h2 className="font-bold text-lg">

                            {item.name}

                        </h2>

                        <p className="text-gray-500 text-sm">

                            {item.deviceId}

                        </p>

                    </div>

                </div>

                <SpareStatus
                    status={item.condition}
                />

            </div>

            {/* Body */}

            <div
                className="
                    mt-5
                    grid
                    grid-cols-2
                    gap-y-3
                    text-sm
                "
            >

                <div>

                    <span className="text-gray-500">

                        Số lượng

                    </span>

                    <p className="font-semibold">

                        {item.quantity}

                    </p>

                </div>

                <div>

                    <span className="text-gray-500">

                        Kho

                    </span>

                    <p className="font-semibold">

                        {item.warehouse || "-"}

                    </p>

                </div>

                <div>

                    <span className="text-gray-500">

                        Tủ

                    </span>

                    <p className="font-semibold">

                        {item.cabinet || "-"}

                    </p>

                </div>

                <div>

                    <span className="text-gray-500">

                        Kệ

                    </span>

                    <p className="font-semibold">

                        {item.shelf || "-"}

                    </p>

                </div>

            </div>

            {/* Footer */}

            <div
                className="
                    mt-6
                    flex
                    justify-end
                    gap-2
                "
            >

                <button
                    onClick={() => onView(item)}
                    className="
                        p-2
                        rounded-lg
                        bg-blue-100
                        hover:bg-blue-200
                    "
                >

                    <Eye size={18} />

                </button>

                {role === "admin" && (

                    <>

                        <button
                            onClick={() => onEdit(item)}
                            className="
                                p-2
                                rounded-lg
                                bg-yellow-100
                                hover:bg-yellow-200
                            "
                        >

                            <Pencil size={18} />

                        </button>

                        <button
                            onClick={() => onDelete(item)}
                            className="
                                p-2
                                rounded-lg
                                bg-red-100
                                hover:bg-red-200
                            "
                        >

                            <Trash2 size={18} />

                        </button>

                    </>

                )}

            </div>

        </div>

    );

}
