import { useEffect, useState } from "react";
import axios from "axios";

import API from "../config";

import VaconHistory from "../components/Fault/VaconHistory";
import AbbTable from "../components/Fault/AbbTable";
import DriveImportModal from "../components/Drive/DriveImportModal";

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

    const [openImport, setOpenImport] = useState(false);

    const [preview, setPreview] = useState([]);
    
    const [importLoading, setImportLoading] = useState(false);

    const [importFile, setImportFile] = useState(null);

    async function loadData() {

        try {

            setLoading(true);

            const url =
                tab === "VACON"
                    ? `${API}/api/vacon`
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

    const handleExport = async () => {

        try {
    
            const url =
    
                tab === "VACON"
    
                    ? `${API}/api/vacon/export`
    
                    : `${API}/api/abb-faults/export`;
    
            const response = await axios.get(
    
                url,
    
                {
    
                    responseType: "blob"
    
                }
    
            );
    
            const blob = new Blob(
    
                [response.data],
    
                {
    
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    
                }
    
            );
    
            const downloadUrl = window.URL.createObjectURL(blob);
    
            const link = document.createElement("a");
    
            link.href = downloadUrl;
    
            link.download =
    
                tab === "VACON"
    
                    ? "Vacon_History.xlsx"
    
                    : "ABB_History.xlsx";
    
            document.body.appendChild(link);
    
            link.click();
    
            link.remove();
    
            window.URL.revokeObjectURL(downloadUrl);
    
        }
    
        catch (err) {
    
            console.log(err);
    
            alert("Xuất Excel thất bại.");
    
        }
    
    };

    const handleImport = async () => {

        try {
    
            setImportLoading(true);
    
            const token = localStorage.getItem("token");
    
            if (!token) {
    
                alert("Bạn chưa đăng nhập.");
    
                return;
    
            }
    
            const url =
    
                tab === "VACON"
    
                    ? `${API}/api/vacon/confirm-import`
    
                    : `${API}/api/abb-faults/confirm-import`;
    
            await axios.post(
    
                url,
    
                {
                    rows: preview
                },
    
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
    
            );
    
            alert("Import thành công.");
    
            setOpenImport(false);
    
            setPreview([]);
    
            loadData();
    
        }
    
        catch (err) {
    
            console.error(err);
    
            if (err.response) {
    
                alert(
    
                    err.response.data.message ||
    
                    `Import thất bại (${err.response.status})`
    
                );
    
            }
    
            else {
    
                alert("Không thể kết nối tới server.");
    
            }
    
        }
    
        finally {
    
            setImportLoading(false);
    
        }
    
    };
    
    const handlePreview = async (file) => {

        try {
    
            setImportLoading(true);
            setImportFile(file);
    
            const formData = new FormData();
    
            formData.append("file", file);
    
            const url =
    
                tab === "VACON"
    
                    ? `${API}/api/vacon/preview-import`
    
                    : `${API}/api/abb-faults/preview-import`;
    
            const res = await axios.post(
    
                url,
    
                formData,
    
                {
    
                    headers: {
    
                        "Content-Type": "multipart/form-data"
    
                    }
    
                }
    
            );
    
            setPreview(res.data.rows);
    
            setOpenImport(true);
    
        }
    
        catch (err) {
    
            console.log(err);
    
            alert("Không đọc được file Excel.");
    
        }
    
        finally {
    
            setImportLoading(false);
    
        }
    
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
             
                            <label
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
                                    cursor-pointer
                                "
                            >
                            
                                <Upload size={18} />
                            
                                Import
                            
                                <input
                            
                                    type="file"
                            
                                    accept=".xlsx,.xls"
                            
                                    hidden
                            
                                    onChange={(e) => {
                            
                                        if (e.target.files?.length) {
                            
                                            handlePreview(
                            
                                                e.target.files[0]
                            
                                            );
                            
                                        }
                            
                                    }}
                            
                                />
                            
                            </label>

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

                    <VaconHistory

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

            <DriveImportModal
                open={openImport}
                preview={preview}
                loading={importLoading}
                importFile={importFile}
                onClose={() => setOpenImport(false)}
                onUpload={handlePreview}
                onConfirm={handleImport}
            />

        </div>

    );

}
