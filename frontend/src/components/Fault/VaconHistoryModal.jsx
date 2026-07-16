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
                bg-black/50
                z-50
                flex
                items-center
                justify-center
                p-2
                md:p-4
            "
        >

            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow-xl
                    w-full
                    max-w-6xl
                    max-h-[95vh]
                    flex
                    flex-col
                    overflow-hidden
                "
            >

                {/* Header */}

                <div
                    className="
                        flex
                        justify-between
                        items-start
                        border-b
                        px-4
                        md:px-6
                        py-4
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

                                    <b>Thiết bị:</b> {device.deviceName}

                                </div>

                                <div>

                                    <b>Serial:</b> {device.serialNumber}

                                </div>

                                <div>

                                    <b>Station:</b> {device.station || "-"}

                                </div>

                            </div>

                        }

                    </div>

                    <button

                        onClick={onClose}

                        className="hover:text-red-600"

                    >

                        <X size={28} />

                    </button>

                </div>

                {/* Body */}

                <div
                    className="
                        flex-1
                        overflow-auto
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

                                    <div className="p-10 text-center text-gray-500">

                                        Chưa có lịch sử.

                                    </div>

                                )

                                :

                                <>

                                    {/* ================= Desktop ================= */}

                                    <div className="hidden md:block">

                                        <table className="w-full text-sm">

                                            <thead
                                                className="
                                                    sticky
                                                    top-0
                                                    bg-yellow-300
                                                    z-10
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
                                                            className="border-t align-top"
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

                                    {/* ================= Mobile ================= */}

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
                                                        rounded-xl
                                                        border
                                                        shadow-sm
                                                        p-4
                                                        bg-white
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            justify-between
                                                            items-center
                                                            mb-3
                                                        "
                                                    >

                                                        <div className="font-bold">

                                                            Lần #{index + 1}

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

                                                    <div className="space-y-3 text-sm">

                                                        <div>

                                                            <b>Operation Hours</b>

                                                            <div>{h.operationHours || "-"}</div>

                                                        </div>

                                                        <div>

                                                            <b>Power Unit</b>

                                                            <div>{h.powerUnitDate || "-"}</div>

                                                        </div>

                                                        <div>

                                                            <b>Fault</b>

                                                            <div className="whitespace-pre-wrap">

                                                                {h.faultHistory || "-"}

                                                            </div>

                                                        </div>

                                                        <div>

                                                            <b>Description</b>

                                                            <div className="whitespace-pre-wrap">

                                                                {h.description || "-"}

                                                            </div>

                                                        </div>

                                                        <div>

                                                            <b>Possible Cause</b>

                                                            <div className="whitespace-pre-wrap">

                                                                {h.possibleCause || "-"}

                                                            </div>

                                                        </div>

                                                        <div>

                                                            <b>Corrective Action</b>

                                                            <div className="whitespace-pre-wrap">

                                                                {h.correctiveActions || "-"}

                                                            </div>

                                                        </div>

                                                        {

                                                            h.note &&

                                                            <div>

                                                                <b>Note</b>

                                                                <div className="whitespace-pre-wrap">

                                                                    {h.note}

                                                                </div>

                                                            </div>

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

    );

}