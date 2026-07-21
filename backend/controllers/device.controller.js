const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const XLSX = require("xlsx");

const crypto = require("crypto");

// ================= IMPORT SESSION =================

const importSessions = new Map();

function createImportSession(rows, summary) {

  const sessionId = crypto.randomUUID();

  importSessions.set(sessionId, {

    rows,

    summary,

    createdAt: Date.now()

  });

  return sessionId;

}

function getImportSession(sessionId) {

  return importSessions.get(sessionId);

}

function deleteImportSession(sessionId) {

  importSessions.delete(sessionId);

}

// ================= AUTO CLEAN SESSION =================

// Xóa session quá 30 phút
setInterval(() => {

  const now = Date.now();

  for (const [id, session] of importSessions.entries()) {

    if (now - session.createdAt > 30 * 60 * 1000) {

      importSessions.delete(id);

    }

  }

}, 5 * 60 * 1000);

// ================= HELPER =================
const normalize = (v, def = "") => {

  if (
    v === undefined ||
    v === null ||
    v === ""
  ) {

    return def;

  }

  return v
    .toString()
    .replace(/\r\n/g, " ")
    .replace(/\n/g, " ")
    .replace(/\r/g, " ")
    .replace(/\s+/g, " ")
    .trim();

};

// ================= DATE =================
const {

    parseDate,

    sameDate,

    formatDate,

    calculateExpiryDate

} = require("../utils/date");

// ================= SAME DATE =================
function sameDate(a, b) {

  const d1 = parseDate(a);
  const d2 = parseDate(b);

  if (!d1 && !d2) return true;

  if (!d1 || !d2) return false;

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );

}

// ================= GET VALUE =================
 function get(row, ...keys) {

      for (const key of keys) {

        if (
          row[key] !== undefined &&
          row[key] !== null &&
          row[key] !== ""
        ) {
          return row[key];
        }

      }

      return null;

    }

// ================= STATUS =================
const normalizeStatus = (v) => {

  if (!v) return "Inactive";

  const t = v
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  console.log("STATUS =", t);

  // ACTIVE
  if (
    t === "active" ||
    t.includes("active") ||
    t.includes("dang su dung") ||
    t.includes("su dung")
  ) {
    return "Active";
  }

  // MAINTENANCE
  if (
    t.includes("maintenance") ||
    t.includes("bao tri")
  ) {
    return "Maintenance";
  }

  return "Inactive";
};

// ================= CATEGORY =================

const detectCategory = (

    name = "",

    code = "",

    model = ""

) => {

    const t = [

        name,

        code,

        model

    ]

        .filter(Boolean)

        .join(" ")

        .toLowerCase()

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g, "");


  // BIẾN TẦN
  if (
    t.includes("vacon") ||
    t.includes("danfoss") ||
    t.includes("inverter") ||
    t.includes("bien tan") ||
    t.includes("bien tan abb") ||
    t.includes("acs") ||
    t.includes("dcs") ||
    t.includes("nxi") ||
    t.includes("nxb") ||
    t.includes("nxa")
  ) {
    return "Biến tần";
  }

  // PLC
  if (
    t.includes("plc") ||
    t.includes("cpu") ||
    t.includes("pss") ||
    t.includes("pssu") ||
    t.includes("p10") ||
    t.includes("pilz")
  ) {
    return "PLC";
  }

  // BECKHOFF
  if (
    t.includes("beckhoff") ||
    t.includes("module") ||
    t.includes("bus") ||
    /^el\d+/i.test(name) ||
    /^kl\d+/i.test(name) ||
    /^bk\d+/i.test(name) ||
    /^ek\d+/i.test(name) ||
    t.includes("thiet bi dau cuoi")
  ) {
    return "BECKHOFF";
  }

  // AN TOÀN (PILZ)
  if (
    t.includes("safety")
  ) {
    return "An toàn";
  }

  // CẢM BIẾN
  if (
    t.includes("sensor") ||
    t.includes("encoder") ||
    t.includes("prox") ||
    t.includes("cam bien")
  ) {
    return "Cảm biến";
  }

  // ĐỘNG CƠ
  if (
    t.includes("motor") ||
    t.includes("dong co") ||
    t.includes("gearbox") ||
    t.includes("brake") ||
    t.includes("tacho")
  ) {
    return "Động cơ";
  }

  // ĐIỆN ĐIỀU KHIỂN
  if (
    t.includes("relay") ||
    t.includes("contactor") ||
    t.includes("mcb") ||
    t.includes("mccb") ||
    t.includes("rcbo") ||
    t.includes("rcd") ||
    t.includes("elr") ||
    t.includes("cb") ||
    t.includes("aptomat") ||
    t.includes("switch") ||
    t.includes("selector") ||
    t.includes("push button") ||
    t.includes("button") ||
    t.includes("nut nhan") ||
    t.includes("den") ||
    t.includes("lamp") ||
    t.includes("pilot") ||
    t.includes("power supply") ||
    t.includes("nguon") ||
    t.includes("terminal") ||
    t.includes("fuse") ||
    t.includes("cau chi") ||
    t.includes("chong set") ||
    t.includes("surge") ||
    t.includes("spd") ||
    t.includes("role nhiet") ||
    t.includes("relay nhiet")
  ) {
    return "Điện điều khiển";
  }
  return "Khác";
};
// ================= AUTO MAINTENANCE =================

const calcMaintenance = (device) => {

  if (
    !device.installDate
    ||
    !device.lifespan
  ) {

    return "Inactive";

  }

  const now =
    new Date();

  const install =
    new Date(
      device.installDate
    );

  const totalDays =
    Number(
      device.lifespan
    ) * 365;

  const usedDays =
    (
      now - install
    )
    / 86400000;

  const percent =
    usedDays
    /
    totalDays;

  // HẾT HẠN
  if (
    percent >= 1
  ) {

    return "Expired";

  }

  // ĐẾN KỲ BẢO TRÌ
  if (
    percent >= 0.7
  ) {

    return "Maintenance";

  }

  // ĐANG HOẠT ĐỘNG
  return "Active";

};

// ================= GET FIELD =================
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

// ================= VALIDATE IMPORT =================

function validateRow(data) {

  const errors = [];

  if (!data.line) {

    errors.push("Thiếu Tuyến");

  }

  if (!data.code) {

    errors.push("Thiếu Ký hiệu");

  }

  if (!data.name) {

    errors.push("Thiếu Tên thiết bị");

  }

  return errors;

}

// ================= GET =================
exports.getDevices = async (req, res) => {

  try {

    const raw = await prisma.device.findMany({

      orderBy: {
        id: "desc"
      }

    });

    const data = raw.map(d => ({

        ...d,
    
        status:
            d.status ||
    
            calcMaintenance(d)
    
    }));

    res.json(data);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= CREATE =================
exports.createDevice = async (req, res) => {

  try {

    const d = req.body;

    const result = await prisma.device.create({
      data: {
        ...d,
        status: normalizeStatus(d.status),
        installDate: parseDate(d.installDate),
        lastMaintenance: parseDate(d.lastMaintenance),
        expiryDate: parseDate(d.expiryDate)
      }
    });

    res.json(result);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= UPDATE =================
exports.updateDevice = async (req, res) => {

  try {

    const id = Number(req.params.id);

    const d = req.body;

    const updated = await prisma.device.update({
      where: { id },
      data: {
        ...d,
        status: normalizeStatus(d.status),
        installDate: parseDate(d.installDate),
        lastMaintenance: parseDate(d.lastMaintenance),
        expiryDate: parseDate(d.expiryDate)
      }
    });

    res.json(updated);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= DELETE =================
exports.deleteDevice = async (req, res) => {

  try {

    const id = Number(req.params.id);

    await prisma.device.delete({
      where: { id }
    });

    res.json({ ok: true });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// =========Comparerow=========================
async function compareRows(rows) {

  const devices = await prisma.device.findMany({

    select: {

      id: true,

      deviceId: true,

      name: true,

      category: true,

      line: true,

      station: true,

      code: true,

      area: true,

      status: true,

      installDate: true,

      lifespan: true

    }

  });

  const deviceMap = new Map();

  devices.forEach(device => {

    if (device.line && device.code) {

      const key =
        `${normalize(device.line)}_${normalize(device.code)}`;

      deviceMap.set(key, device);

    }

  });

  let newCount = 0;

  let updateCount = 0;

  let skipCount = 0;

  const result = [];

  for (const row of rows) {

    const data = {

      deviceId: normalize(

        get(
          row,
          "Mã ID",
          "Device ID",
          "deviceId",
          "Mã thiết bị"
        )
      ),

      name: normalize(

        get(
          row,
          "Tên thiết bị",
          "Tên",
          "Name"
        )
      ),

      category: normalize(

        get(
          row,
          "Phân loại",
          "Category"
        )
      ),

      line: normalize(

        get(
          row,
          "Tuyến",
          "Line"
        )
      ),

      station: normalize(

        get(
          row,
          "Nhà ga",
          "Station"
        )
      ),

      code: normalize(

        get(
          row,
          "Ký hiệu",
          "Code"
        )
      ),

      area: normalize(

        get(
          row,
          "Khu vực",
          "Area"
        )
      ),

      status: normalize(

        get(
          row,
          "Trạng thái",
          "Status"
        )
      ),

      installDate: parseDate(

        get(
          row,
          "Ngày lắp",
          "Ngày lắp đặt",
          "Install Date"
        )
      ),

      lifespan: Number(

        get(
          row,
          "Tuổi thọ",
          "Lifespan"
        ) || 0

      )

    };

    // Thiếu dữ liệu

    if (!data.line || !data.code || !data.name) {

      skipCount++;

      result.push({

        action: "SKIP",

        reason: "Thiếu Tuyến hoặc Ký hiệu hoặc Tên thiết bị",

        changedFields: [],

        row: data

      });

      continue;

    }

    const key =
      `${normalize(data.line)}_${normalize(data.code)}`;

    const old = deviceMap.get(key);

    // Thiết bị mới

    if (!old) {

      newCount++;

      result.push({

        action: "NEW",

        changedFields: [],

        row: data

      });

      continue;

    }

    const changedFields = [];

    if (normalize(old.name) !== normalize(data.name))
        changedFields.push("Tên thiết bị");
    
    if (normalize(old.category) !== normalize(data.category))
        changedFields.push("Phân loại");
    
    if (normalize(old.line) !== normalize(data.line))
        changedFields.push("Tuyến");
    
    if (normalize(old.station) !== normalize(data.station))
        changedFields.push("Nhà ga");
    
    if (normalize(old.code) !== normalize(data.code))
        changedFields.push("Ký hiệu");
    
    if (normalize(old.area) !== normalize(data.area))
        changedFields.push("Khu vực");
    
    if (normalize(old.status) !== normalize(data.status))
        changedFields.push("Trạng thái");

    if (!sameDate(old.installDate, data.installDate))
      changedFields.push("Ngày lắp");

    if (Number(old.lifespan || 0) !== Number(data.lifespan || 0))
      changedFields.push("Tuổi thọ");

    if (changedFields.length) {

      console.log({

          name: data.name,
      
          changedFields
      
      });

      updateCount++;

      result.push({

        action: "UPDATE",

        changedFields,

        row: data

      });

    }

    else {

      skipCount++;

      result.push({

        action: "SKIP",

        changedFields: [],

        row: data

      });

    }

  }

  return {

    summary: {

      total: rows.length,

      newCount,

      updateCount,

      skipCount

    },

    rows: result

  };

}

// ================= PREVIEW IMPORT =================

exports.previewImport = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({

        message: "Chưa chọn file Excel."

      });

    }

    const workbook = XLSX.read(

      req.file.buffer,

      {

        type: "buffer"

      }

    );

    const sheet =

      workbook.Sheets[

      workbook.SheetNames[0]

      ];

    const excelRows =

      XLSX.utils.sheet_to_json(

        sheet,

        {

          raw: true,

          defval: ""

        }

      );

    const result =

      await compareRows(

        excelRows

      );

    const sessionId =

      createImportSession(

        result.rows,

        result.summary

      );

    return res.json({

      success: true,

      sessionId,

      summary: result.summary,

      rows: result.rows

    });

  }

  catch (err) {

    console.error(err);

    return res.status(500).json({

      message: err.message

    });

  }

};

// ================= CONFIRM IMPORT =================
exports.confirmImport = async (req, res) => {

  try {

    const { sessionId } = req.body;

    if (!sessionId) {

      return res.status(400).json({
        message: "Thiếu sessionId."
      });

    }

    const session = getImportSession(sessionId);

    if (!session) {

      return res.status(404).json({
        message: "Phiên import đã hết hạn."
      });

    }

    const rows = session.rows;

    let created = 0;
    let updated = 0;
    let skipped = 0;

    const failed = [];

    for (const item of rows) {

      if (item.action === "SKIP") {

        skipped++;
        continue;

      }

      const d = item.row;

      const data = {

          name: d.name,
      
          category: d.category || detectCategory(d.name, d.code, d.model),
      
          line: d.line,
      
          station: d.station,
      
          code: d.code,
      
          area: d.area,
      
          deviceId: d.deviceId,
      
          status: normalizeStatus(d.status),
      
          installDate: parseDate(d.installDate),
      
          lastMaintenance: parseDate(d.lastMaintenance),
      
          lifespan: Number(d.lifespan || 0),
      
          expiryDate:

            parseDate(d.expiryDate) ||
        
            calculateExpiryDate(
        
                d.installDate,
        
                d.lifespan
        
            )
      
                : null
      
      };

      try {

        if (item.action === "NEW") {

          await prisma.device.create({
            data
          });

          created++;

        }

        else if (item.action === "UPDATE") {

          await prisma.device.update({

            where: {

              line_code: {

                line: d.line,

                code: d.code

              }

            },

            data

          });

          updated++;

        }

      }

      catch (err) {

        failed.push({

          deviceId: d.deviceId,

          name: d.name,

          message: err.message

        });

      }

    }

    deleteImportSession(sessionId);

    return res.json({

      success: true,

      summary: {

        total: rows.length,

        created,

        updated,

        skipped,

        failed: failed.length

      },

      failed

    });

  }

  catch (err) {

    console.error(err);

    return res.status(500).json({

      message: err.message

    });

  }

};
// ================= GET ONE =================
exports.getOne =
  async (
    req,
    res
  ) => {

    try {

      const id =
        Number(
          req.params.id
        );

      const device =
        await prisma.device.findUnique({

          where: {
            id
          }

        });

      if (!device) {

        return res
          .status(404)
          .json({

            message:
              "Không tìm thấy thiết bị"

          });

      }

      // tính trạng thái giống dashboard
      const data = {

        ...device,

        status:
          calcMaintenance(
            device
          )

      };

      res.json(
        data
      );

    }

    catch (err) {

      console.log(err);

      res
        .status(500)
        .json({

          error:
            err.message

        });

    }

  };

// ================= EXPORT =================
exports.exportDevices = async (req, res) => {

  try {

    const devices =
      await prisma.device.findMany({

        orderBy: {
          id: "asc"
        }

      });

    const rows =
      devices.map(d => ({

        "Tên thiết bị":
          d.name,

        "Phân loại": d.category || detectCategory(d.name),

        "Tuyến":
          d.line,

        "Nhà ga":
          d.station,

        "Ký hiệu":
          d.code,

        "Khu vực":
          d.area,

        "Mã ID":
          d.deviceId,

        "Trạng thái":
          calcMaintenance(d),

        "Ngày lắp":
          formatDate(d.installDate)

        "Tuổi thọ":
          d.lifespan

      }));

    const wb =
      XLSX.utils.book_new();

    const ws =
      XLSX.utils.json_to_sheet(
        rows
      );

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      "Devices"
    );

    const buffer =
      XLSX.write(
        wb,
        {
          bookType: "xlsx",
          type: "buffer"
        }
      );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=devices.xlsx"
    );

    res.send(buffer);

  }

  catch (err) {

    console.log(err);

    res
      .status(500)
      .json({
        error: err.message
      });

  }

};

exports.getCategories = async (req, res) => {

  try {

    const devices = await prisma.device.findMany({
      select: {
        category: true
      }
    });

    const map = {};

    for (const d of devices) {

      const key = d.category?.trim() || "Chưa phân loại";

      map[key] = (map[key] || 0) + 1;

    }

    res.json(

      Object.entries(map).map(([name, count]) => ({

        id: name,

        name,

        count

      }))

    );

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      error: err.message

    });

  }

};

exports.updateCategories = async (req, res) => {

  const devices = await prisma.device.findMany();

  let updated = 0;

  for (const device of devices) {

    const category = detectCategory(
      device.name,
      device.code,
      device.model
    );

    console.log(device.name, "=>", category);

    await prisma.device.update({
      where: { id: device.id },
      data: { category }
    });

    updated++;
  }

  res.json({
    ok: true,
    updated
  });

};

exports.getByCategory = async (req, res) => {

  try {

    const category =
      decodeURIComponent(
        req.params.name
      );

    let devices;

    if (
      category ===
      "Chưa phân loại"
    ) {

      devices =
        await prisma.device.findMany({

          where: {
            category: null
          },

          orderBy: {
            name: "asc"
          }

        });

    } else {

      devices =
        await prisma.device.findMany({

          where: {
            category
          },

          orderBy: {
            name: "asc"
          }

        });

    }

    res.json(devices);

  }

  catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

};
