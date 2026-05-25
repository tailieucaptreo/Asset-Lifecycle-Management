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

         data:{
      
            action:"Thêm thiết bị",
            
            deviceName:data.name,
            
            quantity:data.initialQuantity,
            
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
        error: "Không có file"
      });

    }

    const workbook = XLSX.read(
      req.file.buffer,{ type:"buffer" }
    );

    const sheet = workbook.Sheets[
      workbook.SheetNames[0]
    ];

    const rawRows = XLSX.utils.sheet_to_json(
      sheet
    );

    const rows = rawRows.map((r)=>{
      const initialQuantity = Number(

        r["SL"]

        ??

        r["Số lượng"]

        ??

        r["Ban đầu"]

        ??

        0

        );

      const importQty = Number(
        r["Nhập"] || 0
      );

      const exportQty = Number(
        r["Xuất"] || 0
      );

     return {

      name:

      r["Tên vật tư"]

      ||

      r["Tên thiết bị"]

      ||

      "",


      deviceId:

        String(

        r["Mã vật tư"]

        ||

        r["Mã ID"]

        ||

        ""

        ),

  
  // QUAN TRỌNG
  quantity:
  
  initialQuantity,
  
  initialQuantity,
  
  importQty,
  
  exportQty,
  
  
  unit:
  
  r["Đvt"]
  
  ||
  
  r["ĐVT"]
  
  ||
  
  "Cái",
  
  
  cabinet:
  
  r["Tủ"]
  
  ||
  
  "",
  
  
  shelf:
  
  r["Ngăn"]
  
  ||
  
  r["Kệ"]
  
  ||
  
  "",
  
  
  slot:
  
  r["Số khay"]
  
  ||
  
  r["Khay"]
  
  ||
  
  "",
  
  
  warehouse:
  
  r["Kho"]
  
  ||
  
  "",
  
  
  symbol:
  
  r["Ký hiệu"]
  
  ||
  
  "",
  
  
  condition:
  
  "New"
  
  };
  
  });
  
  res.json({
  
    ok:true, rows
  
    });
  
  }
  
  catch(err){
  
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

    const rows = req.body.rows || [];

    for (const row of rows) {

      const quantity =

        Number(row.initialQuantity || 0)

        +

        Number(row.importQty || 0)

        -

        Number(row.exportQty || 0);

      await prisma.spareDevice.create({

        data: {

          name: row.name || "",

          deviceId:
            row.deviceId || "",

          quantity,

          initialQuantity:
            Number(
              row.initialQuantity || 0
            ),

          importQty:
            Number(
              row.importQty || 0
            ),

          exportQty:
            Number(
              row.exportQty || 0
            ),

          unit:
            row.unit || "Cái",

          warehouse:
            row.warehouse || "",

          cabinet:
            row.cabinet || "",

          shelf:
            row.shelf || "",

          slot:
            row.slot || "",

          symbol:
            row.symbol || "",

          condition:
            row.condition || "New"
        }
      });

      // ================= HISTORY =================
      await prisma.spareHistory.create({

        data: {

          action: "Import Excel",

          deviceName: row.name,

          quantity
        }
      });
    }

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
