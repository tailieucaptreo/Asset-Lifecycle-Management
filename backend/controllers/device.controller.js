const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const XLSX = require("xlsx");

// ================= HELPER =================
const normalize = (v, def = "") =>
  v === undefined || v === null || v === ""
    ? def
    : v.toString().trim();

// ================= DATE =================
const parseDate = (v) => {

  if (!v) return null;

  // Excel serial
  if (typeof v === "number") {
    const d = new Date((v - 25569) * 86400000);
    return isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(v);

  return isNaN(d.getTime()) ? null : d;
};

// ================= STATUS =================
const normalizeStatus = (v) => {

  if (!v) return "Inactive";

  const t = v
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  console.log("STATUS =", t);

  // ACTIVE
  if (
    t === "active" ||
    t.includes("active") ||
    t.includes("dang su dung") ||
    t.includes("su dung")
  ) {
    return "Active";
  }

  // MAINTENANCE
  if (
    t.includes("maintenance") ||
    t.includes("bao tri")
  ) {
    return "Maintenance";
  }

  return "Inactive";
};

// ================= GET FIELD =================
const getField = (row, keys) => {

  for (let key of Object.keys(row)) {

    const k = key
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    if (keys.some(x => k.includes(x))) {
      return row[key];
    }
  }

  return null;
};

// ================= GET =================
exports.getDevices = async (req, res) => {

  try {

    const data = await prisma.device.findMany({
      orderBy: { id: "desc" }
    });

    res.json(data);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= CREATE =================
exports.createDevice = async (req, res) => {

  try {

    const d = req.body;

    const result = await prisma.device.create({
      data: {
        ...d,
        status: normalizeStatus(d.status),
        installDate: parseDate(d.installDate),
        lastMaintenance: parseDate(d.lastMaintenance)
      }
    });

    res.json(result);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= UPDATE =================
exports.updateDevice = async (req, res) => {

  try {

    const id = Number(req.params.id);

    const d = req.body;

    const updated = await prisma.device.update({
      where: { id },
      data: {
        ...d,
        status: normalizeStatus(d.status),
        installDate: parseDate(d.installDate),
        lastMaintenance: parseDate(d.lastMaintenance)
      }
    });

    res.json(updated);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= DELETE =================
exports.deleteDevice = async (req, res) => {

  try {

    const id = Number(req.params.id);

    await prisma.device.delete({
      where: { id }
    });

    res.json({ ok: true });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= IMPORT =================
exports.importExcel = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        error: "Không có file"
      });
    }

    const workbook = XLSX.read(req.file.buffer, {
      type: "buffer"
    });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // 🔥 FIX QUAN TRỌNG
    const rows = XLSX.utils.sheet_to_json(sheet, {
      raw: true,
      defval: ""
    });

    let success = 0;
    let failed = 0;

    for (let row of rows) {

      try {

        const data = {

          deviceId: normalize(
            getField(row, ["ma id", "id"]),
            null
          ),

          name: normalize(
            getField(row, ["ten thiet bi", "ten"])
          ),

          line: normalize(
            getField(row, ["tuyen cap", "tuyen"])
          ),

          station: normalize(
            getField(row, ["nha ga", "ga"])
          ),

          code: normalize(
            getField(row, ["ky hieu"]),
            null
          ),

          area: normalize(
            getField(row, ["khu vuc"]),
            null
          ),

          status: normalizeStatus(
            getField(row, ["active", "trang thai", "status"])
          ),

          installDate: parseDate(
            getField(row, ["ngay lap dat", "ngay lap"])
          ),

          lifespan:
            Number(
              getField(row, ["tuoi tho thiet bi", "tuoi tho"])
            ) || null
        };

        console.log("IMPORT DATA:", data);

        await prisma.device.create({
          data
        });

        success++;

      } catch (err) {

        console.log("❌ IMPORT ERROR:", err.message);
        console.log("ROW:", row);

        failed++;
      }
    }

    res.json({
      success,
      failed,
      total: rows.length
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};