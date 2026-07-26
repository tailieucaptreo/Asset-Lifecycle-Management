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

                quantity: data.quantity
                    ? Number(data.quantity)
                    : null,
                
                oldMotor: data.oldMotor,
                
                newMotor: data.newMotor,
                
                maintenanceContent: data.maintenanceContent,

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

                quantity: data.quantity
                    ? Number(data.quantity)
                    : null,
                
                oldMotor: data.oldMotor,
                
                newMotor: data.newMotor,
                
                maintenanceContent: data.maintenanceContent,

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

        line: ImportHelper.text(
            excelRow["Tuyến cáp"] ??
            excelRow["Tuyến"] ??
            excelRow.line
        ),

        station: ImportHelper.text(
            excelRow["Nhà ga"] ??
            excelRow.station
        ),
        
        deviceId: (() => {

            const id = ImportHelper.text(
                excelRow["Mã Vật Tư/ID"] ??
                excelRow["Mã TB"] ??
                excelRow.deviceId
            );
        
            return id === "-" ? "" : id;
        
        })(),

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

        quantity: ImportHelper.number(
            excelRow["Số Lượng"]
        ),

        location: ImportHelper.text(
            excelRow["Vị trí lắp đặt"]
        ),

        brand: ImportHelper.text(
            excelRow["Hãng"]
        ),

        model: ImportHelper.text(
            excelRow["Model"]
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

        bearingCode: ImportHelper.text(
            excelRow["Mã ổ bi"] ??
            excelRow.bearingCode
        ),

        runningHours: ImportHelper.number(
            excelRow["Số giờ vận hành"] ??
            excelRow.runningHours
        ),

        status: ImportHelper.text(

            excelRow["Trạng thái"] ??
            excelRow.status ??
            "Chưa thay"
        
        ),

        replacementDate: ImportHelper.date(
        
            excelRow["Thời gian thay thế"] ??
            excelRow.replacementDate
        
        ),

        oldMotor: ImportHelper.text(
            excelRow["Cũ"] ??
            excelRow.oldMotor
        ),

        newMotor: ImportHelper.text(
            excelRow["Mới"] ??
            excelRow.newMotor
        ),
        
        warehouse: ImportHelper.nullableText(
            excelRow["Vị trí lưu kho"] ??
            excelRow.warehouse
        ),

        maintenanceDate: ImportHelper.date(
        
            excelRow["Ngày bảo trì"] ??
            excelRow.maintenanceDate
        
        ),
        
       maintenanceContent: ImportHelper.text(
            excelRow["Nội dung thực hiện"]
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

        "line",
        "station",
        "deviceId",
        "name",
        "type",
        "quantity",
        "location",
        "brand",
        "model",
        "serial",
        "power",
        "bearingCode",
        "runningHours",
        "status",
        "replacementDate",
        "oldMotor",
        "newMotor",
        "warehouse",
        "maintenanceDate",
        "maintenanceContent",
        "note"
    
    ];

    for (const field of fields) {

        if (
    
            field === "replacementDate" ||
    
            field === "maintenanceDate"
    
        ) {
    
            const oldValue =
                oldData[field]
                    ? new Date(oldData[field]).toISOString().slice(0, 10)
                    : "";
    
            const newValue =
                newData[field]
                    ? new Date(newData[field]).toISOString().slice(0, 10)
                    : "";
    
            if (oldValue !== newValue) {
    
                changedFields.push(field);
    
            }
    
            continue;
    
        }
    
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

function normalizeMotorName(name = "") {
    return String(name)
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function classifyMotor(name = "") {

    const text = normalizeMotorName(name);

    console.log({
        original: name,
        normalized: text
    });

     // Làm mát
    if (text.includes("lammat"))
        return "cooling";
    
    // Bơm
    if (
        text.includes("bomdau")
    )
        return "oilPump";
    
    // Nâng hạ
    if (text.includes("nangha"))
        return "lifting";
    
    // Phanh
    if (text.includes("bomthuylucphanh"))
        return "brake";
    
    // Chính
    if (text.includes("dongcochinh"))
        return "mainMotor";
    
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
            original: 0,
        
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
                    statistics.original++;
                    break;
            }
        
            // ===== Motor Type =====
            const motorType = classifyMotor(motor.name);

            console.log(motor.name, "=>", motorType);
            
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
            
                case "lifting":
                    statistics.lifting++;
                    break;
            
                case "brake":
                    statistics.brake++;
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

                    quantity: true,
                    
                    oldMotor: true,
                    
                    newMotor: true,
                    
                    maintenanceContent: true,
                    
                    image: true,

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
            const key = getMotorKey(row);
            const exists =
                motorMap.get(
                    getMotorKey(row)
                );

            // Chưa tồn tại

            if (!exists) {

                console.log("========== NOT FOUND ==========");
                console.log("KEY:", key);
                console.log("EXCEL:", row);
                
                newCount++;

                preview.push({

                    action: "NEW",

                    changedFields: [],

                    row

                });

                continue;

            }

            console.log("========== DB SAMPLE ==========");
            console.log(motors[0]);
            console.log("DB KEY:", getMotorKey(motors[0]));

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

                total: preview.length,

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

                    quantity: true,
                    
                    oldMotor: true,
                    
                    newMotor: true,
                    
                    maintenanceContent: true,
                    
                    image: true,

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

            { header: "Tuyến cáp", key: "line", width: 15 },
        
            { header: "Nhà ga", key: "station", width: 15 },
        
            { header: "Mã Vật Tư/ID", key: "deviceId", width: 18 },
        
            { header: "Tên thiết bị", key: "name", width: 35 },
        
            { header: "Loại thiết bị", key: "type", width: 20 },
        
            { header: "Số Lượng", key: "quantity", width: 12 },
        
            { header: "Vị trí lắp đặt", key: "location", width: 25 },
        
            { header: "Hãng", key: "brand", width: 18 },
        
            { header: "Model", key: "model", width: 22 },
        
            { header: "Serial Number ID", key: "serial", width: 22 },
        
            { header: "Công suất (kW)", key: "power", width: 15 },
        
            { header: "Mã ổ bi", key: "bearingCode", width: 18 },
        
            { header: "Số giờ vận hành", key: "runningHours", width: 18 },
        
            { header: "Trạng thái", key: "status", width: 18 },
        
            { header: "Thời gian thay thế", key: "replacementDate", width: 18 },
        
            { header: "Cũ", key: "oldMotor", width: 20 },
        
            { header: "Mới", key: "newMotor", width: 20 },
        
            { header: "Vị trí lưu kho", key: "warehouse", width: 25 },
        
            { header: "Ngày bảo trì", key: "maintenanceDate", width: 18 },
        
            { header: "Nội dung thực hiện", key: "maintenanceContent", width: 35 },
        
            { header: "Ghi chú", key: "note", width: 40 }
        
        ];

        motors.forEach(motor => {

            sheet.addRow({
        
                line: motor.line,
        
                station: motor.station,
        
                deviceId: motor.deviceId,
        
                name: motor.name,
        
                type: motor.type,
        
                quantity: motor.quantity,
        
                location: motor.location,
        
                brand: motor.brand,
        
                model: motor.model,
        
                serial: motor.serial,
        
                power: motor.power,
        
                bearingCode: motor.bearingCode,
        
                runningHours: motor.runningHours,
        
                status: motor.status,
        
                replacementDate: motor.replacementDate,
        
                oldMotor: motor.oldMotor,
        
                newMotor: motor.newMotor,
        
                warehouse: motor.warehouse,
        
                maintenanceDate: motor.maintenanceDate,
        
                maintenanceContent: motor.maintenanceContent,
        
                note: motor.note
        
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

            "attachment; filename=Motors.xlsx"

        );

        sheet.getColumn("replacementDate").numFmt = "dd/mm/yyyy";

        sheet.getColumn("maintenanceDate").numFmt = "dd/mm/yyyy";

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

            { header: "Tuyến cáp", key: "line", width: 15 },
        
            { header: "Nhà ga", key: "station", width: 15 },
        
            { header: "Mã Vật Tư/ID", key: "deviceId", width: 18 },
        
            { header: "Tên thiết bị", key: "name", width: 35 },
        
            { header: "Loại thiết bị", key: "type", width: 20 },
        
            { header: "Số Lượng", key: "quantity", width: 12 },
        
            { header: "Vị trí lắp đặt", key: "location", width: 25 },
        
            { header: "Hãng", key: "brand", width: 18 },
        
            { header: "Model", key: "model", width: 22 },
        
            { header: "Serial Number ID", key: "serial", width: 22 },
        
            { header: "Công suất (kW)", key: "power", width: 15 },
        
            { header: "Mã ổ bi", key: "bearingCode", width: 18 },
        
            { header: "Số giờ vận hành", key: "runningHours", width: 18 },
        
            { header: "Trạng thái", key: "status", width: 18 },
        
            { header: "Thời gian thay thế", key: "replacementDate", width: 18 },
        
            { header: "Cũ", key: "oldMotor", width: 20 },
        
            { header: "Mới", key: "newMotor", width: 20 },
        
            { header: "Vị trí lưu kho", key: "warehouse", width: 25 },
        
            { header: "Ngày bảo trì", key: "maintenanceDate", width: 18 },
        
            { header: "Nội dung thực hiện", key: "maintenanceContent", width: 35 },
        
            { header: "Ghi chú", key: "note", width: 40 }
        
        ];

        sheet.addRow({

            line: "Tuyến 1",
        
            station: "Ga đi",
        
            deviceId: "MTR001",
        
            name: "Động cơ chính",
        
            type: "Động cơ chính",
        
            quantity: 1,
        
            location: "Phòng máy",
        
            brand: "ABB",
        
            model: "M3BP",
        
            serial: "SN001",
        
            power: "45",
        
            bearingCode: "6316",
        
            runningHours: 0,
        
            status: "Đang hoạt động",
        
            replacementDate: "",
        
            oldMotor: "",
        
            newMotor: "",
        
            warehouse: "Kho A",
        
            maintenanceDate: "",
        
            maintenanceContent: "",
        
            note: ""
        
        });

        sheet.getColumn("replacementDate").numFmt = "dd/mm/yyyy";
        sheet.getColumn("maintenanceDate").numFmt = "dd/mm/yyyy";

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
