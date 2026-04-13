const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const {
  getDevices,
  importExcel,
  exportExcel
} = require("../controllers/device.controller");

router.get("/", getDevices);
router.post("/import", upload.single("file"), importExcel);
router.get("/export", exportExcel);

module.exports = router;