const XLSX = require("xlsx");
const ExcelJS = require("exceljs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


// =========================
// 🔥 HEADER MAP LINH HOẠT
// =========================
const HEADER_MAP = {
  line: ["tuyến", "tuyen", "line"],
  station: ["nhà ga", "ga", "station"],
  name: ["tên thiết bị", "ten thiet bi", "name"],
  code: ["ký hiệu", "ky hieu", "code"],
  area: ["khu vực", "khu vuc", "area"],
  status: ["tình trạng", "trang thai", "status"],
  installDate: ["ngày lắp đặt", "ngay lap dat"],
  deviceId: ["mã id", "id"],
  lastMaintenance: ["ngày bt", "bảo trì"],
  lifespan: ["tuổi thọ", "lifespan"]
};


// =========================
// 🔍 GET VALUE LINH HOẠT
// =========================
const getValue = (row, field) => {
  const keys = HEADER_MAP[field];

  for (let k of keys) {
    const found = Object.keys(row).find(h =>
      h.toLowerCase().includes(k)
    );
    if (found) return row[found];
  }

  return null;
};


// =========================
// 🔥 STATUS
// =========================
const normalizeStatus = (s) => {
  if (!s) return "Inactive";

  s = s.toLowerCase();

  if (s.includes("đang") || s.includes("active")) return "Active";
  if (s.includes("bảo") || s.includes("maint")) return "Maintenance";

  return "Inactive";
};


// =========================
// 🔥 DATE PARSE
// =========================
const parseDate = (date) => {
  if (!date) return null;

  if (typeof date === "number") {
    return new Date((date - 25569) * 86400 * 1000);
  }

  if (typeof date === "string" && date.includes("/")) {
    const [d, m, y] = date.split("/");
    return new Date(`${y}-${m}-${d}`);
  }

  return new Date(date);
};


// =========================
// 📥 CREATE / UPSERT DEVICE
// =========================
exports.createDevice = async (req, res) => {
  try {
    const data = req.body;

    if (!data.deviceId) {
      return res.status(400).json({
        error: "deviceId là bắt buộc"
      });
    }

    const installDate = parseDate(data.installDate);
    const lifespan = data.lifespan ? parseInt(data.lifespan) : null;

    let expiryDate = null;
    if (installDate && lifespan) {
      expiryDate = new Date(installDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + lifespan);
    }

    const device = await prisma.device.upsert({
      where: {
        deviceId: String(data.deviceId)
      },
      update: {
        name: data.name,
        line: data.line,
        station: data.station,
        code: data.code || null,
        area: data.area || null,
        status: data.status,
        installDate,
        lastMaintenance: parseDate(data.lastMaintenance),
        lifespan,
        expiryDate
      },
      create: {
        name: data.name,
        line: data.line,
        station: data.station,
        code: data.code || null,
        area: data.area || null,
        deviceId: String(data.deviceId),
        status: data.status,
        installDate,
        lastMaintenance: parseDate(data.lastMaintenance),
        lifespan,
        expiryDate
      }
    });

    res.json(device);

  } catch (err) {
    console.log("🔥 CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// =========================
// 📊 GET ALL DEVICES
// =========================
exports.getDevices = async (req, res) => {
  try {
    const data = await prisma.device.findMany({
      orderBy: { createdAt: "desc" }
    });

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =========================
// 📥 IMPORT EXCEL (AUTO)
// =========================
exports.importExcel = async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    let success = 0;
    let errors = [];

    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];

        const deviceId = getValue(row, "deviceId");

        if (!deviceId) {
          errors.push({ row: i + 2, error: "Thiếu deviceId" });
          continue;
        }

        const name = getValue(row, "name") || "Không tên";
        const line = getValue(row, "line") || "Unknown";
        const station = getValue(row, "station") || "Unknown";

        const installDate = parseDate(getValue(row, "installDate"));
        const lifespan = parseInt(getValue(row, "lifespan")) || null;

        let expiryDate = null;
        if (installDate && lifespan) {
          expiryDate = new Date(installDate);
          expiryDate.setFullYear(expiryDate.getFullYear() + lifespan);
        }

        await prisma.device.upsert({
          where: {
            deviceId: String(deviceId)
          },
          update: {
            name,
            line,
            station,
            code: getValue(row, "code"),
            area: getValue(row, "area"),
            status: normalizeStatus(getValue(row, "status")),
            installDate,
            lastMaintenance: parseDate(getValue(row, "lastMaintenance")),
            lifespan,
            expiryDate
          },
          create: {
            name,
            line,
            station,
            code: getValue(row, "code"),
            area: getValue(row, "area"),
            deviceId: String(deviceId),
            status: normalizeStatus(getValue(row, "status")),
            installDate,
            lastMaintenance: parseDate(getValue(row, "lastMaintenance")),
            lifespan,
            expiryDate
          }
        });

        success++;

      } catch (err) {
        errors.push({
          row: i + 2,
          error: err.message
        });
      }
    }

    res.json({
      message: "Import hoàn tất",
      success,
      total: rows.length,
      errors
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Import failed" });
  }
};


// =========================
// 📤 EXPORT EXCEL
// =========================
exports.exportExcel = async (req, res) => {
  try {
    const devices = await prisma.device.findMany();

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Devices");

    ws.columns = [
      { header: "Tên thiết bị", key: "name" },
      { header: "Tuyến", key: "line" },
      { header: "Nhà ga", key: "station" },
      { header: "Mã ID", key: "deviceId" },
      { header: "Trạng thái", key: "status" },
      { header: "Ngày lắp đặt", key: "installDate" },
      { header: "Ngày BT gần nhất", key: "lastMaintenance" },
      { header: "Tuổi thọ", key: "lifespan" }
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