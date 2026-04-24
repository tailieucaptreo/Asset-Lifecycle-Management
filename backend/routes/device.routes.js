const express = require("express");
const router = express.Router();
const multer = require("multer");

const controller = require("../controllers/device.controller");

// upload memory (CHO EXCEL)
const upload = multer({ storage: multer.memoryStorage() });

// =========================
// ROUTES
// =========================

// GET ALL
router.get("/devices", controller.getDevices);

// CREATE / UPDATE
router.post("/devices", controller.createDevice);

// DELETE
router.delete("/devices/:id", controller.deleteDevice);

// IMPORT EXCEL
router.post(
  "/devices/import",
  upload.single("file"),
  controller.importExcel
);

module.exports = router;
