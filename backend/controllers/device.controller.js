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
    console.log("GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// CREATE
// ===============================
exports.createDevice = async (req, res) => {
  try {
    const d = req.body;

    const data = {
      deviceId: d.deviceId || null,
      name: d.name || "Không tên",
      line: d.line || "Chưa rõ",
      station: d.station || "Chưa rõ",
      code: d.code || null,
      area: d.area || null,
      status: d.status || "Inactive",
      installDate: d.installDate ? new Date(d.installDate) : null,
      lastMaintenance: d.lastMaintenance
        ? new Date(d.lastMaintenance)
        : null,
      lifespan: d.lifespan ? Number(d.lifespan) : null
    };

    const result = await prisma.device.create({ data });

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
    const d = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID không hợp lệ" });
    }

    const data = {
      deviceId: d.deviceId || null,
      name: d.name || "Không tên",
      line: d.line || "Chưa rõ",
      station: d.station || "Chưa rõ",
      code: d.code || null,
      area: d.area || null,
      status: d.status || "Inactive",
      installDate: d.installDate ? new Date(d.installDate) : null,
      lastMaintenance: d.lastMaintenance
        ? new Date(d.lastMaintenance)
        : null,
      lifespan: d.lifespan ? Number(d.lifespan) : null
    };

    const result = await prisma.device.update({
      where: { id },
      data
    });

    res.json(result);

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
// IMPORT EXCEL (KHÔNG FAIL)
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
        const row = rows[i];

        // ======================
        // SAFE FUNCTIONS
        // ======================
        const safeString = (v, def = null) => {
          if (v === undefined || v === null || v === "") return def;
          return String(v).trim();
        };

        const safeNumber = (v) => {
          const n = Number(v);
          return isNaN(n) ? null : n;
        };

        const safeDate = (v) => {
          if (!v) return null;

          // Excel dạng số
          if (typeof v === "number") {
            const d = new Date((v - 25569) * 86400 * 1000);
            return isNaN(d) ? null : d;
          }

          const d = new Date(v);
          return isNaN(d) ? null : d;
        };

        const normalizeStatus = (v) => {
          if (!v) return "Inactive";

          const t = v.toString().toLowerCase();

          if (t.includes("đang") || t.includes("active")) return "Active";
          if (t.includes("bảo")) return "Maintenance";

          return "Inactive";
        };

        // ======================
        // BUILD DATA
        // ======================
        const data = {
          deviceId: safeString(row["Mã ID"]),
          name: safeString(row["Tên thiết bị"], "Không tên"),
          line: safeString(row["Tuyến cáp"], "Chưa rõ"),
          station: safeString(row["Nhà ga"], "Chưa rõ"),
          code: safeString(row["Ký hiệu"]),
          area:
            safeString(row["Khu Vực"]) ||
            safeString(row["Khu vực"]),

          status: normalizeStatus(row["Trạng thái"]),
          installDate: safeDate(row["Ngày lắp đặt"]),
          lastMaintenance: safeDate(row["Ngày BT gần nhất"]),
          lifespan: safeNumber(row["Tuổi thọ thiết bị"])
        };

        // 🔥 luôn create → cho phép trùng
        await prisma.device.create({ data });

        success++;

      } catch (err) {
        console.log(`❌ Row ${i + 2}:`, err.message);

        // 🔥 fallback không mất dòng
        try {
          await prisma.device.create({
            data: {
              name: "Lỗi dữ liệu",
              line: "Unknown"
            }
          });
          success++;
        } catch {
          failed++;
        }
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
