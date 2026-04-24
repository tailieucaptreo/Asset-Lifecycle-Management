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

// ===============================
// IMPORT EXCEL (FIX DATE 1970)
// ===============================
exports.importExcel = async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const parseDate = (v) => {
      if (!v) return null;

      // FIX EXCEL NUMBER DATE
      if (typeof v === "number") {
        const d = new Date((v - 25569) * 86400 * 1000);
        return d;
      }

      const d = new Date(v);
      return isNaN(d) ? null : d;
    };

    const data = rows.map(r => ({
      name: r["Tên thiết bị"] || "Không tên",
      line: r["Tuyến cáp"] || "Chưa rõ",
      station: r["Nhà ga"] || "Chưa rõ",
      code: r["Ký hiệu"] || null,
      area: r["Khu vực"] || null,
      deviceId: r["Mã ID"] || null,
      status: r["Tình trạng"] || "Inactive",
      installDate: parseDate(r["Ngày lắp đặt"]),
      lastMaintenance: parseDate(r["Ngày BT gần nhất"])
    }));

    await prisma.device.createMany({
      data,
      skipDuplicates: true
    });

    res.json({ message: "Import OK" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
