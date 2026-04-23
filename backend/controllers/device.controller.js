const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const XLSX = require("xlsx");

// ===============================
// 📥 IMPORT EXCEL SIÊU NHANH
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
    // 🧠 HELPER
    // ===============================
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

    // ===============================
    // 🧩 MAP DATA
    // ===============================
    let warnings = [];
    let validData = [];

    rows.forEach((row, i) => {
      try {
        const deviceId = normalize(row["Mã ID"], null);

        const installDate = parseDate(row["Ngày lắp đặt"]);
        const lifespan = row["Tuổi thọ thiết bị"]
          ? Number(row["Tuổi thọ thiết bị"])
          : null;

        const item = {
          deviceId: deviceId || null,
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
        };

        // ⚠ warning nếu thiếu ID
        if (!deviceId) {
          warnings.push({
            row: i + 2,
            message: "Thiếu Mã ID (vẫn lưu)",
          });
        }

        validData.push(item);

      } catch (err) {
        warnings.push({
          row: i + 2,
          error: err.message,
        });
      }
    });

    // ===============================
    // 🚀 INSERT THEO BATCH
    // ===============================
    const chunkSize = 500;
    let inserted = 0;

    for (let i = 0; i < validData.length; i += chunkSize) {
      const chunk = validData.slice(i, i + chunkSize);

      await prisma.device.createMany({
        data: chunk,
        skipDuplicates: true, // 🔥 tránh crash nếu trùng deviceId
      });

      inserted += chunk.length;
    }

    // ===============================
    // 📤 RESPONSE
    // ===============================
    res.json({
      success: inserted,
      total: rows.length,
      warnings,
      message: "Import nhanh thành công 🚀",
    });

  } catch (err) {
    console.log("IMPORT ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};