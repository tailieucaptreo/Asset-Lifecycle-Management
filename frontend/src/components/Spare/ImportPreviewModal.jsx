export default function ImportPreviewModal({

    show,

    previewData = [],

    onClose,

    onImport

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
                    max-w-7xl
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
                        border-b
                        px-6
                        py-4
                    "
                >

                    <div>

                        <h2
                            className="
                                text-2xl
                                font-bold
                            "
                        >

                            📄 Xem trước dữ liệu Import

                        </h2>

                        <p className="text-gray-500 mt-1">

                            Tổng cộng: {previewData.length} dòng

                        </p>

                    </div>

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
                        max-h-[65vh]
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

                                <th className="px-3 py-3">
                                    #
                                </th>

                                <th className="px-3 py-3 text-left">
                                    Tên
                                </th>

                                <th className="px-3 py-3">
                                    Mã
                                </th>

                                <th className="px-3 py-3">
                                    Kho
                                </th>

                                <th className="px-3 py-3">
                                    Tủ
                                </th>

                                <th className="px-3 py-3">
                                    Kệ
                                </th>

                                <th className="px-3 py-3">
                                    SL
                                </th>

                                <th className="px-3 py-3">
                                    ĐVT
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {previewData.length > 0 ? (

                                previewData.map((item,index)=>(

                                    <tr

                                        key={index}

                                        className="
                                            border-t
                                            hover:bg-slate-50
                                        "

                                    >

                                        <td className="px-3 py-2">

                                            {index+1}

                                        </td>

                                        <td className="px-3 py-2">

                                            {item.name}

                                        </td>

                                        <td className="px-3 py-2">

                                            {item.deviceId}

                                        </td>

                                        <td className="px-3 py-2">

                                            {item.warehouse}

                                        </td>

                                        <td className="px-3 py-2">

                                            {item.cabinet}

                                        </td>

                                        <td className="px-3 py-2">

                                            {item.shelf}

                                        </td>

                                        <td className="px-3 py-2 text-center">

                                            {item.quantity}

                                        </td>

                                        <td className="px-3 py-2 text-center">

                                            {item.unit}

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan={8}
                                        className="
                                            text-center
                                            py-16
                                            text-gray-400
                                        "
                                    >

                                        Không có dữ liệu

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

                {/* Footer */}

                <div
                    className="
                        flex
                        justify-end
                        gap-3
                        border-t
                        p-5
                    "
                >

                    <button

                        onClick={onClose}

                        className="
                            px-5
                            py-3
                            rounded-xl
                            bg-gray-200
                        "

                    >

                        Hủy

                    </button>

                    <button

                        onClick={onImport}

                        className="
                            px-5
                            py-3
                            rounded-xl
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                        "

                    >

                        Xác nhận Import

                    </button>

                </div>

            </div>

        </div>

    );

}
