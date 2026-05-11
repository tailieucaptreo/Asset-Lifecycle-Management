const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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

    res.json({
      ok: true,
      file: req.file.filename
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};
