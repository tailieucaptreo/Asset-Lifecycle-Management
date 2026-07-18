const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const XLSX = require("xlsx");
const fs = require("fs");

// ================= HELPER =================
const toNumber = (value, defaultValue = 0) => {

  const n = Number(value);

  return isNaN(n) ? defaultValue : n;
};

// ================= NORMALIZE ROW =================
const normalizeSpareRow = (r) => {

  const initialQuantity =
    Number(
      r["SL"] ??
      r["Số lượng"] ??
      r["Ban đầu"] ??
      r["Initial"] ??
      0
    );

  const importQty =
    Number(
      r["Nhập"] ??
      r["Import"] ??
      0
    );

  const exportQty =
    Number(
      r["Xuất"] ??
      r["Export"] ??
      0
    );

  return {

    name:
      r["Tên vật tư"] ??
      r["Tên thiết bị"] ??
      r["Name"] ??
      "",

    deviceId:
      String(
        r["Mã vật tư"] ??
        r["Mã ID"] ??
        r["Device ID"] ??
        ""
      ).trim(),

    symbol:
      r["Ký hiệu"] ??
      r["Symbol"] ??
      "",

    materialCode:
      r["Mã vật tư SAP"] ??
      r["Material Code"] ??
      "",

    warehouse:
      r["Kho"] ??
      "",

    cabinet:
      r["Tủ"] ??
      "",

    shelf:
      r["Ngăn"] ??
      r["Kệ"] ??
      "",

    slot:
      r["Số khay"] ??
      r["Khay"] ??
      "",

    unit:
      r["ĐVT"] ??
      r["Đvt"] ??
      "Cái",

    initialQuantity,

    importQty,

    exportQty,

    quantity:
      initialQuantity +
      importQty -
      exportQty,

    condition:
      r["Tình trạng"] ??
      "New",

    note:
      r["Ghi chú"] ??
      "",

    image:
      ""

  };

};

// ================= COMPARE FIELD =================
const compareField = (oldValue, newValue) => {

  const a =
    oldValue === null ||
      oldValue === undefined
      ? ""
      : String(oldValue).trim();

  const b =
    newValue === null ||
      newValue === undefined
      ? ""
      : String(newValue).trim();

  return a !== b;

};

// ================= CHANGED FIELDS =================
const getChangedFields = (
  current,
  incoming
) => {

  const fields = [];

  if (compareField(current.name, incoming.name))
    fields.push("name");

  if (compareField(current.symbol, incoming.symbol))
    fields.push("symbol");

  if (
    compareField(
      current.materialCode,
      incoming.materialCode
    )
  )
    fields.push("materialCode");

  if (
    compareField(
      current.warehouse,
      incoming.warehouse
    )
  )
    fields.push("warehouse");

  if (
    compareField(
      current.cabinet,
      incoming.cabinet
    )
  )
    fields.push("cabinet");

  if (
    compareField(
      current.shelf,
      incoming.shelf
    )
  )
    fields.push("shelf");

  if (
    compareField(
      current.slot,
      incoming.slot
    )
  )
    fields.push("slot");

  if (
    compareField(
      current.unit,
      incoming.unit
    )
  )
    fields.push("unit");

  if (
    Number(current.initialQuantity) !==
    Number(incoming.initialQuantity)
  )
    fields.push("initialQuantity");

  if (
    Number(current.importQty) !==
    Number(incoming.importQty)
  )
    fields.push("importQty");

  if (
    Number(current.exportQty) !==
    Number(incoming.exportQty)
  )
    fields.push("exportQty");

  if (
    compareField(
      current.condition,
      incoming.condition
    )
  )
    fields.push("condition");

  if (
    compareField(
      current.note,
      incoming.note
    )
  )
    fields.push("note");

  return fields;

};

// ================= COMPARE ROWS =================
const compareRows = (
  current,
  incoming
) => {

  if (!current) {

    return {

      action: "NEW",

      changedFields: []

    };

  }

  const changedFields =
    getChangedFields(
      current,
      incoming
    );

  if (changedFields.length === 0) {

    return {

      action: "SKIP",

      changedFields

    };

  }

  return {

    action: "UPDATE",

    changedFields

  };

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

          editedBy:
            req.body.editedBy || "",

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

    await prisma.spareHistory.create({

      data: {

        action: "Thêm thiết bị",

        deviceName: data.name,

        quantity: data.initialQuantity,

        editedBy:
          req.body.editedBy || "",

        note:
          req.body.note || ""

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

    const id =
      Number(req.params.id);

    if (!id) {

      return res.status(400).json({
        error: "ID không hợp lệ"
      });

    }

    // ======================
    // LẤY THIẾT BỊ HIỆN TẠI
    // ======================

    const current =
      await prisma.spareDevice.findUnique({
        where: { id }

      });

    if (!current) {

      return res.status(404).json({
        error: "Không tìm thấy thiết bị"
      });

    }

    // ======================
    // NHẬP / XUẤT
    // ======================

    const importQty =
      toNumber(req.body.importQty, 0);

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

      current.initialQuantity

      +

      totalImport

      -

      totalExport;


    // ======================
    // KHÔNG CHO ÂM KHO
    // ======================

    if (quantity < 0) {

      return res.status(400).json({
        error: "Số lượng tồn không đủ"

      });

    }

    // ======================
    // UPDATE DB
    // ======================

    const data =
      await prisma.spareDevice.update({
        where: { id },

        data: {

          name:
            req.body.name,

          deviceId:
            req.body.deviceId,

          symbol:
            req.body.symbol,

          materialCode:
            req.body.materialCode,

          // ===== KHO =====

          importQty:
            totalImport,

          exportQty:
            totalExport,

          quantity,

          unit:
            req.body.unit,

          // ===== TRẠNG THÁI =====

          condition:
            req.body.condition,

          // ===== THỜI GIAN =====

          buyDate:
            req.body.buyDate
            || null,

          removedDate:
            req.body.removedDate
            || null,

          // ===== VỊ TRÍ =====

          warehouse:
            req.body.warehouse,

          cabinet:
            req.body.cabinet,

          shelf:
            req.body.shelf,

          slot:
            req.body.slot,

          // ===== KHÁC =====

          image:
            req.body.image,

          note:
            req.body.note

        }

      });


    // ======================
    // HISTORY
    // ======================

    let action =
      "Cập nhật thiết bị";

    let historyQty =
      0;


    // nhập thêm
    if (importQty > 0) {

      action =
        "Nhập thiết bị";

      historyQty =
        importQty;

    }

    // xuất đi
    if (exportQty > 0) {

      action =
        "Xuất thiết bị";

      historyQty =
        exportQty;

    }


    await prisma.spareHistory.create({

      data: {

        action,

        deviceName: data.name,

        quantity: historyQty,

        editedBy: req.body.editedBy || "",

        note: req.body.note || "",

      }

    });


    // ======================
    // RESPONSE
    // ======================

    res.json({

      ok: true,

      message:
        "Cập nhật thành công",

      data

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
// ================= DELETE =================
exports.remove = async (req, res) => {

  try {

    const device =
      await prisma.spareDevice.findUnique({

        where: {
          id: Number(req.params.id)
        }
      });

    await prisma.spareDevice.delete({

      where: {
        id: Number(req.params.id)
      }
    });

    // ================= HISTORY =================
    await prisma.spareHistory.create({

      data: {

        action: "Xóa thiết bị",

        deviceName:
          device?.name || "",

        quantity:
          device?.quantity || 0,

        editedBy:
          req.body.editedBy || "",

        note:
          req.body.note || "",
      }
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
        error: "Không có file Excel"
      });
    }

    // =====================
    // READ EXCEL
    // =====================

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

    const rawRows =
      XLSX.utils.sheet_to_json(
        sheet,
        {
          defval: ""
        }
      );

    // =====================
    // PREVIEW
    // =====================

    const previewRows = [];

    let newCount = 0;
    let updateCount = 0;
    let skipCount = 0;

    // =====================
    // LOOP
    // =====================

    for (const excelRow of rawRows) {

      const row =
        normalizeSpareRow(excelRow);

      // bỏ dòng trống
      if (
        !row.name &&
        !row.deviceId
      ) {
        continue;
      }

      const exist =
        await prisma.spareDevice.findFirst({

          where: {
            deviceId:
              row.deviceId
          }

        });

      // =====================
      // NEW
      // =====================

      if (!exist) {

        newCount++;

        previewRows.push({

          action: "NEW",

          changedFields: [],

          row

        });

        continue;
      }

      // =====================
      // UPDATE / SKIP
      // =====================

      const result =
        compareRows(
          exist,
          row
        );

      previewRows.push({

        action:
          result.action,

        changedFields:
          result.changedFields,

        row

      });

      switch (result.action) {

        case "NEW":
          newCount++;
          break;

        case "UPDATE":
          updateCount++;
          break;

        default:
          skipCount++;

      }

    }

    // =====================
    // SUMMARY
    // =====================

    const summary = {

      total:
        previewRows.length,

      newCount,

      updateCount,

      skipCount

    };

    // =====================
    // SAVE SESSION
    // =====================

    const expiredAt =
      new Date(
        Date.now() +
        30 * 60 * 1000
      );

    const session =
      await prisma.importSession.create({

        data: {

          module: "spare",

          filename:
            req.file.originalname,

          data:
            previewRows,

          total:
            summary.total,

          newCount:
            summary.newCount,

          updateCount:
            summary.updateCount,

          skipCount:
            summary.skipCount,

          userId:
            req.user?.id || null,

          expiredAt

        }

      });

    // =====================
    // RESPONSE
    // =====================

    res.json({

      ok: true,

      sessionId:
        session.id,

      summary,

      rows:
        previewRows

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

// ================= CONFIRM IMPORT =================
exports.confirmImport = async (req, res) => {

  try {

    const { sessionId } = req.body;

    if (!sessionId) {

      return res.status(400).json({
        error: "Thiếu sessionId"
      });

    }

    // ======================
    // GET SESSION
    // ======================

    const session =
      await prisma.importSession.findUnique({

        where: {
          id: sessionId
        }

      });

    if (!session) {

      return res.status(404).json({
        error: "Không tìm thấy phiên import"
      });

    }

    if (session.module !== "spare") {

      return res.status(400).json({
        error: "Sai loại phiên import"
      });

    }

    const rows = session.data || [];

    let created = 0;
    let updated = 0;
    let skipped = 0;

    // ======================
    // LOOP
    // ======================

    for (const item of rows) {

      const row = item.row;

      if (!row) continue;

      // ======================
      // NEW
      // ======================

      if (item.action === "NEW") {

        await prisma.spareDevice.create({

          data: {

            name: row.name,

            deviceId: row.deviceId,

            symbol: row.symbol,

            materialCode: row.materialCode,

            initialQuantity:
              Number(row.initialQuantity || 0),

            quantity:
              Number(row.initialQuantity || 0)
              +
              Number(row.importQty || 0)
              -
              Number(row.exportQty || 0),

            importQty:
              Number(row.importQty || 0),

            exportQty:
              Number(row.exportQty || 0),

            unit:
              row.unit,

            condition:
              row.condition || "New",

            warehouse:
              row.warehouse,

            cabinet:
              row.cabinet,

            shelf:
              row.shelf,

            slot:
              row.slot,

            note:
              row.note,

            image:
              row.image,

            editedBy:
              req.user?.username || ""

          }

        });

        await prisma.spareHistory.create({

          data: {

            action: "Import Excel (New)",

            deviceName:
              row.name,

            quantity:
              Number(row.initialQuantity || 0),

            editedBy:
              req.user?.username || "",

            note:
              "Import Excel"

          }

        });

        created++;

        continue;

      }

      // ======================
      // UPDATE
      // ======================

      if (item.action === "UPDATE") {

        await prisma.spareDevice.updateMany({

          where: {

            deviceId:
              row.deviceId

          },

          data: {

            name:
              row.name,

            symbol:
              row.symbol,

            materialCode:
              row.materialCode,

            initialQuantity:
              Number(row.initialQuantity || 0),

            quantity:
              Number(row.initialQuantity || 0)
              +
              Number(row.importQty || 0)
              -
              Number(row.exportQty || 0),

            importQty:
              Number(row.importQty || 0),

            exportQty:
              Number(row.exportQty || 0),

            unit:
              row.unit,

            condition:
              row.condition,

            warehouse:
              row.warehouse,

            cabinet:
              row.cabinet,

            shelf:
              row.shelf,

            slot:
              row.slot,

            note:
              row.note,

            image:
              row.image,

            editedBy:
              req.user?.username || ""

          }

        });

        await prisma.spareHistory.create({

          data: {

            action: "Import Excel (Update)",

            deviceName:
              row.name,

            quantity:
              Number(row.initialQuantity || 0),

            editedBy:
              req.user?.username || "",

            note:
              `Updated: ${item.changedFields.join(", ")}`

          }

        });

        updated++;

        continue;

      }

      // ======================
      // SKIP
      // ======================

      skipped++;

    }

    // ======================
    // DELETE SESSION
    // ======================

    await prisma.importSession.delete({

      where: {

        id: sessionId

      }

    });

    // ======================
    // RESPONSE
    // ======================

    res.json({

      ok: true,

      message: "Import thành công",

      result: {

        created,

        updated,

        skipped

      }

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
// ================= EXPORT EXCEL =================
exports.exportExcel = async (req, res) => {

  try {

    const data =
      await prisma.spareDevice.findMany({

        orderBy: {
          id: "desc"
        }
      });

    const rows = data.map((d, index) => ({

      STT: index + 1,

      "Tên thiết bị":
        d.name || "",

      "Mã ID":
        d.deviceId || "",

      "Tình trạng":
        d.condition || "",

      "Kho":
        d.warehouse || "",

      "Tủ":
        d.cabinet || "",

      "Kệ":
        d.shelf || "",

      "Khay":
        d.slot || "",

      "Ban đầu":
        d.initialQuantity || 0,

      "Nhập":
        d.importQty || 0,

      "Xuất":
        d.exportQty || 0,

      "Tồn kho":
        d.quantity || 0,

      "ĐVT":
        d.unit || ""
    }));

    const worksheet =
      XLSX.utils.json_to_sheet(rows);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Spare Devices"
    );

    const buffer =
      XLSX.write(workbook, {

        type: "buffer",

        bookType: "xlsx"
      });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=spare-devices.xlsx"
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= HISTORY =================
exports.getHistory = async (req, res) => {

  try {

    const data =
      await prisma.spareHistory.findMany({

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
