const { PrismaClient } = require("@prisma/client");
const ExcelJS = require("exceljs");
const XLSX = require("xlsx");

const prisma = new PrismaClient();

/* =====================================================
   Helper
===================================================== */

async function writeHistory({
    motorId = null,
    action,
    user,
    deviceId,
    name,
    note = "",
    changes = null
}) {
    try {
        await prisma.motorHistory.create({
            data: {
                motorId,
                action,
                user,
                deviceId,
                name,
                note,
                changes
            }
        });
    } catch (err) {
        console.error("MotorHistory:", err.message);
    }
}

/* =====================================================
   GET ALL
===================================================== */

exports.getMotors = async (req, res) => {
    try {
        const motors = await prisma.motor.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json(motors);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Không thể lấy danh sách động cơ."
        });
    }
};

/* =====================================================
   GET ONE
===================================================== */

exports.getMotor = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const motor = await prisma.motor.findUnique({
            where: { id }
        });

        if (!motor) {
            return res.status(404).json({
                message: "Không tìm thấy động cơ."
            });
        }

        res.json(motor);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Không thể lấy thông tin động cơ."
        });
    }
};

/* =====================================================
   CREATE
===================================================== */

exports.createMotor = async (req, res) => {
    try {

        const data = req.body;

        const exists = await prisma.motor.findUnique({
            where: {
                deviceId: data.deviceId
            }
        });

        if (exists) {
            return res.status(400).json({
                message: "Mã thiết bị đã tồn tại."
            });
        }

        const motor = await prisma.motor.create({
            data: {

                deviceId: data.deviceId,

                name: data.name,

                type: data.type,

                brand: data.brand,

                model: data.model,

                serial: data.serial,

                power: data.power,

                voltage: data.voltage,

                current: data.current,

                frequency: data.frequency,

                rpm: data.rpm,

                efficiency: data.efficiency,

                pole: data.pole,

                bearingCode: data.bearingCode,

                line: data.line,

                station: data.station,

                location: data.location,

                warehouse: data.warehouse,

                status: data.status,

                installDate: data.installDate
                    ? new Date(data.installDate)
                    : null,

                maintenanceDate: data.maintenanceDate
                    ? new Date(data.maintenanceDate)
                    : null,

                replacementDate: data.replacementDate
                    ? new Date(data.replacementDate)
                    : null,

                runningHours: data.runningHours
                    ? Number(data.runningHours)
                    : null,

                image: data.image,

                note: data.note

            }
        });

        await writeHistory({

            motorId: motor.id,

            action: "CREATE",

            user: req.user?.username || "System",

            deviceId: motor.deviceId,

            name: motor.name,

            note: "Thêm mới động cơ"

        });

        res.status(201).json(motor);

    } catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Không thể thêm động cơ."

        });

    }
};

/* =====================================================
   UPDATE
===================================================== */

exports.updateMotor = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const data = req.body;

        const oldMotor = await prisma.motor.findUnique({

            where: { id }

        });

        if (!oldMotor) {

            return res.status(404).json({

                message: "Không tìm thấy động cơ."

            });

        }

        const duplicate = await prisma.motor.findFirst({

            where: {

                deviceId: data.deviceId,

                NOT: {

                    id

                }

            }

        });

        if (duplicate) {

            return res.status(400).json({

                message: "Mã thiết bị đã tồn tại."

            });

        }

        const updated = await prisma.motor.update({

            where: { id },

            data: {

                deviceId: data.deviceId,

                name: data.name,

                type: data.type,

                brand: data.brand,

                model: data.model,

                serial: data.serial,

                power: data.power,

                voltage: data.voltage,

                current: data.current,

                frequency: data.frequency,

                rpm: data.rpm,

                efficiency: data.efficiency,

                pole: data.pole,

                bearingCode: data.bearingCode,

                line: data.line,

                station: data.station,

                location: data.location,

                warehouse: data.warehouse,

                status: data.status,

                installDate: data.installDate
                    ? new Date(data.installDate)
                    : null,

                maintenanceDate: data.maintenanceDate
                    ? new Date(data.maintenanceDate)
                    : null,

                replacementDate: data.replacementDate
                    ? new Date(data.replacementDate)
                    : null,

                runningHours: data.runningHours
                    ? Number(data.runningHours)
                    : null,

                image: data.image,

                note: data.note

            }

        });

        const changes = {};

        Object.keys(data).forEach(key => {

            const oldValue = oldMotor[key];

            const newValue = updated[key];

            if (String(oldValue ?? "") !== String(newValue ?? "")) {

                changes[key] = {

                    old: oldValue,

                    new: newValue

                };

            }

        });

        await writeHistory({

            motorId: updated.id,

            action: "UPDATE",

            user: req.user?.username || "System",

            deviceId: updated.deviceId,

            name: updated.name,

            note: "Cập nhật thông tin động cơ",

            changes

        });

        res.json(updated);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Không thể cập nhật động cơ."

        });

    }

};


/* =====================================================
   DELETE
===================================================== */

exports.deleteMotor = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const motor = await prisma.motor.findUnique({

            where: { id }

        });

        if (!motor) {

            return res.status(404).json({

                message: "Không tìm thấy động cơ."

            });

        }

        await prisma.motor.delete({

            where: { id }

        });

        await writeHistory({

            motorId: null,

            action: "DELETE",

            user: req.user?.username || "System",

            deviceId: motor.deviceId,

            name: motor.name,

            note: "Xóa động cơ"

        });

        res.json({

            message: "Đã xóa động cơ."

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Không thể xóa động cơ."

        });

    }

};


/* =====================================================
   STATISTICS
===================================================== */

exports.getStatistics = async (req, res) => {

    try {

        const motors = await prisma.motor.findMany();

        const statistics = {

            total: motors.length,

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

            otherType: 0

        };

        motors.forEach(motor => {

            // Brand

            switch (motor.brand) {

                case "ABB":

                    statistics.abb++;

                    break;

                case "Siemens":

                    statistics.siemens++;

                    break;

                default:

                    statistics.otherBrand++;

            }

            // Status

            switch (motor.status) {

                case "Running":

                    statistics.running++;

                    break;

                case "Maintenance":

                    statistics.maintenance++;

                    break;

                case "Replaced":

                    statistics.replaced++;

                    break;

                case "Original":

                    statistics.original++;

                    break;

            }

            // Type

            switch (motor.type) {

                case "Động cơ chính":

                    statistics.mainMotor++;

                    break;

                case "Động cơ bơm dầu":

                    statistics.oilPump++;

                    break;

                case "Động cơ làm mát":

                    statistics.cooling++;

                    break;

                case "Động cơ phanh":

                    statistics.brake++;

                    break;

                case "Động cơ nâng hạ":

                    statistics.lifting++;

                    break;

                default:

                    statistics.otherType++;

            }

        });

        res.json(statistics);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Không thể thống kê động cơ."

        });

    }

};

/* =====================================================
   PREVIEW IMPORT
===================================================== */

exports.previewImport = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                message: "Chưa chọn file."
            });
        }

        const workbook = XLSX.read(req.file.buffer, {
            type: "buffer"
        });

        const sheet =
            workbook.Sheets[
                workbook.SheetNames[0]
            ];

        const rows = XLSX.utils.sheet_to_json(sheet, {
            defval: ""
        });

        const preview = [];

        let newCount = 0;
        let updateCount = 0;
        let skipCount = 0;

        for (const excelRow of rows) {

            // ===========================
            // MAP EXCEL -> OBJECT
            // ===========================

            const row = {

                deviceId:
                    String(
                        excelRow["Mã TB"] ??
                        excelRow["Mã thiết bị"] ??
                        excelRow.deviceId ??
                        ""
                    ).trim(),

                name:
                    String(
                        excelRow["Tên động cơ"] ??
                        excelRow.name ??
                        ""
                    ).trim(),

                type:
                    String(
                        excelRow["Loại"] ??
                        excelRow.type ??
                        ""
                    ).trim(),

                brand:
                    String(
                        excelRow["Hãng"] ??
                        excelRow.brand ??
                        ""
                    ).trim(),

                model:
                    String(
                        excelRow["Model"] ??
                        excelRow.model ??
                        ""
                    ).trim(),

                power:
                    String(
                        excelRow["Công suất"] ??
                        excelRow.power ??
                        ""
                    ).trim(),

                line:
                    String(
                        excelRow["Tuyến"] ??
                        excelRow.line ??
                        ""
                    ).trim(),

                station:
                    String(
                        excelRow["Nhà ga"] ??
                        excelRow.station ??
                        ""
                    ).trim(),

                status:
                    String(
                        excelRow["Trạng thái"] ??
                        excelRow.status ??
                        ""
                    ).trim()

            };

            // ===========================
            // Không có mã TB
            // ===========================

            if (!row.deviceId) {

                skipCount++;

                preview.push({

                    action: "SKIP",

                    changedFields: [],

                    row

                });

                continue;

            }

            // ===========================
            // Tìm DB
            // ===========================

            const exists =
                await prisma.motor.findUnique({

                    where: {
                        deviceId: row.deviceId
                    }

                });

            // ===========================
            // Chưa tồn tại
            // ===========================

            if (!exists) {

                newCount++;

                preview.push({

                    action: "NEW",

                    changedFields: [],

                    row

                });

                continue;

            }

            // ===========================
            // So sánh
            // ===========================

            const changedFields = [];

            const fields = [

                "name",

                "type",

                "brand",

                "model",

                "power",

                "line",

                "station",

                "status"

            ];

            fields.forEach(field => {

                const oldValue =
                    String(
                        exists[field] ?? ""
                    ).trim();

                const newValue =
                    String(
                        row[field] ?? ""
                    ).trim();

                if (oldValue !== newValue) {

                    changedFields.push(field);

                }

            });

            // ===========================
            // Kết quả
            // ===========================

            if (changedFields.length === 0) {

                skipCount++;

                preview.push({

                    action: "SKIP",

                    changedFields,

                    row

                });

            }

            else {

                updateCount++;

                preview.push({

                    action: "UPDATE",

                    changedFields,

                    row

                });

            }

        }

        res.json({

            summary: {

                total: rows.length,

                new: newCount,

                update: updateCount,

                skip: skipCount

            },

            preview

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Không thể xem trước file import."

        });

    }

};

/* =====================================================
   IMPORT
===================================================== */

exports.importMotors = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                message: "Chưa chọn file."

            });

        }

        const workbook = XLSX.read(

            req.file.buffer,

            {

                type: "buffer"

            }

        );

        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const rows = XLSX.utils.sheet_to_json(sheet, {

            defval: ""

        });

        let created = 0;

        let updated = 0;

        for (const row of rows) {

            const deviceId = String(

                row["Mã TB"] ||

                row.deviceId ||

                ""

            ).trim();

            if (!deviceId) continue;

            const data = {

                deviceId,

                name: row["Tên động cơ"] || row.name,

                type: row["Loại"] || row.type,

                brand: row["Hãng"] || row.brand,

                model: row["Model"] || row.model,

                power: row["Công suất"] || row.power,

                line: row["Tuyến"] || row.line,

                station: row["Nhà ga"] || row.station,

                status: row["Trạng thái"] || row.status

            };

            const exists = await prisma.motor.findUnique({

                where: {

                    deviceId

                }

            });

            if (!exists) {

                const motor = await prisma.motor.create({

                    data

                });

                await writeHistory({

                    motorId: motor.id,

                    action: "IMPORT",

                    user: req.user?.username || "System",

                    deviceId: motor.deviceId,

                    name: motor.name,

                    note: "Import thêm mới"

                });

                created++;

            }

            else {

                await prisma.motor.update({

                    where: {

                        id: exists.id

                    },

                    data

                });

                await writeHistory({

                    motorId: exists.id,

                    action: "IMPORT",

                    user: req.user?.username || "System",

                    deviceId,

                    name: data.name,

                    note: "Import cập nhật"

                });

                updated++;

            }

        }

        res.json({

            message: "Import thành công.",

            created,

            updated

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Không thể import."

        });

    }

};


/* =====================================================
   EXPORT EXCEL
===================================================== */

exports.exportExcel = async (req, res) => {

    try {

        const motors = await prisma.motor.findMany({

            orderBy: {

                deviceId: "asc"

            }

        });

        const workbook = new ExcelJS.Workbook();

        const sheet = workbook.addWorksheet("Motors");

        sheet.columns = [

            { header: "Mã TB", key: "deviceId", width: 18 },

            { header: "Tên động cơ", key: "name", width: 35 },

            { header: "Loại", key: "type", width: 20 },

            { header: "Hãng", key: "brand", width: 15 },

            { header: "Model", key: "model", width: 20 },

            { header: "Công suất", key: "power", width: 15 },

            { header: "Tuyến", key: "line", width: 15 },

            { header: "Nhà ga", key: "station", width: 18 },

            { header: "Trạng thái", key: "status", width: 18 }

        ];

        motors.forEach(motor => {

            sheet.addRow({

                deviceId: motor.deviceId,

                name: motor.name,

                type: motor.type,

                brand: motor.brand,

                model: motor.model,

                power: motor.power,

                line: motor.line,

                station: motor.station,

                status: motor.status

            });

        });

        res.setHeader(

            "Content-Type",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        );

        res.setHeader(

            "Content-Disposition",

            "attachment; filename=motors.xlsx"

        );

        await workbook.xlsx.write(res);

        res.end();

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Không thể export Excel."

        });

    }

};

/* =====================================================
   GET HISTORY
===================================================== */

exports.getHistory = async (req, res) => {

    try {

        const histories = await prisma.motorHistory.findMany({

            orderBy: {

                createdAt: "desc"

            }

        });

        res.json(histories);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Không thể lấy lịch sử."

        });

    }

};


/* =====================================================
   EXPORT TEMPLATE
===================================================== */

exports.exportTemplate = async (req, res) => {

    try {

        const workbook = new ExcelJS.Workbook();

        const sheet = workbook.addWorksheet("Motor Template");

        sheet.columns = [

            { header: "Mã TB", key: "deviceId", width: 18 },

            { header: "Tên động cơ", key: "name", width: 30 },

            { header: "Loại", key: "type", width: 20 },

            { header: "Hãng", key: "brand", width: 15 },

            { header: "Model", key: "model", width: 20 },

            { header: "Serial", key: "serial", width: 20 },

            { header: "Công suất", key: "power", width: 15 },

            { header: "Điện áp", key: "voltage", width: 15 },

            { header: "Dòng điện", key: "current", width: 15 },

            { header: "Tần số", key: "frequency", width: 15 },

            { header: "RPM", key: "rpm", width: 12 },

            { header: "Hiệu suất", key: "efficiency", width: 15 },

            { header: "Pole", key: "pole", width: 10 },

            { header: "Bearing", key: "bearingCode", width: 18 },

            { header: "Tuyến", key: "line", width: 15 },

            { header: "Nhà ga", key: "station", width: 15 },

            { header: "Vị trí", key: "location", width: 20 },

            { header: "Kho", key: "warehouse", width: 20 },

            { header: "Trạng thái", key: "status", width: 18 },

            { header: "Ghi chú", key: "note", width: 35 }

        ];

        sheet.addRow({

            deviceId: "MTR001",

            name: "Động cơ kéo chính",

            type: "Động cơ chính",

            brand: "ABB",

            model: "M3BP",

            serial: "",

            power: "45 kW",

            voltage: "380 V",

            current: "82 A",

            frequency: "50 Hz",

            rpm: "1480",

            efficiency: "IE3",

            pole: "4",

            bearingCode: "6316",

            line: "Tuyến 1",

            station: "Ga đi",

            location: "Phòng máy",

            warehouse: "",

            status: "Running",

            note: ""

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

            "attachment; filename=Motor_Template.xlsx"

        );

        await workbook.xlsx.write(res);

        res.end();

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Không thể xuất template."

        });

    }

};
