const express = require("express");
const router = express.Router();

const multer = require("multer");

const controller =
require("../controllers/device.controller");

const auth =
require("../middleware/auth");

const role =
require("../middleware/role");

const upload =
multer({
storage:
multer.memoryStorage()
});

// ====================
// DANH SÁCH
// ====================

router.get(
"/",
auth,
controller.getDevices
);


// ====================
// CHI TIẾT THIẾT BỊ
// THÊM ĐOẠN NÀY
// ====================

router.get(
"/:id",
auth,
controller.getOne
);


// ====================
// THÊM
// ====================

router.post(
"/",
auth,
role("admin"),
controller.createDevice
);


// ====================
// SỬA
// ====================

router.put(
"/:id",
auth,
role("admin"),
controller.updateDevice
);


// ====================
// XÓA
// ====================

router.delete(
"/:id",
auth,
role("admin"),
controller.deleteDevice
);


// ====================
// IMPORT
// ====================

router.post(
"/import",
auth,
role("admin"),
upload.single("file"),
controller.importExcel
);

module.exports =
router;
