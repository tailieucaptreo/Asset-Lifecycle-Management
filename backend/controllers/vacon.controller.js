const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const XLSX = require("xlsx");

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

    const id =
      Number(req.params.id);

    const item =
      await prisma.vaconRecord.update({

        where: {
          id
        },

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
      { type: "buffer" }
    );

    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    const rows =
      XLSX.utils.sheet_to_json(sheet, {
        defval: ""
      });

    let imported = 0;

    for (const row of rows) {

      await prisma.vaconRecord.create({

        data: {

          recordDate:
            row["Record Date"]
              ? new Date(row["Record Date"])
              : null,

          station:
            row["Station"] || "",

          tandem:
            row["Tandem"] || "",

          deviceName:
            row["The Device Name"] || "",

          serialNumber:
            row["Serial number"] || "",

          application:
            row["Application"] || "",

          powerUnitDate:
            row["Power Unit Date"] || "",

          faultHistory:
            row["Fault history"] || "",

          operationHours:
            row["Operation Hours"] || "",

          description:
            row["Description"] || "",

          possibleCause:
            row["Possible Cause"] || "",

          correctiveActions:
            row["Corrective actions"] || "",

          note:
            row["note"] || ""

        }

      });

      imported++;

    }

    res.json({

      success: true,
      imported

    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};
