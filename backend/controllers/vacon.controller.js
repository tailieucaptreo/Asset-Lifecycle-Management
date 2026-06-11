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
    
      if (typeof value === "number") {
    
        const excelEpoch =
          new Date(
            Date.UTC(
              1899,
              11,
              30
            )
          );
    
        return new Date(
          excelEpoch.getTime()
          +
          value * 86400000
        );
    
      }
    
      const d =
        new Date(value);
    
      return isNaN(d)
        ? null
        : d;
    
    }
        
    function excelTimeToString(value) {
    
      if (!value) return "";
    
      // Excel time
      if (typeof value === "number") {
    
        const totalSeconds =
          Math.round(
            value * 24 * 60 * 60
          );
    
        const hours =
          String(
            Math.floor(
              totalSeconds / 3600
            )
          ).padStart(2, "0");
    
        const minutes =
          String(
            Math.floor(
              (totalSeconds % 3600) / 60
            )
          ).padStart(2, "0");
    
        const seconds =
          String(
            totalSeconds % 60
          ).padStart(2, "0");
    
        return `${hours}:${minutes}:${seconds}`;
    
      }
    
      return String(value);
    
    }

    const data = rows.map(row => ({

      recordDate:
        excelDateToJS(
          row["Record Date"]
        ),

      station:
        row["Station"]
          ? String(row["Station"])
          : null,

      tandem:
        row["Tandem"]
          ? String(row["Tandem"])
          : null,

      deviceName:
        row["The Device Name"]
          ? String(row["The Device Name"])
          : null,

      serialNumber:
        row["Serial number"]
          ? String(row["Serial number"])
          : null,

      application:
        row["Application"]
          ? String(row["Application"])
          : null,

      powerUnitDate:
        row["Power Unit Date"]
          ? String(row["Power Unit Date"])
          : null,

      faultHistory:
        row["Fault history"]
          ? String(row["Fault history"])
          : null,

      operationHours:
      excelTimeToString(
        row["Operation Hours"]
      ),

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

    }));

    await prisma.vaconRecord.createMany({
      data
    });

    res.json({
      success: true,
      imported: data.length
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};
