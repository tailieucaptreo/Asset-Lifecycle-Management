const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const XLSX = require("xlsx");
const ExcelJS = require("exceljs");

// ============================
// GET ALL
// ============================
exports.getAll = async (req, res) => {

  try {

    const data =
      await prisma.vaconRecord.findMany({
        orderBy: {
          recordDate: "desc"
        }
      });

    res.json(data);

  } catch (err) {

    console.log(err);

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
let currentRecordDate = null;
let imported = 0;

await prisma.$transaction(async (tx) => {

    for (const row of rows) {

        if (
            row["Record Date"] &&
            String(row["Record Date"]).trim() !== ""
        ) {

            currentRecordDate = excelDateToJS(
                row["Record Date"]
            );

        }

        const deviceName =
            row["The Device Name"]
                ? String(row["The Device Name"]).trim()
                : null;

        if (!deviceName) continue;

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

        // ==========================
        // Tìm thiết bị
        // ==========================

        let device =
            serialNumber
                ? await tx.vaconDevice.findUnique({

                    where: {

                        serialNumber

                    }

                })
                : null;

        // Nếu chưa có thì tạo

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

        }

        // Nếu đã có thì cập nhật thông tin

        else {

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

        // ==========================
        // Kiểm tra trùng lịch sử
        // ==========================

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

        // ==========================
        // Thêm lịch sử
        // ==========================

        await tx.vaconHistory.create({

            data: {

                deviceId: device.id,

                recordDate: currentRecordDate,

                operationHours,

                powerUnitDate:
                    row["Power Unit Date"]
                        ? String(row["Power Unit Date"])
                        : null,

                faultHistory:
                    row["Fault history"]
                        ? String(row["Fault history"])
                        : null,

                description:
                    row["Description"]
                        ? String(row["Description"])
                        : null,

                possibleCause:
                    row["Possible Cause"]
                        ? String(row["Possible Cause"])
                        : null,

                correctiveActions:
                    row["Corrective actions"]
                        ? String(row["Corrective actions"])
                        : null,

                note:
                    row["note"]
                        ? String(row["note"])
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
