const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

// IMPORT CONTROLLER
const {
  getDevices,
  importExcel,
  exportExcel
} = require("../controllers/device.controller");

// 👇 THÊM CREATE CONTROLLER
const { createDevice } = require("../controllers/device.controller");

// =====================
// GET
// =====================
router.get("/", getDevices);

// =====================
// CREATE (FIX CHUẨN)
// =====================
router.post("/", createDevice);

// =====================
// IMPORT
// =====================
router.post("/import", upload.single("file"), importExcel);

// =====================
// EXPORT
// =====================
router.get("/export", exportExcel);

module.exports = router;