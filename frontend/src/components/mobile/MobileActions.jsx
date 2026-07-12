import {
    Eye,
    Pencil,
    Trash2
} from "lucide-react";

export default function MobileActions({

    role,

    item,

    onView,

    onEdit,

    onDelete

}) {

    return (

        <div
            className="
                flex
                items-center
                justify-end
                gap-3
            "
        >

            {/* View */}

            <button

                onClick={() => onView?.(item)}

                className="
                    w-10
                    h-10
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                    hover:bg-blue-100
                    transition
                    flex
                    items-center
                    justify-center
                "

                title="Xem"

            >

                <Eye size={20} />

            </button>

            {

                role === "admin" &&

                <>

                    {/* Edit */}

                    <button

                        onClick={() => onEdit?.(item)}

                        className="
                            w-10
                            h-10
                            rounded-xl
                            bg-amber-50
                            text-amber-600
                            hover:bg-amber-100
                            transition
                            flex
                            items-center
                            justify-center
                        "

                        title="Chỉnh sửa"

                    >

                        <Pencil size={20} />

                    </button>

                    {/* Delete */}

                    <button

                        onClick={() => onDelete?.(item)}

                        className="
                            w-10
                            h-10
                            rounded-xl
                            bg-red-50
                            text-red-600
                            hover:bg-red-100
                            transition
                            flex
                            items-center
                            justify-center
                        "

                        title="Xóa"

                    >

                        <Trash2 size={20} />

                    </button>

                </>

            }

        </div>

    );

}
