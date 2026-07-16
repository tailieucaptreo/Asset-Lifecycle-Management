const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const XLSX = require("xlsx");
const ExcelJS = require("exceljs");


// ============================
// GET ALL DEVICES
// ============================
exports.getAll = async (req, res) => {

  try {

    const devices =
      await prisma.vaconDevice.findMany({

        include: {

          histories: {

            orderBy: {

              recordDate: "desc"

            },

            take: 1

          }

        },

        orderBy: {

          deviceName: "asc"

        }

      });

    const result =
      devices.map(device => {

        const history =
          device.histories[0] || {};

        return {

          id: device.id,

          deviceName: device.deviceName,

          serialNumber: device.serialNumber,

          station: device.station,

          tandem: device.tandem,

          application: device.application,

          recordDate: history.recordDate || null,

          operationHours: history.operationHours || null,

          powerUnitDate: history.powerUnitDate || null,

          faultHistory: history.faultHistory || null,

          description: history.description || null,

          possibleCause: history.possibleCause || null,

          correctiveActions: history.correctiveActions || null,

          note: history.note || null,

          createdAt: device.createdAt

        };

      });

    res.json(result);

  }

  catch (err) {

    console.error(err);

    res.status(500).json({

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
// IMPORT EXCEL
// ============================
exports.importExcel = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        message: "Chưa chọn file"
      });

    }

    const workbook = XLSX.read(
      req.file.buffer,
      {
        type: "buffer"
      }
    );

    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    const rows =
      XLSX.utils.sheet_to_json(
        sheet,
        {
          defval: ""
        }
      );

    // ------------------------
    // Chuyển ngày Excel
    // ------------------------

    function excelDateToJS(value) {

      if (!value) return null;

      if (typeof value === "number") {

        const excelEpoch =
          new Date(Date.UTC(1899, 11, 30));

        return new Date(
          excelEpoch.getTime()
          +
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

      return isNaN(d)
        ? null
        : d;

    }

    // ------------------------
    // Chuyển giờ Excel
    // ------------------------

    function excelTimeToString(value) {

      if (!value) return "";

      if (typeof value === "number") {

        const total =
          Math.round(
            value * 24 * 60 * 60
          );

        const h =
          String(
            Math.floor(total / 3600)
          ).padStart(2, "0");

        const m =
          String(
            Math.floor(
              (total % 3600) / 60
            )
          ).padStart(2, "0");

        const s =
          String(
            total % 60
          ).padStart(2, "0");

        return `${h}:${m}:${s}`;

      }

      return String(value);

    }

    let currentRecordDate = null;

    let imported = 0;

    await prisma.$transaction(async (tx) => {

      for (const row of rows) {

        // ------------------------
        // Record Date
        // ------------------------

        if (
          row["Record Date"] &&
          String(row["Record Date"]).trim() !== ""
        ) {

          currentRecordDate =
            excelDateToJS(
              row["Record Date"]
            );

        }

        const deviceName =
          row["The Device Name"]
            ? String(row["The Device Name"]).trim()
            : null;

        if (!deviceName) {

          continue;

        }

        const serialNumber =
          row["Serial number"]
            ? String(row["Serial number"]).trim()
            : null;

        const station =
          row["Station"]
            ? String(row["Station"]).trim()
            : null;

        const tandem =
          row["Tandem"]
            ? String(row["Tandem"]).trim()
            : null;

        const application =
          row["Application"]
            ? String(row["Application"]).trim()
            : null;

        // ------------------------
        // Tìm hoặc tạo thiết bị
        // ------------------------

        let device = null;

        if (serialNumber) {

          device =
            await tx.vaconDevice.findUnique({

              where: {

                serialNumber

              }

            });

        }

        if (!device) {

          device =
            await tx.vaconDevice.create({

              data: {

                deviceName,

                serialNumber,

                station,

                tandem,

                application

              }

            });

        } else {

          await tx.vaconDevice.update({

            where: {

              id: device.id

            },

            data: {

              deviceName,

              station,

              tandem,

              application

            }

          });

        }

        const operationHours =
          excelTimeToString(
            row["Operation Hours"]
          );

        // ------------------------
        // Kiểm tra trùng
        // ------------------------

        const existed =
          await tx.vaconHistory.findFirst({

            where: {

              deviceId: device.id,

              recordDate: currentRecordDate,

              operationHours

            }

          });

        if (existed) {

          continue;

        }

        // ------------------------
        // Lưu lịch sử
        // ------------------------

        await tx.vaconHistory.create({

          data: {

            deviceId: device.id,

            recordDate: currentRecordDate,

            operationHours,

            powerUnitDate:
              row["Power Unit Date"]
                ? String(
                    row["Power Unit Date"]
                  )
                : null,

            faultHistory:
              row["Fault history"]
                ? String(
                    row["Fault history"]
                  )
                : null,

            description:
              row["Description"]
                ? String(
                    row["Description"]
                  )
                : null,

            possibleCause:
              row["Possible Cause"]
                ? String(
                    row["Possible Cause"]
                  )
                : null,

            correctiveActions:
              row["Corrective actions"]
                ? String(
                    row["Corrective actions"]
                  )
                : null,

            note:
              row["note"]
                ? String(
                    row["note"]
                  )
                : null

          }

        });

        imported++;

      }

    });

    res.json({

      success: true,

      imported

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