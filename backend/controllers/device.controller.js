const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const XLSX = require("xlsx");

// ===============================
// GET ALL DEVICES
// ===============================
exports.getDevices = async (req, res) => {
  try {
    const devices = await prisma.device.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// CREATE / UPSERT DEVICE
// ===============================
exports.createDevice = async (req, res) => {
  try {
    const data = req.body;

    if (!data.deviceId) {
      return res.status(400).json({ error: "Thiếu deviceId" });
    }

    const device = await prisma.device.upsert({
      where: { deviceId: String(data.deviceId) },
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
// 📥 IMPORT EXCEL (AUTO FIX 100%)
// ===============================
exports.importExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return res.status(400).json({ error: "File rỗng" });
    }

    let success = 0;
    let failed = [];

    // ===============================
    // 🧠 AUTO MAP COLUMN
    // ===============================
    const findKey = (row, keywords) => {
      const keys = Object.keys(row);

      return keys.find(k =>
        keywords.some(w =>
          k.toLowerCase().includes(w)
        )
      );
    };

    // ===============================
    // 🧠 DATE FIX (CHỐNG 1970)
    // ===============================
    const parseDate = (v) => {
      if (!v) return null;

      // excel number → date
      if (typeof v === "number") {
        return new Date((v - 25569) * 86400 * 1000);
      }

      // dd/mm/yyyy → fix
      if (typeof v === "string" && v.includes("/")) {
        const parts = v.split("/");
        if (parts.length === 3) {
          const [d, m, y] = parts;
          return new Date(`${y}-${m}-${d}`);
        }
      }

      const d = new Date(v);
      return isNaN(d) ? null : d;
    };

    const normalize = (v, def = "") =>
      v === undefined || v === null || v === "" ? def : v;

    const normalizeStatus = (v) => {
      if (!v) return "Inactive";

      const t = v.toString().toLowerCase();

      if (t.includes("active") || t.includes("hoạt")) return "Active";
      if (t.includes("bảo")) return "Maintenance";

      return "Inactive";
    };

    // ===============================
    // 🚀 LOOP SAFE
    // ===============================
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      try {
        const deviceIdKey = findKey(row, ["id"]);
        const nameKey = findKey(row, ["tên", "name"]);
        const lineKey = findKey(row, ["tuyến", "line"]);
        const stationKey = findKey(row, ["ga", "station"]);
        const statusKey = findKey(row, ["trạng", "status"]);
        const installKey = findKey(row, ["lắp", "install"]);
        const maintenanceKey = findKey(row, ["bảo", "bt"]);

        const data = {
          deviceId: row[deviceIdKey]?.toString() || null,
          name: normalize(row[nameKey], "Không tên"),
          line: normalize(row[lineKey], "Chưa rõ"),
          station: normalize(row[stationKey], "Chưa rõ"),
          code: row["Ký hiệu"] || null,
          area: row["Khu vực"] || null,
          status: normalizeStatus(row[statusKey]),
          installDate: parseDate(row[installKey]),
          lastMaintenance: parseDate(row[maintenanceKey]),
        };

        // ❗ thiếu ID → skip
        if (!data.deviceId) {
          failed.push({ row: i + 2, error: "Thiếu Mã ID" });
          continue;
        }

        await prisma.device.upsert({
          where: { deviceId: data.deviceId },
          update: data,
          create: data
        });

        success++;

      } catch (err) {
        failed.push({
          row: i + 2,
          error: err.message
        });
      }
    }

    res.json({
      success,
      failed,
      total: rows.length,
      message: "Import hoàn tất 🚀"
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
    const data = await prisma.device.findMany();

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, "Devices");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=devices.xlsx");
    res.send(buffer);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
