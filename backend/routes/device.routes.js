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
// XEM THIẾT BỊ
// ADMIN + USER
// ====================

router.get(
"/",
auth,
controller.getDevices
);


// ====================
// THÊM THIẾT BỊ
// CHỈ ADMIN
// ====================

router.post(
"/",
auth,
role("admin"),
controller.createDevice
);


// ====================
// SỬA THIẾT BỊ
// CHỈ ADMIN
// ====================

router.put(
"/:id",
auth,
role("admin"),
controller.updateDevice
);


// ====================
// XÓA THIẾT BỊ
// CHỈ ADMIN
// ====================

router.delete(
"/:id",
auth,
role("admin"),
controller.deleteDevice
);


// ====================
// IMPORT
// CHỈ ADMIN
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
