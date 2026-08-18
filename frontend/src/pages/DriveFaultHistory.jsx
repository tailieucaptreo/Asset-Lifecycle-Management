import { useEffect, useState } from "react";
import axios from "axios";

import API from "../config";

import AbbTable from "../components/Fault/AbbTable";
import AbbEditModal from "../components/Fault/AbbEditModal";
import VaconHistoryEditModal from "../components/Fault/VaconHistoryEditModal";
import VaconDeviceTable from "../components/Fault/VaconDeviceTable";
import VaconHistoryModal from "../components/Fault/VaconHistoryModal";
import PreviewImportModal from "../components/Fault/PreviewImportModal";

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

    }, [tab, search]);

    const [histories, setHistories] = useState([]);

    const [selectedDevice, setSelectedDevice] =
        useState(null);

    const [openHistory, setOpenHistory] =
        useState(false);

    const [historyLoading, setHistoryLoading] =
        useState(false);

    const [importLoading, setImportLoading] = useState(false);

    const [openEdit, setOpenEdit] = useState(false);

    const [editing, setEditing] = useState(null);

    const [openHistoryEdit, setOpenHistoryEdit] = useState(false);

    const [editingHistory, setEditingHistory] = useState(null);

    const [openVaconDetail, setOpenVaconDetail] = useState(false);

    const [selectedVacon, setSelectedVacon] = useState(null);

    const [previewOpen, setPreviewOpen] = useState(false);

    const [previewRows, setPreviewRows] = useState([]);

    const [summary, setSummary] = useState({});

    const [sessionId, setSessionId] = useState("");

    async function loadData() {

        try {

            setLoading(true);

            const url =
                tab === "VACON"
                    ? `${API}/api/vacon`
                    : `${API}/api/abb-faults`;

            const res = await axios.get(

                url,

                {

                    params: {

                        search

                    },

                    headers: {

                        Authorization:
                            `Bearer ${localStorage.getItem("token")}`

                    }

                }

            );

            setRecords(res.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    }

    const handleVaconView = async (device) => {

        try {

            setHistoryLoading(true);

            const res = await axios.get(

                `${API}/api/vacon/history/${device.id}`,

                {

                    headers: {

                        Authorization:

                            `Bearer ${localStorage.getItem("token")}`

                    }

                }

            );

            setSelectedDevice(res.data.device);

            setHistories(res.data.histories);

            setOpenHistory(true);

        }

        catch (err) {

            console.log(err);

            alert("Không tải được lịch sử.");

        }

        finally {

            setHistoryLoading(false);

        }

    };

    const handleEdit = (item) => {

        setEditing(item);

        setOpenEdit(true);

    };

    const handleExport = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {

                alert("Bạn chưa đăng nhập.");

                return;

            }

            const url =

                tab === "VACON"

                    ? `${API}/api/vacon/export`

                    : `${API}/api/abb-faults/export`;

            const response = await axios.get(

                url,

                {

                    responseType: "blob",

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

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

            console.error(err);

            alert(

                err.response?.data?.message ||

                `Xuất Excel thất bại (${err.response?.status || ""})`

            );

        }

    };

    const handleImport = async () => {

        try {

            setImportLoading(true);

            const token = localStorage.getItem("token");

            const url =
                tab === "VACON"
                    ? `${API}/api/vacon/import`
                    : `${API}/api/abb-faults/import`;

            await axios.post(
                url,
                {
                    sessionId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Import thành công.");

            setPreviewOpen(false);

            setPreviewRows([]);

            setSummary({});

            setSessionId("");

            await loadData();

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Import thất bại."
            );

        } finally {

            setImportLoading(false);

        }

    };

    const handlePreview = async (file) => {

        try {

            setImportLoading(true);

            const token = localStorage.getItem("token");

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
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setSessionId(res.data.sessionId);

            setSummary(res.data.summary);

            setPreviewRows(res.data.rows);

            setPreviewOpen(true);

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Không đọc được file Excel."
            );

        } finally {

            setImportLoading(false);

        }

    };

    const handleSave = async (data) => {

        try {

            await axios.put(

                `${API}/api/abb-faults/${data.id}`,

                data,

                {

                    headers: {

                        Authorization:

                            `Bearer ${localStorage.getItem("token")}`

                    }

                }

            );

            alert("Đã cập nhật.");

            setOpenEdit(false);

            loadData();

        }

        catch (err) {

            console.log(err);

            alert("Không thể cập nhật.");

        }

    };

    const handleSaveHistory = async (form) => {

        try {

            await axios.put(

                `${API}/api/vacon/history/${form.id}`,

                form,

                {

                    headers: {

                        Authorization:
                            `Bearer ${localStorage.getItem("token")}`

                    }

                }

            );

            alert("Đã cập nhật.");

            setOpenHistoryEdit(false);

            await handleVaconView(selectedDevice);

        }

        catch (err) {

            console.log(err);

            alert("Không thể cập nhật.");

        }

    }

    const handleVaconDelete = async (item) => {

        if (

            !window.confirm(

                "Bạn có chắc muốn xóa bản ghi này?"

            )

        ) return;

        try {

            await axios.delete(

                `${API}/api/vacon/${item.id}`,

                {

                    headers: {

                        Authorization:

                            `Bearer ${localStorage.getItem("token")}`

                    }

                }

            );

            alert("Đã xóa.");

            loadData();

        }

        catch (err) {

            console.log(err);

            alert("Không thể xóa.");

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

                        ${tab === "VACON"

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

                        ${tab === "ABB"

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

                                        handlePreview(e.target.files[0]);

                                    }

                                    e.target.value = "";

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

                        <Download size={18} />

                        Export

                    </button>

                </div>

            </div>

            {/* TABLE */}

            {

                tab === "VACON"

                    ?

                    <VaconDeviceTable

                        role={role}

                        devices={records}

                        loading={loading}

                        onViewHistory={handleVaconView}

                        onDelete={handleVaconDelete}

                    />

                    :

                    <AbbTable

                        role={role}

                        records={records}

                        loading={loading}

                        onView={() => { }}

                        onEdit={handleEdit}

                        onDelete={() => { }}

                    />

            }

            <PreviewImportModal
                open={previewOpen}
                module={tab}
                summary={summary}
                rows={previewRows}
                loading={importLoading}
                onClose={() => {
                    setPreviewOpen(false);

                    setPreviewRows([]);

                    setSummary({});

                    setSessionId("");

                }}
                onConfirm={handleImport}
            />

            <AbbEditModal

                open={openEdit}

                data={editing}

                onClose={() => setOpenEdit(false)}

                onSave={handleSave}

            />

            <VaconHistoryModal

                open={openHistory}

                device={selectedDevice}

                histories={histories}

                loading={historyLoading}

                role={role}

                onEdit={(item) => {

                    setEditingHistory(item);

                    setOpenHistoryEdit(true);

                }}

                onClose={() => {

                    setOpenHistory(false);

                    setSelectedDevice(null);

                    setHistories([]);

                }}

            />

            <VaconHistoryEditModal

                open={openHistoryEdit}

                data={editingHistory}

                onClose={() => {

                    setOpenHistoryEdit(false);

                    setEditingHistory(null);

                }}

                onSave={handleSaveHistory}

            />

        </div>

    );

}
