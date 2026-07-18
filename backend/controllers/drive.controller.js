const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const ExcelJS = require("exceljs");

const xlsx = require("xlsx");

function get(row, ...keys) {
    for (const key of keys) {
        if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
            return row[key];
        }
    }
    return null;
}

function excelDate(value) {
    if (!value) return null;

    if (value instanceof Date) return value;

    if (typeof value === "number") {
        return new Date(Math.round((value - 25569) * 86400 * 1000));
    }

    const d = new Date(value);

    return isNaN(d) ? null : d;
}

function normalize(value) {

    if (value === null || value === undefined) return "";

    return String(value).trim().toUpperCase();

}

function sameDate(dbDate, excelValue) {

    const d1 = dbDate
        ? new Date(dbDate).toISOString().slice(0, 10)
        : "";

    const d2 = excelValue
        ? (excelDate(excelValue)?.toISOString().slice(0, 10) || "")
        : "";

    return d1 === d2;

}

async function compareRows(rows) {

    const drives = await prisma.drive.findMany();

    const driveMap = new Map();

    drives.forEach(drive => {

        if (drive.deviceId) {

            driveMap.set(

                normalize(drive.deviceId),

                drive

            );

        }

    });

    const compareFields = [

        ["name", "Tên biến tần"],

        ["brand", "Hãng"],

        ["model", "Model"],

        ["serialNumber", "Serial Number"],

        ["line", "Tuyến"],

        ["station", "Nhà ga"],

        ["location", "Vị trí"],

        ["ipAddress", "IP Address"],

        ["firmware", "Firmware"],

        ["power", "Công suất"],

        ["voltage", "Điện áp"],

        ["status", "Trạng thái"],

        ["note", "Ghi chú"]

    ];

    let newCount = 0;

    let updateCount = 0;

    let skipCount = 0;

    const result = rows.map(row => {

        const deviceId = get(

            row,

            "Mã thiết bị",

            "Device ID",

            "deviceId"

        );

        if (!deviceId) {

            skipCount++;

            return {

                action: "SKIP",

                reason: "Thiếu Device ID",

                changedFields: [],

                row

            };

        }

        const key = normalize(deviceId);

        const old = driveMap.get(key);

        if (!old) {

            newCount++;

            return {

                action: "NEW",

                changedFields: [],

                row

            };

        }

        const changedFields = [];

        for (const [dbField, excelField] of compareFields) {

            const oldValue = normalize(old[dbField]);

            const newValue = normalize(get(row, excelField));

            if (oldValue !== newValue) {

                changedFields.push(excelField);

            }

        }

        if (!sameDate(old.installDate, get(row, "Ngày lắp đặt"))) {

            changedFields.push("Ngày lắp đặt");

        }

        if (changedFields.length > 0) {

            updateCount++;

            return {

                action: "UPDATE",

                changedFields,

                row

            };

        }

        skipCount++;

        return {

            action: "SKIP",

            changedFields: [],

            row

        };

    });

    return {

        summary: {

            total: rows.length,

            newCount,

            updateCount,

            skipCount

        },

        rows: result

    };

}

// ======================================================
// GET ALL
// ======================================================

exports.getAll = async (req, res) => {

    try {

        const drives = await prisma.drive.findMany({

            orderBy: {

                id: "desc"

            }

        });

        res.json(drives);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Lỗi lấy danh sách biến tần"

        });

    }

};

// ======================================================
// GET ONE
// ======================================================

exports.getOne = async (req, res) => {

    try {

        const drive = await prisma.drive.findUnique({

            where: {

                id: Number(req.params.id)

            }

        });

        if (!drive) {

            return res.status(404).json({

                message: "Không tìm thấy biến tần"

            });

        }

        res.json(drive);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Lỗi lấy thông tin biến tần"

        });

    }

};

// ======================================================
// CREATE
// ======================================================
exports.create = async (req, res) => {

    try {

        const drive = await prisma.drive.create({

            data: {

                name: req.body.name,

                deviceId: req.body.deviceId,

                brand: req.body.brand,

                model: req.body.model,

                serialNumber: req.body.serialNumber,

                firmware: req.body.firmware,

                ipAddress: req.body.ipAddress,

                power: req.body.power,

                voltage: req.body.voltage,

                current: req.body.current,

                line: req.body.line,

                station: req.body.station,

                location: req.body.location,

                status: req.body.status || "Running",

                installDate: req.body.installDate
                    ? new Date(req.body.installDate)
                    : null,

                image: req.body.image,

                note: req.body.note

            }

        });

        res.json(drive);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: err.message

        });

    }

};

// ======================================================
// UPDATE
// ======================================================
exports.update = async (req, res) => {

    try {

        const drive = await prisma.drive.update({

            where: {

                id: Number(req.params.id)

            },

            data: {

                name: req.body.name,

                deviceId: req.body.deviceId,

                brand: req.body.brand,

                model: req.body.model,

                serialNumber: req.body.serialNumber,

                firmware: req.body.firmware,

                ipAddress: req.body.ipAddress,

                power: req.body.power,

                voltage: req.body.voltage,

                current: req.body.current,

                line: req.body.line,

                station: req.body.station,

                location: req.body.location,

                status: req.body.status,

                installDate: req.body.installDate
                    ? new Date(req.body.installDate)
                    : null,

                image: req.body.image,

                note: req.body.note

            }

        });

        res.json(drive);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: err.message

        });

    }

};

// ======================================================
// DELETE
// ======================================================

exports.remove = async (req, res) => {

    try {

        await prisma.drive.delete({

            where: {

                id: Number(req.params.id)

            }

        });

        res.json({

            success: true,

            message: "Đã xóa biến tần"

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Xóa biến tần thất bại"

        });

    }

};

// ======================================================
// DASHBOARD STATISTICS
// ======================================================

exports.getStatistics = async (req, res) => {

    try {

        const drives = await prisma.drive.findMany();

        const statistics = {

            total: drives.length,

            abb: drives.filter(d => d.brand?.toLowerCase() === "abb").length,

            vacon: drives.filter(d => d.brand?.toLowerCase() === "vacon").length,

            running: drives.filter(d => d.status === "Running").length,

            fault: drives.filter(d => d.status === "Fault").length,

            maintenance: drives.filter(d => d.status === "Maintenance").length

        };

        res.json(statistics);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Lỗi thống kê"

        });

    }

};

// ================= IMAGE =================

exports.uploadImage = async (req, res) => {

    res.json({
        message: "Chưa triển khai upload ảnh"
    });

};

exports.previewImport = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                message: "Chưa chọn file Excel."

            });

        }

        const workbook = xlsx.read(req.file.buffer, {
            type: "buffer",
        });


        const sheet =
            workbook.Sheets[workbook.SheetNames[0]];

        const rows =
            xlsx.utils.sheet_to_json(sheet, {

                defval: ""

            });

        

        console.log("Excel rows:", rows.length);

        const result =
            await compareRows(rows);

        console.log("Compare rows:", result.summary);

        const session =
            await prisma.importSession.create({

                data: {

                    module: "drive",

                    filename:
                        req.file.originalname,

                    data: result.rows,

                    total:
                        result.summary.total,

                    newCount:
                        result.summary.newCount,

                    updateCount:
                        result.summary.updateCount,

                    skipCount:
                        result.summary.skipCount,

                    userId:
                        req.user?.id || null,

                    expiredAt:
                        new Date(
                            Date.now() + 30 * 60 * 1000
                        )

                }

            });

        res.json({

            success: true,

            sessionId: session.id,

            summary: result.summary,

            rows: result.rows

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: err.message

        });

    }

};

// ================= IMPORT =================

exports.importExcel = async (req, res) => {

    try {

        const { sessionId } = req.body;

        if (!sessionId) {

            return res.status(400).json({

                message: "Thiếu sessionId."

            });

        }

        const session = await prisma.importSession.findUnique({

            where: {

                id: sessionId

            }

        });

        if (!session) {

            return res.status(404).json({

                message: "Không tìm thấy phiên import."

            });

        }

        const rows = session.data || [];

        // Load toàn bộ Drive chỉ 1 lần

        const drives = await prisma.drive.findMany();

        const driveMap = new Map();

        drives.forEach(d => {

            if (d.deviceId) {

                driveMap.set(

                    d.deviceId.trim().toUpperCase(),

                    d

                );

            }

        });

        let created = 0;

        let updated = 0;

        for (const item of rows) {

            if (item.action === "SKIP") continue;

            const row = item.row;

            const deviceId = get(

                row,

                "Mã thiết bị",

                "Device ID",

                "deviceId"

            );

            if (!deviceId) continue;

            const key = deviceId.trim().toUpperCase();

            const data = {

                name: get(
                    row,
                    "Tên biến tần",
                    "Device Name",
                    "Name"
                ),

                deviceId,

                brand: get(
                    row,
                    "Hãng",
                    "Brand"
                ),

                model: get(
                    row,
                    "Model"
                ),

                serialNumber: get(
                    row,
                    "Serial Number",
                    "Serial"
                ),

                firmware: get(
                    row,
                    "Firmware"
                ),

                ipAddress: get(
                    row,
                    "IP Address"
                ),

                power: get(
                    row,
                    "Công suất",
                    "Power"
                ),

                voltage: get(
                    row,
                    "Điện áp",
                    "Voltage"
                ),

                line: get(
                    row,
                    "Tuyến",
                    "Line"
                ),

                station: get(
                    row,
                    "Nhà ga",
                    "Station"
                ),

                location: get(
                    row,
                    "Vị trí",
                    "Location"
                ),

                status: get(
                    row,
                    "Trạng thái",
                    "Status"
                ) || "Running",

                installDate: excelDate(

                    get(
                        row,
                        "Ngày lắp đặt",
                        "Install Date"
                    )

                ),

                note: get(
                    row,
                    "Ghi chú",
                    "Note"
                )

            };

            // CREATE

            if (!driveMap.has(key)) {

                const drive = await prisma.drive.create({

                    data

                });

                driveMap.set(key, drive);

                created++;

            }

            // UPDATE

            else {

                await prisma.drive.update({

                    where: {

                        id: driveMap.get(key).id

                    },

                    data

                });

                updated++;

            }

        }

        await prisma.importSession.delete({

            where: {

                id: sessionId

            }

        });

        res.json({

            success: true,

            created,

            updated,

            skipped: session.skipCount,

            total: session.total

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: err.message

        });

    }

};

// ================= EXPORT =================

exports.exportExcel = async (req, res) => {

    const drives = await prisma.drive.findMany({

        orderBy: {

            name: "asc"

        }

    });

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Drives");

    sheet.columns = [

        { header: "Tên biến tần", key: "name", width: 30 },

        { header: "Mã thiết bị", key: "deviceId", width: 20 },

        { header: "Serial Number", key: "serialNumber", width: 25 },

        { header: "Hãng", key: "brand", width: 15 },

        { header: "Model", key: "model", width: 20 },

        { header: "Tuyến", key: "line", width: 15 },

        { header: "Nhà ga", key: "station", width: 20 },

        { header: "Vị trí", key: "location", width: 20 },

        { header: "IP Address", key: "ipAddress", width: 18 },

        { header: "Firmware", key: "firmware", width: 18 },

        { header: "Công suất", key: "power", width: 15 },

        { header: "Điện áp", key: "voltage", width: 15 },

        { header: "Trạng thái", key: "status", width: 15 },

        { header: "Ngày lắp đặt", key: "installDate", width: 18 },

        { header: "Ghi chú", key: "note", width: 40 }

    ];

    drives.forEach(drive => {

        sheet.addRow({

            ...drive,

            installDate: drive.installDate
                ? new Date(drive.installDate).toLocaleDateString("vi-VN")
                : ""

        });

    });

    sheet.getRow(1).font = {

        bold: true

    };

    res.setHeader(

        "Content-Type",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    );

    res.setHeader(

        "Content-Disposition",

        'attachment; filename="Drive.xlsx"'

    );

    await workbook.xlsx.write(res);

    res.end();

};

exports.getFilters = async (req, res) => {

    try {

        const drives = await prisma.drive.findMany();

        res.json({

            brands: [
                ...new Set(
                    drives
                        .map(d => d.brand)
                        .filter(Boolean)
                )
            ],

            models: [
                ...new Set(
                    drives
                        .map(d => d.model)
                        .filter(Boolean)
                )
            ],

            lines: [
                ...new Set(
                    drives
                        .map(d => d.line)
                        .filter(Boolean)
                )
            ],

            stations: [
                ...new Set(
                    drives
                        .map(d => d.station)
                        .filter(Boolean)
                )
            ]

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Lỗi lấy bộ lọc"

        });

    }

};

// ================= FAULT =================

exports.getFaults = async (req, res) => {

    res.json([]);

};

exports.addFault = async (req, res) => {

    res.json({
        message: "Chưa triển khai thêm lỗi"
    });

};

exports.updateFault = async (req, res) => {

    res.json({
        message: "Chưa triển khai cập nhật lỗi"
    });

};

exports.deleteFault = async (req, res) => {

    res.json({
        message: "Chưa triển khai xóa lỗi"
    });

};
