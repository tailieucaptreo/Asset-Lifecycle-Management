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

    function excelDateToJS(value) {

      if (!value) return null;

      // Excel serial number
      if (typeof value === "number") {

        return new Date(
          (value - 25569) *
          86400 *
          1000
        );

      }

      // Date string
      const d = new Date(value);

      return isNaN(d)
        ? null
        : d;

    }

    let imported = 0;

    for (const row of rows) {

      await prisma.vaconRecord.create({

        data: {

          recordDate:
            row["Record Date"]
              ? excelDateToJS(row["Record Date"])
              : null,

          station:
            String(row["Station"] || ""),
          
          tandem:
            String(row["Tandem"] || ""),
          
          deviceName:
            String(row["The Device Name"] || ""),
          
          serialNumber:
            String(row["Serial number"] || ""),
          
          application:
            String(row["Application"] || ""),
          
          powerUnitDate:
            String(row["Power Unit Date"] || ""),
          
          faultHistory:
            String(row["Fault history"] || ""),
          
          operationHours:
            String(row["Operation Hours"] || ""),
          
          description:
            String(row["Description"] || ""),
          
          possibleCause:
            String(row["Possible Cause"] || ""),
          
          correctiveActions:
            String(row["Corrective actions"] || ""),
          
          note:
            String(row["note"] || "")
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
