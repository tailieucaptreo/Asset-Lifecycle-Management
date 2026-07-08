import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import API from "../config";

import DriveHeader from "../components/drive/DriveHeader";
import DriveToolbar from "../components/drive/DriveToolbar";
import DriveFilter from "../components/drive/DriveFilter";
import DriveCard from "../components/drive/DriveCard";
import DriveTable from "../components/drive/DriveTable";

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

    return (

        <div className="space-y-6">

            <DriveHeader/>

            <DriveToolbar

                role={role}

                search={search}

                setSearch={setSearch}

                onCreate={() => {}}

                onImport={() => {}}

                onExport={() => {}}

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
        </div>

    );

}
