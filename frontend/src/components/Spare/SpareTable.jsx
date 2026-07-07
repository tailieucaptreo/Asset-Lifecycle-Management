import SpareStatus from "./SpareStatus";

export default function SpareTable({

    data = [],

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
                overflow-hidden
            "
        >

            <div className="overflow-x-auto">

                <table className="min-w-full table-auto">

                    <thead
                        className="
                            bg-slate-100
                            sticky
                            top-0
                            z-10
                        "
                    >

                        <tr>

                            <th className="px-4 py-3 text-left">
                                Mã
                            </th>

                            <th className="px-4 py-3 text-left">
                                Tên thiết bị
                            </th>

                            <th className="px-4 py-3 text-center">
                                SL
                            </th>

                            <th className="px-4 py-3 text-center">
                                Kho
                            </th>

                            <th className="px-4 py-3 text-center">
                                Tủ
                            </th>

                            <th className="px-4 py-3 text-center">
                                Kệ
                            </th>

                            <th className="px-4 py-3 text-center">
                                Tình trạng
                            </th>

                            <th className="px-4 py-3 text-center">
                                Thao tác
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {data.map(item => (

                            <tr

                                key={item.id}

                                className="
                                    border-t
                                    hover:bg-slate-50
                                    transition
                                "

                            >

                                <td className="px-4 py-3">

                                    {item.deviceId}

                                </td>

                                <td className="px-4 py-3 font-medium">

                                    {item.name}

                                </td>

                                <td className="px-4 py-3 text-center">

                                    {item.quantity}

                                </td>

                                <td className="px-4 py-3 text-center">

                                    {item.warehouse}

                                </td>

                                <td className="px-4 py-3 text-center">

                                    {item.cabinet}

                                </td>

                                <td className="px-4 py-3 text-center">

                                    {item.shelf}

                                </td>

                                <td className="px-4 py-3 text-center">

                                    <SpareStatus
                                        status={item.condition}
                                    />

                                </td>

                                <td className="px-4 py-3">

                                    <div
                                        className="
                                            flex
                                            justify-center
                                            gap-2
                                        "
                                    >

                                        <button
                                            onClick={() => onView(item)}
                                        >
                                            👁
                                        </button>

                                        <button
                                            onClick={() => onEdit(item)}
                                        >
                                            ✏
                                        </button>

                                        <button
                                            onClick={() => onDelete(item)}
                                        >
                                            🗑
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}
