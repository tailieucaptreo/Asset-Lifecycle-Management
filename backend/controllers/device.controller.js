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
// CREATE / UPSERT (NHẬP TAY)
// ===============================
exports.createDevice = async (req, res) => {
  try {
    const data = req.body;

    // 🔥 đảm bảo không crash
    const result = await prisma.device.create({
      data: {
        deviceId: data.deviceId || null,
        name: data.name || "Không tên",
        line: data.line || "Chưa rõ",
        station: data.station || "Chưa rõ",
        code: data.code || null,
        area: data.area || null,
        status: data.status || "Inactive",
        installDate: data.installDate ? new Date(data.installDate) : null,
        lastMaintenance: data.lastMaintenance
          ? new Date(data.lastMaintenance)
          : null,
        lifespan: data.lifespan ? Number(data.lifespan) : null
      }
    });

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
// IMPORT EXCEL (KHÔNG BAO GIỜ CRASH)
// ===============================
exports.importExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });

    if (!rows.length) {
      return res.status(400).json({ error: "File rỗng" });
    }

    // ======================
    // HELPER
    // ======================
    const safe = (v) => (v === undefined ? null : v);

    const parseDate = (v) => {
      if (!v) return null;

      // Excel dạng number
      if (typeof v === "number") {
        const date = new Date((v - 25569) * 86400 * 1000);
        return isNaN(date) ? null : date;
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
    // IMPORT LOOP
    // ======================
    let success = 0;
    let failed = 0;

    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];

        const data = {
          deviceId: safe(row["Mã ID"])?.toString() || null,
          name: safe(row["Tên thiết bị"]) || "Không tên",
          line: safe(row["Tuyến cáp"])?.toString() || "Chưa rõ",
          station: safe(row["Nhà ga"]) || "Chưa rõ",
          code: safe(row["Ký hiệu"]),
          area: safe(row["Khu Vực"]) || safe(row["Khu vực"]),
          status: normalizeStatus(row["Trạng thái"]),
          installDate: parseDate(row["Ngày lắp đặt"]),
          lastMaintenance: parseDate(row["Ngày BT gần nhất"]),
          lifespan: safe(row["Tuổi thọ thiết bị"])
            ? Number(row["Tuổi thọ thiết bị"])
            : null
        };

        // 🔥 KHÔNG DÙNG UPSERT → KHÔNG BAO GIỜ CRASH
        await prisma.device.create({ data });

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
