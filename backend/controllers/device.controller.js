const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const XLSX = require("xlsx");

// ===============================
// 🧠 HELPER: normalize key
// ===============================
const normalizeKey = (str) => {
  return str
    ?.toString()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "") || "";
};

// ===============================
// 🧠 HELPER: map column thông minh
// ===============================
const mapRow = (row) => {
  const keys = Object.keys(row);

  const get = (aliases) => {
    for (let key of keys) {
      const normalized = normalizeKey(key);

      for (let a of aliases) {
        if (normalized.includes(normalizeKey(a))) {
          return row[key];
        }
      }
    }
    return null;
  };

  return {
    deviceId: get(["mã id", "id", "deviceid"]),
    name: get(["tên", "thiết bị", "name"]),
    line: get(["tuyến", "line"]),
    station: get(["ga", "nhà ga", "station"]),
    code: get(["ký hiệu", "code"]),
    area: get(["khu vực", "area"]),
    status: get(["trạng thái", "status"]),
    installDate: get(["ngày lắp", "install"]),
    lastMaintenance: get(["bảo trì", "bt"]),
    lifespan: get(["tuổi thọ", "life"])
  };
};

// ===============================
// 🧠 PARSE DATE (chống lỗi 1970)
// ===============================
const parseDate = (v) => {
  if (!v) return null;

  // excel number date
  if (typeof v === "number") {
    const date = XLSX.SSF.parse_date_code(v);
    if (!date) return null;

    return new Date(date.y, date.m - 1, date.d);
  }

  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

// ===============================
// 🧠 STATUS NORMALIZE
// ===============================
const normalizeStatus = (v) => {
  if (!v) return "Inactive";

  const t = v.toString().toLowerCase();

  if (t.includes("đang") || t.includes("active")) return "Active";
  if (t.includes("bảo") || t.includes("maint")) return "Maintenance";

  return "Inactive";
};

// ===============================
// 🧠 COMPUTE EXPIRY
// ===============================
const computeExpiry = (installDate, lifespan) => {
  if (!installDate || !lifespan) return null;

  const d = new Date(installDate);
  if (isNaN(d)) return null;

  d.setFullYear(d.getFullYear() + Number(lifespan));
  return d;
};

// ===============================
// GET ALL
// ===============================
exports.getDevices = async (req, res) => {
  try {
    const data = await prisma.device.findMany({
      orderBy: { id: "desc" }
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// CREATE / UPDATE (NO CRASH)
// ===============================
exports.createDevice = async (req, res) => {
  try {
    let data = req.body;

    data.installDate = parseDate(data.installDate);
    data.lastMaintenance = parseDate(data.lastMaintenance);
    data.status = normalizeStatus(data.status);
    data.lifespan = data.lifespan ? Number(data.lifespan) : null;

    data.expiryDate = computeExpiry(
      data.installDate,
      data.lifespan
    );

    // 🔥 KHÔNG UPSERT -> luôn create (cho phép trùng ID)
    const result = await prisma.device.create({ data });

    res.json(result);

  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// DELETE
// ===============================
exports.deleteDevice = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.device.delete({
      where: { id }
    });

    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// 🚀 IMPORT SIÊU THÔNG MINH
// ===============================
exports.importExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });

    let success = 0;
    let failed = 0;

    for (let i = 0; i < rows.length; i++) {
      try {
        const raw = mapRow(rows[i]);

        const data = {
          deviceId: raw.deviceId?.toString() || null,
          name: raw.name || "Không tên",
          line: raw.line || "Chưa rõ",
          station: raw.station || "Chưa rõ",
          code: raw.code || null,
          area: raw.area || null,
          status: normalizeStatus(raw.status),
          installDate: parseDate(raw.installDate),
          lastMaintenance: parseDate(raw.lastMaintenance),
          lifespan: raw.lifespan ? Number(raw.lifespan) : null
        };

        data.expiryDate = computeExpiry(
          data.installDate,
          data.lifespan
        );

        // 🔥 LUÔN CREATE -> import 100%
        await prisma.device.create({ data });

        success++;

      } catch (err) {
        console.log(`❌ Row ${i + 2}:`, err.message);
        failed++; // chỉ log, không crash
      }
    }

    res.json({
      success,
      failed,
      total: rows.length
    });

  } catch (err) {
    console.log("IMPORT ERROR:", err);

    res.status(500).json({
      error: err.message
    });
  }
};
