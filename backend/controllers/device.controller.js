const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const XLSX = require("xlsx");

// ===============================
// 📊 GET ALL DEVICES
// ===============================
exports.getDevices = async (req, res) => {
  try {
    const devices = await prisma.device.findMany({
      orderBy: { createdAt: "desc" }
    });

    res.json(devices);
  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// ➕ CREATE / UPSERT DEVICE
// ===============================
exports.createDevice = async (req, res) => {
  try {
    const data = req.body;

    const device = await prisma.device.upsert({
      where: {
        deviceId: data.deviceId || "NO_ID_" + Date.now()
      },
      update: data,
      create: data
    });

    res.json(device);
  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// 📥 IMPORT EXCEL (GIỮ NGUYÊN)
// ===============================
exports.importExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file upload" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return res.status(400).json({ error: "File Excel rỗng" });
    }

    const normalize = (v, def = "") =>
      v === undefined || v === null || v === "" ? def : v;

    const parseDate = (v) => {
      if (!v) return null;
      const d = new Date(v);
      return isNaN(d.getTime()) ? null : d;
    };

    const normalizeStatus = (v) => {
      if (!v) return "Inactive";
      const t = v.toString().toLowerCase();
      if (t.includes("hoạt") || t.includes("active")) return "Active";
      if (t.includes("bảo")) return "Maintenance";
      return "Inactive";
    };

    const calculateExpiry = (install, life) => {
      if (!install || !life) return null;
      const d = new Date(install);
      d.setFullYear(d.getFullYear() + Number(life));
      return d;
    };

    let validData = [];

    rows.forEach((row) => {
      const installDate = parseDate(row["Ngày lắp đặt"]);
      const lifespan = row["Tuổi thọ thiết bị"]
        ? Number(row["Tuổi thọ thiết bị"])
        : null;

      validData.push({
        deviceId: row["Mã ID"] || null,
        name: normalize(row["Tên thiết bị"], "Không tên"),
        line: normalize(row["Tuyến cáp"], "Chưa rõ"),
        station: normalize(row["Nhà ga"], "Chưa rõ"),
        code: row["Ký hiệu"] || null,
        area: row["Khu vực"] || null,
        status: normalizeStatus(row["Tình trạng"]),
        installDate,
        lastMaintenance: parseDate(row["Ngày BT gần nhất"]),
        lifespan,
        expiryDate: calculateExpiry(installDate, lifespan),
      });
    });

    const chunkSize = 500;

    for (let i = 0; i < validData.length; i += chunkSize) {
      const chunk = validData.slice(i, i + chunkSize);

      await prisma.device.createMany({
        data: chunk,
        skipDuplicates: true,
      });
    }

    res.json({
      success: validData.length,
      message: "Import thành công 🚀",
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
    const ExcelJS = require("exceljs");

    const devices = await prisma.device.findMany();

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Devices");

    ws.columns = [
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
    console.log("EXPORT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};