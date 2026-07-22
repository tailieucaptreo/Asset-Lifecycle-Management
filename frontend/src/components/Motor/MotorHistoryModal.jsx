import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import API from "../../config";

import {
    X,
    Search,
    History,
    RefreshCw
} from "lucide-react";

const actions = [

    "",

    "CREATE",

    "UPDATE",

    "DELETE",

    "IMPORT"

];

export default function MotorHistoryModal({

    open,

    onClose

}) {

    const token =
        localStorage.getItem("token");

    const [loading, setLoading] =
        useState(false);

    const [histories, setHistories] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [action, setAction] =
        useState("");

    const loadHistory = async () => {

        try {

            setLoading(true);

            const res =
                await axios.get(

                    `${API}/motors/history`,

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );

            setHistories(

                res.data || []

            );

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        if (open) {

            loadHistory();

        }

    }, [open]);

    const filteredData =
        useMemo(() => {

            return histories.filter(item => {

                const keyword =
                    search.toLowerCase();

                const matchSearch =

                    !keyword ||

                    item.deviceId
                        ?.toLowerCase()
                        .includes(keyword)

                    ||

                    item.name
                        ?.toLowerCase()
                        .includes(keyword)

                    ||

                    item.user
                        ?.toLowerCase()
                        .includes(keyword);

                const matchAction =

                    !action ||

                    item.action === action;

                return (

                    matchSearch

                    &&

                    matchAction

                );

            });

        }, [

            histories,

            search,

            action

        ]);

    if (!open) return null;

    return (

        <div
            className="
                fixed
                inset-0
                z-50
                bg-black/40
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
                    shadow-2xl
                    w-full
                    max-w-7xl
                    max-h-[92vh]
                    overflow-hidden
                    flex
                    flex-col
                "
            >

                {/* Header */}

                <div
                    className="
                        px-6
                        py-4
                        border-b
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <History
                            className="
                                text-blue-600
                            "
                            size={24}
                        />

                        <div>

                            <h2
                                className="
                                    text-2xl
                                    font-bold
                                "
                            >

                                Lịch sử động cơ

                            </h2>

                            <p
                                className="
                                    text-sm
                                    text-slate-500
                                "
                            >

                                Theo dõi toàn bộ thay đổi của dữ liệu động cơ.

                            </p>

                        </div>

                    </div>

                    <button

                        onClick={onClose}

                        className="
                            p-2
                            rounded-lg
                            hover:bg-slate-100
                        "

                    >

                        <X size={22} />

                    </button>

                </div>

                {/* Toolbar */}

                <div
                    className="
                        p-5
                        border-b
                        bg-slate-50
                    "
                >

                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-3
                            gap-4
                        "
                    >

                        {/* Search */}

                        <div
                            className="
                                relative
                            "
                        >

                            <Search
                                size={18}
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                            <input

                                value={search}

                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }

                                placeholder="
Tìm theo mã, tên hoặc người thao tác..."

                                className="
                                    w-full
                                    border
                                    rounded-xl
                                    pl-10
                                    pr-4
                                    py-2.5
                                    outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                "

                            />

                        </div>

                        {/* Action */}

                        <select

                            value={action}

                            onChange={(e) =>
                                setAction(
                                    e.target.value
                                )
                            }

                            className="
                                border
                                rounded-xl
                                px-4
                                py-2.5
                            "

                        >

                            <option value="">
                                Tất cả thao tác
                            </option>

                            {

                                actions

                                    .filter(Boolean)

                                    .map(item => (

                                        <option

                                            key={item}

                                            value={item}

                                        >

                                            {item}

                                        </option>

                                    ))

                            }

                        </select>

                        {/* Reload */}

                        <button

                            onClick={loadHistory}

                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                transition
                            "

                        >

                            <RefreshCw size={18} />

                            Làm mới

                        </button>

                    </div>

                </div>

                {/* Table */}

                <div
                    className="
                        flex-1
                        overflow-auto
                    "
                >

                    {

                        loading &&

                        <div
                            className="
                                py-16
                                text-center
                                text-slate-500
                            "
                        >

                            Đang tải dữ liệu...

                        </div>

                    }
                    {

                        !loading &&

                        <div
                            className="
                                overflow-x-auto
                            "
                        >

                            <table
                                className="
                                    min-w-full
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

                                        <th className="px-4 py-3 text-left">
                                            STT
                                        </th>

                                        <th className="px-4 py-3 text-center">
                                            Thao tác
                                        </th>

                                        <th className="px-4 py-3 text-left">
                                            Mã TB
                                        </th>

                                        <th className="px-4 py-3 text-left">
                                            Tên động cơ
                                        </th>

                                        <th className="px-4 py-3 text-left">
                                            Người thực hiện
                                        </th>

                                        <th className="px-4 py-3 text-left">
                                            Thời gian
                                        </th>

                                        <th className="px-4 py-3 text-left">
                                            Nội dung
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        filteredData.length === 0

                                        ?

                                        (

                                            <tr>

                                                <td

                                                    colSpan={7}

                                                    className="
                                                        py-12
                                                        text-center
                                                        text-slate-400
                                                    "

                                                >

                                                    Không có lịch sử.

                                                </td>

                                            </tr>

                                        )

                                        :

                                        filteredData.map((item, index) => (

                                            <tr

                                                key={item.id || index}

                                                className="
                                                    border-t
                                                    hover:bg-slate-50
                                                "

                                            >

                                                <td className="px-4 py-3">

                                                    {index + 1}

                                                </td>

                                                <td
                                                    className="
                                                        px-4
                                                        py-3
                                                        text-center
                                                    "
                                                >

                                                    <span

                                                        className={`
                                                            inline-flex
                                                            px-3
                                                            py-1
                                                            rounded-full
                                                            text-xs
                                                            font-medium
                                                            ${actionColor(item.action)}
                                                        `}

                                                    >

                                                        {item.action}

                                                    </span>

                                                </td>

                                                <td className="px-4 py-3">

                                                    {item.deviceId || "-"}

                                                </td>

                                                <td className="px-4 py-3">

                                                    {item.name || "-"}

                                                </td>

                                                <td className="px-4 py-3">

                                                    {item.user || "-"}

                                                </td>

                                                <td className="px-4 py-3 whitespace-nowrap">

                                                    {

                                                        item.createdAt

                                                        ?

                                                        new Date(

                                                            item.createdAt

                                                        ).toLocaleString(

                                                            "vi-VN"

                                                        )

                                                        :

                                                        "-"

                                                    }

                                                </td>

                                                <td className="px-4 py-3">

                                                    {

                                                        item.note

                                                        ||

                                                        item.description

                                                        ||

                                                        "-"

                                                    }

                                                </td>

                                            </tr>

                                        ))

                                    }

                                </tbody>

                            </table>

                        </div>

                    }

                </div>
              
                {/* Footer */}

                <div
                    className="
                        border-t
                        bg-white
                        px-6
                        py-4
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div
                        className="
                            text-sm
                            text-slate-500
                        "
                    >

                        Tổng cộng

                        {" "}

                        <span className="font-semibold">

                            {filteredData.length}

                        </span>

                        {" "}

                        bản ghi.

                    </div>

                    <button

                        onClick={onClose}

                        className="
                            px-5
                            py-2.5
                            rounded-xl
                            border
                            hover:bg-slate-100
                            transition
                        "

                    >

                        Đóng

                    </button>

                </div>

            </div>

        </div>

    );

}

/* ===========================
   HELPER
=========================== */

function actionColor(action) {

    switch (action) {

        case "CREATE":

            return "bg-green-100 text-green-700";

        case "UPDATE":

            return "bg-yellow-100 text-yellow-700";

        case "DELETE":

            return "bg-red-100 text-red-700";

        case "IMPORT":

            return "bg-blue-100 text-blue-700";

        default:

            return "bg-slate-100 text-slate-700";

    }

}
