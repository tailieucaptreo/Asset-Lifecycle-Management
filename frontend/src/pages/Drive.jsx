import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import API from "../config";

import DriveHeader from "../components/Drive/DriveHeader";
import DriveToolbar from "../components/Drive/DriveToolbar";
import DriveFilter from "../components/Drive/DriveFilter";
import DriveCard from "../components/Drive/DriveCard";
import DriveTable from "../components/Drive/DriveTable";
import DriveModal from "../components/Drive/DriveModal";
import DriveImportModal from "../components/Drive/DriveImportModal";

export default function Drive() {

    const role = localStorage.getItem("role") || "user";

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

    const [preview, setPreview] = useState([]);
    
    const [importFile, setImportFile] = useState(null);
    
    const [importLoading, setImportLoading] = useState(false);

    const [filters, setFilters] = useState({

        brands: [],

        lines: [],

        stations: [],

        models: []

    });

    useEffect(() => {

        loadDrives();

        loadFilters();

    }, []);

    async function loadDrives() {

        try {

            const res = await axios.get(
                `${API}/api/drives`
            );

            setDrives(res.data);

        }

        finally {

            setLoading(false);

        }

    }

    async function loadFilters() {

        const res = await axios.get(
            `${API}/api/drives/filters`
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
                    form
                );
    
            }
    
            else {
    
                await axios.put(
    
                    `${API}/api/drives/${selectedDrive.id}`,
    
                    form
    
                );
    
            }
    
            await loadDrives();
    
            handleClose();
    
        }
    
        catch (err) {
    
            console.error(err);
    
            alert("Không thể lưu dữ liệu.");
    
        }
    
    };

    const handleExport = async () => {

        try {
    
            const response = await axios.get(
    
                `${API}/api/drives/export`,
    
                {
    
                    responseType: "blob"
    
                }
    
            );
    
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });
    
            const url = window.URL.createObjectURL(blob);
    
            const link = document.createElement("a");
    
            link.href = url;
    
            link.download = `Drive_${new Date().toISOString().slice(0,10)}.xlsx`;
    
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

    const handlePreview = async (file) => {

        setImportFile(file);
    
        setPreview([]);

        setOpenImport(true);
    };
    
    const handleImport = async () => {
    
        console.log("Import");
    
    };

    return (

        <div className="max-w-[1600px] mx-auto px-8 py-6 space-y-6">

            <DriveHeader/>

            <DriveToolbar

                role={role}

                search={search}

                setSearch={setSearch}

                onCreate={handleCreate}

                onImport={handlePreview}

                onExport={handleExport}

                onHistory={() => {}}

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
                preview={preview}
                loading={importLoading}
                onClose={() => setOpenImport(false)}
                onUpload={handlePreview}
                onConfirm={handleImport}
            />
            
        </div>

    );

}
