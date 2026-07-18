import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import API from "../config";

import { useRef } from "react";
import DriveHeader from "../components/Drive/DriveHeader";
import DriveToolbar from "../components/Drive/DriveToolbar";
import DriveFilter from "../components/Drive/DriveFilter";
import DriveCard from "../components/Drive/DriveCard";
import DriveTable from "../components/Drive/DriveTable";
import DriveModal from "../components/Drive/DriveModal";
import DriveImportModal from "../components/Drive/DriveImportModal";

export default function Drive() {

    const role = localStorage.getItem("role") || "user";

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const [drives, setDrives] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [brand, setBrand] = useState("All");

    const [line, setLine] = useState("All");

    const [station, setStation] = useState("All");

    const [status, setStatus] = useState("All");

    const [model, setModel] = useState("All");

    const [open, setOpen] = useState(false);

    const [mode, setMode] = useState("view");

    const [selectedDrive, setSelectedDrive] = useState(null);

    const [openImport, setOpenImport] = useState(false);

    const [previewRows, setPreviewRows] = useState([]);

    const [sessionId, setSessionId] = useState(null);

    const [summary, setSummary] = useState({
        total: 0,
        newCount: 0,
        updateCount: 0,
        skipCount: 0,
    });

    const [importFile, setImportFile] = useState(null);

    const [importLoading, setImportLoading] = useState(false);

    const [statistics, setStatistics] = useState({

        total: 0,

        abb: 0,

        vacon: 0

    });

    const [filters, setFilters] = useState({

        brands: [],

        lines: [],

        stations: [],

        models: []

    });

    useEffect(() => {

        loadDrives();

        loadFilters();

        loadStatistics();

    }, []);

    async function loadDrives() {

        try {

            const res = await axios.get(
                `${API}/api/drives`,
                config
            );

            setDrives(res.data);

        }

        finally {

            setLoading(false);

        }

    }

    async function loadFilters() {

        const res = await axios.get(

            `${API}/api/drives/filters`,

            config

        );

        setFilters(res.data);

    }

    const filtered = useMemo(() => {

        return drives.filter(d => {

            const keyword =
                search.toLowerCase();

            const matchSearch =

                d.name?.toLowerCase().includes(keyword) ||

                d.deviceId?.toLowerCase().includes(keyword) ||

                d.model?.toLowerCase().includes(keyword);

            const matchBrand =
                brand === "All" ||
                d.brand === brand;

            const matchLine =
                line === "All" ||
                d.line === line;

            const matchStation =
                station === "All" ||
                d.station === station;

            const matchStatus =
                status === "All" ||
                d.status === status;

            const matchModel =
                model === "All" ||
                d.model === model;

            return (

                matchSearch &&

                matchBrand &&

                matchLine &&

                matchStation &&

                matchStatus &&

                matchModel

            );

        });

    }, [

        drives,

        search,

        brand,

        line,

        station,

        status,

        model

    ]);

    async function loadStatistics() {

        try {

            const res = await axios.get(

                `${API}/api/drives/statistics`,

                config

            );

            setStatistics(res.data);

        }

        catch (err) {

            console.log(err);

        }

    }

    const handleCreate = () => {

        setSelectedDrive(null);

        setMode("create");

        setOpen(true);

    };

    const handleView = (drive) => {

        setSelectedDrive(drive);

        setMode("view");

        setOpen(true);

    };

    const handleEdit = (drive) => {

        setSelectedDrive(drive);

        setMode("edit");

        setOpen(true);

    };

    const handleClose = () => {

        setOpen(false);

        setSelectedDrive(null);

    };

    const handleDelete = (drive) => {

        if (!confirm("Xóa biến tần này?")) {

            return;

        }

        console.log(drive);

    };

    const handleSave = async (form) => {

        try {

            if (mode === "create") {

                await axios.post(
                    `${API}/api/drives`,
                    form,
                    config
                );

            } else {

                await axios.put(
                    `${API}/api/drives/${selectedDrive.id}`,
                    form,
                    config
                );

            }

            await loadDrives();
            await loadStatistics();

            handleClose();

        }

        catch (err) {

            console.log(err);

            alert("Không thể lưu dữ liệu.");

        }

    };

    const handlePreview = async (e) => {

        if (!file) return;

        try {

            setImportFile(file);

            const form = new FormData();

            form.append("file", file);

            const res = await axios.post(
                `${API}/api/drives/preview-import`,
                form,
                {
                    ...config,
                    headers: {
                        ...config.headers,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log(res.data);

            setSessionId(res.data.sessionId);

            setSummary(res.data.summary);

            setPreviewRows(res.data.rows);

            setOpenImport(true);

        } catch (err) {

            console.error(err);

            alert(err.response?.data?.message || "Preview thất bại.");

        }

    };

    const confirmImport = async () => {

        if (!importFile) return;

        setImportLoading(true);

        await axios.post(

            `${API}/api/drives/import`,

            {
                sessionId
            },

            config

        );

        try {

            await axios.post(

                `${API}/api/drives/import`,

                form,

                {
                    ...config,
                    headers: {
                        ...config.headers,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setOpenImport(false);

            await loadDrives();

            await loadFilters();

            await loadStatistics();

        } finally {

            setImportLoading(false);

        }

    };

    const handleExport = async () => {

        try {

            const response = await axios.get(

                `${API}/api/drives/export`,

                {
                    ...config,

                    responseType: "blob"

                }

            );

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;

            link.download = `Drive_${new Date().toISOString().slice(0, 10)}.xlsx`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        }

        catch (error) {

            console.error(error);

            alert("Xuất Excel thất bại.");

        }

    };


    return (

        <div className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

            <DriveHeader

                total={statistics.total}

                abb={statistics.abb}

                vacon={statistics.vacon}

            />

            <DriveToolbar

                role={role}

                search={search}

                setSearch={setSearch}

                onCreate={handleCreate}

                onImport={handlePreview}

                onExport={handleExport}

                onHistory={() => { }}

            />

            <DriveFilter

                brand={brand}
                setBrand={setBrand}

                line={line}
                setLine={setLine}

                station={station}
                setStation={setStation}

                status={status}
                setStatus={setStatus}

                model={model}
                setModel={setModel}

                filters={filters}

            />

            <DriveCard

                drives={filtered}

            />

            <DriveTable
                role={role}
                drives={filtered}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <DriveModal

                open={open}

                mode={mode}

                drive={selectedDrive}

                filters={filters}

                onClose={handleClose}

                onSave={handleSave}

            />

            <DriveImportModal
                open={openImport}
                summary={summary}
                rows={previewRows}
                loading={importLoading}
                onClose={() => setOpenImport(false)}
                onConfirm={confirmImport}
            />

        </div>

    );

}
