const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const XLSX = require("xlsx");
const fs = require("fs");

// ================= HELPER =================
const toNumber = (value, defaultValue = 0) => {

  const n = Number(value);

  return isNaN(n) ? defaultValue : n;
};

// ================= SPARE LOCATION KEY =================

const normalizeKeyText = (value) => {

  if (
    value === undefined ||
    value === null
  ) {
    return "";
  }

  return String(value)
    .trim()
    .toUpperCase();

};


const getSpareLocationKey = (row) => {

  const deviceId =
    normalizeKeyText(
      row?.deviceId
    );

  const warehouse =
    normalizeKeyText(
      row?.warehouse
    );

  const cabinet =
    normalizeKeyText(
      row?.cabinet
    );

  const shelf =
    normalizeKeyText(
      row?.shelf
    );

  const slot =
    normalizeKeyText(
      row?.slot
    );

  return [
    deviceId,
    warehouse,
    cabinet,
    shelf,
    slot
  ].join("|");

};

// ================= NORMALIZE ROW =================
const normalizeSpareRow = (r) => {

  const toText = (value, defaultValue = "") => {

    if (
      value === undefined ||
      value === null
    ) {
      return defaultValue;
    }

    return String(value).trim();

  };


  const initialQuantity =
    toNumber(
      r["SL"] ??
      r["Số lượng"] ??
      r["Ban đầu"] ??
      r["Initial"],
      0
    );


  const importQty =
    toNumber(
      r["Nhập"] ??
      r["Import"],
      0
    );


  const exportQty =
    toNumber(
      r["Xuất"] ??
      r["Export"],
      0
    );


  return {

    // =========================
    // THÔNG TIN
    // =========================

    name:
      toText(
        r["Tên vật tư"] ??
        r["Tên thiết bị"] ??
        r["Thiết bị"] ??
        r["Tên"] ??
        r["Name"]
      ),


    deviceId:
      toText(
        r["Mã vật tư"] ??
        r["Mã ID"] ??
        r["Mã TB"] ??
        r["Mã thiết bị"] ??
        r["Device ID"] ??
        r["DeviceID"]
      ),


    symbol:
      toText(
        r["Ký hiệu"] ??
        r["Symbol"]
      ),


    materialCode:
      toText(
        r["Mã vật tư SAP"] ??
        r["Material Code"] ??
        r["MaterialCode"]
      ),


    // =========================
    // VỊ TRÍ
    // =========================

    warehouse:
      toText(
        r["Kho"] ??
        r["Warehouse"]
      ),


    cabinet:
      toText(
        r["Tủ"] ??
        r["Cabinet"]
      ),


    shelf:
      toText(
        r["Ngăn"] ??
        r["Kệ"] ??
        r["Shelf"]
      ),


    slot:
      toText(
        r["Số khay"] ??
        r["Khay"] ??
        r["Slot"]
      ),


    // =========================
    // ĐƠN VỊ
    // =========================

    unit:
      toText(
        r["ĐVT"] ??
        r["Đvt"] ??
        r["Đơn vị"] ??
        r["Unit"],
        "Cái"
      ),


    // =========================
    // SỐ LƯỢNG
    // =========================

    initialQuantity,

    importQty,

    exportQty,

    quantity:
      initialQuantity +
      importQty -
      exportQty,


    // =========================
    // TRẠNG THÁI
    // =========================

    condition:
      toText(
        r["Tình trạng"] ??
        r["Tình trạng thiết bị"] ??
        r["Condition"],
        "New"
      ),


    // =========================
    // GHI CHÚ
    // =========================

    note:
      r["Ghi chú"] === undefined ||
        r["Ghi chú"] === null ||
        r["Ghi chú"] === ""
        ? null
        : String(
          r["Ghi chú"]
        ).trim(),


    // =========================
    // ẢNH
    // =========================

    image:
      toText(
        r["Ảnh"] ??
        r["Image"]
      )

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

        action: "CREATE",

        deviceName: data.name,

        quantity: data.initialQuantity,

        editedBy: req.user?.username || "System",

        note: "Thêm thiết bị",

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
      "UPDATE";

    let historyQty = current.quantity;

    // nhập thêm
    if (importQty > 0) {

      action = "IMPORT";

      historyQty =
        importQty;

    }

    // xuất đi
    if (exportQty > 0) {

      action =
        "EXPORT";

      historyQty =
        exportQty;

    }


    await prisma.spareHistory.create({

      data: {

        action,

        deviceName: data.name,

        quantity: historyQty,

        editedBy: req.user?.username || "System",

        note:
          action === "UPDATE"
            ? "Cập nhật thông tin"
            : action === "IMPORT"
              ? "Nhập kho"
              : "Xuất kho",
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

        action: "DELETE",

        deviceName:
          device?.name || "",

        quantity:
          device?.quantity || 0,

        editedBy:
          req.user?.username || "System",

        note: "Xóa thiết bị",
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

    // =====================
    // READ BUFFER
    // =====================

    const workbook =
      XLSX.read(
        req.file.buffer,
        {
          type: "buffer"
        }
      );

    const sheetName =
      workbook.SheetNames[0];

    if (!sheetName) {

      return res.status(400).json({
        error: "File Excel không có sheet"
      });

    }

    const sheet =
      workbook.Sheets[sheetName];

    const rawRows =
      XLSX.utils.sheet_to_json(
        sheet,
        {
          defval: ""
        }
      );

    // =====================
    // TRANSACTION
    // =====================

    let created = 0;

    await prisma.$transaction(
      async (tx) => {

        for (
          const excelRow
          of rawRows
        ) {

          const row =
            normalizeSpareRow(
              excelRow
            );

          if (
            !row.name &&
            !row.deviceId
          ) {
            continue;
          }

          if (!row.deviceId) {

            throw new Error(
              `Thiếu Mã ID của thiết bị: ${row.name}`
            );

          }

          await tx.spareDevice.create({

            data: {

              name:
                row.name,

              deviceId:
                row.deviceId,

              symbol:
                row.symbol,

              materialCode:
                row.materialCode,

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

              initialQuantity:
                row.initialQuantity,

              quantity:
                row.quantity,

              importQty:
                row.importQty,

              exportQty:
                row.exportQty,

              unit:
                row.unit,

              image:
                row.image,

              note:
                row.note

            }

          });

          created++;

        }

      },

      {
        maxWait: 10000,
        timeout: 120000
      }

    );

    res.json({

      ok: true,

      total: created

    });

  }

  catch (err) {

    console.error(
      "IMPORT EXCEL ERROR:",
      err
    );

    res.status(500).json({

      ok: false,

      error:
        err.message

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


    // ==================================================
    // READ EXCEL
    // ==================================================

    const workbook =
      XLSX.read(
        req.file.buffer,
        {
          type: "buffer"
        }
      );


    const sheetName =
      workbook.SheetNames[0];


    if (!sheetName) {

      return res.status(400).json({
        error: "File Excel không có sheet"
      });

    }


    const sheet =
      workbook.Sheets[sheetName];


    const rawRows =
      XLSX.utils.sheet_to_json(
        sheet,
        {
          defval: ""
        }
      );


    // ==================================================
    // PREVIEW
    // ==================================================

    const previewRows = [];


    let newCount = 0;

    let updateCount = 0;

    let skipCount = 0;

    let warningCount = 0;


    // ==================================================
    // LOAD DEVICE IDS
    // ==================================================

    const normalizedRows =
      rawRows
        .map((excelRow, index) => {

          const row =
            normalizeSpareRow(
              excelRow
            );


          return {

            excelRow,

            row,

            rowNumber:
              index + 2

          };

        })
        .filter(item => {

          return (
            item.row.name ||
            item.row.deviceId
          );

        });

    // ==================================================
    // PHÁT HIỆN TRÙNG CÙNG VỊ TRÍ TRONG FILE
    // ==================================================

    const firstLocationRow =
      new Map();

    const duplicateLocationKeys =
      new Set();


    for (
      const item
      of normalizedRows
    ) {

      const row =
        item.row;

      const deviceId =
        String(
          row.deviceId || ""
        ).trim();


      if (!deviceId) {
        continue;
      }


      const locationKey =
        getSpareLocationKey(
          row
        );


      if (
        firstLocationRow.has(
          locationKey
        )
      ) {

        duplicateLocationKeys.add(
          locationKey
        );

      }
      else {

        firstLocationRow.set(
          locationKey,
          item.rowNumber
        );

      }

    }

    // ==================================================
    // CHỈ LẤY ID KHÔNG RỖNG
    // ==================================================

    const deviceIds =
      [
        ...new Set(

          normalizedRows

            .map(
              item =>
                item.row.deviceId
            )

            .filter(Boolean)

            .map(
              id =>
                String(id).trim()
            )

        )
      ];


    // ==================================================
    // LOAD EXISTING DEVICES MỘT LẦN
    // ==================================================

    const existingDevices =
      deviceIds.length > 0

        ? await prisma.spareDevice.findMany({

          where: {

            deviceId: {
              in: deviceIds
            }

          }

        })

        : [];


    // ==================================================
    // MAP
    // ==================================================

    const existingMap =
      new Map();


    for (
      const device
      of existingDevices
    ) {

      const locationKey =
        getSpareLocationKey(
          device
        );

      if (locationKey) {

        existingMap.set(
          locationKey,
          device
        );

      }

    }


    // ==================================================
    // PROCESS
    // ==================================================

    for (
      const item
      of normalizedRows
    ) {

      const row =
        item.row;


      // ==================================================
      // THIẾU MÃ ID
      // ==================================================

      if (!row.deviceId) {

        warningCount++;


        previewRows.push({

          action: "WARNING",

          changedFields: [],

          warning:
            "Thiếu Mã ID",

          rowNumber:
            item.rowNumber,

          row

        });


        continue;

      }

      // ==================================================
      // TRÙNG CÙNG MÃ + VỊ TRÍ TRONG FILE
      // ==================================================

      const locationKey =
        getSpareLocationKey(
          row
        );


      if (
        duplicateLocationKeys.has(
          locationKey
        )
      ) {

        warningCount++;

        const firstRow =
          firstLocationRow.get(
            locationKey
          );

        previewRows.push({

          action: "WARNING",

          changedFields: [],

          warning:
            `Cảnh báo: Trùng Mã ID ${row.deviceId} tại cùng vị trí. Dòng đầu tiên: ${firstRow}.`,

          rowNumber:
            item.rowNumber,

          row

        });

        continue;

      }


      // ==================================================
      // TÌM THIẾT BỊ
      // ==================================================
      const locationKey =
        getSpareLocationKey(
          row
        );


      const exist =
        existingMap.get(
          locationKey
        );

      // ==================================================
      // NEW
      // ==================================================

      if (!exist) {

        newCount++;


        previewRows.push({

          action: "NEW",

          changedFields: [],

          rowNumber:
            item.rowNumber,

          row

        });


        continue;

      }


      // ==================================================
      // UPDATE / SKIP
      // ==================================================

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

        rowNumber:
          item.rowNumber,

        row

      });


      if (
        result.action ===
        "UPDATE"
      ) {

        updateCount++;

      }
      else {

        skipCount++;

      }

    }


    // ==================================================
    // SUMMARY
    // ==================================================

    const summary = {

      total:
        previewRows.length,

      newCount,

      updateCount,

      skipCount,

      warningCount

    };


    // ==================================================
    // SAVE SESSION
    // ==================================================

    const expiredAt =
      new Date(
        Date.now() +
        30 * 60 * 1000
      );


    const session =
      await prisma.importSession.create({

        data: {

          module:
            "spare",

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
            req.user?.id ||
            null,

          expiredAt

        }

      });


    // ==================================================
    // RESPONSE
    // ==================================================

    return res.json({

      ok: true,

      sessionId:
        session.id,

      summary,

      rows:
        previewRows

    });

  }

  catch (err) {

    console.error(
      "PREVIEW IMPORT ERROR:",
      err
    );


    return res.status(500).json({

      ok: false,

      error:
        err.message ||
        "Preview import thất bại"

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

    // ==================================================
    // LẤY SESSION
    // ==================================================

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


    // ==================================================
    // LẤY DATA
    // ==================================================

    const rows =
      Array.isArray(session.data)
        ? session.data
        : [];


    if (rows.length === 0) {

      return res.status(400).json({
        error: "Phiên import không có dữ liệu"
      });

    }


    // ==================================================
    // BATCH SIZE
    // ==================================================

    const BATCH_SIZE = 50;


    // ==================================================
    // COUNTER
    // ==================================================

    let created = 0;

    let updated = 0;

    let skipped = 0;

    let warning = 0;


    // ==================================================
    // LẤY TOÀN BỘ DEVICE ID
    // ==================================================

    const deviceIds =
      [
        ...new Set(

          rows

            .map(item =>
              item?.row?.deviceId
            )

            .filter(Boolean)

            .map(id =>
              String(id).trim()
            )

        )
      ];


    // ==================================================
    // LOAD DEVICE HIỆN TẠI
    // ==================================================

    const existingDevices =
      deviceIds.length > 0

        ? await prisma.spareDevice.findMany({

          where: {

            deviceId: {
              in: deviceIds
            }

          }

        })

        : [];


    // ==================================================
    // MAP DEVICE
    // ==================================================

    const deviceMap =
      new Map();


    for (
      const device
      of existingDevices
    ) {

      const locationKey =
        getSpareLocationKey(
          device
        );

      if (locationKey) {

        deviceMap.set(
          locationKey,
          device
        );

      }

    }


    // ==================================================
    // CHIA BATCH
    // ==================================================

    const batches = [];

    for (
      let i = 0;
      i < rows.length;
      i += BATCH_SIZE
    ) {

      batches.push(
        rows.slice(
          i,
          i + BATCH_SIZE
        )
      );

    }


    console.log(
      `SPARE IMPORT: ${rows.length} dòng → ${batches.length} batch`
    );


    // ==================================================
    // XỬ LÝ TỪNG BATCH
    // ==================================================

    for (
      let batchIndex = 0;
      batchIndex < batches.length;
      batchIndex++
    ) {

      const batch =
        batches[batchIndex];


      console.log(
        `SPARE IMPORT: đang xử lý batch ${batchIndex + 1}/${batches.length} - ${batch.length} dòng`
      );


      // ==================================================
      // COUNTER TẠM CHO BATCH
      // ==================================================

      let batchCreated = 0;

      let batchUpdated = 0;

      let batchSkipped = 0;

      let batchWarning = 0;


      // ==================================================
      // TRANSACTION CHỈ CHO 1 BATCH
      // ==================================================

      const batchResult =
        await prisma.$transaction(

          async (tx) => {

            // ==================================================
            // KẾT QUẢ DEVICE SAU KHI BATCH THÀNH CÔNG
            // ==================================================

            const committedDevices = [];


            // ==================================================
            // LOOP BATCH
            // ==================================================

            for (
              const item
              of batch
            ) {

              const row =
                item?.row;


              // ================================================
              // KHÔNG CÓ ROW
              // ================================================

              if (!row) {

                batchSkipped++;

                continue;

              }


              // ================================================
              // WARNING
              // ================================================

              if (
                item.action === "WARNING"
              ) {

                batchWarning++;

                continue;

              }


              // ================================================
              // DEVICE ID
              // ================================================

              const deviceId =
                String(
                  row.deviceId || ""
                ).trim();


              if (!deviceId) {

                throw new Error(
                  `Thiếu Mã ID của thiết bị "${row.name || ""}"`
                );

              }


              // ================================================
              // CHUẨN HÓA TEXT
              // ================================================

              const name =
                row.name == null
                  ? ""
                  : String(
                    row.name
                  ).trim();


              const symbol =
                row.symbol == null
                  ? ""
                  : String(
                    row.symbol
                  ).trim();


              const materialCode =
                row.materialCode == null
                  ? ""
                  : String(
                    row.materialCode
                  ).trim();


              const warehouse =
                row.warehouse == null
                  ? ""
                  : String(
                    row.warehouse
                  ).trim();


              const cabinet =
                row.cabinet == null
                  ? ""
                  : String(
                    row.cabinet
                  ).trim();


              const shelf =
                row.shelf == null
                  ? ""
                  : String(
                    row.shelf
                  ).trim();


              const slot =
                row.slot == null
                  ? ""
                  : String(
                    row.slot
                  ).trim();


              const unit =
                row.unit == null ||
                  row.unit === ""
                  ? "Cái"
                  : String(
                    row.unit
                  ).trim();


              const condition =
                row.condition == null ||
                  row.condition === ""
                  ? "New"
                  : String(
                    row.condition
                  ).trim();


              // ================================================
              // NOTE
              // ================================================

              // Excel có thể trả về:
              // số
              // text
              // null
              //
              // Prisma yêu cầu String hoặc null

              const note =
                row.note === undefined ||
                  row.note === null ||
                  row.note === ""
                  ? null
                  : String(
                    row.note
                  ).trim();


              const image =
                row.image == null
                  ? ""
                  : String(
                    row.image
                  ).trim();


              // ================================================
              // SỐ LƯỢNG
              // ================================================

              const initialQuantity =
                toNumber(
                  row.initialQuantity,
                  0
                );


              const importQty =
                toNumber(
                  row.importQty,
                  0
                );


              const exportQty =
                toNumber(
                  row.exportQty,
                  0
                );


              const quantity =
                initialQuantity +
                importQty -
                exportQty;


              // ================================================
              // KHÔNG CHO ÂM KHO
              // ================================================

              if (quantity < 0) {

                throw new Error(
                  `Số lượng tồn âm tại thiết bị: ${name} (${deviceId})`
                );

              }


              // ================================================
              // TÌM DEVICE HIỆN TẠI
              // ================================================

              const locationKey =
                getSpareLocationKey({

                  deviceId,

                  warehouse,

                  cabinet,

                  shelf,

                  slot

                });


              let existing =
                deviceMap.get(
                  locationKey
                );

              // ================================================
              // NEW
              // ================================================

              if (!existing) {

                const createdDevice =
                  await tx.spareDevice.create({

                    data: {

                      name,

                      deviceId,

                      symbol,

                      materialCode,

                      initialQuantity,

                      quantity,

                      importQty,

                      exportQty,

                      unit,

                      condition,

                      warehouse,

                      cabinet,

                      shelf,

                      slot,

                      note,

                      image,

                      editedBy:
                        req.user?.username ||
                        ""

                    }

                  });


                // --------------------------------------------
                // Cập nhật map ngay trong batch
                // --------------------------------------------

                deviceMap.set(
                  locationKey,
                  createdDevice
                );

                committedDevices.push(
                  createdDevice
                );


                // --------------------------------------------
                // HISTORY
                // --------------------------------------------

                await tx.spareHistory.create({

                  data: {

                    action:
                      "CREATE",

                    deviceName:
                      name,

                    quantity:
                      initialQuantity,

                    editedBy:
                      req.user?.username ||
                      "System",

                    note:
                      "Import tạo mới"

                  }

                });


                batchCreated++;

                continue;

              }


              // ================================================
              // SO SÁNH
              // ================================================

              const changedFields =
                getChangedFields(

                  existing,

                  {

                    name,

                    symbol,

                    materialCode,

                    warehouse,

                    cabinet,

                    shelf,

                    slot,

                    unit,

                    initialQuantity,

                    importQty,

                    exportQty,

                    condition,

                    note

                  }

                );


              // ================================================
              // SKIP
              // ================================================

              if (
                changedFields.length === 0
              ) {

                batchSkipped++;

                continue;

              }


              // ================================================
              // UPDATE
              // ================================================

              const updatedDevice =
                await tx.spareDevice.update({

                  where: {

                    id:
                      existing.id

                  },

                  data: {

                    name,

                    symbol,

                    materialCode,

                    initialQuantity,

                    quantity,

                    importQty,

                    exportQty,

                    unit,

                    condition,

                    warehouse,

                    cabinet,

                    shelf,

                    slot,

                    note,

                    image,

                    editedBy:
                      req.user?.username ||
                      ""

                  }

                });


              // --------------------------------------------
              // cập nhật map
              // --------------------------------------------

              deviceMap.set(
                locationKey,
                updatedDevice
              );

              committedDevices.push(
                updatedDevice
              );


              // ================================================
              // HISTORY
              // ================================================

              await tx.spareHistory.create({

                data: {

                  action:
                    "UPDATE",

                  deviceName:
                    name,

                  quantity:
                    initialQuantity,

                  editedBy:
                    req.user?.username ||
                    "System",

                  note:
                    `Import cập nhật: ${changedFields.join(", ")}`

                }

              });


              batchUpdated++;

            }


            // ================================================
            // RETURN BATCH
            // ================================================

            return {

              created:
                batchCreated,

              updated:
                batchUpdated,

              skipped:
                batchSkipped,

              warning:
                batchWarning,

              committedDevices

            };

          },

          {

            maxWait:
              10000,

            timeout:
              60000

          }

        );


      // ==================================================
      // CỘNG COUNTER SAU KHI TRANSACTION THÀNH CÔNG
      // ==================================================

      created +=
        batchResult.created;


      updated +=
        batchResult.updated;


      skipped +=
        batchResult.skipped;


      warning +=
        batchResult.warning;


      // ==================================================
      // LOG
      // ==================================================

      console.log(

        `SPARE IMPORT: batch ${batchIndex + 1}/${batches.length} OK | ` +

        `NEW=${batchResult.created} | ` +

        `UPDATE=${batchResult.updated} | ` +

        `SKIP=${batchResult.skipped} | ` +

        `WARNING=${batchResult.warning}`

      );

    }


    // ==================================================
    // XÓA SESSION
    // ==================================================

    await prisma.importSession.delete({

      where: {
        id: sessionId
      }

    });


    // ==================================================
    // RESPONSE
    // ==================================================

    return res.json({

      ok: true,

      message:
        "Import thành công",

      result: {

        created,

        updated,

        skipped,

        warning,

        total:
          created +
          updated +
          skipped +
          warning

      }

    });

  }

  catch (err) {

    console.error(
      "CONFIRM IMPORT ERROR:",
      err
    );


    return res.status(500).json({

      ok: false,

      error:
        err.message ||
        "Import thất bại"

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
