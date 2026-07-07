export default function HistoryModal({

    show,

    history,

    onClose

}) {

    if (!show) return null;

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
                    rounded-3xl
                    shadow-2xl
                    w-full
                    max-w-5xl
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
                        px-6
                        py-4
                        border-b
                    "
                >

                    <h2
                        className="
                            text-2xl
                            font-bold
                        "
                    >

                        📜 Lịch sử nhập / xuất

                    </h2>

                    <button

                        onClick={onClose}

                        className="
                            px-4
                            py-2
                            rounded-xl
                            bg-gray-200
                            hover:bg-gray-300
                        "

                    >

                        Đóng

                    </button>

                </div>

                {/* Body */}

                <div
                    className="
                        overflow-auto
                        max-h-[70vh]
                    "
                >

                    <table
                        className="
                            w-full
                            text-sm
                        "
                    >

                        <thead
                            className="
                                bg-slate-100
                                sticky
                                top-0
                            "
                        >

                            <tr>

                                <th className="px-4 py-3 text-left">

                                    Thời gian

                                </th>

                                <th className="px-4 py-3 text-left">

                                    Thiết bị

                                </th>

                                <th className="px-4 py-3 text-center">

                                    Loại

                                </th>

                                <th className="px-4 py-3 text-center">

                                    Số lượng

                                </th>

                                <th className="px-4 py-3 text-left">

                                    Người thực hiện

                                </th>

                                <th className="px-4 py-3 text-left">

                                    Ghi chú

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {history.length > 0 ? (

                                history.map(item => (

                                    <tr
                                        key={item.id}
                                        className="
                                            border-t
                                            hover:bg-slate-50
                                        "
                                    >

                                        <td className="px-4 py-3">

                                            {item.createdAt
                                                ? new Date(item.createdAt)
                                                    .toLocaleString("vi-VN")
                                                : "-"}

                                        </td>

                                        <td className="px-4 py-3">

                                            {item.name}

                                        </td>

                                        <td className="px-4 py-3 text-center">

                                            {item.type}

                                        </td>

                                        <td className="px-4 py-3 text-center">

                                            {item.quantity}

                                        </td>

                                        <td className="px-4 py-3">

                                            {item.editedBy || "-"}

                                        </td>

                                        <td className="px-4 py-3">

                                            {item.note || "-"}

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan={6}
                                        className="
                                            text-center
                                            py-12
                                            text-gray-400
                                        "
                                    >

                                        Chưa có lịch sử

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}
