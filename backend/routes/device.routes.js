const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const {
  getDevices,
  createDevice,
  importExcel,
  exportExcel,
  deleteDevice
} = require("../controllers/device.controller");

// =========================
// GET
// =========================
router.get("/", getDevices);

// =========================
// CREATE / UPSERT
// =========================
router.post("/", createDevice);

// =========================
// DELETE
// =========================
router.delete("/:id", deleteDevice);

// =========================
// IMPORT
// =========================
router.post("/import", upload.single("file"), importExcel);

// =========================
// EXPORT
// =========================
router.get("/export", exportExcel);

module.exports = router;
