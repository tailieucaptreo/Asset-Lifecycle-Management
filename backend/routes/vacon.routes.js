const express = require("express");
const router = express.Router();
const multer = require("multer");

const vaconController =
  require("../controllers/vacon.controller");

const auth =
  require("../middleware/auth");

const adminOnly =
  require("../middleware/adminOnly");

const upload = multer({
  storage: multer.memoryStorage()
});


// Danh sách
router.get(
  "/",
  auth,
  vaconController.getAll
);

router.post(
  "/migrate",
  auth,
  adminOnly,
  vaconController.migrateData
);

router.get(
    "/export",
    auth,
    vaconController.exportExcel
);

router.get(
  "/history/:deviceId",
  auth,
  vaconController.getHistory
);

// Chi tiết
router.get(
  "/:id",
  auth,
  vaconController.getOne
);

// Thêm mới
router.post(
  "/",
  auth,
  vaconController.create
);

// Cập nhật
router.put(
  "/:id",
  auth,
  adminOnly,
  vaconController.update
);

// Xóa
router.delete(
  "/:id",
  auth,
  adminOnly,
  vaconController.remove
);

router.post(
  "/import",
  auth,
  adminOnly,
  upload.single("file"),
  vaconController.importExcel
);

module.exports = router;
