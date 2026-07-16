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
                p-4
            "
        >

            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow-xl
                    w-full
                    max-w-6xl
                    max-h-[90vh]
                    overflow-hidden
                "
            >

                {/* Header */}

                <div
                    className="
                        flex
                        justify-between
                        items-center
                        border-b
                        px-6
                        py-4
                    "
                >

                    <div>

                        <h2 className="text-2xl font-bold">

                            Lịch sử lỗi VACON

                        </h2>

                        {

                            device &&

                            <div className="mt-2 text-sm text-gray-500">

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
                        overflow-auto
                        max-h-[75vh]
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

                                (

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

                                                <th className="px-3 py-3">

                                                    STT

                                                </th>

                                                <th className="px-3 py-3">

                                                    Ngày

                                                </th>

                                                <th className="px-3 py-3">

                                                    Operation Hours

                                                </th>

                                                <th className="px-3 py-3">

                                                    Power Unit

                                                </th>

                                                <th className="px-3 py-3">

                                                    Fault

                                                </th>

                                                <th className="px-3 py-3">

                                                    Description

                                                </th>

                                                <th className="px-3 py-3">

                                                    Cause

                                                </th>

                                                <th className="px-3 py-3">

                                                    Corrective

                                                </th>

                                                <th className="px-3 py-3">

                                                    Note

                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {

                                                histories.map((h, index) => (

                                                    <tr

                                                        key={h.id}

                                                        className="border-t"

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

                                )

                    }

                </div>

            </div>

        </div>

    );

}