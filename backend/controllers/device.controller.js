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

// ================= DATE =================
const {

    parseDate,

    sameDate,

    formatDate,

    calculateExpiryDate

} = require("../utils/date");

// ================= STATUS =================
const {

    normalizeStatus,

    calcMaintenance

} = require("../utils/status");

// ================= CATEGORY =================
const {
    detectCategory
} = require("../services/category.service");

// ================= NORMAL =================
const {

    normalize,

    get,

    getField,

    validateRow

} = require("../utils/normalize");

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
const {

    compareRows

} = require("../services/compare.service");

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
        
        prisma,
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
const { importRows } =
    require("../services/import.service");

exports.confirmImport =
async (req, res) => {

    try {

        const { sessionId } = req.body;

        const session =
            getImportSession(sessionId);

        if (!session) {

            return res.status(404).json({

                message:
                    "Phiên import đã hết hạn."

            });

        }

        const result =
            await importRows(

                prisma,

                session.rows

            );

        deleteImportSession(
            sessionId
        );

        res.json({

            success: true,

            ...result

        });

    }

    catch (err) {

        res.status(500).json({

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
          formatDate(d.installDate),

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
