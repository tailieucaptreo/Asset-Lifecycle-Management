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
// EXPORT
// ====================
router.get(
    "/export",
    auth,
    controller.exportDevices
);
// ====================
// CATEGORIES
// ====================
router.get(
  "/categories",
  auth,
  controller.getCategories
);

router.get(
  "/update-categories",
  controller.updateCategories
);
router.get(
  "/category/:name",
  auth,
  controller.getByCategory
);

// ====================
// HISTORY
// ====================

router.get(
    "/history",
    auth,
    controller.getHistory
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


/// ====================
// IMPORT PREVIEW
// ====================

router.post(

    "/import/preview",

    auth,

    role("admin"),

    upload.single("file"),

    controller.previewImport

);

// ====================
// CONFIRM IMPORT
// ====================

router.post(

    "/import",

    auth,

    role("admin"),

    controller.confirmImport

);

module.exports =
    router;

