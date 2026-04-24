const express = require("express");
const router = express.Router();
const multer = require("multer");

// ===============================
// 🔥 MULTER MEMORY (fix Render)
// ===============================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

// ===============================
// IMPORT CONTROLLER
// ===============================
const {
  getDevices,
  createDevice,
  importExcel,
  exportExcel,
  deleteDevice
} = require("../controllers/device.controller");

// ===============================
// GET ALL
// ===============================
router.get("/", getDevices);

// ===============================
// CREATE / UPSERT
// ===============================
router.post("/", createDevice);

// ===============================
// IMPORT
// ===============================
router.post(
  "/import",
  upload.single("file"),
  importExcel
);

// ===============================
// EXPORT
// ===============================
router.get("/export", exportExcel);

// ===============================
// ❌ DELETE
// ===============================
router.delete("/:id", deleteDevice);

// ===============================
module.exports = router;
