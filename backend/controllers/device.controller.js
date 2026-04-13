const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const xlsx = require("xlsx");
const ExcelJS = require("exceljs");

// ✅ GET ALL DEVICES
exports.getDevices = async (req, res) => {
  try {
    const devices = await prisma.device.findMany();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ IMPORT EXCEL
exports.importExcel = async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (let row of data) {
      await prisma.device.upsert({
        where: { id: String(row.ID) },
        update: {
          name: row.Name,
          line: row.Line,
          station: row.Station,
          installDate: new Date(row.InstallDate),
          expiryDate: new Date(row.ExpiryDate),
          status: row.Status,
          note: row.Note || "",
        },
        create: {
          id: String(row.ID),
          name: row.Name,
          line: row.Line,
          station: row.Station,
          installDate: new Date(row.InstallDate),
          expiryDate: new Date(row.ExpiryDate),
          status: row.Status,
          note: row.Note || "",
        },
      });
    }

    res.json({ message: "Import thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ EXPORT EXCEL
exports.exportExcel = async (req, res) => {
  try {
    const devices = await prisma.device.findMany();

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Devices");

    ws.columns = [
      { header: "ID", key: "id" },
      { header: "Name", key: "name" },
      { header: "Line", key: "line" },
      { header: "Station", key: "station" },
      { header: "Expiry", key: "expiryDate" },
    ];

    devices.forEach(d => ws.addRow(d));

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=devices.xlsx"
    );

    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};