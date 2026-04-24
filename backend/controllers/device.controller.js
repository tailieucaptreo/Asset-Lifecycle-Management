const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const XLSX = require("xlsx");

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
// CREATE
// ===============================
exports.createDevice = async (req, res) => {
  try {
    const data = req.body;

    const result = await prisma.device.create({
      data: {
        ...data,
        installDate: data.installDate ? new Date(data.installDate) : null,
        lastMaintenance: data.lastMaintenance
          ? new Date(data.lastMaintenance)
          : null
      }
    });

    res.json(result);

  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// UPDATE
// ===============================
exports.updateDevice = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "ID không hợp lệ" });
    }

    const data = req.body;

    const updated = await prisma.device.update({
      where: { id },
      data: {
        ...data,
        installDate: data.installDate ? new Date(data.installDate) : null,
        lastMaintenance: data.lastMaintenance
          ? new Date(data.lastMaintenance)
          : null
      }
    });

    res.json(updated);

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// DELETE
// ===============================
exports.deleteDevice = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "ID không hợp lệ" });
    }

    await prisma.device.delete({
      where: { id }
    });

    res.json({ message: "Deleted" });

  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// 🔥 PARSE DATE CHUẨN (FIX 39853)
// ===============================
const parseDate = (v) => {
  if (!v) return null;

  // Excel number → Date
  if (typeof v === "number") {
    const date = XLSX.SSF.parse_date_code(v);
    if (!date) return null;

    return new Date(date.y, date.m - 1, date.d);
  }

  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

// ===============================
// NORMALIZE
// ===============================
const normalize = (v, def = "") =>
  v === undefined || v === null || v === "" ? def : v;

const normalizeStatus = (v) => {
  if (!v) return "Inactive";

  const t = v.toString().toLowerCase();

  if (t.includes("active") || t.includes("hoạt") || t.includes("sử dụng"))
    return "Active";

  if (t.includes("bảo")) return "Maintenance";

  return "Inactive";
};

// ===============================
// AUTO MAP COLUMN
// ===============================
const getField = (row, keys) => {
  for (let key of Object.keys(row)) {
    const k = key.toLowerCase();

    if (keys.some(x => k.includes(x))) {
      return row[key];
    }
  }
  return null;
};

// ===============================
// IMPORT EXCEL (🔥 FIX DATE + 100%)
// ===============================
exports.importExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file" });
    }

    // 🔥 FIX 1: đọc đúng dạng date
    const workbook = XLSX.read(req.file.buffer, {
      type: "buffer",
      cellDates: true
    });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // 🔥 FIX 2: convert date khỏi dạng số
    const rows = XLSX.utils.sheet_to_json(sheet, {
      raw: false,
      defval: null
    });

    if (!rows.length) {
      return res.status(400).json({ error: "File rỗng" });
    }

    let success = 0;
    let failed = 0;

    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];

        const data = {
          deviceId: getField(row, ["id", "mã"])?.toString() || null,
          name: normalize(getField(row, ["tên"]), "Không tên"),
          line: normalize(getField(row, ["tuyến"]), "Chưa rõ"),
          station: normalize(getField(row, ["ga"]), "Chưa rõ"),
          code: getField(row, ["ký hiệu"]) || null,
          area: getField(row, ["khu vực"]) || null,
          status: normalizeStatus(getField(row, ["trạng"])),
          installDate: parseDate(getField(row, ["ngày lắp"])),
          lastMaintenance: parseDate(getField(row, ["bảo trì"])),
          lifespan: Number(getField(row, ["tuổi"])) || null
        };

        await prisma.device.create({
          data: {
            ...data,
            name: data.name || "Không tên",
            line: data.line || "Chưa rõ",
            station: data.station || "Chưa rõ"
          }
        });

        success++;

      } catch (err) {
        console.log(`❌ Row ${i + 2}:`, err.message);
        failed++;
      }
    }

    res.json({
      success,
      failed,
      total: rows.length
    });

  } catch (err) {
    console.log("🔥 IMPORT ERROR:", err);

    res.status(500).json({
      error: err.message
    });
  }
};
