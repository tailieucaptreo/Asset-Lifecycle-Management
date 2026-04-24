const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const {
  getDevices,
  createDevice,
  deleteDevice,
  importExcel
} = require("../controllers/device.controller");

// GET
router.get("/", getDevices);

// CREATE / UPDATE
router.post("/", createDevice);

// DELETE
router.delete("/:id", deleteDevice);

// IMPORT
router.post("/import", upload.single("file"), importExcel);

module.exports = router;
