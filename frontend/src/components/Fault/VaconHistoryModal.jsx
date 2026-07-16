import { X } from "lucide-react";

export default function VaconHistoryModal({

    open,

    device,

    histories = [],

    loading,

    onClose

}) {

    if (!open) return null;

    return (

        <div
            className="
                fixed
                inset-0
                z-50
                bg-black/50
                overflow-y-auto
                p-2
                md:p-6
            "
        >

            <div
                className="
                    min-h-full
                    flex
                    items-start
                    md:items-center
                    justify-center
                    py-3
                    md:py-6
                "
            >

                <div
                    className="
                        w-full
                        max-w-6xl
                        bg-white
                        rounded-2xl
                        shadow-2xl
                        flex
                        flex-col
                        max-h-[88vh]
                        md:max-h-[92vh]
                        animate-in
                        fade-in
                        zoom-in-95
                    "
                >

                    {/* HEADER */}

                    <div
                        className="
                            sticky
                            top-0
                            z-30
                            bg-white
                            border-b
                            px-4
                            md:px-6
                            py-4
                            flex
                            justify-between
                            items-start
                        "
                    >

                        <div>

                            <h2
                                className="
                                    text-xl
                                    md:text-2xl
                                    font-bold
                                "
                            >

                                Lịch sử lỗi VACON

                            </h2>

                            {

                                device &&

                                <div
                                    className="
                                        mt-2
                                        text-xs
                                        md:text-sm
                                        text-gray-500
                                        space-y-1
                                    "
                                >

                                    <div>

                                        <b>Thiết bị:</b>{" "}

                                        {device.deviceName}

                                    </div>

                                    <div>

                                        <b>Serial:</b>{" "}

                                        {device.serialNumber}

                                    </div>

                                    <div>

                                        <b>Station:</b>{" "}

                                        {device.station || "-"}

                                    </div>

                                </div>

                            }

                        </div>

                        <button

                            onClick={onClose}

                            className="
                                p-1
                                rounded-lg
                                hover:bg-slate-100
                                hover:text-red-600
                            "

                        >

                            <X size={28} />

                        </button>

                    </div>

                    {/* BODY */}

                    <div
                        className="
                            flex-1
                            overflow-y-auto
                            overscroll-contain
                        "
                    >

                        {

                            loading ?

                                (

                                    <div className="p-10 text-center">

                                        Đang tải dữ liệu...

                                    </div>

                                )

                                :

                                histories.length === 0 ?

                                    (

                                        <div
                                            className="
                                                p-10
                                                text-center
                                                text-gray-500
                                            "
                                        >

                                            Chưa có lịch sử.

                                        </div>

                                    )

                                    :

                                    <>

                                        {/* DESKTOP */}

                                        <div className="hidden md:block">

                                            <table
                                                className="
                                                    w-full
                                                    text-sm
                                                "
                                            >

                                                <thead
                                                    className="
                                                        sticky
                                                        top-0
                                                        bg-yellow-300
                                                        z-20
                                                    "
                                                >

                                                    <tr>

                                                        <th className="px-3 py-3">STT</th>

                                                        <th className="px-3 py-3">Ngày</th>

                                                        <th className="px-3 py-3">Operation Hours</th>

                                                        <th className="px-3 py-3">Power Unit</th>

                                                        <th className="px-3 py-3">Fault</th>

                                                        <th className="px-3 py-3">Description</th>

                                                        <th className="px-3 py-3">Cause</th>

                                                        <th className="px-3 py-3">Corrective</th>

                                                        <th className="px-3 py-3">Note</th>

                                                    </tr>

                                                </thead>

                                                <tbody>

                                                    {

                                                        histories.map((h, index) => (

                                                            <tr
                                                                key={h.id}
                                                                className="
                                                                    border-t
                                                                    align-top
                                                                "
                                                            >

                                                                <td className="px-3 py-3 text-center">

                                                                    {index + 1}

                                                                </td>

                                                                <td className="px-3 py-3">

                                                                    {

                                                                        h.recordDate

                                                                            ?

                                                                            new Date(

                                                                                h.recordDate

                                                                            ).toLocaleDateString("vi-VN")

                                                                            :

                                                                            "-"

                                                                    }

                                                                </td>

                                                                <td className="px-3 py-3">

                                                                    {h.operationHours || "-"}

                                                                </td>

                                                                <td className="px-3 py-3">

                                                                    {h.powerUnitDate || "-"}

                                                                </td>

                                                                <td className="px-3 py-3 whitespace-pre-wrap">

                                                                    {h.faultHistory || "-"}

                                                                </td>

                                                                <td className="px-3 py-3 whitespace-pre-wrap">

                                                                    {h.description || "-"}

                                                                </td>

                                                                <td className="px-3 py-3 whitespace-pre-wrap">

                                                                    {h.possibleCause || "-"}

                                                                </td>

                                                                <td className="px-3 py-3 whitespace-pre-wrap">

                                                                    {h.correctiveActions || "-"}

                                                                </td>

                                                                <td className="px-3 py-3 whitespace-pre-wrap">

                                                                    {h.note || "-"}

                                                                </td>

                                                            </tr>

                                                        ))

                                                    }

                                                </tbody>

                                            </table>

                                        </div>

                                        {/* MOBILE */}

                                        <div
                                            className="
                                                md:hidden
                                                p-3
                                                space-y-4
                                            "
                                        >

                                            {

                                                histories.map((h, index) => (

                                                    <div
                                                        key={h.id}
                                                        className="
                                                            bg-white
                                                            rounded-2xl
                                                            border
                                                            shadow
                                                            p-4
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                justify-between
                                                                items-center
                                                                mb-4
                                                            "
                                                        >

                                                            <div className="font-bold text-lg">

                                                                Lỗi #{index + 1}

                                                            </div>

                                                            <div className="text-xs text-gray-500">

                                                                {

                                                                    h.recordDate

                                                                        ?

                                                                        new Date(

                                                                            h.recordDate

                                                                        ).toLocaleDateString("vi-VN")

                                                                        :

                                                                        "-"

                                                                }

                                                            </div>

                                                        </div>

                                                        <div className="space-y-4 text-sm">

                                                            <Item
                                                                title="Operation Hours"
                                                                value={h.operationHours}
                                                            />

                                                            <Item
                                                                title="Power Unit"
                                                                value={h.powerUnitDate}
                                                            />

                                                            <Item
                                                                title="Fault"
                                                                value={h.faultHistory}
                                                            />

                                                            <Item
                                                                title="Description"
                                                                value={h.description}
                                                            />

                                                            <Item
                                                                title="Possible Cause"
                                                                value={h.possibleCause}
                                                            />

                                                            <Item
                                                                title="Corrective Action"
                                                                value={h.correctiveActions}
                                                            />

                                                            {

                                                                h.note &&

                                                                <Item
                                                                    title="Note"
                                                                    value={h.note}
                                                                />

                                                            }

                                                        </div>

                                                    </div>

                                                ))

                                            }

                                        </div>

                                    </>

                        }

                    </div>

                </div>

            </div>

        </div>

    );

}

function Item({

    title,

    value

}) {

    return (

        <div>

            <div className="font-semibold">

                {title}

            </div>

            <div
                className="
                    whitespace-pre-wrap
                    text-gray-700
                "
            >

                {value || "-"}

            </div>

        </div>

    );

}