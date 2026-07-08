import {
    Package,
    Pencil,
    Trash2,
    Eye,
    Warehouse
} from "lucide-react";

import SpareStatus from "./SpareStatus";

export default function SpareCard({

    item,

    role,

    onEdit,

    onDelete,

    onView

}) {

    return (

        <div
            className="
                bg-white
                rounded-2xl
                shadow
                border
                border-gray-200
                p-4
            "
        >

            {/* Header */}

            <div className="flex gap-3">

                <div
                    className="
                        w-16
                        h-16
                        rounded-xl
                        bg-gray-100
                        flex
                        items-center
                        justify-center
                    "
                >

                    {

                        item.image

                        ?

                        <img

                            src={item.image}

                            alt=""

                            className="w-full h-full object-cover rounded-xl"

                        />

                        :

                        <Package
                            size={28}
                            className="text-gray-400"
                        />

                    }

                </div>

                <div className="flex-1">

                    <h3 className="font-bold text-base">

                        {item.name}

                    </h3>

                    <p className="text-sm text-gray-500">

                        ID: {item.deviceId}

                    </p>

                    <div className="mt-2">

                        <SpareStatus
                            status={item.condition}
                        />

                    </div>

                </div>

            </div>

            {/* Kho */}

            <div
                className="
                    mt-4
                    rounded-xl
                    bg-slate-50
                    p-3
                "
            >

                <div className="flex justify-between">

                    <span className="text-gray-500">

                        Kho

                    </span>

                    <span className="font-semibold">

                        {item.warehouse || "-"}

                    </span>

                </div>

                <div className="flex justify-between mt-2">

                    <span className="text-gray-500">

                        Tủ

                    </span>

                    <span>

                        {item.cabinet || "-"}

                    </span>

                </div>

                <div className="flex justify-between mt-2">

                    <span className="text-gray-500">

                        Kệ

                    </span>

                    <span>

                        {item.shelf || "-"}

                    </span>

                </div>

                <div className="flex justify-between mt-2">

                    <span className="text-gray-500">

                        Khay

                    </span>

                    <span>

                        {item.slot || "-"}

                    </span>

                </div>

            </div>

            {/* Inventory */}

            <div
                className="
                    grid
                    grid-cols-4
                    gap-2
                    mt-4
                "
            >

                <div className="text-center">

                    <p className="text-gray-400 text-xs">

                        Ban đầu

                    </p>

                    <p className="font-bold">

                        {item.initialQuantity}

                    </p>

                </div>

                <div className="text-center">

                    <p className="text-gray-400 text-xs">

                        Nhập

                    </p>

                    <p className="font-bold text-blue-600">

                        {item.importQty}

                    </p>

                </div>

                <div className="text-center">

                    <p className="text-gray-400 text-xs">

                        Xuất

                    </p>

                    <p className="font-bold text-red-600">

                        {item.exportQty}

                    </p>

                </div>

                <div className="text-center">

                    <p className="text-gray-400 text-xs">

                        Tồn

                    </p>

                    <p className="font-bold text-green-600">

                        {item.quantity}

                    </p>

                </div>

            </div>

            {/* Footer */}

            <div
                className="
                    flex
                    justify-end
                    gap-2
                    mt-5
                    pt-4
                    border-t
                "
            >

                <button

                    onClick={() => onView(item)}

                    className="
                        p-2
                        rounded-lg
                        bg-slate-100
                    "

                >

                    <Eye size={18}/>

                </button>

                {

                    role==="admin"

                    &&

                    <>

                        <button

                            onClick={() => onEdit(item)}

                            className="
                                p-2
                                rounded-lg
                                bg-blue-100
                                text-blue-600
                            "

                        >

                            <Pencil size={18}/>

                        </button>

                        <button

                            onClick={() => onDelete(item.id)}

                            className="
                                p-2
                                rounded-lg
                                bg-red-100
                                text-red-600
                            "

                        >

                            <Trash2 size={18}/>

                        </button>

                    </>

                }

            </div>

        </div>

    );

}
