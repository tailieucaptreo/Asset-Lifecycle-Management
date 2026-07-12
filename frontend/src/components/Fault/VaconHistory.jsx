import { useState } from "react";

import {

    Eye,
    Pencil,
    Trash2

} from "lucide-react";

import VaconDetailModal from "./VaconDetailModal";

export default function VaconHistory({

    role,

    records = [],

    loading,

    onView,

    onEdit,

    onDelete

}) {

    if (loading) {

        return (

            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow
                    p-8
                    text-center
                "
            >

                Đang tải dữ liệu...

            </div>

        );

    }

    return (

        <>

            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow
                    overflow-hidden
                "
            >

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
                                    Record Date
                                </th>

                                <th className="px-3 py-3">
                                    Station
                                </th>

                                <th className="px-3 py-3">
                                    Tandem
                                </th>

                                <th className="px-3 py-3">
                                    Device Name
                                </th>

                                <th className="px-3 py-3">
                                    Serial Number
                                </th>

                                <th className="px-3 py-3">
                                    Operation Hours
                                </th>

                                <th className="px-3 py-3">
                                    Note
                                </th>

                                <th className="px-3 py-3 text-center">
                                    Thao tác
                                </th>

                            </tr>

                        </thead>

                        <tbody>
                          {

                            records.map((item, index) => (

                                <tr

                                    key={item.id}

                                    className="
                                        border-t
                                        hover:bg-slate-50
                                    "

                                >

                                    <td className="px-3 py-3 text-center">

                                        {index + 1}

                                    </td>

                                    <td className="px-3 py-3 whitespace-nowrap">

                                        {

                                            item.recordDate

                                                ? new Date(

                                                    item.recordDate

                                                ).toLocaleDateString("vi-VN")

                                                : "-"

                                        }

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.station || "-"}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.tandem || "-"}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.deviceName || "-"}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.serialNumber || "-"}

                                    </td>

                                    <td className="px-3 py-3">

                                        {item.operationHours || "-"}

                                    </td>

                                    <td

                                        className="
                                            px-3
                                            py-3
                                            max-w-[220px]
                                            truncate
                                        "

                                    >

                                        {item.note || "-"}

                                    </td>

                                    <td className="px-3 py-3">

                                        <div

                                            className="
                                                flex
                                                justify-center
                                                gap-2
                                            "

                                        >

                                            <button

                                                onClick={() => 

                                                    onView?.(item);

                                                }

                                                className="
                                                    text-blue-600
                                                    hover:text-blue-800
                                                "

                                            >

                                                <Eye size={18} />

                                            </button>

                                            {

                                                role === "admin" &&

                                                <>

                                                    <button

                                                        onClick={() =>{

                                                            onEdit(item)

                                                        }}

                                                        className="
                                                            text-amber-600
                                                            hover:text-amber-800
                                                        "

                                                    >

                                                        <Pencil size={18} />

                                                    </button>

                                                    <button

                                                        onClick={() =>

                                                            onDelete(item)

                                                        }

                                                        className="
                                                            text-red-600
                                                            hover:text-red-800
                                                        "

                                                    >

                                                        <Trash2 size={18} />

                                                    </button>

                                                </>

                                            }

                                        </div>

                                    </td>

                                </tr>

                            ))

                        }

                        {

                            records.length === 0 &&

                            <tr>

                                <td

                                    colSpan={9}

                                    className="
                                        py-10
                                        text-center
                                        text-gray-500
                                    "

                                >

                                    Không có dữ liệu.

                                </td>

                            </tr>

                        }

                    </tbody>

                </table>

            </div>

        </div>

        </>

    );

}
