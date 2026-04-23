const express = require("express");
const router = express.Router();
const multer = require("multer");

// ===============================
// 🔥 MULTER (QUAN TRỌNG NHẤT)
// dùng memoryStorage để fix lỗi Render
// ===============================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// ===============================
// 📦 IMPORT CONTROLLERS
// ===============================
const {
  getDevices,
  createDevice,
  importExcel,
  exportExcel
} = require("../controllers/device.controller");

// ===============================
// 📊 GET ALL DEVICES
// ===============================
router.get("/", getDevices);

// ===============================
// ➕ CREATE / UPSERT DEVICE
// ===============================
router.post("/", createDevice);

// ===============================
// 📥 IMPORT EXCEL
// ===============================
router.post(
  "/import",
  upload.single("file"), // ⚠️ phải trùng key frontend: "file"
  importExcel
);

// ===============================
// 📤 EXPORT EXCEL
// ===============================
router.get("/export", exportExcel);

// ===============================
// ❤️ TEST ROUTE (optional)
// ===============================
router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "API running 🚀" });
});

// ===============================
module.exports = router;