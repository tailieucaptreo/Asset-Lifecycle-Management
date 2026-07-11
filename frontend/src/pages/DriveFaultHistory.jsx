import { useEffect, useState } from "react";
import axios from "axios";

import API from "../config";

import VaconHistory from "../components/Fault/VaconHistory";
import AbbTable from "../components/Fault/AbbTable";

import {
    Upload,
    Download,
    Search
} from "lucide-react";

export default function DriveFaultHistory() {

    const role =
        localStorage.getItem("role") || "user";

    const [tab, setTab] =
        useState("VACON");

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [records, setRecords] =
        useState([]);

    useEffect(() => {

        loadData();

    }, [tab]);

    async function loadData() {

        try {

            setLoading(true);

            const url =
                tab === "VACON"
                    ? `${API}/api/vacon-records`
                    : `${API}/api/abb-faults`;

            const res =
                await axios.get(url);

            setRecords(res.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    }

    const filtered =
        records.filter(item => {

            const keyword =
                search.toLowerCase();

            return Object.values(item)
                .join(" ")
                .toLowerCase()
                .includes(keyword);

        });

    const handleExport = () => {

        window.open(

            tab === "VACON"

                ? `${API}/api/vacon-records/export`

                : `${API}/api/abb-faults/export`

        );

    };

    const handleImport = () => {

        alert(

            `Import ${tab} sẽ làm ở bước tiếp theo.`

        );

    };

    return (

        <div className="max-w-[1700px] mx-auto px-8 py-6 space-y-6">

            {/* HEADER */}

            <div>

                <h1
                    className="
                        text-3xl
                        font-bold
                        text-gray-800
                    "
                >

                    Lịch sử lỗi biến tần

                </h1>

                <p className="text-gray-500 mt-2">

                    Quản lý lịch sử lỗi ABB và VACON

                </p>

            </div>

            {/* TAB */}

            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow
                    p-2
                    flex
                    gap-2
                    w-fit
                "
            >

                <button

                    onClick={() =>
                        setTab("VACON")
                    }

                    className={`
                        px-8
                        py-3
                        rounded-xl
                        font-semibold
                        transition

                        ${
                            tab === "VACON"

                                ? "bg-blue-600 text-white"

                                : "hover:bg-slate-100"

                        }

                    `}
                >

                    VACON

                </button>

                <button

                    onClick={() =>
                        setTab("ABB")
                    }

                    className={`
                        px-8
                        py-3
                        rounded-xl
                        font-semibold
                        transition

                        ${
                            tab === "ABB"

                                ? "bg-green-600 text-white"

                                : "hover:bg-slate-100"

                        }

                    `}
                >

                    ABB

                </button>

            </div>

            {/* TOOLBAR */}

            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow
                    p-4
                    flex
                    flex-wrap
                    gap-3
                    justify-between
                    items-center
                "
            >

                <div className="relative w-full md:w-96">

                    <Search
                        size={18}
                        className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            text-gray-400
                        "
                    />

                    <input

                        value={search}

                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }

                        placeholder="Tìm kiếm..."

                        className="
                            w-full
                            border
                            rounded-xl
                            py-2.5
                            pl-10
                            pr-3
                        "

                    />

                </div>

                <div
                    className="
                        flex
                        gap-3
                        flex-wrap
                    "
                >

                    {

                        role === "admin" &&

                        <button

                            onClick={handleImport}

                            className="
                                flex
                                items-center
                                gap-2
                                bg-amber-500
                                text-white
                                px-4
                                py-2.5
                                rounded-xl
                                hover:bg-amber-600
                            "

                        >

                            <Upload size={18}/>

                            Import

                        </button>

                    }

                    <button

                        onClick={handleExport}

                        className="
                            flex
                            items-center
                            gap-2
                            bg-green-600
                            text-white
                            px-4
                            py-2.5
                            rounded-xl
                            hover:bg-green-700
                        "

                    >

                        <Download size={18}/>

                        Export

                    </button>

                </div>

            </div>

            {/* TABLE */}

            {

                tab === "VACON"

                    ?

                    <VaconTable

                        role={role}

                        records={filtered}

                        loading={loading}

                        onView={() => {}}

                        onEdit={() => {}}

                        onDelete={() => {}}

                    />

                    :

                    <AbbTable

                        role={role}

                        records={filtered}

                        loading={loading}

                        onView={() => {}}

                        onEdit={() => {}}

                        onDelete={() => {}}

                    />

            }

        </div>

    );

}
