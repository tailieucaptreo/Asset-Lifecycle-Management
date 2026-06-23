const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const XLSX = require("xlsx");

// ================= HELPER =================
const normalize = (v, def = "") =>
  v === undefined || v === null || v === ""
    ? def
    : v.toString().trim();

// ================= DATE =================
const parseDate = (v) => {

  if (
    v === undefined ||
    v === null ||
    v === ""
  ) {
    return null;
  }

  // Date object
  if (
    v instanceof Date
  ) {
    return v;
  }

  // Excel serial
  if (
    typeof v === "number"
  ) {

    const utcDays =
      Math.floor(
        v - 25569
      );

    const utcValue =
      utcDays *
      86400;

    const date =
      new Date(
        utcValue * 1000
      );

    return isNaN(
      date.getTime()
    )
      ? null
      : date;

  }

  // Chuỗi dd/mm/yyyy
  if (
    typeof v === "string"
  ) {

    const s =
      v.trim();

    const parts =
      s.split("/");

    if (
      parts.length === 3
    ) {

      const [
        day,
        month,
        year
      ] = parts;

      const date =
        new Date(

          Number(year),

          Number(month) - 1,

          Number(day)

        );

      return isNaN(
        date.getTime()
      )
        ? null
        : date;

    }

    const date =
      new Date(s);

    return isNaN(
      date.getTime()
    )
      ? null
      : date;

  }

  return null;

};

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

const detectCategory = (name = "") => {

  const t = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // =====================
  // PLC & SAFETY PLC
  // =====================

  if (
    /^pss/i.test(name) ||
    /^pssu/i.test(name) ||
    /^p10/i.test(name) ||
    /\bplc\b/i.test(name) ||
    /\bcpu\b/i.test(name) ||
    /\bpilz\b/i.test(name)
  ) {
    return "PLC & Safety PLC";
  }

  // =====================
  // SAFETY
  // =====================

  if (
    /^pnoz/i.test(name) ||
    /^psen/i.test(name) ||
    /\bsafety\b/i.test(name) ||
    /\bemergency\b/i.test(name) ||
    /\bestop\b/i.test(t) ||
    /\be-stop\b/i.test(t)
  ) {
    return "Safety";
  }

  // =====================
  // BECKHOFF I/O
  // =====================

  if (
    /^el\d+/i.test(name) ||
    /^kl\d+/i.test(name) ||
    /^bk\d+/i.test(name) ||
    /^ek\d+/i.test(name) ||
    /\bbeckhoff\b/i.test(name) ||
    /\bbus coupler\b/i.test(t)
  ) {
    return "Beckhoff";
  }

  // =====================
  // BIẾN TẦN
  // =====================

  if (
    /\bvacon\b/i.test(name) ||
    /\bdanfoss\b/i.test(name) ||
    /\binverter\b/i.test(name) ||
    /bien tan/i.test(t) ||

    /^acs\d*/i.test(name) ||
    /^nxa/i.test(name) ||
    /^nxb/i.test(name) ||
    /^nxc/i.test(name) ||
    /^nxi/i.test(name) ||
    /^nxp/i.test(name)
  ) {
    return "Biến tần";
  }

  // =====================
  // CẢM BIẾN
  // =====================

  if (
    /sensor/i.test(name) ||
    /encoder/i.test(name) ||
    /prox/i.test(name) ||
    /cam bien/i.test(t) ||

    /^ifm/i.test(name) ||
    /^sick/i.test(name) ||
    /^pepperl/i.test(name)
  ) {
    return "Cảm biến";
  }

  // =====================
  // ĐỘNG CƠ & PHANH
  // =====================

  if (
    /motor/i.test(name) ||
    /dong co/i.test(t) ||
    /gearbox/i.test(name) ||
    /brake/i.test(name) ||
    /tacho/i.test(name) ||

    /^sew/i.test(name) ||
    /^nord/i.test(name)
  ) {
    return "Động cơ & Phanh";
  }

  // =====================
  // MẠNG & TRUYỀN THÔNG
  // =====================

  if (
    /switch/i.test(name) ||
    /ethernet/i.test(name) ||
    /profinet/i.test(name) ||
    /profibus/i.test(name) ||
    /fiber/i.test(name) ||
    /gateway/i.test(name) ||
    /router/i.test(name) ||
    /converter/i.test(name)
  ) {
    return "Mạng & Truyền thông";
  }

  // =====================
  // ĐIỆN ĐIỀU KHIỂN
  // =====================

  if (
    /^relay/i.test(name) ||
    /^ro le/i.test(t) ||

    /^elr/i.test(name) ||

    /^mcb/i.test(name) ||
    /^mccb/i.test(name) ||
    /^mcr/i.test(name) ||

    /^contactor/i.test(name) ||

    /relay nhiet/i.test(t) ||
    /role nhiet/i.test(t) ||

    /abb ms/i.test(t) ||

    /chong set/i.test(t) ||
    /surge/i.test(name)
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

  if (!data.deviceId) {

    errors.push(
      "Thiếu mã ID"
    );

  }

  if (!data.name) {

    errors.push(
      "Thiếu tên thiết bị"
    );

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
        calcMaintenance(
          d
        )

    })
    );

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
        lastMaintenance: parseDate(d.lastMaintenance)
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
        lastMaintenance: parseDate(d.lastMaintenance)
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

// ================= IMPORT =================
exports.importExcel = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        error: "Không có file"
      });

    }

    const workbook =
      XLSX.read(
        req.file.buffer,
        {
          type: "buffer"
        }
      );

    const sheet =
      workbook.Sheets[
      workbook.SheetNames[0]
      ];

    const rows =
      XLSX.utils.sheet_to_json(
        sheet,
        {
          raw: true,
          defval: null
        }
      );

    let inserted = 0;

    const failed = [];

    for (const row of rows) {

      const data = {

        deviceId:
          String(
            getField(
              row,
              [
                "ma id",
                "device id",
                "id",
                "ma thiet bi"
              ]
            ) || ""
          ),

        name:
          String(
            getField(
              row,
              ["ten"]
            ) || ""
          ),

        category: detectCategory(
          String(
            getField(
              row,
              ["ten"]
            ) || ""
          )
        ),

        line:
          String(
            getField(
              row,
              ["tuyen"]
            ) || ""
          ),

        station:
          String(
            getField(
              row,
              ["ga"]
            ) || ""
          ),

        code:
          String(
            getField(
              row,
              [
                "ky hieu",
                "code"
              ]
            ) || ""
          ),

        area:
          String(
            getField(
              row,
              ["khu vuc"]
            ) || ""
          ),

        status:
          normalizeStatus(
            getField(
              row,
              ["trang thai"]
            )
          ),

        installDate:
          parseDate(
            getField(
              row,
              [
                "ngay lap",
                "ngay lap dat",
                "ngay lap dat ",
                "ngày lắp",
                "ngày lắp đặt"
              ]
            )
          ),

        lifespan:
          getField(
            row,
            [
              "tuoi tho",
              "tuoi tho thiet bi"
            ]
          )
            ?
            Number(
              getField(
                row,
                [
                  "tuoi tho",
                  "tuoi tho thiet bi"
                ]
              )
            )
            : null

      };

      const errors =
        validateRow(
          data
        );

      if (
        errors.length
      ) {

        failed.push({

          row,

          errors

        });

        continue;

      }

      try {

        await prisma.device.create({

          data

        });

        inserted++;

      }

      catch (err) {

        failed.push({

          row,

          errors: [
            err.message
          ]

        });

      }

    }

    return res.json({

      ok: true,

      message: "Import thành công",

      total: rows.length,

      success: inserted,

      failedCount: failed.length,

      failed

    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      error:
        err.message

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
          d.installDate
            ? d.installDate
              .toISOString()
              .split("T")[0]
            : "",

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

    const result =
      await prisma.device.groupBy({

        by: ["category"],

        _count: {
          id: true
        }

      });

    res.json(

      result.map(item => ({

        id:
          item.category || "unknown",

        name:
          item.category || "Chưa phân loại",

        count:
          item._count.id

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

  const devices =
    await prisma.device.findMany();

  for (const device of devices) {

    const category =
      detectCategory(
        device.name
      );

    await prisma.device.update({

      where: {
        id: device.id
      },

      data: {
        category
      }

    });

  }

  res.json({
    ok: true
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
