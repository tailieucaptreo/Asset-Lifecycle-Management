import { Package, Eye, Pencil, Trash2 } from "lucide-react";
import SpareStatus from "./SpareStatus";

export default function SpareRow({

    item,

    role,

    onView,

    onEdit,

    onDelete

}) {

    return (

        <tr
            className="
                border-b
                hover:bg-gray-50
                transition
            "
        >

            {/* IMAGE */}

            <td className="px-2 py-3">

                {item.image ? (

                    <img

                        src={item.image}

                        alt=""

                        className="
                            w-10
                            h-10
                            rounded-2xl
                            object-cover
                            border
                        "

                    />

                ) : (

                    <div
                        className="
                            w-10
                            h-10
                            rounded-2xl
                            bg-gray-100
                            flex
                            items-center
                            justify-center
                        "
                    >

                        <Package size={24} />

                    </div>

                )}

            </td>

            <td className="px-3 py-3 font-semibold min-w-[250px]">

                {item.name || "-"}

            </td>

            <td className="px-3 py-3">

                {item.deviceId || "-"}

            </td>

            <td className="px-3 py-3 text-center">

                <SpareStatus
                    status={item.condition}
                />

            </td>

            <td className="px-2 py-3 text-center">

                {item.warehouse || "-"}

            </td>

            <td className="px-2 py-3 text-center">

                {item.cabinet || "-"}

            </td>

            <td className="px-2 py-3 text-center">

                {item.shelf || "-"}

            </td>

            <td className="px-2 py-3 text-center">

                {item.slot || "-"}

            </td>

            <td className="px-2 py-3 text-center font-bold">

                {item.initialQuantity || 0}

            </td>

            <td className="px-2 py-3 text-center font-bold text-blue-600">

                {item.importQty || 0}

            </td>

            <td className="px-2 py-3 text-center font-bold text-red-500">

                {item.exportQty || 0}

            </td>

            <td className="px-2 py-3 text-center font-bold text-green-700">

                {item.quantity || 0}

            </td>

            <td className="px-2 py-3 text-center">

                {item.unit || "Cái"}

            </td>

            <td className="px-3 py-3">

                <div
                    className="
                        flex
                        items-center
                        justify-center
                        gap-4
                    "
                >

                    <button

                        onClick={() => onView(item)}
                    
                        className="
                            w-9
                            h-9
                            rounded-lg
                            bg-gray-100
                            hover:bg-gray-200
                            flex
                            items-center
                            justify-center
                        "
                    
                    >
                    
                        <Eye
                            size={18}
                            className="text-gray-600"
                        />
                    
                    </button>
                    
                    <button

                        onClick={() => onEdit(item)}

                        className="
                            w-9
                            h-9
                            rounded-xl
                            bg-blue-50
                            text-blue-500
                            hover:bg-blue-100
                        "

                    >

                        <Pencil size={18} />

                    </button>

                    {role === "admin" && (

                        <button

                            onClick={() => onDelete(item.id)}

                            className="
                                w-9
                                h-9
                                rounded-xl
                                bg-red-50
                                text-red-500
                                hover:bg-red-100
                            "

                        >

                            <Trash2 size={18} />

                        </button>

                    )}

                </div>

            </td>

        </tr>

    );

}
