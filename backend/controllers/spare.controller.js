const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const XLSX = require("xlsx");
const fs = require("fs");

// ================= HELPER =================
const toNumber = (value, defaultValue = 0) => {

  const n = Number(value);

  return isNaN(n) ? defaultValue : n;
};

// ================= GET ALL =================
exports.getAll = async (req, res) => {

  try {

    const data =
      await prisma.spareDevice.findMany({

        orderBy: {
          id: "desc"
        }
      });

    res.json(data);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= GET ONE =================
exports.getOne = async (req, res) => {

  try {

    const id = Number(req.params.id);

    if (!id) {

      return res.status(400).json({
        error: "ID không hợp lệ"
      });
    }

    const data =
      await prisma.spareDevice.findUnique({
        where: { id }
      });

    if (!data) {

      return res.status(404).json({
        error: "Không tìm thấy thiết bị"
      });
    }

    res.json(data);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= CREATE =================
exports.create = async (req, res) => {

  try {

    // số lượng ban đầu
    const initialQuantity =
      toNumber(req.body.initialQuantity, 0);

    const data =
      await prisma.spareDevice.create({

        data: {

          // =========================
          // THÔNG TIN
          // =========================

          name: req.body.name,
          deviceId: req.body.deviceId,
          symbol: req.body.symbol,
          materialCode: req.body.materialCode,

          // =========================
          // QUẢN LÝ KHO
          // =========================

          initialQuantity,

          quantity: initialQuantity,

          importQty: 0,

          exportQty: 0,

          unit: req.body.unit || "Cái",

          // =========================
          // TRẠNG THÁI
          // =========================

          condition:
            req.body.condition || "New",

          // =========================
          // THỜI GIAN
          // =========================

          buyDate:
            req.body.buyDate || null,

          removedDate:
            req.body.removedDate || null,

          // =========================
          // VỊ TRÍ KHO
          // =========================

          warehouse: req.body.warehouse,
          cabinet: req.body.cabinet,
          shelf: req.body.shelf,
          slot: req.body.slot,

          // =========================
          // KHÁC
          // =========================

          image: req.body.image,
          note: req.body.note
        }
      });

    res.json(data);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= UPDATE =================
exports.update = async (req, res) => {

  try {

    const id = Number(req.params.id);

    if (!id) {

      return res.status(400).json({
        error: "ID không hợp lệ"
      });
    }

    // lấy dữ liệu hiện tại
    const current =
      await prisma.spareDevice.findUnique({
        where: { id }
      });

    if (!current) {

      return res.status(404).json({
        error: "Không tìm thấy thiết bị"
      });
    }

    // nhập thêm
    const importQty =
      toNumber(req.body.importQty, 0);

    // xuất đi
    const exportQty =
      toNumber(req.body.exportQty, 0);

    // tổng nhập
    const totalImport =
      current.importQty + importQty;

    // tổng xuất
    const totalExport =
      current.exportQty + exportQty;

    // tồn kho mới
    const quantity =
      current.initialQuantity +
      totalImport -
      totalExport;

    // không cho âm kho
    if (quantity < 0) {

      return res.status(400).json({
        error: "Số lượng tồn không đủ"
      });
    }

    const data =
      await prisma.spareDevice.update({

        where: { id },

        data: {

          // =========================
          // THÔNG TIN
          // =========================

          name: req.body.name,
          deviceId: req.body.deviceId,
          symbol: req.body.symbol,
          materialCode: req.body.materialCode,

          // =========================
          // QUẢN LÝ KHO
          // =========================

          importQty: totalImport,

          exportQty: totalExport,

          quantity,

          unit: req.body.unit,

          // =========================
          // TRẠNG THÁI
          // =========================

          condition: req.body.condition,

          // =========================
          // THỜI GIAN
          // =========================

          buyDate:
            req.body.buyDate || null,

          removedDate:
            req.body.removedDate || null,

          // =========================
          // VỊ TRÍ
          // =========================

          warehouse: req.body.warehouse,
          cabinet: req.body.cabinet,
          shelf: req.body.shelf,
          slot: req.body.slot,

          // =========================
          // KHÁC
          // =========================

          image: req.body.image,
          note: req.body.note
        }
      });

    res.json(data);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= DELETE =================
exports.remove = async (req, res) => {

  try {

    const id = Number(req.params.id);

    if (!id) {

      return res.status(400).json({
        error: "ID không hợp lệ"
      });
    }

    await prisma.spareDevice.delete({
      where: { id }
    });

    res.json({
      ok: true
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= UPLOAD IMAGE =================
exports.uploadImage = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        error: "Không có file"
      });
    }

    res.json({
      image: `/uploads/${req.file.filename}`
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};
// ================= IMPORT EXCEL =================
exports.importExcel = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        error: "Không có file"
      });
    }

    // đọc file excel
    const workbook = XLSX.readFile(req.file.path);

    // sheet đầu tiên
    const sheetName =
      workbook.SheetNames[0];

    const sheet =
      workbook.Sheets[sheetName];

    // convert json
    const rows =
      XLSX.utils.sheet_to_json(sheet);

    // insert database
    for (const row of rows) {

      const initialQuantity =
        Number(row.initialQuantity || 0);

      await prisma.spareDevice.create({

        data: {

          name:
            row.name || "",

          deviceId:
            row.deviceId || "",

          symbol:
            row.symbol || "",

          condition:
            row.condition || "New",

          warehouse:
            row.warehouse || "",

          cabinet:
            row.cabinet || "",

          shelf:
            row.shelf || "",

          slot:
            row.slot || "",

          initialQuantity,

          quantity:
            initialQuantity,

          importQty: 0,

          exportQty: 0,

          unit:
            row.unit || "Cái",

          image:
            row.image || ""
        }
      });
    }

    // xóa file temp
    fs.unlinkSync(req.file.path);

    res.json({
      ok: true,
      total: rows.length
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};
// ================= PREVIEW IMPORT =================
exports.previewImport = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        error: "Không có file"
      });
    }

    // đọc excel
    const workbook = XLSX.readFile(req.file.path);

    const sheetName =
      workbook.SheetNames[0];

    const sheet =
      workbook.Sheets[sheetName];

    const rows =
      XLSX.utils.sheet_to_json(sheet);

    // xóa file temp
    fs.unlinkSync(req.file.path);

    res.json({
      ok: true,
      rows
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};
// ================= CONFIRM IMPORT =================
exports.confirmImport = async (req, res) => {

  try {

    const rows =
      req.body.rows || [];

    for (const row of rows) {

      const initialQuantity =
        Number(row.initialQuantity || 0);

      const importQty =
        Number(row.importQty || 0);

      const exportQty =
        Number(row.exportQty || 0);

      const quantity =
        initialQuantity +
        importQty -
        exportQty;

      await prisma.spareDevice.create({

        data: {

          // tên vật tư
          name:
            row.name ||
            row["Tên vật tư"] ||
            "Chưa có tên",

          // mã vật tư
          deviceId:
            String(
              row.deviceId ||
              row["Mã vật tư"] ||
              ""
            ),

          // kho
          warehouse:
            row.warehouse ||
            row["Kho"] ||
            "Ga 19",

          // tủ
          cabinet:
            row.cabinet ||
            row["Tủ"] ||
            "",

          // kệ
          shelf:
            row.shelf ||
            row["Kệ"] ||
            "",

          // khay
          slot:
            row.slot ||
            row["Số khay"] ||
            "",

          // tồn đầu
          initialQuantity,

          // nhập
          importQty,

          // xuất
          exportQty,

          // tồn hiện tại
          quantity,

          // đơn vị
          unit:
            row.unit ||
            row["Đvt"] ||
            row["ĐVT"] ||
            "Cái",

          // tình trạng
          condition: "New",

          symbol: "",

          image: ""
        }
      });
    }

    res.json({
      ok: true,
      total: rows.length
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};
