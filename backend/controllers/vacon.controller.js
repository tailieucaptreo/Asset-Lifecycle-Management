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

    let currentRecordDate = null;

    const result = [];

    for (const row of rows) {

        //---------------------------------
        // Record Date
        //---------------------------------

        if (
            row["Record Date"] &&
            String(row["Record Date"]).trim() !== ""
        ) {

            currentRecordDate =
                excelDateToJS(row["Record Date"]);

        }

        const deviceName =
            row["The Device Name"]
                ? String(row["The Device Name"]).trim()
                : "";

        if (!deviceName) continue;

        const serialNumber =
            row["Serial number"]
                ? String(row["Serial number"]).trim()
                : "";

        const station =
            row["Station"]
                ? String(row["Station"]).trim()
                : "";

        const tandem =
            row["Tandem"]
                ? String(row["Tandem"]).trim()
                : "";

        const application =
            row["Application"]
                ? String(row["Application"]).trim()
                : "";

        const operationHours =
            excelTimeToString(
                row["Operation Hours"]
            );

        //---------------------------------
        // Tìm thiết bị
        //---------------------------------

        let device = null;

        if (serialNumber) {

            device =
                await prisma.vaconDevice.findUnique({

                    where: {

                        serialNumber

                    }

                });

        }

        //---------------------------------
        // NEW
        //---------------------------------

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

                powerUnitDate:
                    row["Power Unit Date"] || "",

                faultHistory:
                    row["Fault history"] || "",

                description:
                    row["Description"] || "",

                possibleCause:
                    row["Possible Cause"] || "",

                correctiveActions:
                    row["Corrective actions"] || "",

                note:
                    row["note"] || ""

            });

            continue;

        }

        //---------------------------------
        // UPDATE DATA
        //---------------------------------

        const updateData = {};

        if (
            deviceName &&
            device.deviceName !== deviceName
        ) {

            updateData.deviceName = deviceName;

        }

        if (
            station &&
            device.station !== station
        ) {

            updateData.station = station;

        }

        if (
            tandem &&
            device.tandem !== tandem
        ) {

            updateData.tandem = tandem;

        }

        if (
            application &&
            device.application !== application
        ) {

            updateData.application = application;

        }

        //---------------------------------
        // Kiểm tra lịch sử
        //---------------------------------

        const history =
            await prisma.vaconHistory.findFirst({

                where: {

                    deviceId: device.id,

                    recordDate: currentRecordDate,

                    operationHours

                }

            });

        result.push({

            status:
                history
                    ? "SKIP"
                    : "UPDATE",

            deviceId: device.id,

            updateData,

            deviceName,

            serialNumber,

            station,

            tandem,

            application,

            recordDate: currentRecordDate,

            operationHours,

            powerUnitDate:
                row["Power Unit Date"] || "",

            faultHistory:
                row["Fault history"] || "",

            description:
                row["Description"] || "",

            possibleCause:
                row["Possible Cause"] || "",

            correctiveActions:
                row["Corrective actions"] || "",

            note:
                row["note"] || ""

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
// EXPORT EXCEL
// ============================
exports.exportExcel = async (req, res) => {

  try {

    const rows = await prisma.vaconRecord.findMany({

      orderBy: {

        recordDate: "desc"

      }

    });

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("VACON History");

    sheet.columns = [

      { header: "Record Date", key: "recordDate", width: 15 },
      { header: "Station", key: "station", width: 12 },
      { header: "Tandem", key: "tandem", width: 15 },
      { header: "Device Name", key: "deviceName", width: 18 },
      { header: "Serial Number", key: "serialNumber", width: 22 },
      { header: "Application", key: "application", width: 18 },
      { header: "Power Unit Date", key: "powerUnitDate", width: 18 },
      { header: "Operation Hours", key: "operationHours", width: 18 },
      { header: "Fault History", key: "faultHistory", width: 40 },
      { header: "Description", key: "description", width: 40 },
      { header: "Possible Cause", key: "possibleCause", width: 40 },
      { header: "Corrective Actions", key: "correctiveActions", width: 40 },
      { header: "Note", key: "note", width: 30 }

    ];

    rows.forEach(item => {

      sheet.addRow({

        ...item,

        recordDate: item.recordDate
          ? new Date(item.recordDate).toLocaleDateString("vi-VN")
          : ""

      });

    });

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

    console.log(err);

    res.status(500).json({

      message: err.message

    });

  }

};


// ============================
// GET ONE
// ============================
exports.getOne = async (req, res) => {

  try {

    const id =
      Number(req.params.id);

    const item =
      await prisma.vaconRecord.findUnique({
        where: {
          id
        }
      });

    if (!item) {

      return res.status(404).json({
        message: "Không tìm thấy"
      });

    }

    res.json(item);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};


// ============================
// CREATE
// ============================
exports.create = async (req, res) => {

  try {

    const item =
      await prisma.vaconRecord.create({
        data: req.body
      });

    res.json(item);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message
    });

  }

};


// ============================
// UPDATE
// ============================
exports.update = async (req, res) => {

  try {

    const id = Number(req.params.id);

    const data = {
      ...req.body
    };

    if (data.recordDate) {
      data.recordDate =
        new Date(data.recordDate);
    }

    const item =
      await prisma.vaconRecord.update({
        where: { id },
        data
      });

    res.json(item);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message
    });

  }

};

// ============================
// DELETE
// ============================
exports.remove = async (req, res) => {

  try {

    const id =
      Number(req.params.id);

    await prisma.vaconRecord.delete({
      where: {
        id
      }
    });

    res.json({
      message: "Đã xóa"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
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

        // So sánh
        const compare = await compareRows(rows);

        // Thống kê
        const summary = {

            total: compare.length,

            newCount: compare.filter(x => x.status === "NEW").length,

            updateCount: compare.filter(x => x.status === "UPDATE").length,

            skipCount: compare.filter(x => x.status === "SKIP").length

        };

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

                updateCount: summary.updateCount,

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

                const device = await prisma.vaconDevice.create({

                    data: {

                        deviceName: item.deviceName,

                        serialNumber: item.serialNumber,

                        station: item.station,

                        tandem: item.tandem,

                        application: item.application

                    }

                });

                created++;

                await prisma.vaconHistory.create({

                    data: {

                        deviceId: device.id,

                        recordDate: item.recordDate,

                        operationHours: item.operationHours,

                        powerUnitDate: item.powerUnitDate,

                        faultHistory: item.faultHistory,

                        description: item.description,

                        possibleCause: item.possibleCause,

                        correctiveActions: item.correctiveActions,

                        note: item.note

                    }

                });

                histories++;

                continue;

            }

            if (item.status === "UPDATE") {

                if (

                    item.updateData &&

                    Object.keys(item.updateData).length

                ) {

                    await prisma.vaconDevice.update({

                        where: {

                            id: item.deviceId

                        },

                        data: item.updateData

                    });

                }

                await prisma.vaconHistory.create({

                    data: {

                        deviceId: item.deviceId,

                        recordDate: item.recordDate,

                        operationHours: item.operationHours,

                        powerUnitDate: item.powerUnitDate,

                        faultHistory: item.faultHistory,

                        description: item.description,

                        possibleCause: item.possibleCause,

                        correctiveActions: item.correctiveActions,

                        note: item.note

                    }

                });

                updated++;
                histories++;

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
