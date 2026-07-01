import DeviceStatus from "./DeviceStatus";

export default function DeviceTable({

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

                <table className="min-w-full">

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
                                ID
                            </th>

                            <th className="px-4 py-3 text-left">
                                Tên thiết bị
                            </th>

                            <th className="px-4 py-3 text-left">
                                Phân loại
                            </th>

                            <th className="px-4 py-3 text-left">
                                Tuyến
                            </th>

                            <th className="px-4 py-3 text-left">
                                Nhà ga
                            </th>

                            <th className="px-4 py-3 text-center">
                                Trạng thái
                            </th>

                            <th className="px-4 py-3 text-center">
                                Thao tác
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {data.map(device => (

                            <tr

                                key={device.id}

                                className="
                                    border-t
                                    hover:bg-slate-50
                                    transition
                                "

                            >

                                <td className="px-4 py-3">

                                    {device.deviceId}

                                </td>

                                <td className="px-4 py-3 font-medium">

                                    {device.name}

                                </td>

                                <td className="px-4 py-3">

                                    {device.category}

                                </td>

                                <td className="px-4 py-3">

                                    {device.line}

                                </td>

                                <td className="px-4 py-3">

                                    {device.station}

                                </td>

                                <td className="px-4 py-3 text-center">

                                    <DeviceStatus
                                        status={device.status}
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
                                            onClick={() => onView(device)}
                                        >
                                            👁
                                        </button>

                                        <button
                                            onClick={() => onEdit(device)}
                                        >
                                            ✏
                                        </button>

                                        <button
                                            onClick={() => onDelete(device)}
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
