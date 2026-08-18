const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const XLSX = require("xlsx");
const ExcelJS = require("exceljs");


// ============================================================
// HELPERS
// ============================================================

function normalize(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .trim()
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n");
}


// ============================================================
// EXCEL DATE -> JS DATE
// ============================================================

function excelDateToJS(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    if (value instanceof Date) {
        return value;
    }

    // Excel serial date
    if (typeof value === "number") {

        const excelEpoch =
            new Date(Date.UTC(1899, 11, 30));

        return new Date(
            excelEpoch.getTime() +
            value * 86400000
        );
    }

    const text =
        String(value).trim();

    // dd/mm/yyyy
    const match =
        text.match(
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
        );

    if (match) {

        const day =
            Number(match[1]);

        const month =
            Number(match[2]);

        const year =
            Number(match[3]);

        return new Date(
            Date.UTC(
                year,
                month - 1,
                day
            )
        );
    }

    const d =
        new Date(text);

    if (isNaN(d.getTime())) {
        return null;
    }

    return d;
}


// ============================================================
// DATE KEY
// ============================================================

function dateKey(value) {

    if (!value) {
        return "";
    }

    const d =
        value instanceof Date
            ? value
            : new Date(value);

    if (isNaN(d.getTime())) {
        return "";
    }

    return d
        .toISOString()
        .slice(0, 10);
}


// ============================================================
// EXCEL TIME
// ============================================================

function excelTimeToString(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "";
    }

    if (typeof value === "number") {

        const total =
            Math.round(
                value * 24 * 60 * 60
            );

        const hours =
            String(
                Math.floor(total / 3600)
            ).padStart(2, "0");

        const minutes =
            String(
                Math.floor(
                    (total % 3600) / 60
                )
            ).padStart(2, "0");

        const seconds =
            String(
                total % 60
            ).padStart(2, "0");

        return `${hours}:${minutes}:${seconds}`;
    }

    return String(value).trim();
}


// ============================================================
// GET EXCEL VALUE
// ============================================================

function getValue(row, ...keys) {

    for (const key of keys) {

        if (
            row[key] !== undefined &&
            row[key] !== null
        ) {

            return row[key];

        }

    }

    return "";
}


// ============================================================
// PARSE EXCEL
// ============================================================

async function parseExcel(file) {

    const workbook =
        XLSX.read(file.buffer, {
            type: "buffer"
        });

    const sheetName =
        workbook.SheetNames[0];

    if (!sheetName) {
        return [];
    }

    const sheet =
        workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_json(
        sheet,
        {
            defval: ""
        }
    );
}


// ============================================================
// COMPARE ROWS
// ============================================================

async function compareRows(rows) {

    // ========================================================
    // LOAD DEVICES
    // ========================================================

    const devices =
        await prisma.vaconDevice.findMany();


    // ========================================================
    // LOAD HISTORIES
    // ========================================================

    const histories =
        await prisma.vaconHistory.findMany({

            select: {

                id: true,

                deviceId: true,

                recordDate: true,

                operationHours: true,

                powerUnitDate: true,

                faultHistory: true,

                description: true,

                possibleCause: true,

                correctiveActions: true,

                note: true

            }

        });


    // ========================================================
    // DEVICE MAP
    // Serial Number = khóa nhận diện thiết bị
    // ========================================================

    const deviceMap =
        new Map();

    for (const device of devices) {

        const serial =
            normalize(
                device.serialNumber
            );

        if (!serial) {
            continue;
        }

        deviceMap.set(
            serial,
            device
        );
    }


    // ========================================================
    // HISTORY MAP
    //
    // KHÔNG dùng Note / Description / Fault History
    // làm khóa.
    //
    // Ưu tiên:
    // Device + Record Date
    // ========================================================

    const historyMap =
        new Map();

    for (const history of histories) {

        const key =
            `${history.deviceId}|${dateKey(history.recordDate)}`;

        if (!historyMap.has(key)) {

            historyMap.set(
                key,
                []
            );
        }

        historyMap
            .get(key)
            .push(history);
    }


    // ========================================================
    // COMPARE
    // ========================================================

    let currentRecordDate =
        null;

    const result = [];


    for (const row of rows) {

        // ====================================================
        // RECORD DATE
        //
        // File Excel có thể chỉ ghi ngày ở dòng đầu,
        // các dòng sau để trống.
        //
        // Vì vậy giữ lại currentRecordDate.
        // ====================================================

        if (
            row["Record Date"] !== undefined &&
            String(
                row["Record Date"]
            ).trim() !== ""
        ) {

            currentRecordDate =
                excelDateToJS(
                    row["Record Date"]
                );
        }


        // ====================================================
        // DEVICE NAME
        // ====================================================

        const deviceName =
            normalize(
                getValue(
                    row,
                    "Device Name",
                    "The Device Name"
                )
            );

        if (!deviceName) {
            continue;
        }


        // ====================================================
        // SERIAL
        // ====================================================

        const serialNumber =
            normalize(
                getValue(
                    row,
                    "Serial Number",
                    "Serial number"
                )
            );


        // ====================================================
        // DEVICE DATA
        // ====================================================

        const station =
            normalize(
                getValue(
                    row,
                    "Station"
                )
            );

        const tandem =
            normalize(
                getValue(
                    row,
                    "Tandem"
                )
            );

        const application =
            normalize(
                getValue(
                    row,
                    "Application"
                )
            );


        // ====================================================
        // HISTORY DATA
        // ====================================================

        const operationHours =
            normalize(
                excelTimeToString(
                    getValue(
                        row,
                        "Operation Hours",
                        "Operation hours"
                    )
                )
            );


        const powerUnitDate =
            normalize(
                getValue(
                    row,
                    "Power Unit Date",
                    "Power unit date"
                )
            );


        const faultHistory =
            normalize(
                getValue(
                    row,
                    "Fault History",
                    "Fault history"
                )
            );


        const description =
            normalize(
                getValue(
                    row,
                    "Description"
                )
            );


        const possibleCause =
            normalize(
                getValue(
                    row,
                    "Possible Cause",
                    "Possible cause"
                )
            );


        const correctiveActions =
            normalize(
                getValue(
                    row,
                    "Corrective Actions",
                    "Corrective actions"
                )
            );


        const note =
            normalize(
                getValue(
                    row,
                    "Note",
                    "note"
                )
            );


        // ====================================================
        // TÌM DEVICE
        // ====================================================

        const device =
            deviceMap.get(
                serialNumber
            );


        // ====================================================
        // NEW DEVICE
        // ====================================================

        if (!device) {

            result.push({

                status: "NEW",

                deviceId: null,

                historyId: null,

                updateData: {},

                deviceName,

                serialNumber,

                station,

                tandem,

                application,

                recordDate:
                    currentRecordDate,

                operationHours,

                powerUnitDate,

                faultHistory,

                description,

                possibleCause,

                correctiveActions,

                note,

                changes: [
                    "Thiết bị mới"
                ]

            });

            continue;
        }


        // ====================================================
        // DEVICE CHANGES
        // ====================================================

        const updateData = {};

        const deviceChanges = [];


        if (
            normalize(device.deviceName)
            !== deviceName
        ) {

            updateData.deviceName =
                deviceName;

            deviceChanges.push(
                "Tên thiết bị"
            );
        }


        if (
            normalize(device.station)
            !== station
        ) {

            updateData.station =
                station;

            deviceChanges.push(
                "Trạm"
            );
        }


        if (
            normalize(device.tandem)
            !== tandem
        ) {

            updateData.tandem =
                tandem;

            deviceChanges.push(
                "Tandem"
            );
        }


        if (
            normalize(device.application)
            !== application
        ) {

            updateData.application =
                application;

            deviceChanges.push(
                "Ứng dụng"
            );
        }


        const deviceChanged =
            Object.keys(updateData).length > 0;


        // ====================================================
        // HISTORY KEY
        // ====================================================

        const historyKey =
            `${device.id}|${dateKey(
                currentRecordDate
            )}`;


        const historyCandidates =
            historyMap.get(
                historyKey
            ) || [];


        // ====================================================
        // TÌM HISTORY PHÙ HỢP
        //
        // Ưu tiên bản ghi có cùng:
        // - Operation Hours
        // - Power Unit Date
        // - Fault History
        //
        // Sau đó mới lấy bản ghi đầu tiên.
        // ====================================================

        let oldHistory =
            historyCandidates.find(
                history => {

                    return (

                        normalize(
                            history.operationHours
                        )
                        === operationHours

                        &&

                        normalize(
                            history.powerUnitDate
                        )
                        === powerUnitDate

                        &&

                        normalize(
                            history.faultHistory
                        )
                        === faultHistory

                    );

                }
            );


        if (!oldHistory) {

            oldHistory =
                historyCandidates[0] || null;

        }


        // ====================================================
        // KHÔNG CÓ HISTORY
        //
        // Đây là lịch sử mới của thiết bị.
        // ====================================================

        if (!oldHistory) {

            result.push({

                status:
                    deviceChanged
                        ? "UPDATE_BOTH"
                        : "UPDATE_HISTORY",

                deviceId:
                    device.id,

                historyId:
                    null,

                updateData,

                deviceName,

                serialNumber,

                station,

                tandem,

                application,

                recordDate:
                    currentRecordDate,

                operationHours,

                powerUnitDate,

                faultHistory,

                description,

                possibleCause,

                correctiveActions,

                note,

                changes: [

                    ...deviceChanges,

                    "Lịch sử mới"

                ]

            });

            continue;
        }


        // ====================================================
        // HISTORY CHANGES
        // ====================================================

        const historyChanges = [];


        if (
            normalize(
                oldHistory.operationHours
            )
            !== operationHours
        ) {

            historyChanges.push(
                "Operation Hours"
            );
        }


        if (
            normalize(
                oldHistory.powerUnitDate
            )
            !== powerUnitDate
        ) {

            historyChanges.push(
                "Power Unit Date"
            );
        }


        if (
            normalize(
                oldHistory.faultHistory
            )
            !== faultHistory
        ) {

            historyChanges.push(
                "Fault History"
            );
        }


        if (
            normalize(
                oldHistory.description
            )
            !== description
        ) {

            historyChanges.push(
                "Description"
            );
        }


        if (
            normalize(
                oldHistory.possibleCause
            )
            !== possibleCause
        ) {

            historyChanges.push(
                "Possible Cause"
            );
        }


        if (
            normalize(
                oldHistory.correctiveActions
            )
            !== correctiveActions
        ) {

            historyChanges.push(
                "Corrective Actions"
            );
        }


        if (
            normalize(
                oldHistory.note
            )
            !== note
        ) {

            historyChanges.push(
                "Note"
            );
        }


        const historyChanged =
            historyChanges.length > 0;


        // ====================================================
        // STATUS
        // ====================================================

        let status =
            "SKIP";


        if (
            deviceChanged &&
            historyChanged
        ) {

            status =
                "UPDATE_BOTH";

        }
        else if (
            deviceChanged
        ) {

            status =
                "UPDATE_DEVICE";

        }
        else if (
            historyChanged
        ) {

            status =
                "UPDATE_HISTORY";

        }


        // ====================================================
        // RESULT
        // ====================================================

        result.push({

            status,

            deviceId:
                device.id,

            historyId:
                oldHistory.id,

            updateData,

            deviceName,

            serialNumber,

            station,

            tandem,

            application,

            recordDate:
                currentRecordDate,

            operationHours,

            powerUnitDate,

            faultHistory,

            description,

            possibleCause,

            correctiveActions,

            note,

            changes: [

                ...deviceChanges,

                ...historyChanges

            ]

        });

    }


    return result;
}


// ============================================================
// GET ALL VACON DEVICE
// ============================================================

exports.getAll = async (req, res) => {

    try {

        const search =
            req.query.search?.trim() || "";


        const devices =
            await prisma.vaconDevice.findMany({

                where: search
                    ? {

                        OR: [

                            {
                                deviceName: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            },

                            {
                                serialNumber: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            },

                            {
                                station: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            },

                            {
                                tandem: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            },

                            {
                                application: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            },

                            {
                                histories: {

                                    some: {

                                        OR: [

                                            {
                                                faultHistory: {
                                                    contains: search,
                                                    mode: "insensitive"
                                                }
                                            },

                                            {
                                                description: {
                                                    contains: search,
                                                    mode: "insensitive"
                                                }
                                            },

                                            {
                                                possibleCause: {
                                                    contains: search,
                                                    mode: "insensitive"
                                                }
                                            },

                                            {
                                                correctiveActions: {
                                                    contains: search,
                                                    mode: "insensitive"
                                                }
                                            },

                                            {
                                                note: {
                                                    contains: search,
                                                    mode: "insensitive"
                                                }
                                            }

                                        ]

                                    }

                                }

                            }

                        ]

                    }
                    : {},

                include: {

                    histories: {

                        orderBy: {
                            recordDate: "desc"
                        },

                        take: 1,

                        select: {
                            recordDate: true
                        }

                    },

                    _count: {

                        select: {
                            histories: true
                        }

                    }

                },

                orderBy: [

                    {
                        deviceName: "asc"
                    },

                    {
                        serialNumber: "asc"
                    }

                ]

            });


        const result =
            devices.map(
                device => ({

                    id:
                        device.id,

                    deviceName:
                        device.deviceName,

                    serialNumber:
                        device.serialNumber,

                    station:
                        device.station,

                    tandem:
                        device.tandem,

                    application:
                        device.application,

                    recordDate:
                        device.histories.length
                            ? device.histories[0].recordDate
                            : null,

                    historyCount:
                        device._count.histories

                })
            );


        res.json(result);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// ============================================================
// EXPORT VACON HISTORY
// ============================================================

exports.exportExcel = async (req, res) => {

    try {

        const devices =
            await prisma.vaconDevice.findMany({

                include: {

                    histories: {

                        orderBy: {

                            recordDate: "desc"

                        }

                    }

                },

                orderBy: [

                    {
                        deviceName: "asc"
                    },

                    {
                        serialNumber: "asc"
                    }

                ]

            });


        const workbook =
            new ExcelJS.Workbook();


        const sheet =
            workbook.addWorksheet(
                "VACON History"
            );


        sheet.columns = [

            {
                header: "Record Date",
                key: "recordDate",
                width: 15
            },

            {
                header: "Station",
                key: "station",
                width: 12
            },

            {
                header: "Tandem",
                key: "tandem",
                width: 15
            },

            {
                header: "Device Name",
                key: "deviceName",
                width: 18
            },

            {
                header: "Serial Number",
                key: "serialNumber",
                width: 22
            },

            {
                header: "Application",
                key: "application",
                width: 35
            },

            {
                header: "Power Unit Date",
                key: "powerUnitDate",
                width: 18
            },

            {
                header: "Operation Hours",
                key: "operationHours",
                width: 18
            },

            {
                header: "Fault History",
                key: "faultHistory",
                width: 40
            },

            {
                header: "Description",
                key: "description",
                width: 40
            },

            {
                header: "Possible Cause",
                key: "possibleCause",
                width: 40
            },

            {
                header: "Corrective Actions",
                key: "correctiveActions",
                width: 40
            },

            {
                header: "Note",
                key: "note",
                width: 30
            }

        ];


        // Header style
        sheet.getRow(1).font = {
            bold: true
        };


        for (const device of devices) {

            // =================================================
            // DEVICE KHÔNG CÓ HISTORY
            // =================================================

            if (!device.histories.length) {

                sheet.addRow({

                    recordDate: "",

                    station:
                        device.station,

                    tandem:
                        device.tandem,

                    deviceName:
                        device.deviceName,

                    serialNumber:
                        device.serialNumber,

                    application:
                        device.application,

                    powerUnitDate: "",

                    operationHours: "",

                    faultHistory: "",

                    description: "",

                    possibleCause: "",

                    correctiveActions: "",

                    note: ""

                });

                continue;
            }


            // =================================================
            // HISTORY
            // =================================================

            for (
                const history
                of device.histories
            ) {

                sheet.addRow({

                    recordDate:
                        history.recordDate
                            ? new Date(
                                history.recordDate
                            ).toLocaleDateString(
                                "vi-VN"
                            )
                            : "",

                    station:
                        device.station,

                    tandem:
                        device.tandem,

                    deviceName:
                        device.deviceName,

                    serialNumber:
                        device.serialNumber,

                    application:
                        device.application,

                    powerUnitDate:
                        history.powerUnitDate || "",

                    operationHours:
                        history.operationHours || "",

                    faultHistory:
                        history.faultHistory || "",

                    description:
                        history.description || "",

                    possibleCause:
                        history.possibleCause || "",

                    correctiveActions:
                        history.correctiveActions || "",

                    note:
                        history.note || ""

                });

            }

        }


        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );


        res.setHeader(
            "Content-Disposition",
            'attachment; filename="Vacon_History.xlsx"'
        );


        await workbook.xlsx.write(res);

        res.end();

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// ============================================================
// GET ONE DEVICE
// ============================================================

exports.getOne = async (req, res) => {

    try {

        const id =
            Number(req.params.id);


        if (isNaN(id)) {

            return res.status(400).json({

                message:
                    "ID không hợp lệ"

            });

        }


        const device =
            await prisma.vaconDevice.findUnique({

                where: {
                    id
                },

                include: {

                    histories: {

                        orderBy: {

                            recordDate: "desc"

                        }

                    }

                }

            });


        if (!device) {

            return res.status(404).json({

                message:
                    "Không tìm thấy thiết bị"

            });

        }


        res.json(device);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message:
                err.message

        });

    }

};


// ============================================================
// CREATE DEVICE
// ============================================================

exports.create = async (req, res) => {

    try {

        const {

            deviceName,

            serialNumber,

            station,

            tandem,

            application

        } = req.body;


        const device =
            await prisma.vaconDevice.create({

                data: {

                    deviceName:
                        normalize(deviceName),

                    serialNumber:
                        normalize(serialNumber),

                    station:
                        normalize(station),

                    tandem:
                        normalize(tandem),

                    application:
                        normalize(application)

                }

            });


        res.json(device);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message:
                err.message

        });

    }

};


// ============================================================
// UPDATE DEVICE
// ============================================================

exports.update = async (req, res) => {

    try {

        const id =
            Number(req.params.id);


        if (isNaN(id)) {

            return res.status(400).json({

                message:
                    "ID không hợp lệ"

            });

        }


        const {

            deviceName,

            serialNumber,

            station,

            tandem,

            application

        } = req.body;


        const data = {};


        if (
            deviceName !== undefined
        ) {
            data.deviceName =
                normalize(deviceName);
        }


        if (
            serialNumber !== undefined
        ) {
            data.serialNumber =
                normalize(serialNumber);
        }


        if (
            station !== undefined
        ) {
            data.station =
                normalize(station);
        }


        if (
            tandem !== undefined
        ) {
            data.tandem =
                normalize(tandem);
        }


        if (
            application !== undefined
        ) {
            data.application =
                normalize(application);
        }


        const device =
            await prisma.vaconDevice.update({

                where: {
                    id
                },

                data

            });


        res.json(device);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message:
                err.message

        });

    }

};


// ============================================================
// DELETE DEVICE
// ============================================================

exports.remove = async (req, res) => {

    try {

        const id =
            Number(req.params.id);


        if (isNaN(id)) {

            return res.status(400).json({

                success: false,

                message:
                    "ID không hợp lệ"

            });

        }


        await prisma.vaconHistory.deleteMany({

            where: {

                deviceId: id

            }

        });


        await prisma.vaconDevice.delete({

            where: {

                id

            }

        });


        res.json({

            success: true,

            message:
                "Đã xóa thiết bị"

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message:
                err.message

        });

    }

};


// ============================================================
// PREVIEW IMPORT
// ============================================================

exports.previewImport = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message:
                    "Chưa chọn file"

            });

        }


        // ====================================================
        // PARSE EXCEL
        // ====================================================

        const rows =
            await parseExcel(
                req.file
            );


        console.log(
            "========================================"
        );

        console.log(
            "========== PREVIEW IMPORT VACON =========="
        );

        console.log(
            "Excel rows:",
            rows.length
        );


        if (rows.length) {

            console.log(
                "First Excel row:"
            );

            console.log(
                rows[0]
            );

        }


        // ====================================================
        // COMPARE
        // ====================================================

        const compare =
            await compareRows(
                rows
            );


        console.log(
            "Compare rows:",
            compare.length
        );


        if (compare.length) {

            console.log(
                "First compare row:"
            );

            console.log(
                compare[0]
            );

        }


        // ====================================================
        // SUMMARY
        // ====================================================

        const summary = {

            total:
                compare.length,

            newCount:
                compare.filter(
                    x =>
                        x.status === "NEW"
                ).length,

            deviceUpdateCount:
                compare.filter(
                    x =>
                        x.status === "UPDATE_DEVICE"
                ).length,

            historyUpdateCount:
                compare.filter(
                    x =>
                        x.status === "UPDATE_HISTORY"
                ).length,

            bothUpdateCount:
                compare.filter(
                    x =>
                        x.status === "UPDATE_BOTH"
                ).length,

            skipCount:
                compare.filter(
                    x =>
                        x.status === "SKIP"
                ).length

        };


        // Tổng số UPDATE
        summary.updateCount =
            summary.deviceUpdateCount +
            summary.historyUpdateCount +
            summary.bothUpdateCount;


        console.log(
            "Summary:",
            summary
        );


        console.log(
            "========================================"
        );


        // ====================================================
        // DELETE OLD SESSION
        // ====================================================

        await prisma.importSession.deleteMany({

            where: {

                module:
                    "VACON",

                userId:
                    req.user?.id || null

            }

        });


        // ====================================================
        // CREATE SESSION
        // ====================================================

        const session =
            await prisma.importSession.create({

                data: {

                    module:
                        "VACON",

                    filename:
                        req.file.originalname,

                    data:
                        compare,

                    total:
                        summary.total,

                    newCount:
                        summary.newCount,

                    updateCount:
                        summary.updateCount,

                    skipCount:
                        summary.skipCount,

                    userId:
                        req.user?.id || null,

                    expiredAt:
                        new Date(
                            Date.now() +
                            30 * 60 * 1000
                        )

                }

            });


        // ====================================================
        // RESPONSE
        // ====================================================

        res.json({

            success: true,

            sessionId:
                session.id,

            summary,

            rows:
                compare

        });

    }

    catch (err) {

        console.error(
            "PREVIEW IMPORT ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            message:
                err.message

        });

    }

};


// ============================================================
// IMPORT FROM PREVIEW
// ============================================================

exports.importExcel = async (req, res) => {

    try {

        const {
            sessionId
        } = req.body;


        if (!sessionId) {

            return res.status(400).json({

                success: false,

                message:
                    "Thiếu sessionId"

            });

        }


        // ====================================================
        // GET SESSION
        // ====================================================

        const session =
            await prisma.importSession.findUnique({

                where: {

                    id:
                        sessionId

                }

            });


        if (!session) {

            return res.status(404).json({

                success: false,

                message:
                    "Preview không tồn tại"

            });

        }


        if (
            session.module !== "VACON"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Sai module"

            });

        }


        if (
            new Date(
                session.expiredAt
            ) < new Date()
        ) {

            await prisma.importSession.delete({

                where: {

                    id:
                        session.id

                }

            });


            return res.status(400).json({

                success: false,

                message:
                    "Preview đã hết hạn"

            });

        }


        const rows =
            Array.isArray(session.data)
                ? session.data
                : [];


        let created =
            0;

        let updated =
            0;

        let skipped =
            0;

        let histories =
            0;


        // ====================================================
        // IMPORT
        // ====================================================

        for (
            const item
            of rows
        ) {

            // =================================================
            // NEW
            // =================================================

            if (
                item.status === "NEW"
            ) {

                const device =
                    await prisma.vaconDevice.upsert({

                        where: {

                            serialNumber:
                                item.serialNumber

                        },

                        update: {

                            deviceName:
                                item.deviceName,

                            station:
                                item.station,

                            tandem:
                                item.tandem,

                            application:
                                item.application

                        },

                        create: {

                            deviceName:
                                item.deviceName,

                            serialNumber:
                                item.serialNumber,

                            station:
                                item.station,

                            tandem:
                                item.tandem,

                            application:
                                item.application

                        }

                    });


                created++;


                // =============================================
                // HISTORY
                // =============================================

                const existed =
                    await prisma.vaconHistory.findFirst({

                        where: {

                            deviceId:
                                device.id,

                            recordDate:
                                item.recordDate,

                            operationHours:
                                item.operationHours,

                            powerUnitDate:
                                item.powerUnitDate || null,

                            faultHistory:
                                item.faultHistory || null

                        }

                    });


                if (!existed) {

                    await prisma.vaconHistory.create({

                        data: {

                            deviceId:
                                device.id,

                            recordDate:
                                item.recordDate,

                            operationHours:
                                item.operationHours || null,

                            powerUnitDate:
                                item.powerUnitDate || null,

                            faultHistory:
                                item.faultHistory || null,

                            description:
                                item.description || null,

                            possibleCause:
                                item.possibleCause || null,

                            correctiveActions:
                                item.correctiveActions || null,

                            note:
                                item.note || null

                        }

                    });


                    histories++;

                }

                else {

                    skipped++;

                }


                continue;
            }


            // =================================================
            // UPDATE DEVICE
            // =================================================

            if (
                item.status === "UPDATE_DEVICE"
            ) {

                await prisma.vaconDevice.update({

                    where: {

                        id:
                            Number(
                                item.deviceId
                            )

                    },

                    data:
                        item.updateData || {}

                });


                updated++;

                continue;
            }


            // =================================================
            // UPDATE HISTORY
            // =================================================

            if (
                item.status === "UPDATE_HISTORY"
            ) {

                // ---------------------------------------------
                // Có historyId → UPDATE TRỰC TIẾP
                // ---------------------------------------------

                if (item.historyId) {

                    await prisma.vaconHistory.update({

                        where: {

                            id:
                                Number(
                                    item.historyId
                                )

                        },

                        data: {

                            recordDate:
                                item.recordDate,

                            operationHours:
                                item.operationHours || null,

                            powerUnitDate:
                                item.powerUnitDate || null,

                            faultHistory:
                                item.faultHistory || null,

                            description:
                                item.description || null,

                            possibleCause:
                                item.possibleCause || null,

                            correctiveActions:
                                item.correctiveActions || null,

                            note:
                                item.note || null

                        }

                    });


                    updated++;

                }

                // ---------------------------------------------
                // Không có historyId → CREATE
                // ---------------------------------------------

                else {

                    await prisma.vaconHistory.create({

                        data: {

                            deviceId:
                                Number(
                                    item.deviceId
                                ),

                            recordDate:
                                item.recordDate,

                            operationHours:
                                item.operationHours || null,

                            powerUnitDate:
                                item.powerUnitDate || null,

                            faultHistory:
                                item.faultHistory || null,

                            description:
                                item.description || null,

                            possibleCause:
                                item.possibleCause || null,

                            correctiveActions:
                                item.correctiveActions || null,

                            note:
                                item.note || null

                        }

                    });


                    histories++;
                }


                continue;
            }


            // =================================================
            // UPDATE BOTH
            // =================================================

            if (
                item.status === "UPDATE_BOTH"
            ) {

                // ---------------------------------------------
                // 1. UPDATE DEVICE
                // ---------------------------------------------

                if (
                    item.updateData &&
                    Object.keys(
                        item.updateData
                    ).length > 0
                ) {

                    await prisma.vaconDevice.update({

                        where: {

                            id:
                                Number(
                                    item.deviceId
                                )

                        },

                        data:
                            item.updateData

                    });

                }


                // ---------------------------------------------
                // 2. UPDATE HISTORY
                // ---------------------------------------------

                if (item.historyId) {

                    await prisma.vaconHistory.update({

                        where: {

                            id:
                                Number(
                                    item.historyId
                                )

                        },

                        data: {

                            recordDate:
                                item.recordDate,

                            operationHours:
                                item.operationHours || null,

                            powerUnitDate:
                                item.powerUnitDate || null,

                            faultHistory:
                                item.faultHistory || null,

                            description:
                                item.description || null,

                            possibleCause:
                                item.possibleCause || null,

                            correctiveActions:
                                item.correctiveActions || null,

                            note:
                                item.note || null

                        }

                    });


                    updated++;

                }

                else {

                    await prisma.vaconHistory.create({

                        data: {

                            deviceId:
                                Number(
                                    item.deviceId
                                ),

                            recordDate:
                                item.recordDate,

                            operationHours:
                                item.operationHours || null,

                            powerUnitDate:
                                item.powerUnitDate || null,

                            faultHistory:
                                item.faultHistory || null,

                            description:
                                item.description || null,

                            possibleCause:
                                item.possibleCause || null,

                            correctiveActions:
                                item.correctiveActions || null,

                            note:
                                item.note || null

                        }

                    });


                    histories++;
                }


                continue;
            }


            // =================================================
            // SKIP
            // =================================================

            if (
                item.status === "SKIP"
            ) {

                skipped++;

                continue;
            }


            // =================================================
            // UNKNOWN STATUS
            // =================================================

            skipped++;

        }


        // ====================================================
        // DELETE SESSION
        // ====================================================

        await prisma.importSession.delete({

            where: {

                id:
                    session.id

            }

        });


        // ====================================================
        // RESPONSE
        // ====================================================

        res.json({

            success: true,

            summary: {

                total:
                    rows.length,

                created,

                updated,

                skipped,

                histories

            }

        });

    }

    catch (err) {

        console.error(
            "IMPORT VACON ERROR:",
            err
        );

        res.status(500).json({

            success: false,

            message:
                err.message

        });

    }

};


// ============================================================
// GET HISTORY BY DEVICE
// ============================================================

exports.getHistory = async (req, res) => {

    try {

        const deviceId =
            Number(
                req.params.deviceId
            );


        if (isNaN(deviceId)) {

            return res.status(400).json({

                message:
                    "deviceId không hợp lệ"

            });

        }


        const device =
            await prisma.vaconDevice.findUnique({

                where: {

                    id:
                        deviceId

                },

                include: {

                    histories: {

                        orderBy: {

                            recordDate:
                                "desc"

                        }

                    }

                }

            });


        if (!device) {

            return res.status(404).json({

                message:
                    "Không tìm thấy thiết bị"

            });

        }


        res.json({

            device: {

                id:
                    device.id,

                deviceName:
                    device.deviceName,

                serialNumber:
                    device.serialNumber,

                station:
                    device.station,

                tandem:
                    device.tandem,

                application:
                    device.application

            },

            histories:
                device.histories

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message:
                err.message

        });

    }

};


// ============================================================
// MIGRATE VACON RECORD
// ============================================================

exports.migrateData = async (req, res) => {

    try {

        const records =
            await prisma.vaconRecord.findMany({

                orderBy: {

                    recordDate:
                        "asc"

                }

            });


        let deviceCount =
            0;

        let historyCount =
            0;


        for (
            const row
            of records
        ) {

            if (!row.deviceName) {
                continue;
            }


            let device =
                null;


            // =================================================
            // FIND BY SERIAL
            // =================================================

            if (row.serialNumber) {

                device =
                    await prisma.vaconDevice.findUnique({

                        where: {

                            serialNumber:
                                row.serialNumber

                        }

                    });

            }


            // =================================================
            // CREATE DEVICE
            // =================================================

            if (!device) {

                device =
                    await prisma.vaconDevice.create({

                        data: {

                            deviceName:
                                row.deviceName,

                            serialNumber:
                                row.serialNumber,

                            station:
                                row.station,

                            tandem:
                                row.tandem,

                            application:
                                row.application

                        }

                    });


                deviceCount++;

            }

            // =================================================
            // UPDATE DEVICE
            // =================================================

            else {

                await prisma.vaconDevice.update({

                    where: {

                        id:
                            device.id

                    },

                    data: {

                        deviceName:
                            row.deviceName,

                        station:
                            row.station,

                        tandem:
                            row.tandem,

                        application:
                            row.application

                    }

                });

            }


            // =================================================
            // FIND HISTORY
            // =================================================

            const existed =
                await prisma.vaconHistory.findFirst({

                    where: {

                        deviceId:
                            device.id,

                        recordDate:
                            row.recordDate,

                        operationHours:
                            row.operationHours

                    }

                });


            if (existed) {
                continue;
            }


            // =================================================
            // CREATE HISTORY
            // =================================================

            await prisma.vaconHistory.create({

                data: {

                    deviceId:
                        device.id,

                    recordDate:
                        row.recordDate,

                    operationHours:
                        row.operationHours,

                    powerUnitDate:
                        row.powerUnitDate,

                    faultHistory:
                        row.faultHistory,

                    description:
                        row.description,

                    possibleCause:
                        row.possibleCause,

                    correctiveActions:
                        row.correctiveActions,

                    note:
                        row.note

                }

            });


            historyCount++;

        }


        res.json({

            success: true,

            devices:
                deviceCount,

            histories:
                historyCount

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message:
                err.message

        });

    }

};


// ============================================================
// UPDATE HISTORY
// ============================================================

exports.updateHistory = async (req, res) => {

    try {

        const id =
            Number(
                req.params.id
            );


        if (isNaN(id)) {

            return res.status(400).json({

                message:
                    "ID lịch sử không hợp lệ"

            });

        }


        const item =
            await prisma.vaconHistory.update({

                where: {

                    id

                },

                data: {

                    recordDate:
                        req.body.recordDate
                            ? new Date(
                                req.body.recordDate
                            )
                            : null,

                    operationHours:
                        req.body.operationHours || null,

                    powerUnitDate:
                        req.body.powerUnitDate || null,

                    faultHistory:
                        req.body.faultHistory || null,

                    description:
                        req.body.description || null,

                    possibleCause:
                        req.body.possibleCause || null,

                    correctiveActions:
                        req.body.correctiveActions || null,

                    note:
                        req.body.note || null

                }

            });


        res.json(item);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message:
                err.message

        });

    }

};
