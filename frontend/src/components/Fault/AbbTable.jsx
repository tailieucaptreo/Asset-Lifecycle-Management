import {
    Eye,
    Pencil,
    Trash2
} from "lucide-react";

import { useState } from "react";

import AbbCard from "../mobile/AbbCard";

import AbbDetailModal from "./AbbDetailModal";

export default function AbbTable({

    role,

    records = [],

    loading,

    onView,

    onEdit,

    onDelete

}) {

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    if (loading) {

        return (

            <div className="bg-white rounded-2xl shadow p-8 text-center">

                Đang tải dữ liệu...

            </div>

        );

    }

    return (

        <>

            <div
                className="
                    hidden
                    md:block
                    bg-white
                    rounded-2xl
                    shadow
                    overflow-hidden
                "
            >

                <div className="overflow-auto max-h-[70vh]">

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
                                bg-slate-100
                                z-10
                            "
                        >

                            <tr>

                                <th className="px-3 py-3 text-left">
                                    STT
                                </th>

                                <th className="px-3 py-3 text-left">
                                    Type Code
                                </th>

                                <th className="px-3 py-3 text-left">
                                    Serial Number
                                </th>

                                <th className="px-3 py-3 text-left">
                                    Tuyến
                                </th>

                                <th className="px-3 py-3 text-left">
                                    Nhà ga
                                </th>

                                <th className="px-3 py-3 text-left">
                                    Tình trạng
                                </th>

                                <th className="px-3 py-3 text-left">
                                    Ngày bảo dưỡng
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

                                        <td className="px-3 py-3">

                                            {index + 1}

                                        </td>

                                        <td className="px-3 py-3">

                                            {item.typeCode}

                                        </td>

                                        <td className="px-3 py-3">

                                            {item.serialNumber}

                                        </td>

                                        <td className="px-3 py-3">

                                            {item.line}

                                        </td>

                                        <td className="px-3 py-3">

                                            {item.station}

                                        </td>

                                        <td className="px-3 py-3">

                                            {item.currentStatus}

                                        </td>

                                        <td className="px-3 py-3 max-w-[220px]">

                                            {
                                                item.lastMaintenance
                                                    ? new Date(item.lastMaintenance).toLocaleDateString("vi-VN")
                                                    : "-"
                                            }

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
                                                    onClick={() => {
                                                        setSelected(item);
                                                        setOpen(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >

                                                    <Eye size={18} />

                                                </button>

                                                {

                                                    role === "admin" &&

                                                    <>

                                                        <button

                                                            onClick={() => onEdit(item)}

                                                            className="text-amber-600"

                                                        >

                                                            <Pencil size={18} />

                                                        </button>

                                                        <button

                                                            onClick={() => onDelete(item)}

                                                            className="text-red-600"

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

                        </tbody>

                    </table>

                </div>

            </div>

            {/* Mobile */}

            <div
                className="
                md:hidden
                space-y-4
            "
            >

                {

                    records.length === 0 ?

                        (

                            <div
                                className="
                                bg-white
                                rounded-xl
                                shadow
                                p-8
                                text-center
                                text-gray-400
                            "
                            >

                                Không có dữ liệu

                            </div>

                        )

                        :

                        records.map((item) => (

                            <AbbCard

                                key={item.id}

                                item={item}

                                role={role}

                                onView={() => {

                                    setSelected(item);

                                    setOpen(true);

                                }}

                                onEdit={onEdit}

                                onDelete={onDelete}

                            />

                        ))

                }

            </div>

            <AbbDetailModal

                open={open}

                data={selected}

                onClose={() => setOpen(false)}

            />

        </>

    );

}
