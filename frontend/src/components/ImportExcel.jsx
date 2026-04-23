const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const XLSX = require("xlsx");

// ===============================
// 📥 IMPORT EXCEL (FULL CHUẨN)
// ===============================
exports.importExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file upload" });
    }

    // 🔥 đọc file từ buffer (fix Render)
    const workbook = XLSX.read(req.file.buffer, {
      type: "buffer",
    });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return res.status(400).json({ error: "File Excel rỗng" });
    }

    // ===============================
    // 🧠 HELPER FUNCTIONS
    // ===============================
    const normalize = (val, def = "") => {
      if (val === undefined || val === null || val === "") return def;
      return val;
    };

    const parseDateSafe = (val) => {
      if (!val) return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d;
    };

    const normalizeStatus = (val) => {
      if (!val) return "Inactive";

      const v = val.toString().toLowerCase();

      if (v.includes("hoạt") || v.includes("active")) return "Active";
      if (v.includes("bảo") || v.includes("maint")) return "Maintenance";

      return "Inactive";
    };

    const calculateExpiry = (installDate, lifespan) => {
      if (!installDate || !lifespan) return null;

      const d = new Date(installDate);
      d.setFullYear(d.getFullYear() + Number(lifespan));

      return d;
    };

    // ===============================
    // 🚀 IMPORT LOOP
    // ===============================
    let success = 0;
    let warnings = [];
    let errors = [];

    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];

        const deviceId = normalize(row["Mã ID"], null);

        const installDate = parseDateSafe(row["Ngày lắp đặt"]);
        const lifespan = row["Tuổi thọ thiết bị"]
          ? Number(row["Tuổi thọ thiết bị"])
          : null;

        const data = {
          deviceId: deviceId || null,
          name: normalize(row["Tên thiết bị"], "Không tên"),
          line: normalize(row["Tuyến cáp"], "Chưa rõ"),
          station: normalize(row["Nhà ga"], "Chưa rõ"),
          code: normalize(row["Ký hiệu"], null),
          area: normalize(row["Khu vực"], null),
          status: normalizeStatus(row["Tình trạng"]),
          installDate,
          lastMaintenance: parseDateSafe(row["Ngày BT gần nhất"]),
          lifespan,
          expiryDate: calculateExpiry(installDate, lifespan),
        };

        // ===============================
        // 🔥 LOGIC CHÍNH
        // ===============================

        // ❌ KHÔNG có ID → CREATE
        if (!deviceId) {
          await prisma.device.create({ data });

          warnings.push({
            row: i + 2,
            message: "Thiếu Mã ID (đã lưu, cần cập nhật sau)",
          });
        }

        // ✅ CÓ ID → UPSERT
        else {
          await prisma.device.upsert({
            where: { deviceId },
            update: data,
            create: data,
          });
        }

        success++;

      } catch (err) {
        console.log("ROW ERROR:", err);

        errors.push({
          row: i + 2,
          error: err.message,
        });
      }
    }

    // ===============================
    // 📤 RESPONSE
    // ===============================
    res.json({
      success,
      total: rows.length,
      warnings,
      errors,
    });

  } catch (err) {
    console.log("IMPORT ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};