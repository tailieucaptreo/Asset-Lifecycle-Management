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
              ["ma id"]
            ) || ""
          ),

        name:
          String(
            getField(
              row,
              ["ten"]
            ) || ""
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

    const devices =
      await prisma.device.findMany();

    const map = {};

    devices.forEach(device => {

      const category =
        device.category || "Chưa phân loại";

      if (!map[category]) {

        map[category] = 0;

      }

      map[category]++;

    });

    const result =
      Object.keys(map).map(
        (key, index) => ({

          id: index + 1,

          name: key,

          count: map[key]

        })
      );

    res.json(result);

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

    let category = "Khác";

    const name =
      (device.name || "")
      .toLowerCase();

    if (
      name.includes("vacon") ||
      name.includes("biến tần")
    ) {
      category = "Biến tần";
    }
    else if (
      name.includes("motor") ||
      name.includes("động cơ")
    ) {
      category = "Động cơ";
    }
    else if (
      name.includes("plc")
    ) {
      category = "PLC";
    }
    else if (
      name.includes("encoder") ||
      name.includes("sensor")
    ) {
      category = "Cảm biến";
    }

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

    const devices =
      await prisma.device.findMany({

        where: {
          category:
            decodeURIComponent(
              req.params.name
            )
        },

        orderBy: {
          name: "asc"
        }

      });

    res.json(devices);

  }

  catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

};
