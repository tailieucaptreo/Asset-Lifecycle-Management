const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const XLSX = require("xlsx");

// ================= HELPER =================
const normalize = (v, def = "") =>
  v === undefined || v === null || v === "" ? def : v;

// 🔥 FIX DATE CHUẨN
const parseDate = (v) => {
  if (!v) return null;

  if (typeof v === "number") {
    const d = new Date((v - 25569) * 86400000);
    return isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

// 🔥 FIX STATUS CHUẨN 100%
const normalizeStatus = (v) => {
  if (!v) return "Inactive";

  const t = v
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (t.includes("active") || t.includes("dang su dung") || t.includes("su dung"))
    return "Active";

  if (t.includes("bao"))
    return "Maintenance";

  return "Inactive";
};

// ================= GET =================
exports.getDevices = async (req, res) => {
  const data = await prisma.device.findMany({
    orderBy: { id: "desc" }
  });
  res.json(data);
};

// ================= CREATE =================
exports.createDevice = async (req, res) => {
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
};

// ================= UPDATE =================
exports.updateDevice = async (req, res) => {
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
};

// ================= DELETE =================
exports.deleteDevice = async (req, res) => {
  const id = Number(req.params.id);

  await prisma.device.delete({
    where: { id }
  });

  res.json({ ok: true });
};

// ================= IMPORT (FIX FULL) =================
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

exports.importExcel = async (req, res) => {
  const workbook = XLSX.read(req.file.buffer);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  let success = 0;
  let failed = 0;

  for (let row of rows) {
    try {
      const data = {
        deviceId: getField(row, ["ma id", "id"])?.toString() || null,

        name: normalize(getField(row, ["ten thiet bi", "ten"])),
        line: normalize(getField(row, ["tuyen"])),
        station: normalize(getField(row, ["nha ga", "ga"])),

        code: getField(row, ["ky hieu"]),
        area: getField(row, ["khu vuc"]),

        status: normalizeStatus(getField(row, ["trang thai"])),

        installDate: parseDate(getField(row, ["ngay lap"])),
        lifespan: Number(getField(row, ["tuoi tho thiet bi", "tuoi tho"])) || null
      };
      await prisma.device.create({ data });

      success++;

    } catch (err) {
      console.log("IMPORT ERROR:", err.message);
      console.log(row);
      failed++;
    }
  }

  res.json({
    success,
    failed,
    total: rows.length
  });
};
