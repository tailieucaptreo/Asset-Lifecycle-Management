const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const XLSX = require("xlsx");
const ExcelJS = require("exceljs");

// ===============================
// 📊 GET ALL DEVICES
// ===============================
exports.getDevices = async (req, res) => {
  try {
    const devices = await prisma.device.findMany({
      orderBy: { id: "desc" }
    });

    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// ➕ CREATE / UPDATE (UPSERT)
// ===============================
exports.createDevice = async (req, res) => {
  try {
    const data = req.body;

    // 🛡 validate
    if (!data.deviceId) {
      return res.status(400).json({
        error: "Thiếu deviceId (Mã ID)"
      });
    }

    const device = await prisma.device.upsert({
      where: { deviceId: String(data.deviceId) },
      update: {
        name: data.name || "Không tên",
        line: data.line || "Chưa rõ",
        station: data.station || "Chưa rõ",
        code: data.code || null,
        area: data.area || null,
        status: data.status || "Inactive",
        lifespan: data.lifespan || null,
        installDate: data.installDate ? new Date(data.installDate) : null,
        lastMaintenance: data.lastMaintenance ? new Date(data.lastMaintenance) : null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null
      },
      create: {
        deviceId: String(data.deviceId),
        name: data.name || "Không tên",
        line: data.line || "Chưa rõ",
        station: data.station || "Chưa rõ",
        code: data.code || null,
        area: data.area || null,
        status: data.status || "Inactive",
        lifespan: data.lifespan || null,
        installDate: data.installDate ? new Date(data.installDate) : null,
        lastMaintenance: data.lastMaintenance ? new Date(data.lastMaintenance) : null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null
      }
    });

    res.json(device);

  } catch (err) {
    console.log("UPSERT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// 📥 IMPORT EXCEL (BATCH)
// ===============================
exports.importExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    let success = 0;

    for (let row of rows) {
      const deviceId = row["Mã ID"];

      if (!deviceId) continue;

      await prisma.device.upsert({
        where: { deviceId: String(deviceId) },
        update: {
          name: row["Tên thiết bị"] || "Không tên",
          line: row["Tuyến"] || "Chưa rõ",
          station: row["Nhà ga"] || "Chưa rõ",
          code: row["Ký hiệu"] || null,
          area: row["Khu vực"] || null,
          status: row["Tình trạng"] || "Inactive"
        },
        create: {
          deviceId: String(deviceId),
          name: row["Tên thiết bị"] || "Không tên",
          line: row["Tuyến"] || "Chưa rõ",
          station: row["Nhà ga"] || "Chưa rõ",
          code: row["Ký hiệu"] || null,
          area: row["Khu vực"] || null,
          status: row["Tình trạng"] || "Inactive"
        }
      });

      success++;
    }

    res.json({
      message: "Import thành công",
      total: success
    });

  } catch (err) {
    console.log("IMPORT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// 📤 EXPORT EXCEL
// ===============================
exports.exportExcel = async (req, res) => {
  try {
    const devices = await prisma.device.findMany();

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Devices");

    ws.columns = [
      { header: "ID", key: "id" },
      { header: "Tên thiết bị", key: "name" },
      { header: "Tuyến", key: "line" },
      { header: "Nhà ga", key: "station" },
      { header: "Mã ID", key: "deviceId" },
      { header: "Trạng thái", key: "status" },
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
