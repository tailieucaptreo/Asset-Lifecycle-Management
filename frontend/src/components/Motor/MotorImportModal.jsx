import { useMemo, useState } from "react";
import axios from "axios";

import {
    X,
    Upload,
    RefreshCw
} from "lucide-react";

import API from "../../config";

const badgeColor = {

    NEW:
        "bg-emerald-100 text-emerald-700",

    UPDATE:
        "bg-amber-100 text-amber-700",

    SKIP:
        "bg-slate-100 text-slate-600"

};

const cardColor = {

    total:
        "bg-blue-50 border-blue-200 text-blue-700",

    new:
        "bg-emerald-50 border-emerald-200 text-emerald-700",

    update:
        "bg-amber-50 border-amber-200 text-amber-700",

    skip:
        "bg-slate-50 border-slate-200 text-slate-700"

};

function SummaryCard({

    title,

    value,

    color

}) {

    return (

        <div
            className={`
                rounded-xl
                border
                p-4
                ${color}
            `}
        >

            <div
                className="
                    text-sm
                    font-medium
                    opacity-80
                "
            >
                {title}
            </div>

            <div
                className="
                    mt-2
                    text-4xl
                    font-bold
                "
            >
                {value}
            </div>

        </div>

    );

}

function StatusBadge({

    action

}) {

    return (

        <span
            className={`
                inline-flex
                items-center
                rounded-full
                px-2.5
                py-1
                text-xs
                font-semibold
                ${badgeColor[action] || badgeColor.SKIP}
            `}
        >
            {action}
        </span>

    );

}

export default function MotorImportModal({

    open,

    file,

    preview = [],

    summary,

    token,

    onClose,

    onSuccess

}) {

    const [loading, setLoading] = useState(false);

    const total =
        summary?.total ??
        preview.length;

    const newCount =
        summary?.new ?? 0;

    const updateCount =
        summary?.update ?? 0;

    const skipCount =
        summary?.skip ?? 0;

    const hasData =
        preview.length > 0;

    const canImport = useMemo(() => {

        return (

            newCount > 0 ||

            updateCount > 0

        );

    }, [

        newCount,

        updateCount

    ]);
        const handleImport = async () => {

        if (!file) return;

        try {

            setLoading(true);

            const form = new FormData();

            form.append("file", file);

            await axios.post(

                `${API}/api/motors/import`,

                form,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            onSuccess?.();

        }

        catch (err) {

            console.error(err);

            alert(

                err.response?.data?.message ||

                "Import thất bại."

            );

        }

        finally {

            setLoading(false);

        }

    };

    if (!open)
        return null;

    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/40
                backdrop-blur-sm
                p-4
            "
        >

            <div
                className="
                    w-full
                    max-w-7xl
                    bg-white
                    rounded-3xl
                    shadow-2xl
                    overflow-hidden
                "
            >

                {/* ===========================
                    HEADER
                =========================== */}

                <div
                    className="
                        border-b
                        border-slate-200
                        px-6
                        py-5
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div>

                        <h2
                            className="
                                text-2xl
                                font-bold
                                text-slate-800
                            "
                        >
                            Xem trước dữ liệu Import
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            Kiểm tra dữ liệu trước khi cập nhật vào hệ thống.
                        </p>

                        {file && (

                            <p
                                className="
                                    mt-2
                                    text-xs
                                    text-slate-400
                                "
                            >
                                File:
                                <span className="font-medium">
                                    {" "}
                                    {file.name}
                                </span>
                            </p>

                        )}

                    </div>

                    <button

                        onClick={onClose}

                        disabled={loading}

                        className="
                            w-10
                            h-10
                            rounded-xl
                            hover:bg-slate-100
                            flex
                            items-center
                            justify-center
                            transition
                        "

                    >

                        <X size={22} />

                    </button>

                </div>

                {/* ===========================
                    SUMMARY
                =========================== */}

                <div className="p-6">

                    <div
                        className="
                            grid
                            grid-cols-2
                            lg:grid-cols-4
                            gap-4
                        "
                    >

                        <SummaryCard
                            title="Tổng bản ghi"
                            value={total}
                            color={cardColor.total}
                        />

                        <SummaryCard
                            title="Thêm mới"
                            value={newCount}
                            color={cardColor.new}
                        />

                        <SummaryCard
                            title="Cập nhật"
                            value={updateCount}
                            color={cardColor.update}
                        />

                        <SummaryCard
                            title="Bỏ qua"
                            value={skipCount}
                            color={cardColor.skip}
                        />

                    </div>

                    {hasData && (

                        <div
                            className="
                                mt-6
                                flex
                                items-center
                                justify-between
                                flex-wrap
                                gap-3
                            "
                        >

                            <div>

                                <h3
                                    className="
                                        text-lg
                                        font-semibold
                                        text-slate-800
                                    "
                                >
                                    Danh sách xem trước
                                </h3>

                                <p
                                    className="
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    Chỉ những bản ghi có thay đổi mới được cập nhật.
                                </p>

                            </div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    flex-wrap
                                "
                            >

                                <StatusBadge action="NEW" />

                                <StatusBadge action="UPDATE" />

                                <StatusBadge action="SKIP" />

                            </div>

                        </div>

                    )}
                    {/* ===========================
                        PREVIEW TABLE
                    =========================== */}

                    <div
                        className="
                            mt-6
                            border
                            rounded-2xl
                            overflow-hidden
                        "
                    >

                        <div
                            className="
                                overflow-auto
                                max-h-[500px]
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

                                        <th className="px-3 py-3 text-left font-semibold w-14">
                                            STT
                                        </th>

                                        <th className="px-3 py-3 text-left font-semibold">
                                            Trạng thái
                                        </th>

                                        <th className="px-3 py-3 text-left font-semibold">
                                            Mã TB
                                        </th>

                                        <th className="px-3 py-3 text-left font-semibold min-w-[220px]">
                                            Tên động cơ
                                        </th>

                                        <th className="px-3 py-3 text-left font-semibold">
                                            Loại
                                        </th>

                                        <th className="px-3 py-3 text-left font-semibold">
                                            Hãng
                                        </th>

                                        <th className="px-3 py-3 text-left font-semibold">
                                            Model
                                        </th>

                                        <th className="px-3 py-3 text-left font-semibold">
                                            Tuyến
                                        </th>

                                        <th className="px-3 py-3 text-left font-semibold">
                                            Ga
                                        </th>

                                        <th className="px-3 py-3 text-left font-semibold min-w-[220px]">
                                            Thay đổi
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {!hasData && (

                                        <tr>

                                            <td
                                                colSpan={10}
                                                className="
                                                    py-16
                                                    text-center
                                                    text-slate-500
                                                "
                                            >
                                                Không có dữ liệu xem trước.
                                            </td>

                                        </tr>

                                    )}

                                    {preview.map((item, index) => {

                                        const row =
                                            item.row || {};

                                        return (

                                            <tr
                                                key={index}
                                                className="
                                                    border-t
                                                    hover:bg-slate-50
                                                    transition
                                                "
                                            >

                                                <td className="px-3 py-3">
                                                    {index + 1}
                                                </td>

                                                <td className="px-3 py-3">

                                                    <StatusBadge
                                                        action={item.action}
                                                    />

                                                </td>

                                                <td className="px-3 py-3 font-medium whitespace-nowrap">
                                                    {row.deviceId || "-"}
                                                </td>

                                                <td className="px-3 py-3">
                                                    {row.name || "-"}
                                                </td>

                                                <td className="px-3 py-3 whitespace-nowrap">
                                                    {row.type || "-"}
                                                </td>

                                                <td className="px-3 py-3 whitespace-nowrap">
                                                    {row.brand || "-"}
                                                </td>

                                                <td className="px-3 py-3 whitespace-nowrap">
                                                    {row.model || "-"}
                                                </td>

                                                <td className="px-3 py-3 whitespace-nowrap">
                                                    {row.line || "-"}
                                                </td>

                                                <td className="px-3 py-3 whitespace-nowrap">
                                                    {row.station || "-"}
                                                </td>

                                                <td className="px-3 py-3">

                                                    {item.changedFields?.length ? (

                                                        <div
                                                            className="
                                                                flex
                                                                flex-wrap
                                                                gap-1
                                                            "
                                                        >

                                                            {item.changedFields.map(
                                                                (field) => (

                                                                    <span
                                                                        key={field}
                                                                        className="
                                                                            px-2
                                                                            py-1
                                                                            rounded-full
                                                                            text-xs
                                                                            bg-blue-100
                                                                            text-blue-700
                                                                        "
                                                                    >
                                                                        {field}
                                                                    </span>

                                                                )
                                                            )}

                                                        </div>

                                                    ) : (

                                                        <span
                                                            className="
                                                                text-slate-400
                                                            "
                                                        >
                                                            -
                                                        </span>

                                                    )}

                                                </td>

                                            </tr>

                                        );

                                    })}

                                </tbody>

                            </table>

                        </div>

                    </div>
                    {/* ===========================
                        FOOTER
                    =========================== */}

                    <div
                        className="
                            mt-6
                            border-t
                            pt-5
                            flex
                            items-center
                            justify-between
                            flex-wrap
                            gap-4
                        "
                    >

                        <div
                            className="
                                text-sm
                                text-slate-500
                            "
                        >
                            {canImport
                                ? `Có ${newCount + updateCount} bản ghi sẽ được thêm hoặc cập nhật.`
                                : "Không có dữ liệu cần import."}
                        </div>

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <button

                                type="button"

                                disabled={loading}

                                onClick={onClose}

                                className="
                                    px-5
                                    py-2.5
                                    rounded-xl
                                    border
                                    border-slate-300
                                    hover:bg-slate-100
                                    transition
                                "

                            >
                                Hủy
                            </button>

                            <button

                                type="button"

                                disabled={
                                    loading ||
                                    !canImport
                                }

                                onClick={handleImport}

                                className="
                                    px-6
                                    py-2.5
                                    rounded-xl
                                    bg-blue-600
                                    hover:bg-blue-700
                                    text-white
                                    font-semibold
                                    flex
                                    items-center
                                    gap-2
                                    transition
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "

                            >

                                {loading ? (

                                    <>

                                        <RefreshCw
                                            size={18}
                                            className="animate-spin"
                                        />

                                        Đang Import...

                                    </>

                                ) : (

                                    <>

                                        <Upload size={18} />

                                        Xác nhận Import

                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>

             </div>

        </div>

    );

}
