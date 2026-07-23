const { PrismaClient } = require("@prisma/client");
const ExcelJS = require("exceljs");
const XLSX = require("xlsx");

const prisma = new PrismaClient();

const ImportHelper =
    require("../utils/importHelper");

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

function getMotorKey(data) {

    return [

        data.deviceId ?? "",

        data.line ?? "",

        data.station ?? "",

        data.location ?? ""

    ]

    .map(v => String(v).trim())

    .join("|");

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

        const exists =
        await prisma.motor.findFirst({
        
            where: {
        
                deviceId:
                    data.deviceId,
        
                line:
                    data.line,
        
                station:
                    data.station,
        
                location:
                    data.location
        
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

        const duplicate =
        await prisma.motor.findFirst({
        
            where: {
        
                deviceId:
                    data.deviceId,
        
                line:
                    data.line,
        
                station:
                    data.station,
        
                location:
                    data.location,
        
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
   IMPORT HELPER
===================================================== */

function mapMotorRow(excelRow) {

    return {

        deviceId: ImportHelper.text(
            excelRow["Mã Vật Tư/ID"] ??
            excelRow["Mã TB"] ??
            excelRow.deviceId
        ),

        name: ImportHelper.text(
            excelRow["Tên thiết bị"] ??
            excelRow["Tên động cơ"] ??
            excelRow.name
        ),

        type: ImportHelper.text(
            excelRow["Loại thiết bị"] ??
            excelRow["Loại"] ??
            excelRow.type
        ),

        brand: ImportHelper.text(
            excelRow["Hãng"] ??
            excelRow.brand
        ),

        model: ImportHelper.text(
            excelRow["Model"] ??
            excelRow.model
        ),

        serial: ImportHelper.nullableText(
            excelRow["Serial Number ID"] ??
            excelRow.serial
        ),

        power: ImportHelper.nullableText(
            excelRow["Công suất (kW)"] ??
            excelRow["Công suất"] ??
            excelRow.power
        ),

        voltage: ImportHelper.nullableText(
            excelRow["Điện áp"] ??
            excelRow.voltage
        ),

        current: ImportHelper.nullableText(
            excelRow["Dòng điện"] ??
            excelRow.current
        ),

        frequency: ImportHelper.nullableText(
            excelRow["Tần số"] ??
            excelRow.frequency
        ),

        rpm: ImportHelper.nullableText(
            excelRow["RPM"] ??
            excelRow.rpm
        ),

        efficiency: ImportHelper.nullableText(
            excelRow["Hiệu suất"] ??
            excelRow.efficiency
        ),

        pole: ImportHelper.nullableText(
            excelRow["Pole"] ??
            excelRow.pole
        ),

        bearingCode: ImportHelper.nullableText(
            excelRow["Mã ổ bi"] ??
            excelRow.bearingCode
        ),

        runningHours: ImportHelper.number(
            excelRow["Số giờ vận hành"] ??
            excelRow.runningHours
        ),

        line: ImportHelper.text(
            excelRow["Tuyến cáp"] ??
            excelRow["Tuyến"] ??
            excelRow.line
        ),

        station: ImportHelper.text(
            excelRow["Nhà ga"] ??
            excelRow.station
        ),

        location: ImportHelper.nullableText(
            excelRow["Vị trí lắp đặt"] ??
            excelRow.location
        ),

        warehouse: ImportHelper.nullableText(
            excelRow["Vị trí lưu kho"] ??
            excelRow.warehouse
        ),

        status: ImportHelper.text(
            excelRow["Trạng thái"] ??
            excelRow.status ??
            "Running"
        ),

        replacementDate: ImportHelper.date(
            excelRow["Thời gian thay thế"]
        ),

        maintenanceDate: ImportHelper.date(
            excelRow["Ngày bảo trì"]
        ),

        note: ImportHelper.nullableText(
            excelRow["Ghi chú"] ??
            excelRow.note
        )

    };

}

/* =====================================================
   COMPARE HELPER
===================================================== */

function compareMotor(oldData, newData) {

    const changedFields = [];

    const fields = [

        "name",

        "type",

        "brand",

        "model",

        "serial",

        "power",

        "voltage",

        "current",

        "frequency",

        "rpm",

        "efficiency",

        "pole",

        "bearingCode",

        "runningHours",

        "line",

        "station",

        "location",

        "warehouse",

        "status",

        "replacementDate",

        "maintenanceDate",

        "note"

    ];

    for (const field of fields) {

        const oldValue =
            oldData[field] == null
                ? ""
                : String(oldData[field]).trim();

        const newValue =
            newData[field] == null
                ? ""
                : String(newData[field]).trim();

        if (oldValue !== newValue) {

            changedFields.push(field);

        }

    }

    return changedFields;

}

function detectMotorType(name = "") {

    const text = String(name)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    console.log(text);

    if (/dong co chinh\b/.test(text))
        return "mainMotor";

    if (/lam mat/.test(text))
        return "cooling";

    if (/bom dau/.test(text))
        return "oilPump";

    if (/phanh/.test(text))
        return "brake";

    if (/nang ha/.test(text))
        return "lifting";

    return "otherMotor";
}

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
            notReplaced: 0,
        
            mainMotor: 0,
            oilPump: 0,
            cooling: 0,
            brake: 0,
            lifting: 0,
            otherMotor: 0
        };
        
        for (const motor of motors) {
        
            // ===== Brand =====
            switch ((motor.brand || "").toUpperCase()) {
        
                case "ABB":
                    statistics.abb++;
                    break;
        
                case "SIEMENS":
                    statistics.siemens++;
                    break;
        
                default:
                    statistics.otherBrand++;
                    break;
            }
        
            // ===== Status =====
            switch (motor.status) {
        
                case "Đang hoạt động":
                    statistics.running++;
                    break;
        
                case "Bảo trì":
                    statistics.maintenance++;
                    break;
        
                case "Đã thay":
                    statistics.replaced++;
                    break;
        
                default:
                    statistics.notReplaced++;
                    break;
            }
        
            // ===== Motor Type =====
            const motorType = detectMotorType(motor.name);
            
            if (motor.name.includes("Động cơ chính")) {
                console.log(
                    `[${motor.name}] => ${motorType}`
                );
            }
        
            switch (motorType) {
        
                case "mainMotor":
                    statistics.mainMotor++;
                    break;
        
                case "oilPump":
                    statistics.oilPump++;
                    break;
        
                case "cooling":
                    statistics.cooling++;
                    break;
        
                case "brake":
                    statistics.brake++;
                    break;
        
                case "lifting":
                    statistics.lifting++;
                    break;
        
                default:
                    statistics.otherMotor++;
                    break;
            }
        
        }
        
        return res.json(statistics);

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

        // =========================
        // Đọc Excel
        // =========================

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

        // =========================
        // Load toàn bộ Motor 1 lần
        // =========================

        const motors =
            await prisma.motor.findMany({

                select: {

                    id: true,

                    deviceId: true,

                    name: true,

                    type: true,

                    brand: true,

                    model: true,

                    serial: true,

                    power: true,

                    voltage: true,

                    current: true,

                    frequency: true,

                    rpm: true,

                    efficiency: true,

                    pole: true,

                    bearingCode: true,

                    runningHours: true,

                    line: true,

                    station: true,

                    location: true,

                    warehouse: true,

                    status: true,

                    replacementDate: true,

                    maintenanceDate: true,

                    note: true

                }

            });

        // =========================
        // Tạo Map
        // =========================

        const motorMap = new Map();

        motors.forEach(motor => {

            motorMap.set(

                getMotorKey(motor),

                motor

            );

        });

        // =========================
        // Preview
        // =========================

        const preview = [];

        let newCount = 0;

        let updateCount = 0;

        let skipCount = 0;

        for (const excelRow of rows) {

            const row = mapMotorRow(excelRow);

            // Không có mã thiết bị

            if (!row.deviceId) {

                newCount++;

                preview.push({

                    action: "NEW",

                    changedFields: [

                        "Thiếu Mã Vật Tư/ID"

                    ],

                    row

                });

                continue;

            }

            // Tra cứu trong Map

            const exists =
                motorMap.get(
                    getMotorKey(row)
                );

            // Chưa tồn tại

            if (!exists) {

                newCount++;

                preview.push({

                    action: "NEW",

                    changedFields: [],

                    row

                });

                continue;

            }

            // So sánh

            const changedFields =
                compareMotor(
                    exists,
                    row
                );

            if (
                changedFields.length === 0
            ) {

                skipCount++;

                preview.push({

                    action: "SKIP",

                    changedFields: [],

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

        return res.json({

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

        return res.status(500).json({

            message: "Không thể xem trước dữ liệu."

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

        // =========================
        // Đọc Excel
        // =========================

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

        // =========================
        // Load toàn bộ Motor
        // =========================

        const motors =
            await prisma.motor.findMany({

                select: {

                    id: true,

                    deviceId: true,

                    name: true,

                    type: true,

                    brand: true,

                    model: true,

                    serial: true,

                    power: true,

                    voltage: true,

                    current: true,

                    frequency: true,

                    rpm: true,

                    efficiency: true,

                    pole: true,

                    bearingCode: true,

                    runningHours: true,

                    line: true,

                    station: true,

                    location: true,

                    warehouse: true,

                    status: true,

                    replacementDate: true,

                    maintenanceDate: true,

                    note: true

                }

            });

        // =========================
        // Tạo Map
        // =========================

        const motorMap = new Map();

        motors.forEach(motor => {

            motorMap.set(

                getMotorKey(motor),

                motor

            );

        });

        // =========================
        // Danh sách xử lý
        // =========================

        const createList = [];

        const updateList = [];

        let skipped = 0;

        // =========================
        // Phân loại dữ liệu
        // =========================

        for (const excelRow of rows) {

            const data =
                mapMotorRow(excelRow);

            // Thiếu mã TB

            if (!data.deviceId) {

                createList.push(data);
            
                continue;
            
            }

            const exists =
                motorMap.get(
                    getMotorKey(data)
                );

            // Chưa tồn tại

            if (!exists) {

                createList.push(data);

                continue;

            }

            // So sánh

            const changedFields =
                compareMotor(
                    exists,
                    data
                );

            // Không thay đổi

            if (
                changedFields.length === 0
            ) {

                skipped++;

                continue;

            }

            // Chuẩn bị Update

            updateList.push({

                id: exists.id,

                data,

                changedFields

            });

        }

        // =========================
        // Import thêm mới
        // =========================

        let created = 0;

        for (const data of createList) {

            const motor =
                await prisma.motor.create({

                    data

                });

            await writeHistory({

                motorId: motor.id,

                action: "IMPORT",

                user:
                    req.user?.username ||
                    "System",

                deviceId: motor.deviceId,

                name: motor.name,

                note: "Import thêm mới"

            });

            created++;

        }

        // =========================
        // Import cập nhật
        // =========================

        let updated = 0;

        for (const item of updateList) {

            const motor =
                await prisma.motor.update({

                    where: {

                        id: item.id

                    },

                    data: item.data

                });

            const changes = {};

            const oldMotor = motorMap.get(
                getMotorKey(item.data)
            );

            item.changedFields.forEach(field => {

                changes[field] = {
            
                    old: oldMotor?.[field] ?? null,
            
                    new: item.data[field]
            
                };
            
            });

            await writeHistory({

                motorId: motor.id,

                action: "IMPORT",

                user:
                    req.user?.username ||
                    "System",

                deviceId: motor.deviceId,

                name: motor.name,

                note: "Import cập nhật",

                changes

            });

            updated++;

        }

        // =========================
        // Trả kết quả
        // =========================

        return res.json({

            message: "Import thành công.",

            created,

            updated,

            skipped

        });

    }

    catch (err) {

        console.error(err);

        console.error(err.stack);

        return res.status(500).json({

            message: err.message

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
