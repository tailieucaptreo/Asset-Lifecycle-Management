const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const XLSX = require("xlsx");
const ExcelJS = require("exceljs");

// ============================
// PARSE EXCEL
// ============================
async function parseExcel(file) {

    const workbook = XLSX.read(file.buffer, {
        type: "buffer"
    });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    return XLSX.utils.sheet_to_json(sheet, {
        defval: ""
    });

}

// ============================
// COMPARE ROWS
// ============================
async function compareRows(rows) {

    function excelDateToJS(value) {

        if (!value) return null;

        if (typeof value === "number") {

            const excelEpoch =
                new Date(Date.UTC(1899, 11, 30));

            return new Date(
                excelEpoch.getTime() +
                value * 86400000
            );

        }

        if (
            typeof value === "string" &&
            value.includes("/")
        ) {

            const p = value.split("/");

            if (p.length === 3) {

                return new Date(
                    Number(p[2]),
                    Number(p[1]) - 1,
                    Number(p[0])
                );

            }

        }

        const d = new Date(value);

        return isNaN(d) ? null : d;

    }

    function excelTimeToString(value) {

        if (!value) return "";

        if (typeof value === "number") {

            const total =
                Math.round(value * 24 * 60 * 60);

            const h =
                String(Math.floor(total / 3600))
                    .padStart(2, "0");

            const m =
                String(
                    Math.floor((total % 3600) / 60)
                ).padStart(2, "0");

            const s =
                String(total % 60)
                    .padStart(2, "0");

            return `${h}:${m}:${s}`;

        }

        return String(value);

    }

    function get(row, ...keys) {

        for (const key of keys) {

            const value = row[key];

            if (
                value !== undefined &&
                value !== null &&
                String(value).trim() !== ""
            ) {
                return value;
            }

        }

        return "";

    }

    // ===================================
    // Load DB chỉ 1 lần
    // ===================================

    const devices =
        await prisma.vaconDevice.findMany();

    const histories =
        await prisma.vaconHistory.findMany({
    
            select: {
    
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

    // ===================================
    // Device Map
    // ===================================

    const deviceMap = new Map();

    devices.forEach(device => {

        if (device.serialNumber) {

            deviceMap.set(
                device.serialNumber.trim(),
                device
            );

        }

    });

    // ===================================
    // History Map
    // ===================================

    const historyMap = new Map();

    histories.forEach(h => {
    
        const date =
            new Date(h.recordDate)
                .toISOString()
                .slice(0,10);
    
        const key =
            `${h.deviceId}|${date}|${h.operationHours}|${String(h.powerUnitDate || "")}|${String(h.faultHistory || "")}`;
    
        historyMap.set(key, h);
    
    });

    // ===================================
    // Compare
    // ===================================

    let currentRecordDate = null;

    const result = [];

    for (const row of rows) {

        if (
            row["Record Date"] &&
            String(row["Record Date"]).trim() !== ""
        ) {

            currentRecordDate =
                excelDateToJS(
                    row["Record Date"]
                );

        }

        const deviceName = String(
            get(
                row,
                "Device Name",
                "The Device Name"
            )
        ).trim();

        if (!deviceName) continue;

        const serialNumber = String(
            get(
                row,
                "Serial Number",
                "Serial number"
            )
        ).trim();

        const station = String(
            get(row, "Station")
        ).trim();

        const tandem = String(
            get(row, "Tandem")
        ).trim();

        const application = String(
            get(row, "Application")
        ).trim();

        const operationHours =
            excelTimeToString(

                get(
                    row,
                    "Operation Hours",
                    "Operation hours"
                )

            );

        const powerUnitDate = String(
            get(
                row,
                "Power Unit Date",
                "Power unit date"
            ) || ""
        ).trim();

        const faultHistory =
            get(
                row,
                "Fault History",
                "Fault history"
            );

        const description =
            get(row, "Description");

        const possibleCause =
            get(
                row,
                "Possible Cause",
                "Possible cause"
            );

        const correctiveActions =
            get(
                row,
                "Corrective Actions",
                "Corrective actions"
            );

        const note =
            get(
                row,
                "Note",
                "note"
            );

        //---------------------------------
        // Device
        //---------------------------------

        const device =
            deviceMap.get(serialNumber);

        if (!device) {

            result.push({

                status: "NEW",

                deviceId: null,

                updateData: {},

                deviceName,

                serialNumber,

                station,

                tandem,

                application,

                recordDate: currentRecordDate,

                operationHours,

                powerUnitDate,

                faultHistory,

                description,

                possibleCause,

                correctiveActions,

                note

            });

            continue;

        }

        //---------------------------------
        // Update data
        //---------------------------------

        const updateData = {};

        if (
            device.deviceName !== deviceName
        ) {
            updateData.deviceName =
                deviceName;
        }

        if (
            device.station !== station
        ) {
            updateData.station =
                station;
        }

        if (
            device.tandem !== tandem
        ) {
            updateData.tandem =
                tandem;
        }

        if (
            device.application !== application
        ) {
            updateData.application =
                application;
        }

        //---------------------------------
        // History
        //---------------------------------

        const date =
            currentRecordDate
                ? currentRecordDate
                    .toISOString()
                    .slice(0, 10)
                : "";

        const historyKey =
            `${device.id}|${date}|${operationHours}|${powerUnitDate}|${faultHistory}`;

        const oldHistory =
            historyMap.get(historyKey);
        
        const deviceChanged =
            Object.keys(updateData).length > 0;
        
        let historyChanged = false;
        
        if (!oldHistory) {
        
            historyChanged = true;
        
        } else {
        
            historyChanged = !(
                String(oldHistory.powerUnitDate || "") === String(powerUnitDate || "") &&
                String(oldHistory.faultHistory || "") === String(faultHistory || "") &&
                String(oldHistory.description || "") === String(description || "") &&
                String(oldHistory.possibleCause || "") === String(possibleCause || "") &&
                String(oldHistory.correctiveActions || "") === String(correctiveActions || "") &&
                String(oldHistory.note || "") === String(note || "")
            );
        
        }
        
        let status = "SKIP";
        
        if (!deviceChanged && !historyChanged) {
        
            status = "SKIP";
        
        }
        else if (deviceChanged && historyChanged) {
        
            status = "UPDATE_BOTH";
        
        }
        else if (deviceChanged) {
        
            status = "UPDATE_DEVICE";
        
        }
        else if (historyChanged) {
        
            status = "UPDATE_HISTORY";
        
        }
        
        result.push({
        
            status,
        
            deviceId: device.id,
        
            updateData,
        
            deviceName,
        
            serialNumber,
        
            station,
        
            tandem,
        
            application,
        
            recordDate: currentRecordDate,
        
            operationHours,
        
            powerUnitDate,
        
            faultHistory,
        
            description,
        
            possibleCause,
        
            correctiveActions,
        
            note
        
        });
    }

    return result;

}
// ============================
// GET ALL VACON DEVICE
// ============================
exports.getAll = async (req, res) => {

    try {

        const search = req.query.search?.trim() || "";

        const devices = await prisma.vaconDevice.findMany({

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

        const result = devices.map(device => ({

            id: device.id,

            deviceName: device.deviceName,

            serialNumber: device.serialNumber,

            station: device.station,

            tandem: device.tandem,

            application: device.application,

            recordDate:

                device.histories.length

                    ? device.histories[0].recordDate

                    : null,

            historyCount:

                device._count.histories

        }));

        res.json(result);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ============================
// EXPORT VACON HISTORY
// ============================
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
            workbook.addWorksheet("VACON History");

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

        for (const device of devices) {

            if (!device.histories.length) {

                sheet.addRow({

                    recordDate: "",

                    station: device.station,

                    tandem: device.tandem,

                    deviceName: device.deviceName,

                    serialNumber: device.serialNumber,

                    application: device.application,

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

            for (const history of device.histories) {

                sheet.addRow({

                    recordDate:
                        history.recordDate
                            ? new Date(history.recordDate)
                                .toLocaleDateString("vi-VN")
                            : "",

                    station: device.station,

                    tandem: device.tandem,

                    deviceName: device.deviceName,

                    serialNumber: device.serialNumber,

                    application: device.application,

                    powerUnitDate:
                        history.powerUnitDate,

                    operationHours:
                        history.operationHours,

                    faultHistory:
                        history.faultHistory,

                    description:
                        history.description,

                    possibleCause:
                        history.possibleCause,

                    correctiveActions:
                        history.correctiveActions,

                    note:
                        history.note

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

// ============================
// GET ONE DEVICE
// ============================
exports.getOne = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const device = await prisma.vaconDevice.findUnique({

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

                message: "Không tìm thấy thiết bị"

            });

        }

        res.json(device);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: err.message

        });

    }

};

// ============================
// CREATE DEVICE
// ============================
exports.create = async (req, res) => {

    try {

        const {

            deviceName,

            serialNumber,

            station,

            tandem,

            application

        } = req.body;

        const device = await prisma.vaconDevice.create({

            data: {

                deviceName,

                serialNumber,

                station,

                tandem,

                application

            }

        });

        res.json(device);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: err.message

        });

    }

};


// ============================
// UPDATE DEVICE
// ============================
exports.update = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const {

            deviceName,

            serialNumber,

            station,

            tandem,

            application

        } = req.body;

        const device = await prisma.vaconDevice.update({

            where: {

                id

            },

            data: {

                deviceName,

                serialNumber,

                station,

                tandem,

                application

            }

        });

        res.json(device);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: err.message

        });

    }

};

// ============================
// DELETE DEVICE
// ============================
exports.remove = async (req, res) => {

    try {

        const id = Number(req.params.id);

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

            message: "Đã xóa thiết bị"

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ============================
// PREVIEW IMPORT
// ============================
exports.previewImport = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "Chưa chọn file"

            });

        }

       // Đọc Excel
        const rows = await parseExcel(req.file);
        
        console.log("========== PREVIEW IMPORT ==========");
        console.log("Excel rows:", rows.length);
        
        if (rows.length) {
            console.log("First Excel row:");
            console.log(rows[0]);
        }
        
        // So sánh
        const compare = await compareRows(rows);
        
        console.log("Compare rows:", compare.length);
        
        if (compare.length) {
            console.log("First compare row:");
            console.log(compare[0]);
        }
        
        // Thống kê
        const summary = {

            total: compare.length,
        
            newCount:
                compare.filter(x => x.status === "NEW").length,
        
            deviceUpdateCount:
                compare.filter(x => x.status === "UPDATE_DEVICE").length,
        
            historyUpdateCount:
                compare.filter(x => x.status === "UPDATE_HISTORY").length,
        
            bothUpdateCount:
                compare.filter(x => x.status === "UPDATE_BOTH").length,
        
            skipCount:
                compare.filter(x => x.status === "SKIP").length
        
        };
        
        console.log("Summary:", summary);
        console.log("==============================");

        // Xóa Preview cũ của user (nếu có)
        await prisma.importSession.deleteMany({

            where: {

                module: "VACON",

                userId: req.user.id

            }

        });

        // Tạo Preview mới
        const session = await prisma.importSession.create({

            data: {

                module: "VACON",

                filename: req.file.originalname,

                data: compare,

                total: summary.total,

                newCount: summary.newCount,

                updateCount:

                    summary.deviceUpdateCount +
                
                    summary.historyUpdateCount +
                
                    summary.bothUpdateCount,

                skipCount: summary.skipCount,

                userId: req.user.id,

                expiredAt: new Date(

                    Date.now() + 30 * 60 * 1000

                )

            }

        });

        res.json({

            success: true,

            sessionId: session.id,

            summary,

            rows: compare

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ============================
// IMPORT FROM PREVIEW
// ============================
exports.importExcel = async (req, res) => {

    try {

        const { sessionId } = req.body;

        if (!sessionId) {

            return res.status(400).json({

                success: false,

                message: "Thiếu sessionId"

            });

        }

        const session = await prisma.importSession.findUnique({

            where: {

                id: sessionId

            }

        });

        if (!session) {

            return res.status(404).json({

                success: false,

                message: "Preview không tồn tại"

            });

        }

        if (session.module !== "VACON") {

            return res.status(400).json({

                success: false,

                message: "Sai module"

            });

        }

        if (new Date(session.expiredAt) < new Date()) {

            await prisma.importSession.delete({

                where: {

                    id: session.id

                }

            });

            return res.status(400).json({

                success: false,

                message: "Preview đã hết hạn"

            });

        }

        const rows = session.data;

        let created = 0;
        let updated = 0;
        let skipped = 0;
        let histories = 0;

        for (const item of rows) {

            if (item.status === "NEW") {

                const device = await prisma.vaconDevice.upsert({

                    where: {
                
                        serialNumber: item.serialNumber
                
                    },
                
                    update: {
                
                        deviceName: item.deviceName,
                
                        station: item.station,
                
                        tandem: item.tandem,
                
                        application: item.application
                
                    },
                
                    create: {
                
                        deviceName: item.deviceName,
                
                        serialNumber: item.serialNumber,
                
                        station: item.station,
                
                        tandem: item.tandem,
                
                        application: item.application
                
                    }
                
                });

                if (item.status === "NEW") {

                    created++;
                
                }

                const existed = await prisma.vaconHistory.findFirst({

                    where: {
                
                        deviceId: device.id,
                
                        recordDate: item.recordDate,
                
                        operationHours: item.operationHours,
                
                        powerUnitDate:
                            item.powerUnitDate == null
                                ? null
                                : String(item.powerUnitDate),
                
                        faultHistory: item.faultHistory
                
                    }
                
                });
                
                if (!existed) {
                
                    await prisma.vaconHistory.create({
                
                        data: {
                
                            deviceId: device.id,
                
                            recordDate: item.recordDate,
                
                            operationHours: item.operationHours,
                
                            powerUnitDate:
                                item.powerUnitDate == null
                                    ? null
                                    : String(item.powerUnitDate),
                
                            faultHistory: item.faultHistory,
                
                            description: item.description,
                
                            possibleCause: item.possibleCause,
                
                            correctiveActions: item.correctiveActions,
                
                            note: item.note
                
                        }
                
                    });
                
                    histories++;
                
                }
                else {
                
                    skipped++;
                
                }

                continue;

            }

            if (item.status === "UPDATE_DEVICE") {

                await prisma.vaconDevice.update({
            
                    where: {
                        id: item.deviceId
                    },
            
                    data: item.updateData
            
                });
            
                updated++;
            
                continue;
            
            }

            if (item.status === "UPDATE_HISTORY") {

                const existed = await prisma.vaconHistory.findFirst({

                    where: {
                
                        deviceId: item.deviceId,
                
                        recordDate: item.recordDate,
                
                        operationHours: item.operationHours,
                
                        powerUnitDate:
                            item.powerUnitDate == null
                                ? null
                                : String(item.powerUnitDate),
                
                        faultHistory: item.faultHistory
                
                    }
                
                });
                
                if (!existed) {
                
                    await prisma.vaconHistory.create({
                
                        data: {
                
                            deviceId: item.deviceId,
                
                            recordDate: item.recordDate,
                
                            operationHours: item.operationHours,
                
                            powerUnitDate:
                                item.powerUnitDate == null
                                    ? null
                                    : String(item.powerUnitDate),
                
                            faultHistory: item.faultHistory,
                
                            description: item.description,
                
                            possibleCause: item.possibleCause,
                
                            correctiveActions: item.correctiveActions,
                
                            note: item.note
                
                        }
                
                    });
                
                    histories++;
                
                }
                else {
                
                    skipped++;
                
                }
                
                continue;
            
            }

           if (item.status === "UPDATE_BOTH") {

                // 1. cập nhật thiết bị
                await prisma.vaconDevice.update({
            
                    where: {
                        id: item.deviceId
                    },
            
                    data: item.updateData
            
                });
            
                // 2. kiểm tra lịch sử
                const existed = await prisma.vaconHistory.findFirst({
            
                    where: {
            
                        deviceId: item.deviceId,
            
                        recordDate: item.recordDate,
            
                        operationHours: item.operationHours,
            
                        powerUnitDate:
                            item.powerUnitDate == null
                                ? null
                                : String(item.powerUnitDate),
            
                        faultHistory: item.faultHistory
            
                    }
            
                });
            
                // 3. nếu chưa có thì thêm
                if (!existed) {
            
                    await prisma.vaconHistory.create({
            
                        data: {
            
                            deviceId: item.deviceId,
            
                            recordDate: item.recordDate,
            
                            operationHours: item.operationHours,
            
                            powerUnitDate:
                                item.powerUnitDate == null
                                    ? null
                                    : String(item.powerUnitDate),
            
                            faultHistory: item.faultHistory,
            
                            description: item.description,
            
                            possibleCause: item.possibleCause,
            
                            correctiveActions: item.correctiveActions,
            
                            note: item.note
            
                        }
            
                    });
            
                    histories++;
            
                }
            
                updated++;
            
                continue;
            
            }

            skipped++;

        }

        await prisma.importSession.delete({

            where: {

                id: session.id

            }

        });

        res.json({

            success: true,

            summary: {

                total: rows.length,

                created,

                updated,

                skipped,

                histories

            }

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// ============================
// GET HISTORY BY DEVICE
// ============================
exports.getHistory = async (req, res) => {

  try {

    const deviceId = Number(req.params.deviceId);

    if (isNaN(deviceId)) {

      return res.status(400).json({

        message: "deviceId không hợp lệ"

      });

    }

    const device =
      await prisma.vaconDevice.findUnique({

        where: {

          id: deviceId

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

        message: "Không tìm thấy thiết bị"

      });

    }

    res.json({

      device: {

        id: device.id,

        deviceName: device.deviceName,

        serialNumber: device.serialNumber,

        station: device.station,

        tandem: device.tandem,

        application: device.application

      },

      histories: device.histories

    });

  }

  catch (err) {

    console.error(err);

    res.status(500).json({

      message: err.message

    });

  }

};

// ============================
// MIGRATE VACON RECORD -> DEVICE + HISTORY
// ============================
exports.migrateData = async (req, res) => {

  try {

    const records = await prisma.vaconRecord.findMany({

      orderBy: {

        recordDate: "asc"

      }

    });

    let deviceCount = 0;
    let historyCount = 0;

    for (const row of records) {

      if (!row.deviceName) continue;

      let device = null;

      // ==========================
      // Tìm theo Serial Number
      // ==========================

      if (row.serialNumber) {

        device = await prisma.vaconDevice.findUnique({

          where: {

            serialNumber: row.serialNumber

          }

        });

      }

      // ==========================
      // Nếu chưa có thì tạo
      // ==========================

      if (!device) {

        device = await prisma.vaconDevice.create({

          data: {

            deviceName: row.deviceName,

            serialNumber: row.serialNumber,

            station: row.station,

            tandem: row.tandem,

            application: row.application

          }

        });

        deviceCount++;

      }

      // ==========================
      // Nếu đã có thì cập nhật
      // ==========================

      else {

        await prisma.vaconDevice.update({

          where: {

            id: device.id

          },

          data: {

            deviceName: row.deviceName,

            station: row.station,

            tandem: row.tandem,

            application: row.application

          }

        });

      }

      // ==========================
      // Kiểm tra lịch sử đã tồn tại
      // ==========================

      const existed = await prisma.vaconHistory.findFirst({

        where: {

          deviceId: device.id,

          recordDate: row.recordDate,

          operationHours: row.operationHours

        }

      });

      if (existed) {

        continue;

      }

      // ==========================
      // Thêm lịch sử
      // ==========================

      await prisma.vaconHistory.create({

        data: {

          deviceId: device.id,

          recordDate: row.recordDate,

          operationHours: row.operationHours,

          powerUnitDate: row.powerUnitDate,

          faultHistory: row.faultHistory,

          description: row.description,

          possibleCause: row.possibleCause,

          correctiveActions: row.correctiveActions,

          note: row.note

        }

      });

      historyCount++;

    }

    res.json({

      success: true,

      devices: deviceCount,

      histories: historyCount

    });

  }

  catch (err) {

    console.error(err);

    res.status(500).json({

      success: false,

      message: err.message

    });

  }

};

exports.updateHistory = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const item =
            await prisma.vaconHistory.update({

                where: {

                    id

                },

                data: {

                    recordDate:
                        req.body.recordDate
                            ? new Date(req.body.recordDate)
                            : null,

                    operationHours:
                        req.body.operationHours,

                    powerUnitDate:
                        req.body.powerUnitDate,

                    faultHistory:
                        req.body.faultHistory,

                    description:
                        req.body.description,

                    possibleCause:
                        req.body.possibleCause,

                    correctiveActions:
                        req.body.correctiveActions,

                    note:
                        req.body.note

                }

            });

        res.json(item);

    }

    catch(err){

        console.error(err);

        res.status(500).json({

            message: err.message

        });

    }

};
