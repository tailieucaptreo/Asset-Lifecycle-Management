import { useEffect, useRef, useState } from "react";
import axios from "axios";
import API from "../config";

import MotorHeader from "../components/Motor/MotorHeader";
import MotorToolbar from "../components/Motor/MotorToolbar";
import MotorCard from "../components/Motor/MotorCard";
import MotorFilter from "../components/Motor/MotorFilter";
import MotorTable from "../components/Motor/MotorTable";

import MotorModal from "../components/Motor/MotorModal";
import MotorImportModal from "../components/Motor/MotorImportModal";
import MotorHistoryModal from "../components/Motor/MotorHistoryModal";

function normalizeText(text = "") {

    return String(text)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
}

function detectMotorType(name = "") {

    const text = normalizeText(name);

    if (text.includes("dongcochinh"))
        return "mainMotor";

    if (
        text.includes("bomdau") ||
        text.includes("bomthuyluc")
    )
        return "oilPump";

    if (text.includes("lammat"))
        return "cooling";

    if (text.includes("nangha"))
        return "lifting";

    if (text.includes("phanh"))
        return "brake";

    return "otherMotor";
}

export default function Motor() {

    const token = localStorage.getItem("token");

    const role = localStorage.getItem("role");

    const [loading, setLoading] = useState(false);

    const [motors, setMotors] = useState([]);

    const [statistics, setStatistics] = useState({

        total: 0,

        abb: 0,

        siemens: 0,

        otherBrand: 0,

        running: 0,

        maintenance: 0,

        replaced: 0,

        original: 0,

        mainMotor: 0,

        oilPump: 0,

        cooling: 0,

        brake: 0,

        lifting: 0,

        otherMotor: 0

    });

    const [search, setSearch] = useState("");

    const [filters, setFilters] = useState({

        line: "",

        station: "",

        brand: "",

        type: "",

        status: ""

    });

    const [activeCard, setActiveCard] = useState("");

    const [selectedMotor, setSelectedMotor] = useState(null);

    const [modalMode, setModalMode] = useState("view");

    const [openModal, setOpenModal] = useState(false);

    const [openImport, setOpenImport] = useState(false);

    const fileInputRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    
    const [previewData, setPreviewData] = useState([]);
    
    const [summary, setSummary] = useState(null);

    const [openHistory, setOpenHistory] = useState(false);

    console.log("API =", API);

    console.log(
        `${API}/api/motors`
    );

    const loadMotors = async () => {

        try {

            setLoading(true);

            const res = await axios.get(

                `${API}/api/motors`,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setMotors(res.data || []);

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    };

    const handleImportFile = async (e) => {

        const file = e.target.files?.[0];
    
        if (!file) return;
    
        setSelectedFile(file);
    
        try {
    
            const form = new FormData();
    
            form.append("file", file);
    
            const res = await axios.post(
    
                `${API}/api/motors/preview-import`,
    
                form,
    
                {
    
                    headers: {
    
                        Authorization: `Bearer ${token}`
    
                    }
    
                }
    
            );
    
            setPreviewData(res.data.preview);
    
            setSummary(res.data.summary);
    
            setOpenImport(true);
    
        }
    
        catch (err) {
    
            console.error(err);
    
            alert(
    
                err.response?.data?.message ||
    
                "Không thể xem trước dữ liệu."
    
            );
    
        }
    
    };

    const loadStatistics = async () => {

        try {

            const res = await axios.get(

                `${API}/api/motors/statistics`,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setStatistics(res.data);

        }

        catch (err) {

            console.error(err);

        }

    };

    useEffect(() => {

        loadMotors();

        loadStatistics();

    }, []);

    return (

        <div className="max-w-[1650px] mx-auto px-6 xl:px-8 py-6 space-y-6">

            <MotorHeader />

            <MotorCard

                statistics={statistics}

                active={activeCard}

                onSelect={setActiveCard}

            />

            <MotorToolbar

                search={search}

                setSearch={setSearch}

                onAdd={() => {

                    setSelectedMotor(null);

                    setModalMode("add");

                    setOpenModal(true);

                }}

                onImport={() => fileInputRef.current?.click()}

                onHistory={() => setOpenHistory(true)}

                onExport={() => {

                    window.open(

                        `${API}/motors/export`,

                        "_blank"

                    );

                }}

            />

            <input

                ref={fileInputRef}
            
                type="file"
            
                accept=".xlsx"
            
                hidden
            
                onChange={handleImportFile}
            
            />

            <MotorFilter

                filters={filters}

                setFilters={setFilters}

                data={motors}

            />

            {(() => {

                const filteredMotors = motors.filter((motor) => {

                    // Search

                    const keyword = search.trim().toLowerCase();

                    const matchSearch =

                        !keyword ||

                        motor.deviceId?.toLowerCase().includes(keyword) ||

                        motor.name?.toLowerCase().includes(keyword) ||

                        motor.brand?.toLowerCase().includes(keyword) ||

                        motor.model?.toLowerCase().includes(keyword) ||

                        motor.line?.toLowerCase().includes(keyword) ||

                        motor.station?.toLowerCase().includes(keyword) ||

                        motor.type?.toLowerCase().includes(keyword);

                    // Filter

                    const matchFilter =

                        (!filters.line ||
                            motor.line === filters.line)

                        &&

                        (!filters.station ||
                            motor.station === filters.station)

                        &&

                        (!filters.brand ||
                            motor.brand === filters.brand)

                        &&

                        (!filters.type ||

                            detectMotorType(motor.name)
                            === filters.type)

                        &&

                        (!filters.status ||
                            motor.status === filters.status);

                    // Card filter

                    let matchCard = true;

                    switch (activeCard) {

                        case "abb":

                            matchCard =

                                motor.brand === "ABB";

                            break;

                        case "siemens":

                            matchCard =

                                motor.brand === "Siemens";

                            break;

                        case "otherBrand":

                            matchCard =

                                motor.brand !== "ABB"

                                &&

                                motor.brand !== "Siemens";

                            break;

                        case "running":

                            matchCard =

                                motor.status === "Running";

                            break;

                        case "maintenance":

                            matchCard =

                                motor.status === "Maintenance";

                            break;

                        case "replaced":

                            matchCard =

                                motor.status === "Replaced";

                            break;

                        case "original":

                            matchCard =

                                motor.status === "Original";

                            break;

                        case "mainMotor":

                            matchCard =
                                detectMotorType(motor.name)
                                === "mainMotor";
                        
                            break;
                        
                        case "oilPump":
                        
                            matchCard =
                                detectMotorType(motor.name)
                                === "oilPump";
                        
                            break;
                        
                        case "cooling":
                        
                            matchCard =
                                detectMotorType(motor.name)
                                === "cooling";
                        
                            break;
                        
                        case "brake":
                        
                            matchCard =
                                detectMotorType(motor.name)
                                === "brake";
                        
                            break;
                        
                        case "lifting":
                        
                            matchCard =
                                detectMotorType(motor.name)
                                === "lifting";
                        
                            break;
                        
                        case "otherMotor":
                        
                            matchCard =
                                detectMotorType(motor.name)
                                === "otherMotor";
                        
                            break;
                        default:

                            matchCard = true;

                    }

                    return (

                        matchSearch

                        &&

                        matchFilter

                        &&

                        matchCard

                    );

                });

                return (

                    <>
                      <MotorTable

                role={role}

                motors={filteredMotors}

                loading={loading}

                onView={(motor) => {

                    setSelectedMotor(motor);

                    setModalMode("view");

                    setOpenModal(true);

                }}

                onEdit={(motor) => {

                    setSelectedMotor(motor);

                    setModalMode("edit");

                    setOpenModal(true);

                }}

                onDelete={async (motor) => {

                    if (

                        !window.confirm(

                            `Xóa động cơ "${motor.name}" ?`

                        )

                    ) return;

                    try {

                        await axios.delete(

                            `${API}/motors/${motor.id}`,

                            {

                                headers: {

                                    Authorization: `Bearer ${token}`

                                }

                            }

                        );

                        await loadMotors();

                        await loadStatistics();

                    }

                    catch (err) {

                        console.error(err);

                        alert(

                            err.response?.data?.message ||

                            "Không thể xóa động cơ."

                        );

                    }

                }}

            />

            <MotorModal
                open={openModal}
                mode={modalMode}
                motor={selectedMotor}
                token={token}
                onClose={() => {
                    setOpenModal(false);
                }}
                onSuccess={async () => {
                    setOpenModal(false);
                    await loadMotors();
                    await loadStatistics();
                }}
            />
            
            <MotorImportModal

                open={openImport}
            
                file={selectedFile}
            
                preview={previewData}
            
                summary={summary}
            
                token={token}
            
                onClose={() => {
            
                    setOpenImport(false);
            
                    setSelectedFile(null);
            
                    setPreviewData([]);
            
                    setSummary(null);
            
                }}
            
                onSuccess={async () => {
            
                    setOpenImport(false);
            
                    await loadMotors();
            
                    await loadStatistics();
            
                }}
            
            />
            
            <MotorHistoryModal
                open={openHistory}
                onClose={() => {
                    setOpenHistory(false);
                }}
            />

        </>

    );

})()}

        </div>

    );

}
