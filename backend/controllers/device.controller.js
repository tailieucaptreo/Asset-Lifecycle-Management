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
// CREATE / UPSERT
// ===============================
exports.createDevice = async (req, res) => {
  try {
    const data = req.body;

    let result;

    if (data.deviceId) {
      result = await prisma.device.upsert({
        where: { deviceId: data.deviceId },
        update: data,
        create: data
      });
    } else {
      result = await prisma.device.create({
        data
      });
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// DELETE
// ===============================
exports.deleteDevice = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({ error: "ID không hợp lệ" });
    }

    await prisma.device.delete({
      where: { id }
    });

    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

    // =====================
    // HELPER
    // =====================
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

      if (t.includes("active") || t.includes("hoạt")) return "Active";
      if (t.includes("bảo")) return "Maintenance";

      return "Inactive";
    };

    // =====================
    // MAP DATA
    // =====================
    const data = rows.map(row => ({
      deviceId: row["Mã ID"]?.toString() || null,
      name: normalize(row["Tên thiết bị"], "Không tên"),
      line: normalize(row["Tuyến cáp"], "Chưa rõ"),
      station: normalize(row["Nhà ga"], "Chưa rõ"),
      code: row["Ký hiệu"] || null,
      area: row["Khu vực"] || null,
      status: normalizeStatus(row["Tình trạng"]),
      installDate: parseDate(row["Ngày lắp đặt"]),
      lastMaintenance: parseDate(row["Ngày BT gần nhất"]),
      lifespan: row["Tuổi thọ thiết bị"]
        ? Number(row["Tuổi thọ thiết bị"])
        : null
    }));

    // =====================
    // UPSERT (KHÔNG CRASH)
    // =====================
    let success = 0;
    let failed = 0;

    for (const item of data) {
      try {
        await prisma.device.upsert({
          where: {
            deviceId: item.deviceId || "temp_" + Math.random()
          },
          update: item,
          create: item
        });

        success++;
      } catch (err) {
        console.log("ROW ERROR:", err.message);
        failed++;
      }
    }

    res.json({
      success,
      failed,
      total: data.length,
      message: "Import OK"
    });

  } catch (err) {
    console.log("IMPORT ERROR:", err);

    res.status(500).json({
      error: err.message
    });
  }
};
// ===============================
// ❌ DELETE DEVICE
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

    res.json({
      message: "Xóa thành công"
    });

  } catch (err) {
    console.log("DELETE ERROR:", err);

    res.status(500).json({
      error: "Xóa thất bại"
    });
  }
};
};
