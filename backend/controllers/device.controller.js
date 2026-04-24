const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const XLSX = require("xlsx");

// ===============================
const getDevices = async (req, res) => {
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
const createDevice = async (req, res) => {
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
      result = await prisma.device.create({ data });
    }

    res.json(result);
  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
const deleteDevice = async (req, res) => {
  try {
    const id = Number(req.params.id);

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
const importExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    let success = 0;
    let failed = 0;

    for (const row of rows) {
      try {
        const data = {
          deviceId: row["Mã ID"]?.toString() || null,
          name: row["Tên thiết bị"] || "Không tên",
        };

        if (!data.deviceId) {
          await prisma.device.create({ data });
        } else {
          await prisma.device.upsert({
            where: { deviceId: data.deviceId },
            update: data,
            create: data
          });
        }

        success++;
      } catch {
        failed++;
      }
    }

    res.json({ success, failed });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
module.exports = {
  getDevices,
  createDevice,
  deleteDevice,
  importExcel
};
